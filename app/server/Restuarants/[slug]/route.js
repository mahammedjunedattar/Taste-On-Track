import https from 'https';
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

// Helper function to make HTTPS requests using Node.js native `https` module
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// API route handler using Node.js https module
export async function GET(req, { params }) {
  const { slug } = params;

  try {
    // Use native https to fetch external data
    const client = await connectToDatabase();
    const db = client.db();

    const externalData = await fetch(`/apis/search?q=${slug}`);
    console.log('External API data using https:', externalData);



    

    return NextResponse.json({ data: {  externalData } }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Unable to fetch data', details: error.message }, { status: 500 });
  }
}
