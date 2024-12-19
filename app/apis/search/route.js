import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Ensure you have this environment variable set
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

  // Create indexes if necessary
  await createIndexes(client);

  return cachedClient;
}

// Function to create indexes
async function createIndexes(client) {
  const db = await client.db('Add-Restaurantsss'); // Replace with your actual database name
  const collection = await db.collection('Restaurantsss');

  // Create a unique index on the 'name' field
  await collection.createIndex(
    { name: 1 }, // Field to index
    { unique: true, sparse: true } // Options: unique and sparse
  );

  console.log('Index created on the name field');
}

export async function GET(request) {
  // Extract the query parameter
  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q');
  console.log('Search Query:', q);

  // Validate the query parameter
  if (!q || typeof q !== 'string' || q.trim() === '') {
    return NextResponse.json(
      { error: 'Query parameter "q" is required and should be a non-empty string' },
      { status: 400 }
    ); // Bad Request
  }

  try {
    const client = await connectToDatabase();
    const db = client.db('Add-Restaurantsss'); // Replace with your actual database name
    const collection = db.collection('Restaurantsss');
    
    // Count documents and log a sample document
    const count = await collection.countDocuments();
    console.log('Number of documents in Restaurants collection:', count);
    const document = await collection.findOne({});

    // Build the aggregation pipeline
    const pipeline = [
      {
        $search: {
          index: 'default', // Ensure this index exists in Atlas
          text: {
            query: q, // Convert query to lowercase
            path: 'name' // Ensure this matches the actual field name
          }
        }
      },
      { $limit: 10 }
    ];
    
    // Run the aggregation pipeline
    const results = await collection.aggregate(pipeline).toArray();

    // Return the results from the aggregation
    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error('Search Error:', error);
    return NextResponse.json(
      { error: 'Unable to search the database', details: error.message },
      { status: 500 }
    ); // Internal Server Error
  }
}
