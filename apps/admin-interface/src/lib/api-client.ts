/**
 * API Client for communicating with backend services
 */

// Base API URL
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
  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, errorText || response.statusText);
  }
  
  // Check if there's content to parse
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }
  
  return {} as T;
}

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string, 
  method: string = 'GET', 
  data?: any, 
  headers: HeadersInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const options: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: 'include', // Include cookies for authentication
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  return handleResponse<T>(response);
}

// Document types
export interface Document {
  id: string;
  name: string;
  slug?: string;
  type: string;
  parentId: string | null;
  path?: string;
  children?: Document[];
  isExpanded?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Documents API
export const documentsApi = {
  // Get document tree
  async getDocumentTree(parentId?: string, depth: number = 3): Promise<Document[]> {
    const endpoint = parentId 
      ? `/documents/${parentId}/children?depth=${depth}` 
      : '/documents?depth=${depth}';
    return apiRequest<Document[]>(endpoint);
  },

  // Get a single document by ID
  async getDocument(id: string): Promise<Document> {
    return apiRequest<Document>(`/documents/${id}`);
  },

  // Create a new document
  async createDocument(document: Partial<Document>): Promise<Document> {
    return apiRequest<Document>('/documents', 'POST', document);
  },

  // Update a document
  async updateDocument(id: string, document: Partial<Document>): Promise<Document> {
    return apiRequest<Document>(`/documents/${id}`, 'PUT', document);
  },

  // Delete a document
  async deleteDocument(id: string): Promise<void> {
    return apiRequest<void>(`/documents/${id}`, 'DELETE');
  },

  // Move documents (reordering)
  async moveDocuments(moves: { id: string, parentId: string | null, position?: number }[]): Promise<void> {
    return apiRequest<void>('/documents/move', 'POST', { moves });
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