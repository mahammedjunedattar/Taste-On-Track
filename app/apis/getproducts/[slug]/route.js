import { MongoClient } from 'mongodb';
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

export async function GET(req, { params }) {
  try {
    const client = await connectToDatabase();
    const db = client.db('Addproducts');
    const collection = db.collection('Products');

    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' },
        { status: 400 }
      );
    }

    // Query the database for the specified slug
    const restaurant = await collection.find({ slug }).toArray();

    if (!restaurant || restaurant.length===0) {
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
