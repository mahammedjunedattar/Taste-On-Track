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
    const products = await request.json();
    const client = await connectToDatabase();
    const db = client.db('Add-Restaurantsss');
    const collection = db.collection('Restaurantsss');
    console.log(products);

    if (!Array.isArray(products)) {
      return NextResponse.json({ message: 'Invalid data format. Expected an array of products.', products }, { status: 400 });
    }

    // Loop through each product and update in the database
    for (const product of products) {
      const { _id, category, items } = product;
      console.log(_id);

      if (!_id) {
        console.warn('Product is missing _id:', product);
        continue; // Skip if _id is missing
      }

      if (!Array.isArray(items)) {
        console.error('Menu data is not in array format:', items);
        continue; // Skip if items is not an array
      }

      console.log(items);

      try {
        const result = await collection.updateOne(
          { "_id": new ObjectId(_id), "menu.category": category }, // Match by _id and category
          {
            $set: {
              "menu.$.items": items, // Update the items field in the correct category
            },
          }
        );

        if (result.matchedCount === 0) {
          console.warn(`Product with _id ${_id} and category "${category}" not found`);
        } else {
          console.log(`Updated product with _id ${_id} and category "${category}"`);  
        }
      } catch (error) {
        console.error(`Error updating product with _id ${_id}:`, error);
      }
    }

    return NextResponse.json({ message: 'Products updated successfully' });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Failed to process request' }, { status: 500 });
  }
}
