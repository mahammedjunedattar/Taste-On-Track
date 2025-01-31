import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Ensure you have this environment variable set
let cachedClient = null;

// Function to connect to the database
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

// Function to handle GET requests
export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q');

  // Validate the query parameter
  if (!q || typeof q !== 'string' || q.trim() === '') {
    return NextResponse.json(
      { error: 'Query parameter "q" is required and should be a non-empty string' },
      { status: 400 }
    ); // Bad Request
  }

  try {
    const client = await connectToDatabase();
    const db = client.db('Delivery-parteners'); // Replace with your actual database name
    const collection = db.collection('parteners'); // Replace with your actual collection name

    // Build the aggregation pipeline
    const pipeline = [
      {
        $search: {
          index: 'default', // Ensure this index exists in Atlas
          text: {
            query: q, // The search query
            path: ['name', 'area', 'id'] // Search across multiple fields
          }
        }
      },
      { $limit: 10 }, // Limit the results to 10
      {
        $project: {
            id: 1,
          name: 1,
          email: 1,
          contact: 1,
          score: { $meta: 'searchScore' } // Include the relevance score (optional)
        }
      }
    ];

    // Run the aggregation pipeline
    const results = await collection.aggregate(pipeline).toArray();

    // Return the results
    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error('Search Error:', error);
    return NextResponse.json(
      { error: 'Unable to search the database', details: error.message },
      { status: 500 }
    ); // Internal Server Error
  }
}
