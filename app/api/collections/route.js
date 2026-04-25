import dbConnect from '../../../utils/mongodb';
import Collection from '../../../utils/models/Collection';
import JournalEntry from '../../../utils/models/JournalEntry';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// GET /api/collections?userId=xxx — get all collections with entry counts
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }

    // Get collections with actual entry counts
    const collections = await Collection.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'journalentries',
          localField: '_id',
          foreignField: 'collectionId',
          as: 'entries'
        }
      },
      {
        $project: {
          name: 1,
          color: 1,
          createdAt: 1,
          entryCount: { $size: '$entries' }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    return NextResponse.json({ success: true, collections });
  } catch (error) {
    console.error('Collections GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/collections — create a new collection
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, name, color } = body;

    if (!userId || !name?.trim()) {
      return NextResponse.json({ success: false, error: 'userId and name required' }, { status: 400 });
    }

    const collection = await Collection.create({
      userId: new mongoose.Types.ObjectId(userId),
      name: name.trim(),
      color: color || '#E8B4B8',
    });

    return NextResponse.json({ success: true, collection });
  } catch (error) {
    console.error('Collections POST Error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'Collection name already exists' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/collections?id=xxx&userId=yyy — delete a collection
export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const collectionId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!collectionId || !userId) {
      return NextResponse.json({ success: false, error: 'id and userId required' }, { status: 400 });
    }

    // Remove collection reference from all entries first
    await JournalEntry.updateMany(
      { collectionId, userId },
      { $unset: { collectionId: 1 } }
    );

    // Delete the collection
    const result = await Collection.findOneAndDelete({ _id: collectionId, userId });
    
    if (!result) {
      return NextResponse.json({ success: false, error: 'Collection not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Collections DELETE Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
