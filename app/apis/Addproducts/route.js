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


    const client = await connectToDatabase();
    const db = client.db('Addproducts');
    const collection = db.collection('Products');

    // Insert new restaurant document using the full data structure
    for (let i = 0; i < data.length; i++) {
        await collection.insertOne({
            title: data[i].title,
            description : data[i].description,
            image: data[i].image,
            rating: data[i].rating,
            slug :data[i].slug,
            category : data[i].category
            
      
          });
      
        
    }

    return NextResponse.json({ message: 'Restaurant inserted successfully', ok: true }, { status: 201 });

  } catch (e) {
    console.error('Error in POST handler:', e);
    return NextResponse.json({ 
      error: 'Unable to insert restaurant data', 
      details: e.message 
    }, { status: 500 });
  }
}
