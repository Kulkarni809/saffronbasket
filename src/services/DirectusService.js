const DIRECTUS_URL = import.meta.env.DEV ? '/api' : 'http://88.222.212.134:8055';
const SIGNUP_FLOW_ID = 'dd7f95d4-2397-4f98-956e-0b659974319d';

// Helper to parse JSON fields safely
function parseJSONField(value, defaultValue) {
  if (!value) return defaultValue;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch (e) {
    console.error('Failed to parse JSON field:', e);
    return defaultValue;
  }
}

// Helper to make fetch requests with optional auth
async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('saffron_access_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${DIRECTUS_URL}${path}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.errors?.[0]?.message || `HTTP error! status: ${response.status}`;
    throw new Error(message);
  }
  
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
}

export const DirectusService = {
  // Base URL exporter
  baseUrl: DIRECTUS_URL,

  // Image Helper: Formats an asset ID to its public URL
  // If no ID is provided, returns a CSS gradient string or placeholder indicator
  getImageUrl(assetId) {
    if (!assetId) return null;
    return `${DIRECTUS_URL}/assets/${assetId}`;
  },

  // 1. Fetch all categories
  async getCategories() {
    const response = await apiRequest('/items/categories?fields=id,name,slug,description,parent,image');
    return response.data || [];
  },

  // 2. Fetch products (supports filtering, search, sorting)
  async getProducts({ categorySlug, search, sort, featured } = {}) {
    let queryParams = new URLSearchParams();
    queryParams.append('fields', 'id,name,slug,description,price,compare_at_price,badge,image,stock,origin,weight,rating,reviews_count,featured,highlights,categories.categories_id.id,categories.categories_id.slug,categories.categories_id.name');
    
    let filters = {};
    
    // Feature filter
    if (featured !== undefined) {
      filters.featured = { _eq: featured };
    }
    
    // Category filter (Many-to-Many structure)
    if (categorySlug) {
      filters.categories = {
        categories_id: {
          slug: { _eq: categorySlug }
        }
      };
    }
    
    // Search filter
    if (search) {
      filters._or = [
        { name: { _icontains: search } },
        { description: { _icontains: search } },
        { origin: { _icontains: search } }
      ];
    }
    
    if (Object.keys(filters).length > 0) {
      queryParams.append('filter', JSON.stringify(filters));
    }
    
    // Sorting
    if (sort) {
      queryParams.append('sort', sort);
    } else {
      queryParams.append('sort', 'sort'); // Default manual sorting
    }
    
    const response = await apiRequest(`/items/products?${queryParams.toString()}`);
    const products = response.data || [];
    return products.map(product => ({
      ...product,
      price: product.price ? Math.round(product.price) : 0,
      compare_at_price: product.compare_at_price ? Math.round(product.compare_at_price) : null,
      highlights: parseJSONField(product.highlights, []),
      specifications: parseJSONField(product.specifications, {})
    }));
  },

  // 3. Fetch product by ID
  async getProductById(id) {
    const queryParams = new URLSearchParams();
    queryParams.append('fields', 'id,name,slug,description,price,compare_at_price,badge,image,stock,origin,weight,rating,reviews_count,featured,highlights,specifications,categories.categories_id.id,categories.categories_id.name,categories.categories_id.slug,gallery.directus_files_id');
    
    const response = await apiRequest(`/items/products/${id}?${queryParams.toString()}`);
    if (!response || !response.data) {
      throw new Error('Product not found');
    }
    
    const product = response.data;
    const scaledProduct = {
      ...product,
      price: product.price ? Math.round(product.price) : 0,
      compare_at_price: product.compare_at_price ? Math.round(product.compare_at_price) : null,
      highlights: parseJSONField(product.highlights, []),
      specifications: parseJSONField(product.specifications, {})
    };
    
    // Format gallery images into a clean flat array of IDs
    const galleryImages = scaledProduct.gallery?.map(item => item.directus_files_id) || [];
    
    return {
      ...scaledProduct,
      gallery: galleryImages.length > 0 ? galleryImages : (scaledProduct.image ? [scaledProduct.image] : [])
    };
  },

  // Fetch product by slug
  async getProductBySlug(slug) {
    const queryParams = new URLSearchParams();
    queryParams.append('fields', 'id,name,slug,description,price,compare_at_price,badge,image,stock,origin,weight,rating,reviews_count,featured,highlights,specifications,categories.categories_id.id,categories.categories_id.name,categories.categories_id.slug,gallery.directus_files_id');
    
    // Filter by slug
    const filters = { slug: { _eq: slug } };
    queryParams.append('filter', JSON.stringify(filters));
    
    const response = await apiRequest(`/items/products?${queryParams.toString()}`);
    if (!response || !response.data || response.data.length === 0) {
      throw new Error('Product not found');
    }
    
    const product = response.data[0];
    const scaledProduct = {
      ...product,
      price: product.price ? Math.round(product.price) : 0,
      compare_at_price: product.compare_at_price ? Math.round(product.compare_at_price) : null,
      highlights: parseJSONField(product.highlights, []),
      specifications: parseJSONField(product.specifications, {})
    };
    
    // Format gallery images into a clean flat array of IDs
    const galleryImages = scaledProduct.gallery?.map(item => item.directus_files_id) || [];
    
    return {
      ...scaledProduct,
      gallery: galleryImages.length > 0 ? galleryImages : (scaledProduct.image ? [scaledProduct.image] : [])
    };
  },

  // 4. Submit a new customer order
  async createOrder(orderData) {
    const payload = {
      status: 'pending',
      customer_name: orderData.name,
      customer_email: orderData.email,
      customer_phone: orderData.phone,
      shipping_address: orderData.address,
      total_price: parseFloat(orderData.totalPrice),
      items: orderData.items // JSON array of checkout items
    };
    
    const response = await apiRequest('/items/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    
    return response.data;
  },

  // 5. Customer Login (Authenticates with Directus system auth)
  async login(email, password) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    const { access_token, refresh_token, expires } = response.data;
    localStorage.setItem('saffron_access_token', access_token);
    localStorage.setItem('saffron_refresh_token', refresh_token);
    localStorage.setItem('saffron_token_expires', Date.now() + expires);
    
    return this.getCurrentUser();
  },

  // 6. Customer Registration (Triggers backend signup flow webhook)
  async signup(email, password, first_name, last_name, phone) {
    // Flows trigger returns the raw operation result
    const response = await fetch(`${DIRECTUS_URL}/flows/trigger/${SIGNUP_FLOW_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, first_name, last_name, phone })
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      const message = responseData.errors?.[0]?.message || 'Registration failed';
      throw new Error(message);
    }
    
    return responseData;
  },

  // 7. Get logged in user details
  async getCurrentUser() {
    try {
      const response = await apiRequest('/users/me?fields=id,email,first_name,last_name,avatar');
      return response.data;
    } catch (e) {
      this.logout();
      throw e;
    }
  },

  // 8. Get order history of currently logged in user
  async getUserOrders() {
    const response = await apiRequest('/items/orders?fields=id,status,total_price,items,date_created&sort=-date_created');
    return response.data || [];
  },

  // 9. Logout
  logout() {
    localStorage.removeItem('saffron_access_token');
    localStorage.removeItem('saffron_refresh_token');
    localStorage.removeItem('saffron_token_expires');
  },

  // 10. Check if user session exists and is valid
  isAuthenticated() {
    const token = localStorage.getItem('saffron_access_token');
    const expires = localStorage.getItem('saffron_token_expires');
    if (!token) return false;
    
    // Check if token expired
    if (expires && Date.now() > parseInt(expires)) {
      this.logout();
      return false;
    }
    return true;
  }
};
