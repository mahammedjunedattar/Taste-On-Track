import { MongoClient, ObjectId } from 'mongodb';
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

  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    cachedClient = await client.connect();
    return cachedClient;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw new Error('Failed to connect to database');
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    // Validate inputs
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid or missing order ID' }, { status: 400 });
    }

    if (!status || typeof status !== 'string') {
      return NextResponse.json({ message: 'Invalid or missing status' }, { status: 400 });
    }

    // Connect to the database
    const client = await connectToDatabase();
    const db = client.db('order-details');
    const collection = db.collection('orders');

    // Update the status of the order
    const result = await collection.updateOne(
      { _id: new ObjectId(id) }, // Match the document by its ID
      { $set: { status } } // Update the status field
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Failed to process request' }, { status: 500 });
  }
}
