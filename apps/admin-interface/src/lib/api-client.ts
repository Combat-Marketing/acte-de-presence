/**
 * API Client for communicating with backend services
 */

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Generic API error
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  console.log(`Response status: ${response.status}`);
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`API Error (${response.status}): ${errorText || response.statusText}`);
    throw new ApiError(response.status, errorText || response.statusText);
  }
  // Check if there's content to parse
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json() as Promise<T>;
  }
  
  return {} as T;
}

// Helper function for API requests with timeout
async function apiRequest<T>(
  endpoint: string, 
  method: string = 'GET', 
  data?: any, 
  headers: HeadersInit = {},
  timeoutMs: number = 30000 // Increased timeout
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Use a distinct name in the network panel to identify this request
  const requestId = `${method}-${endpoint}-${Date.now()}`;
  window.console.log(`%c 🔌 [API Request: ${requestId}] ${method} ${url}`, "background: #8b5cf6; color: white; padding: 2px 4px; border-radius: 2px;", data || '');
  
  // Minimal headers to avoid CORS issues
  const requestHeaders: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
    'X-Request-ID': requestId,
    ...headers,
  };
  

  // Keep the options as minimal as possible
  const options: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    // For debugging: log that we're about to make the fetch call
    window.console.log(`%c 🚀 [API Fetch: ${requestId}] About to fetch...`, "background: #8b5cf6; color: white; padding: 2px 4px; border-radius: 2px;", options);
    
    // Create a marker in the network tab
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`fetch-start-${requestId}`);
    }
    
    let response: Response;
    try {
      // Using standard fetch with no advanced options for maximum compatibility
      response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: data ? JSON.stringify(data) : undefined
      });
      
      window.console.log(`%c ✅ [API Success: ${requestId}] Status: ${response.status}`, "background: #10b981; color: white; padding: 2px 4px; border-radius: 2px;", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()])
      });
    } catch (fetchError) {
      window.console.log(`%c ❌ [API Fetch Error: ${requestId}]`, "background: #ef4444; color: white; padding: 2px 4px; border-radius: 2px;", fetchError);
      
      // Try a second attempt with a different mode
      window.console.log(`%c 🔄 [API Retry: ${requestId}] Trying with no-cors mode...`, "background: #f59e0b; color: white; padding: 2px 4px; border-radius: 2px;");
      
      // Try a simple fetch to see if a basic request works
      const testResponse = await fetch(API_BASE_URL, { mode: 'no-cors' });
      window.console.log(`%c 🧪 [API Test: ${requestId}] Base URL test:`, "background: #8b5cf6; color: white; padding: 2px 4px; border-radius: 2px;", testResponse);
      
      throw fetchError;
    }
    
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`fetch-end-${requestId}`);
      performance.measure(`fetch-${requestId}`, `fetch-start-${requestId}`, `fetch-end-${requestId}`);
    }
    
    return handleResponse<T>(response);
  } catch (error) {
    window.console.log(`%c ❌ [API Error: ${requestId}]`, "background: #ef4444; color: white; padding: 2px 4px; border-radius: 2px;", error);
    
    // Try detect network issues
    if (!navigator.onLine) {
      window.console.log(`%c 📡 [API Network: ${requestId}] Browser is offline`, "background: #ef4444; color: white; padding: 2px 4px; border-radius: 2px;");
      throw new ApiError(503, "You are currently offline. Please check your internet connection.");
    }
    
    // Provide more specific error info for debugging
    const errorMessage = error instanceof Error 
      ? `${error.name}: ${error.message}` 
      : 'Unknown fetch error';
    
    throw new ApiError(500, errorMessage);
  }
}

// Document types
export interface Document {
  id: string;
  key: string;
  slug?: string;
  type: string;
  parentId: string | null;
  path?: string;
  children?: Document[];
  isExpanded?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentTreeResponse {
  "documents": Document[];
  "total": number;
  "limit": number;
  "offset": number;
}
// Documents API
export const documentsApi = {
  // Get document tree
  async getDocumentTree(parentId?: string, depth: number = 3): Promise<DocumentTreeResponse> {
    // Simplify to exactly match the working approach in the ApiDebugger
    const url = `https://localhost:8080/documents?depth=${depth}`;
    
    window.console.log(`%c 🌳 [DocumentTree] Attempting fetch to: ${url}`, "background: #8b5cf6; color: white; padding: 2px 4px; border-radius: 2px;");
    
    try {
      // Use the same approach as the working API debugger - as simple as possible
      const response = await fetch(url);
      
      window.console.log(`%c ✅ [DocumentTree] Response received: ${response.status}`, "background: #10b981; color: white; padding: 2px 4px; border-radius: 2px;");
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(response.status, errorText || response.statusText);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      window.console.error(`%c ❌ [DocumentTree] Fetch failed:`, "background: #ef4444; color: white; padding: 2px 4px; border-radius: 2px;", error);
      
      // Provide mock data when fetch fails in development
      if (process.env.NODE_ENV === 'development') {
        window.console.log(`%c 🔄 [DocumentTree] Using mock data for development`, "background: #f59e0b; color: white; padding: 2px 4px; border-radius: 2px;");
        
        // Return mock data structure
        return {
          documents: [],
          total: 0,
          limit: 0, 
          offset: 0
        };
      }
      
      throw error instanceof ApiError ? error : new ApiError(500, error instanceof Error ? error.message : 'Unknown error');
    }
  },

  // Get a single document by ID
  async getDocument(id: string): Promise<Document> {
    const url = `/api/documents/${id}`;
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(response.status, errorText || response.statusText);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError(500, error instanceof Error ? error.message : 'Unknown error');
    }
  },

  // Create a new document
  async createDocument(document: Partial<Document>): Promise<Document> {
    const url = '/api/documents';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(document)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(response.status, errorText || response.statusText);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError(500, error instanceof Error ? error.message : 'Unknown error');
    }
  },

  // Delete a document
  async deleteDocument(id: string): Promise<void> {
    const url = `/api/documents/${id}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(response.status, errorText || response.statusText);
      }
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError(500, error instanceof Error ? error.message : 'Unknown error');
    }
  },

  // Update a document
  async updateDocument(id: string, document: Partial<Document>): Promise<Document> {
    const url = `/api/documents/${id}`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(document)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(response.status, errorText || response.statusText);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError(500, error instanceof Error ? error.message : 'Unknown error');
    }
  },

  // Move documents (reordering)
  async moveDocuments(moves: { id: string, parentId: string | null, position?: number }[]): Promise<void> {
    const url = '/api/documents/move';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ moves })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new ApiError(response.status, errorText || response.statusText);
      }
    } catch (error) {
      throw error instanceof ApiError ? error : new ApiError(500, error instanceof Error ? error.message : 'Unknown error');
    }
  }
};

// Assets API
export const assetsApi = {
  // Get asset tree
  async getAssetTree(parentId?: string, depth: number = 3): Promise<Document[]> {
    const endpoint = parentId 
      ? `/assets/${parentId}/children?depth=${depth}` 
      : '/assets?depth=${depth}';
    return apiRequest<Document[]>(endpoint);
  },

  // Additional asset methods would go here...
};