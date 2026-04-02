import { NextResponse } from 'next/server';
import dbConnect from '../../../utils/mongodb';
import Broadcast from '../../../utils/models/Broadcast';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const admin = searchParams.get('admin');

    if (admin === 'true') {
      const broadcasts = await Broadcast.find().sort({ date: -1 });
      return NextResponse.json({ success: true, data: broadcasts });
    }

    if (date) {
      const broadcast = await Broadcast.findOne({ date });
      return NextResponse.json({ success: true, data: broadcast });
    }

    return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { date, message, imageUrl, id } = body;

    if (!date || !message) {
      return NextResponse.json({ success: false, error: 'Date and message are required' }, { status: 400 });
    }

    let broadcast;
    if (id) {
      broadcast = await Broadcast.findByIdAndUpdate(id, { date, message, imageUrl }, { new: true });
    } else {
      // Check if date already exists
      const existing = await Broadcast.findOne({ date });
      if (existing) {
        broadcast = await Broadcast.findByIdAndUpdate(existing._id, { message, imageUrl }, { new: true });
      } else {
        broadcast = await Broadcast.create({ date, message, imageUrl });
      }
    }

    return NextResponse.json({ success: true, data: broadcast });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }

    await Broadcast.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
