import { NextRequest, NextResponse } from 'next/server';

// Define the URL of your documents service
const DOCUMENTS_SERVICE_URL = process.env.DOCUMENTS_SERVICE_URL || 'http://localhost:8080';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {

    // Forward the request to your documents service
    const response = await fetch(`${DOCUMENTS_SERVICE_URL}/documents`, {
      headers: {
        'Accept': 'application/json',
        // Forward authorization headers if present
        ...request.headers.has('Authorization') ? {
          'Authorization': request.headers.get('Authorization') || ''
        } : {}
      },
    });

    // Get response data
    const data = await response.json();

    // Return the response to the client
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying request to documents service:', error);
    return NextResponse.json(
      { error: 'Failed to connect to documents service' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log the incoming request
    console.log('Proxying POST request to documents service');

    // Forward the request to your documents service
    const response = await fetch(`${DOCUMENTS_SERVICE_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Forward authorization headers if present
        ...request.headers.has('Authorization') ? {
          'Authorization': request.headers.get('Authorization') || ''
        } : {}
      },
      body: JSON.stringify(body),
    });

    // Get response data
    const data = await response.json();

    // Return the response to the client
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying request to documents service:', error);
    return NextResponse.json(
      { error: 'Failed to connect to documents service' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    // Log the incoming request
    console.log(`Proxying DELETE request to documents service for ID: ${id}`);

    // Forward the request to your documents service
    const response = await fetch(`${DOCUMENTS_SERVICE_URL}/documents/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        // Forward authorization headers if present
        ...request.headers.has('Authorization') ? {
          'Authorization': request.headers.get('Authorization') || ''
        } : {}
      },
    });

    // If no content, return success with no data
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // Get response data
    const data = await response.json();

    // Return the response to the client
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying request to documents service:', error);
    return NextResponse.json(
      { error: 'Failed to connect to documents service' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const body = await request.json();

    // Log the incoming request
    console.log(`Proxying PUT request to documents service for ID: ${id}`);

    // Forward the request to your documents service
    const response = await fetch(`${DOCUMENTS_SERVICE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Forward authorization headers if present
        ...request.headers.has('Authorization') ? {
          'Authorization': request.headers.get('Authorization') || ''
        } : {}
      },
      body: JSON.stringify(body),
    });

    // Get response data
    const data = await response.json();

    // Return the response to the client
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying request to documents service:', error);
    return NextResponse.json(
      { error: 'Failed to connect to documents service' },
      { status: 500 }
    );
  }
}