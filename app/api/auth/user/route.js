import dbConnect from '../../../../utils/mongodb';
import User from '../../../../utils/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    const { userId, settings, ignoredHabits } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    const updateData = {};
    if (settings) updateData.settings = settings;
    if (ignoredHabits) updateData.ignoredHabits = ignoredHabits;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { returnDocument: 'after' }
    );

    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error('User Update Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
       return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    return NextResponse.json({ 
      success: true, 
      settings: user.settings, 
      ignoredHabits: user.ignoredHabits,
      hasDriveAccess: !!user.googleRefreshToken
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
