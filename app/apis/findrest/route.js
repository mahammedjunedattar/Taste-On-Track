import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;

let cachedClient = null;

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

export async function POST(request) {
  try {
    // Parse the request body
    const data = await request.json();
    const { id } = data;

    // Validate the input
    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db('Addproducts');
    const collection = db.collection('Products');

    // Find the restaurant by ID (convert id to ObjectId if needed)
    const restaurant = await collection.findOne({ _id: new ObjectId(id) });

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
