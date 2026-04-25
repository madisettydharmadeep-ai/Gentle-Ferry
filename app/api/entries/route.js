import dbConnect from '../../../utils/mongodb';
import JournalEntry from '../../../utils/models/JournalEntry';
import User from '../../../utils/models/User';
import { getDriveService, createFolderIfNotExist, uploadImageToDrive } from '../../../utils/googleDrive';
import { NextResponse } from 'next/server';

// POST /api/entries — create a new journal entry
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, text, imageBase64, mood, entryDate, highlights, collectionId } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }

    let driveImageUrl = null;
    let driveFileId = null;

    // Upload image to Google Drive if provided
    if (imageBase64) {
      const user = await User.findById(userId);
      if (!user?.googleRefreshToken) {
        return NextResponse.json({ success: false, error: 'No Drive access. Please re-login.' }, { status: 403 });
      }

      const drive = getDriveService(user.googleRefreshToken);
      
      // Ensure folder exists
      let folderId = user.googleDriveFolderId;
      if (!folderId) {
        folderId = await createFolderIfNotExist(drive, 'Gentle Ferry');
        await User.findByIdAndUpdate(userId, { googleDriveFolderId: folderId });
      }

      const date = entryDate ? new Date(entryDate) : new Date();
      const fileName = `journal_${date.toISOString().split('T')[0]}_${Date.now()}.jpg`;
      const file = await uploadImageToDrive(drive, folderId, fileName, imageBase64);
      
      driveFileId = file.id;
      // Use Google's direct image serving URL (works because file is shared publicly)
      driveImageUrl = `https://lh3.googleusercontent.com/d/${file.id}=s1200`;
    }

    const entry = await JournalEntry.create({
      userId,
      text: text || '',
      driveImageUrl,
      driveFileId,
      mood: mood || null,
      entryDate: entryDate ? new Date(entryDate) : new Date(),
      highlights: highlights || [],
      collectionId: collectionId || null,
    });

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error('Entry POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET /api/entries?userId=xxx&year=2026&month=4&q=searchText
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const year = parseInt(searchParams.get('year'));
    const month = parseInt(searchParams.get('month')); // 1-indexed
    const q = searchParams.get('q'); // search text
    const collectionId = searchParams.get('collectionId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }

    let query = { userId };

    if (year && month) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59, 999);
      query.entryDate = { $gte: start, $lte: end };
    }

    if (collectionId) {
      query.collectionId = collectionId;
    }

    // Text search across entry text
    if (q && q.trim()) {
      query.$or = [
        { text: { $regex: q, $options: 'i' } },
        { mood: { $regex: q, $options: 'i' } },
      ];
    }

    const entries = await JournalEntry.find(query).sort({ entryDate: -1 }).lean();

    return NextResponse.json({ success: true, entries });
  } catch (error) {
    console.error('Entry GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/entries?id=xxx&userId=yyy — permanently delete a journal entry and its attached Drive image
export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!entryId || !userId) {
      return NextResponse.json({ success: false, error: 'id and userId required' }, { status: 400 });
    }

    const entry = await JournalEntry.findOne({ _id: entryId, userId });
    
    if (!entry) {
      return NextResponse.json({ success: false, error: 'Entry not found or unauthorized' }, { status: 404 });
    }

    // Attempt to selectively delete from Drive if there's a fileId
    if (entry.driveFileId) {
      const user = await User.findById(userId);
      if (user?.googleRefreshToken) {
        // dynamic import of the drive function to avoid scope leak
        const { getDriveService, deleteFileFromDrive } = await import('../../../utils/googleDrive');
        const drive = getDriveService(user.googleRefreshToken);
        await deleteFileFromDrive(drive, entry.driveFileId);
      }
    }

    await JournalEntry.findByIdAndDelete(entryId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Entry DELETE Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH /api/entries — update an existing entry (for collection assignment, etc.)
export async function PATCH(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { entryId, userId, collectionId } = body;

    if (!entryId || !userId) {
      return NextResponse.json({ success: false, error: 'entryId and userId required' }, { status: 400 });
    }

    const updateData = {};
    if (collectionId !== undefined) {
      updateData.collectionId = collectionId || null;
    }

    const entry = await JournalEntry.findOneAndUpdate(
      { _id: entryId, userId },
      updateData,
      { new: true }
    );

    if (!entry) {
      return NextResponse.json({ success: false, error: 'Entry not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error('Entry PATCH Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
