import { OAuth2Client } from 'google-auth-library';
import dbConnect from '../../../../utils/mongodb';
import User from '../../../../utils/models/User';
import { NextResponse } from 'next/server';

const client = new OAuth2Client(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage'
);

export async function POST(request) {
  try {
    await dbConnect();
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ success: false, error: 'Code required' }, { status: 400 });
    }

    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: image } = payload;

    const updateData = { name, email, image, lastLogin: new Date() };
    if (tokens.refresh_token) {
      updateData.googleRefreshToken = tokens.refresh_token;
    }

    const user = await User.findOneAndUpdate(
      { googleId },
      updateData,
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        hasDriveAccess: !!user.googleRefreshToken,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Auth Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
