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

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedClient = await client.connect();
  return cachedClient;
}

export async function POST(request) {
  const data = await request.json();

  try {
    const client = await connectToDatabase();
    const db = client.db('Addrestuarant-credintial');
    const collection = db.collection('Addrestuarant-delivery');

    // Insert the restaurant data into the collection
    const result = await collection.insertOne({
      Name : data.Name,
      Email : data.Email,
      Address : data.Address,
      Number : data.Number
      
    });

    if (result.insertedCount === 1) {
      return NextResponse.json({ message: 'Restaurant added successfully', ok: true }, { status: 201 });
    } else {
      throw new Error('Failed to insert the restaurant data');
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'An error occurred', details: e.message }, { status: 500 });
  }
}
