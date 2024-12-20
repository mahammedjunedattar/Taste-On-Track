export async function GET(request) {
    return new Response(
      JSON.stringify({ status: 'healthy' }),
      { status: 200 }
    );
  }
  