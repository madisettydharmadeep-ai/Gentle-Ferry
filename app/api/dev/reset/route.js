import dbConnect from '../../../../utils/mongodb';
import User from '../../../../utils/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  const res = await User.updateMany({}, { $unset: { googleRefreshToken: 1, googleDriveFolderId: 1 } });
  return NextResponse.json({ success: true, updated: res.modifiedCount });
}
