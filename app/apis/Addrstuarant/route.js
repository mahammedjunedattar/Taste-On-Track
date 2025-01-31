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
    const data = await request.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid data format. Expected an array of restaurant objects.');
    }

    const client = await connectToDatabase();
    const db = client.db('Add-Restaurantsss');
    const collection = db.collection('Restaurantsss');

    // Insert restaurants in bulk
    const documents = data.map((restaurant) => ({
      name: restaurant.name,
      address: restaurant.address,
      contact: restaurant.contact,
      opening_hours: restaurant.opening_hours,
      cuisines: restaurant.cuisines,
      photos: restaurant.photos,
      menu: restaurant.menu,
      delivery_options: restaurant.delivery_options,
    }));

    await collection.insertMany(documents);

    return NextResponse.json(
      { message: 'Restaurants inserted successfully', ok: true },
      { status: 201 }
    );
  } catch (e) {
    console.error('Error in POST handler:', e);
    return NextResponse.json(
      {
        error: 'Unable to insert restaurant data',
        details: e.message,
      },
      { status: 500 }
    );
  }
}
