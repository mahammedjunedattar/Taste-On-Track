import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;

let cachedClient = null;

// Function to connect to the database
async function connectToDatabase() {
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedClient = await client.connect();
  return cachedClient;
}

export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db('order-details');
    const collection = db.collection('orders');

    // Fetch all documents from the collection
    const users = await collection.find().toArray();

    if (!users || users.length === 0) {
      // Return 404 if no users are found
      return NextResponse.json({ error: 'No users found' }, { status: 404 });
    }

    // Return 200 OK with the list of users
    return NextResponse.json({ message: 'Users fetched successfully', users, ok: true }, { status: 200 });
  } catch (e) {
    // Log the error and return a 500 Internal Server Error response
    console.error('Error fetching users:', e);
    return NextResponse.json({ error: 'An error occurred', details: e.message }, { status: 500 });
  }
}
