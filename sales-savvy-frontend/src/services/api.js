import { API_BASE_URL } from '../utils/constants'
import { getAuthToken, removeAuthToken } from '../utils/helpers'

const handleResponse = async (response) => {
  console.log('🔵 API Response Status:', response.status, response.statusText);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('🔴 API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      error: errorText
    });
    
    if (response.status === 401) {
      // Auto logout on 401
      console.log('🔴 401 Unauthorized - Clearing auth data');
      removeAuthToken();
      localStorage.removeItem('user');
      window.location.href = '/login?session=expired';
      throw new Error('Authentication failed - Please login again');
    } else if (response.status === 403) {
      throw new Error('Access denied - You do not have permission to access this resource');
    } else if (response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else {
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.error || errorJson.message || `Request failed with status ${response.status}`);
      } catch {
        throw new Error(errorText || `Request failed with status ${response.status}`);
      }
    }
  }
  
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('✅ API Success Response:', data);
      return data;
    } else {
      const text = await response.text();
      console.log('✅ API Response (text):', text);
      // Try to parse as JSON even if content-type is wrong
      try {
        return JSON.parse(text);
      } catch {
        return { success: true, message: text };
      }
    }
  } catch (error) {
    console.error('JSON parse error:', error);
    return { success: true };
  }
}

const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    credentials: 'include',
    ...options,
  }

  // Remove leading slash from endpoint to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  const fullUrl = `${API_BASE_URL}/${cleanEndpoint}`;

  // Log the request details including auth header
  console.log('🌐 Making API request:', {
    method: options.method || 'GET',
    url: fullUrl,
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + '...' : 'None'
  });

  if (options.body && typeof options.body === 'object') {
    console.log('📦 Request data:', options.body);
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(fullUrl, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('🔴 Fetch error:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please make sure the backend is running on https://sales-savvy-production-f77a.up.railway.app');
    }
    
    throw error;
  }
}

// Test connection method - standalone function
const testConnection = async () => {
  try {
    console.log('🔍 Testing backend connection...');
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      console.log('✅ Backend is reachable');
      return true;
    } else {
      console.log('❌ Backend responded with error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Backend is not reachable:', error.message);
    return false;
  }
}

export const api = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, data) => apiRequest(endpoint, { method: 'POST', body: data }),
  put: (endpoint, data) => apiRequest(endpoint, { method: 'PUT', body: data }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
  
  // Add the missing testConnection method
  testConnection: () => testConnection()
};
