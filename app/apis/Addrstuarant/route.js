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
    console.log(data);

    // Check if required fields for restaurant are provided
    const requiredFields = ['name', 'address', 'contact', 'opening_hours'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db('Add-Restaurantsss');
    const collection = db.collection('Restaurantsss');

    // Insert new restaurant document using the full data structure
    await collection.insertOne({
      name: data.name,
      address: {
        street: data.address.street,
        city: data.address.city,
        state: data.address.state,
        postal_code: data.address.postal_code,
        country: data.address.country
      },
      contact: {
        phone: data.contact.phone,
        email: data.contact.email,
        website: data.contact.website
      },
      opening_hours: data.opening_hours,
      cuisines: data.cuisines,
      photos: data.photos,
      menu: data.menu,
      delivery_options: data.delivery_options,

    });

    return NextResponse.json({ message: 'Restaurant inserted successfully', ok: true }, { status: 201 });

  } catch (e) {
    console.error('Error in POST handler:', e);
    return NextResponse.json({ 
      error: 'Unable to insert restaurant data', 
      details: e.message 
    }, { status: 500 });
  }
}
