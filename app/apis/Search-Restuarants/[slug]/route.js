import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;

let cachedClient = null;

// Database connection function
async function connectToDatabase() {
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri);
  cachedClient = await client.connect();
  return cachedClient;
}

export async function POST(request, { params }) {
  try {
    // Parse the slug and request body
    const { slug } = params;
    console.log(slug)
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db('Add-Restaurantsss');
    const collection = db.collection('Restaurantsss');

    // Find the restaurant by slug
    const restaurant = await collection.findOne({ name:slug });
    console.log(restaurant)
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Restaurant found', restaurant, ok: true },
      { status: 200 }
    );
  } catch (e) {
    console.error('Error fetching restaurant:', e);
    return NextResponse.json(
      { error: 'An error occurred', details: e.message },
      { status: 500 }
    );
  }
}
