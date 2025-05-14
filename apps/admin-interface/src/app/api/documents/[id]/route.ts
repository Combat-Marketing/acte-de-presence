import { NextRequest, NextResponse } from 'next/server';

// Define the URL of your documents service
const DOCUMENTS_SERVICE_URL = process.env.DOCUMENTS_SERVICE_URL || 'http://localhost:8080';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const {id} = await params;

        // Log the incoming request
        console.log('Proxying GET request to documents service');
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