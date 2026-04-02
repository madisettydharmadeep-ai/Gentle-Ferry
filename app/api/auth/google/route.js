import { OAuth2Client } from 'google-auth-library';
import dbConnect from '../../../../utils/mongodb';
import User from '../../../../utils/models/User';
import { NextResponse } from 'next/server';

const client = new OAuth2Client(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'postmessage' // Special value for cross-origin authentication
);

export async function POST(request) {
  try {
    await dbConnect();
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ success: false, error: 'Code required' }, { status: 400 });
    }

    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get user info from ID Token or via API
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: image } = payload;

    // Refresh token is only sent on first consent or if prompt=consent
    const updateData = {
      name,
      email,
      image,
      lastLogin: new Date()
    };

    if (tokens.refresh_token) {
      updateData.googleRefreshToken = tokens.refresh_token;
    }

    // Upsert user
    let user = await User.findOneAndUpdate(
      { googleId },
      updateData,
      { upsert: true, returnDocument: 'after' }
    );

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image
      },
      hasRefreshToken: !!user.googleRefreshToken
    });

  } catch (error) {
    console.error('Auth Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
