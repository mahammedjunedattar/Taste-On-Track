import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;

let cachedClient = null;

// Function to connect to the database
async function connectToDatabase() {
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  if (!cachedClient) {
    const client = new MongoClient(uri);
    cachedClient = client;
    await client.connect();
  }

  return cachedClient;
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log(data);

    const client = await connectToDatabase();
    const db = client.db('assign-delivery'); // Ensure correct database name
    const collection = db.collection('assign');

    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        const { cart, deliveryDetails, status, deliveryDate } = data[i]; // Fixed typo 'stauses'
        await collection.insertOne({ cart, deliveryDetails, status, deliveryDate });
      }
    } else {
      const { cart, deliveryDetails, status, deliveryDate } = data;
      await collection.insertOne({ cart, deliveryDetails, status, deliveryDate });
    }

    return NextResponse.json({ message: 'Data inserted successfully', ok: true }, { status: 201 });

  } catch (e) {
    console.error('Error in POST handler:', e);
    return NextResponse.json({ 
      error: 'Unable to insert data', 
      details: e.message 
    }, { status: 500 });
  }
}
