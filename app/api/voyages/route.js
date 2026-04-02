import dbConnect from '../../../utils/mongodb';
import Voyage from '../../../utils/models/Voyage';
import User from '../../../utils/models/User';
import { getDriveService, createFolderIfNotExist, uploadImageToDrive, uploadFileToDrive } from '../../../utils/googleDrive';
import { NextResponse } from 'next/server';

// Get all voyages for a user
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    const month = searchParams.get('month'); // e.g., 'January'
    const year = searchParams.get('year');   // e.g., '2026'

    let query = { userId };
    
    // Support filtering by month/year string if provided
    if (month && year) {
      query.date = { $regex: new RegExp(`^${month} \\d+, ${year}$`) };
    } else if (year) {
      query.date = { $regex: new RegExp(`${year}$`) };
    }

    const voyages = await Voyage.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: voyages });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Save or Update a voyage
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, voyage } = body;

    if (!userId || !voyage) {
      return NextResponse.json({ success: false, error: 'User ID and Voyage data required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Handle Google Drive Image Upload
    // GUARD: Never accept Base64 into MongoDB. It MUST go to Drive or fail.
    if (voyage.photo && voyage.photo.startsWith('data:image')) {
      if (!user.settings?.isPremium || !user.googleRefreshToken) {
        return NextResponse.json({ 
          success: false, 
          error: 'Visual Records require Pro and Google Drive storage.' 
        }, { status: 403 });
      }

      try {
        const drive = getDriveService(user.googleRefreshToken);
        
        let folderId = user.googleDriveFolderId;
        if (!folderId) {
          folderId = await createFolderIfNotExist(drive, 'Gentle Ferry');
          user.googleDriveFolderId = folderId;
          await user.save();
        }

        const fileName = `voyage_${voyage.id}.jpg`;
        const driveFile = await uploadImageToDrive(drive, folderId, fileName, voyage.photo);
        voyage.photo = driveFile.webContentLink; // Store only the cloud link
      } catch (driveError) {
        console.error('B64 REJECTED:', driveError);
        
        // If the token is invalid, remove it so the user is prompted again
        user.googleRefreshToken = null;
        user.googleDriveFolderId = null;
        await user.save();

        return NextResponse.json({ 
          success: false, 
          error: 'The ferry does not accept local baggage (Base64). Cloud storage failed.',
          authError: true
        }, { status: 500 });
      }
    }

    // Handle Google Drive Audio Upload
    if (voyage.audio && (voyage.audio.startsWith('data:audio') || voyage.audio.startsWith('data:application/octet-stream'))) {
        if (!user.settings?.isPremium || !user.googleRefreshToken) {
            return NextResponse.json({ 
                success: false, 
                error: 'Voice Records require Pro and Google Drive storage.' 
            }, { status: 403 });
        }

        try {
            const drive = getDriveService(user.googleRefreshToken);
            let folderId = user.googleDriveFolderId;
            if (!folderId) {
                folderId = await createFolderIfNotExist(drive, 'Gentle Ferry');
                user.googleDriveFolderId = folderId;
                await user.save();
            }

            const fileName = `voyage_audio_${voyage.id}.webm`;
            const driveFile = await uploadFileToDrive(drive, folderId, fileName, voyage.audio, 'audio/webm');
            voyage.audio = driveFile.webContentLink;
        } catch (driveError) {
            console.error('AUDIO B64 REJECTED:', driveError);
            return NextResponse.json({ success: false, error: 'Cloud storage failed for audio.' }, { status: 500 });
        }
    }

    // Check if voyage already exists (by custom id)
    const existing = await Voyage.findOne({ userId, id: voyage.id });

    if (existing) {
      // Update
      const updated = await Voyage.findOneAndUpdate(
        { userId, id: voyage.id },
        { ...voyage },
        { returnDocument: 'after' }
      );
      return NextResponse.json({ success: true, data: updated });
    } else {
      // Create
      const newVoyage = await Voyage.create({
        userId,
        ...voyage
      });
      return NextResponse.json({ success: true, data: newVoyage });
    }

  } catch (error) {
    console.error('Voyage Save Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
