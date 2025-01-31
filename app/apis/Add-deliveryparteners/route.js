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
    const db = client.db('Delivery-parteners');
    const collection = db.collection('parteners');

    // Insert new restaurant document using the full data structure
    for (let i = 0; i < data.length; i++) {
        await collection.insertOne({
            id: data[i].id,
            name : data[i].name,
            contact: data[i].contact,
            email: data[i].email,
            status :data[i].status,
            area : data[i].area,
            ordersDelivered : data[i].ordersDelivered,
            vehicle : data[i].vehicle,
            licensePlate : data[i].licensePlate
            
      
          });
      
        
    }

    return NextResponse.json({ message: 'partener inserted successfully', ok: true }, { status: 201 });

  } catch (e) {
    console.error('Error in POST handler:', e);
    return NextResponse.json({ 
      error: 'Unable to insert partener data', 
      details: e.message 
    }, { status: 500 });
  }
}
