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

// POST request handler
export async function POST(request) {
  try {
    // Parse incoming JSON data from the request body
    const [deliveryDetails, carts] = await request.json();
    console.log('Received delivery details:', deliveryDetails);
    console.log('Received cart:', carts);

    // Validation: Ensure required delivery details and cart fields are provided
    if (
      !deliveryDetails.Address ||
      !deliveryDetails.flat ||
      !deliveryDetails.area ||
      !deliveryDetails.landmark
    ) {
      return NextResponse.json(
        { error: 'Missing required delivery details' },
        { status: 400 }
      );
    }

    if (!Array.isArray(carts) || carts.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty or invalid' },
        { status: 400 }
      );
    }

    // Connect to the database
    const client = await connectToDatabase();
    const db = client.db('order-details');
    const collection = db.collection('orders');

    // Insert the new order into the collection
    await collection.insertOne({
        status : 'pending',
      deliveryDetails: {
        Name : deliveryDetails.Name,
        Address: deliveryDetails.Address,
        flat: parseInt(deliveryDetails.flat, 10),
        area: deliveryDetails.area,
        landmark: deliveryDetails.landmark,
      },
      cart: carts.map((item) => ({
        name: item.name,
        quantity: parseInt(item.quantity, 10),
        price: parseFloat(item.price),
        ...(item.customizations && { customizations: item.customizations }), // Optional customizations
      })),
      createdAt: new Date(), // Timestamp
    });

    // Return success response
    return NextResponse.json(
      { message: 'Order inserted successfully', ok: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST handler:', error);

    // Return error response with details
    return NextResponse.json(
      {
        error: 'Unable to insert order data',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
