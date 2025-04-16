import { NextRequest, NextResponse } from 'next/server';

// Define the URL of your documents service
const DOCUMENTS_SERVICE_URL = process.env.DOCUMENTS_SERVICE_URL || 'http://localhost:8082';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Log the incoming request
    console.log(`Proxying GET request to documents service for ID: ${id}`);
    
    // Forward the request to your documents service
    const response = await fetch(`${DOCUMENTS_SERVICE_URL}/documents/${id}`, {
      headers: {
        'Accept': 'application/json',
        // Forward authorization headers if present
        ...request.headers.has('Authorization') ? { 
          'Authorization': request.headers.get('Authorization') || '' 
        } : {}
      },
    });

    // If not found, return 404
    if (response.status === 404) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
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

    // If not found, return 404
    if (response.status === 404) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
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

    // If not found, return 404
    if (response.status === 404) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
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