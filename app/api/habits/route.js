import dbConnect from '../../../utils/mongodb';
import Habit from '../../../utils/models/Habit';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    const habits = await Habit.find({ userId });
    return NextResponse.json({ success: true, data: habits });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { userId, habit } = await request.json();

    if (!userId || !habit || !habit.text) {
      return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
    }

    // Update or Create
    const updatedHabit = await Habit.findOneAndUpdate(
      { userId, text: habit.text },
      { ...habit, userId },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: updatedHabit });

  } catch (error) {
    console.error('Habit Sync Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { userId, text } = await request.json();

    if (!userId || !text) {
      return NextResponse.json({ success: false, error: 'User ID and Habit Text required' }, { status: 400 });
    }

    await Habit.findOneAndDelete({ userId, text });

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
