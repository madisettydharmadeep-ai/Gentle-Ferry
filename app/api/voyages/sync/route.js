import dbConnect from '../../../../utils/mongodb';
import Voyage from '../../../../utils/models/Voyage';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    const { userId, voyages } = await request.json();

    if (!userId || !Array.isArray(voyages)) {
      return NextResponse.json({ success: false, error: 'User ID and Voyage array required' }, { status: 400 });
    }

    const results = [];
    
    // Process each voyage
    for (const voyage of voyages) {
      const result = await Voyage.findOneAndUpdate(
        { userId, id: voyage.id },
        { ...voyage, userId },
        { upsert: true, returnDocument: 'after' }
      );
      results.push(result);
    }

    return NextResponse.json({ success: true, count: results.length });

  } catch (error) {
    console.error('Voyage Sync Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
