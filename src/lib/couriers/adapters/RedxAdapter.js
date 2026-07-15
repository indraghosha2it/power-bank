
// const CourierAdapter = require('./CourierAdapter');

// // ========== REDX API ENDPOINTS ==========
// const REDX_AUTH_URL = 'https://api.redx.com.bd/v4/auth/login';
// const REDX_API_BASE = 'https://openapi.redx.com.bd/v1.0.0-beta';
// const REDX_SANDBOX_BASE = 'https://sandbox.redx.com.bd/v1.0.0-beta';

// class RedxAdapter extends CourierAdapter {
//   constructor(creds, storeConfig) {
//     super('redx', creds, storeConfig);
//     this.accessToken = null;
//     this.tokenExpiry = null;
//     this.areasCache = null;
//     this.areasCacheTime = null;
//     this.cacheTTL = 3600000; // 1 hour cache TTL
    
//     this.redxConfig = {
//       pickupStoreId: storeConfig?.pickupStoreId || null,
//       baseUrl: storeConfig?.redxBaseUrl || creds?.baseUrl || REDX_API_BASE,
//     };
//   }

//   // ========== GET REDX AUTHENTICATION TOKEN ==========
//   async getAccessToken() {
//     if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
//       return this.accessToken;
//     }

//     try {
//       console.log('🔑 Getting RedX access token...');
      
//       if (this.creds.apiToken) {
//         console.log('✅ Using provided API token');
//         this.accessToken = this.creds.apiToken;
//         this.tokenExpiry = Date.now() + 3600 * 1000;
//         return this.accessToken;
//       }

//       const phone = String(this.creds.phone || '').replace(/\D/g, '');
//       const normalizedPhone = phone.startsWith('880') ? phone : 
//                               phone.startsWith('0') ? `88${phone}` : 
//                               `880${phone}`;

//       const response = await fetch(REDX_AUTH_URL, {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           'User-Agent': 'Mozilla/5.0',
//         },
//         body: JSON.stringify({
//           phone: normalizedPhone,
//           password: this.creds.password,
//         }),
//       });

//       const contentType = response.headers.get('content-type');
//       if (contentType && contentType.includes('text/html')) {
//         const html = await response.text();
//         console.error('❌ Received HTML instead of JSON');
//         throw new Error('RedX API returned HTML. Please check your credentials.');
//       }

//       let data;
//       try {
//         data = await response.json();
//       } catch (parseError) {
//         const text = await response.text();
//         console.error('❌ Failed to parse response:', text.substring(0, 200));
//         throw new Error('RedX API returned invalid JSON response');
//       }

//       if (!response.ok) {
//         throw new Error(data?.message || data?.error || 'RedX authentication failed');
//       }

//       const token = data?.data?.accessToken || data?.accessToken || data?.token;
      
//       if (!token) {
//         console.error('❌ No token found in response');
//         throw new Error('No access token received from RedX');
//       }

//       this.accessToken = token;
//       this.tokenExpiry = Date.now() + (data?.expires_in || 3600) * 1000;
      
//       console.log('✅ RedX token obtained successfully');
//       return this.accessToken;
      
//     } catch (error) {
//       console.error('❌ RedX token error:', error);
//       throw new Error(`RedX authentication failed: ${error.message}`);
//     }
//   }

//   // ========== GET BASE URL ==========
//   getBaseUrl() {
//     const url = this.redxConfig.baseUrl || this.creds.baseUrl || REDX_API_BASE;
//     return url.replace(/\/$/, '');
//   }

//   // ========== GET AUTH HEADERS - FIXED ==========
//   getAuthHeaders(token) {
//     return {
//       'API-ACCESS-TOKEN': `Bearer ${token}`,  // ✅ Bearer prefix is REQUIRED
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//     };
//   }

//   // ========== FETCH REDX AREAS ==========
//   async fetchAreas(districtName = null) {
//     try {
//       const now = Date.now();
//       if (this.areasCache && this.areasCacheTime && (now - this.areasCacheTime) < this.cacheTTL) {
//         console.log(`📦 Using cached areas (${this.areasCache.length} areas)`);
//         return this.areasCache;
//       }

//       const token = await this.getAccessToken();
//       const baseUrl = this.getBaseUrl();
      
//       let url = `${baseUrl}/areas`;
//       if (districtName) {
//         url += `?district_name=${encodeURIComponent(districtName)}`;
//       }
      
//       console.log(`📡 Fetching RedX areas: ${url}`);
      
//       const response = await fetch(url, {
//         headers: this.getAuthHeaders(token),
//       });

//       console.log('📊 Response Status:', response.status);

//       const contentType = response.headers.get('content-type');
//       if (contentType && contentType.includes('text/html')) {
//         const html = await response.text();
//         console.error('❌ Received HTML instead of JSON');
//         throw new Error('RedX API returned HTML. Please check the API endpoint.');
//       }

//       let data;
//       try {
//         data = await response.json();
//       } catch (parseError) {
//         const text = await response.text();
//         console.error('❌ Failed to parse response:', text.substring(0, 200));
//         throw new Error('RedX API returned invalid JSON response');
//       }

//       if (!response.ok) {
//         const errorMsg = data?.message || data?.error || `HTTP ${response.status}`;
//         throw new Error(errorMsg);
//       }
      
//       const areas = data?.areas || [];
      
//       this.areasCache = areas;
//       this.areasCacheTime = Date.now();
      
//       console.log(`✅ Fetched ${areas.length} RedX areas`);
//       return areas;
      
//     } catch (error) {
//       console.error('❌ Fetch RedX areas error:', error);
//       if (this.areasCache) {
//         console.log('⚠️ Using expired cache due to fetch failure');
//         return this.areasCache;
//       }
//       throw error;
//     }
//   }

//   // ========== FIND DELIVERY AREA ID FROM ORDER ADDRESS ==========
//   async findDeliveryAreaId(order) {
//     const customer = order.customerInfo;
    
//     const searchTerms = [
//       customer.area || '',
//       customer.zone || '',
//       customer.city || '',
//       customer.division || '',
//     ].filter(Boolean);

//     console.log('📍 Finding RedX area for address:', {
//       division: customer.division,
//       city: customer.city,
//       zone: customer.zone,
//       area: customer.area,
//     });

//     // try {
//     //   const areas = await this.fetchAreas(customer.city);
      
//     //   if (!areas || areas.length === 0) {
//     //     console.log('⚠️ No areas found for city:', customer.city);
//     //     return null;
//     //   }

//     try {
//   // Fetch the FULL area list — don't pre-filter by district_name.
//   // RedX's district_name filter requires an EXACT match against its own
//   // internal spelling (e.g. it may store "Chapai Nawabganj" with a space,
//   // while the customer's address has "Chapainawabganj"). A mismatch makes
//   // RedX's API itself throw ("No active area found for provided
//   // district_name") before your local fuzzy-matching logic ever runs.
//   // So: try the filtered call first (fast path via cache), and if RedX
//   // rejects it, fall back to fetching everything and matching locally.
//   let areas;
//   try {
//     areas = await this.fetchAreas(customer.city);
//   } catch (filterError) {
//     console.log(`⚠️ RedX rejected district_name="${customer.city}" (${filterError.message}). Retrying with full area list...`);
//     areas = await this.fetchAreas(); // no filter
//   }

//   if (!areas || areas.length === 0) {
//     console.log('⚠️ No areas found for city:', customer.city);
//     return null;
//   }

//       console.log(`🔍 Searching through ${areas.length} areas...`);

//       let matchedArea = null;
//       let matchScore = 0;

//       for (const area of areas) {
//         const areaName = (area.name || '').toLowerCase().trim();
//         const areaDistrict = (area.district_name || '').toLowerCase().trim();
//         const areaCity = (area.city_name || '').toLowerCase().trim();
        
//         let score = 0;

//         for (const term of searchTerms) {
//           const termLower = term.toLowerCase().trim();
//           if (!termLower) continue;

//           if (areaName === termLower) {
//             score += 100;
//           } else if (areaName.includes(termLower) || termLower.includes(areaName)) {
//             score += 50;
//           } else if (areaDistrict === termLower || areaDistrict.includes(termLower) || termLower.includes(areaDistrict)) {
//             score += 30;
//           } else if (areaCity === termLower || areaCity.includes(termLower) || termLower.includes(areaCity)) {
//             score += 20;
//           }
//         }

//         if (score > matchScore) {
//           matchScore = score;
//           matchedArea = area;
//         }
//       }

//       if (matchedArea && matchScore > 0) {
//         console.log(`✅ Found matching area: ${matchedArea.name} (ID: ${matchedArea.id})`);
//         return matchedArea;
//       }

//       if (areas.length > 0) {
//         const firstArea = areas[0];
//         console.log(`⚠️ No match found, using first area: ${firstArea.name} (ID: ${firstArea.id})`);
//         return firstArea;
//       }

//       return null;
      
//     } catch (error) {
//       console.error('❌ Error finding delivery area:', error);
//       return null;
//     }
//   }

//   // ========== TEST CONNECTION ==========
//   async testConnection() {
//     try {
//       console.log('🧪 Testing RedX connection...');
      
//       if (!this.creds.phone && !this.creds.apiToken) {
//         return { 
//           success: false, 
//           message: 'RedX credentials not configured. Please add API token or phone/password.',
//           details: 'API token is required for authentication'
//         };
//       }

//       const token = await this.getAccessToken();
//       const baseUrl = this.getBaseUrl();
//       const url = `${baseUrl}/areas`;
      
//       console.log('📡 Testing areas endpoint:', url);
//       console.log('📝 Token (first 20 chars):', token.substring(0, 20) + '...');
//       console.log('📝 Header format: API-ACCESS-TOKEN: Bearer <token>');
      
//       const response = await fetch(url, {
//         headers: this.getAuthHeaders(token),
//       });

//       console.log('📊 Response Status:', response.status);

//       if (response.status === 401) {
//         return {
//           success: false,
//           message: 'RedX authentication failed (401 Unauthorized). Please check that your API token is valid and has not expired.',
//           details: 'Generate a new token from RedX Merchant Panel → Developer APIs → Configuration'
//         };
//       }

//       const contentType = response.headers.get('content-type');
//       if (contentType && contentType.includes('text/html')) {
//         const html = await response.text();
//         console.error('❌ Received HTML instead of JSON');
//         throw new Error('RedX API returned HTML. Please check the base URL.');
//       }

//       let data;
//       try {
//         data = await response.json();
//       } catch (parseError) {
//         const text = await response.text();
//         console.error('❌ Failed to parse response:', text.substring(0, 200));
//         throw new Error('RedX API returned invalid JSON');
//       }

//       if (!response.ok) {
//         const errorMsg = data?.message || data?.error || `HTTP ${response.status}`;
//         throw new Error(errorMsg);
//       }

//       const areasCount = data?.areas?.length || 0;
      
//       return { 
//         success: true, 
//         message: `RedX API connected successfully. ${areasCount} delivery areas available.`,
//         details: `Areas fetched: ${areasCount}`,
//         areas: data?.areas || []
//       };
      
//     } catch (error) {
//       console.error('❌ RedX test connection error:', error);
//       return { 
//         success: false, 
//         message: error.message || 'RedX connection failed',
//         details: 'Please check your credentials and API endpoint'
//       };
//     }
//   }

//   // ========== CREATE ORDER ==========
//   async createOrder(orderData) {
//     try {
//       console.log('📦 Creating RedX order...');
      
//       const token = await this.getAccessToken();
//       const baseUrl = this.getBaseUrl();
      
//       let areaId = this.redxConfig.deliveryAreaId || this.storeConfig?.redxDeliveryAreaId;
//       let areaName = this.redxConfig.deliveryAreaName || this.storeConfig?.redxDeliveryAreaName;
      
//       if (!areaId) {
//         console.log('📍 No area ID in config, finding from order address...');
//         const matchedArea = await this.findDeliveryAreaId(orderData);
        
//         if (matchedArea) {
//           areaId = matchedArea.id;
//           areaName = matchedArea.name;
//           console.log(`📍 Found area: ${areaName} (ID: ${areaId})`);
//         } else {
//           throw new Error(
//             'Could not determine RedX delivery area from the order address. ' +
//             'Please ensure the address has valid Division, District, Upazila/Thana, and Area.'
//           );
//         }
//       }

//       const customer = orderData.customerInfo;
//       const cleanPhone = this.cleanPhoneNumber(customer.phone);
//       const weightGrams = Math.round((orderData.weight || 0.5) * 1000);
//       const codAmount = orderData.paymentMethod === 'cod' ? Math.round(orderData.total || 0) : 0;

//       const fullAddress = [
//         customer.address,
//         customer.area || '',
//         customer.zone || '',
//         customer.city || '',
//         customer.division || ''
//       ].filter(Boolean).join(', ');

//       const itemDescription = orderData.items
//         .map(item => `${item.productName || 'Product'} x${item.quantity || 1}`)
//         .join(', ')
//         .slice(0, 255);

//       const body = {
//         customer_name: customer.fullName || 'Customer',
//         customer_phone: cleanPhone || '01700000000',
//         delivery_area: areaName || customer.city || 'Dhaka',
//         delivery_area_id: Number(areaId),
//         customer_address: fullAddress.slice(0, 255),
//         merchant_invoice_id: orderData.orderNumber || `ORD-${Date.now()}`,
//         cash_collection_amount: String(codAmount),
//         parcel_weight: Math.max(100, weightGrams),
//         instruction: (customer.note || '').slice(0, 255),
//         value: Math.round(orderData.total || 0),
//         parcel_details_json: [
//           {
//             name: itemDescription || 'Order items',
//             category: 'general',
//             value: Math.round(orderData.total || 0),
//           },
//         ],
//       };

//       const pickupStoreId = this.redxConfig.pickupStoreId || this.storeConfig?.pickupStoreId;
//       if (pickupStoreId) {
//         body.pickup_store_id = pickupStoreId;
//       }

//       console.log('📤 RedX order data:', JSON.stringify(body, null, 2));

//       const url = `${baseUrl}/parcel`;
//       console.log(`📡 POST ${url}`);

//       const response = await fetch(url, {
//         method: 'POST',
//         headers: this.getAuthHeaders(token),
//         body: JSON.stringify(body),
//       });

//       console.log('📊 Response Status:', response.status);

//       let data;
//       try {
//         data = await response.json();
//       } catch (parseError) {
//         const text = await response.text();
//         console.error('❌ Failed to parse response:', text.substring(0, 200));
//         throw new Error('RedX API returned invalid JSON response');
//       }

//       if (!response.ok) {
//         const errorMsg = data?.message || data?.error || 'RedX parcel creation failed';
//         throw new Error(errorMsg);
//       }

//       const trackingId = data?.tracking_id || data?.data?.tracking_id || data?.id;
      
//       return {
//         success: true,
//         courierOrderId: trackingId ? String(trackingId) : null,
//         trackingNumber: trackingId ? String(trackingId) : null,
//         trackingUrl: trackingId ? `https://redx.com.bd/track/${trackingId}` : null,
//         labelUrl: data?.label_url || data?.data?.label_url || '',
//         fullResponse: data,
//         message: 'Order created successfully with RedX'
//       };
      
//     } catch (error) {
//       console.error('❌ RedX order creation error:', error);
//       return { 
//         success: false, 
//         message: error.message || 'Failed to create RedX order' 
//       };
//     }
//   }

//   // ========== FORMAT ORDER DATA ==========
//   formatOrderData(order) {
//     const customer = order.customerInfo;
//     const cleanPhone = this.cleanPhoneNumber(customer.phone);
//     const fullAddress = [customer.address, customer.area, customer.zone, customer.city]
//       .filter(Boolean).join(', ');

//     return {
//       merchant_order_id: order.orderNumber || `ORD-${Date.now()}`,
//       customer_name: customer.fullName || 'Customer',
//       customer_phone: cleanPhone || '01700000000',
//       customer_address: fullAddress.slice(0, 255) || 'N/A',
//       city: customer.city || 'Dhaka',
//       zone: customer.zone || '',
//       total_amount: Math.round(order.total || 0),
//       cod_amount: order.paymentMethod === 'cod' ? Math.round(order.total || 0) : 0,
//       weight: this.calculateTotalWeight(order.items) || 0.5,
//       weight_grams: Math.round((this.calculateTotalWeight(order.items) || 0.5) * 1000),
//       item_description: order.items.map(item => 
//         `${item.productName || 'Product'} x${item.quantity || 1}`
//       ).join(', ').slice(0, 255),
//       note: (customer.note || '').slice(0, 255)
//     };
//   }

//   // ========== CLEAN PHONE NUMBER ==========
//   cleanPhoneNumber(phone) {
//     if (!phone) return '01700000000';
//     let cleaned = phone.replace(/\D/g, '');
//     if (cleaned.startsWith('880')) cleaned = '0' + cleaned.slice(3);
//     if (!cleaned.startsWith('0')) cleaned = '0' + cleaned;
//     if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
//     while (cleaned.length < 11) cleaned = cleaned + '0';
//     return cleaned;
//   }

//   // ========== CALCULATE TOTAL WEIGHT ==========
//   calculateTotalWeight(items) {
//     if (!items || items.length === 0) return 0.5;
//     return items.reduce((sum, item) => {
//       const weight = item.weight || item.itemWeight || 0.5;
//       return sum + (weight * (item.quantity || 1));
//     }, 0);
//   }

//   // ========== GET TRACKING ==========
//   async getTracking(trackingNumber) {
//     try {
//       const token = await this.getAccessToken();
//       const baseUrl = this.getBaseUrl();
      
//       const response = await fetch(`${baseUrl}/parcel/track/${trackingNumber}`, {
//         headers: this.getAuthHeaders(token),
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data?.message || 'Failed to get tracking info');
//       }
      
//       return { 
//         success: true, 
//         status: data?.status || data?.delivery_status,
//         history: data?.tracking || [],
//         fullResponse: data 
//       };
      
//     } catch (error) {
//       console.error('❌ RedX tracking error:', error);
//       return { success: false, message: error.message };
//     }
//   }

//   // ========== CANCEL ORDER ==========
//   async cancelOrder(courierOrderId) {
//     try {
//       const token = await this.getAccessToken();
//       const baseUrl = this.getBaseUrl();
      
//       const response = await fetch(`${baseUrl}/parcels`, {
//         method: 'PATCH',
//         headers: this.getAuthHeaders(token),
//         body: JSON.stringify({
//           entity_type: 'parcel-tracking-id',
//           entity_id: courierOrderId,
//           update_details: {
//             property_name: 'status',
//             new_value: 'cancelled',
//             reason: 'Cancelled by merchant',
//           },
//         }),
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data?.message || 'Failed to cancel order');
//       }
      
//       return { 
//         success: true, 
//         message: 'Order cancelled successfully with RedX',
//         fullResponse: data 
//       };
      
//     } catch (error) {
//       console.error('❌ RedX cancel error:', error);
//       return { success: false, message: error.message };
//     }
//   }

//   // ========== GET AVAILABLE AREAS ==========
//   async getAvailableAreas(districtName = null) {
//     return this.fetchAreas(districtName);
//   }
// }

// module.exports = RedxAdapter;


const CourierAdapter = require('./CourierAdapter');

// ========== REDX API ENDPOINTS ==========
const REDX_AUTH_URL = 'https://api.redx.com.bd/v4/auth/login';
const REDX_API_BASE = 'https://openapi.redx.com.bd/v1.0.0-beta';
const REDX_SANDBOX_BASE = 'https://sandbox.redx.com.bd/v1.0.0-beta';

class RedxAdapter extends CourierAdapter {
  constructor(creds, storeConfig) {
    super('redx', creds, storeConfig);
    this.accessToken = null;
    this.tokenExpiry = null;
    this.areasCache = null;
    this.areasCacheTime = null;
    this.cacheTTL = 3600000; // 1 hour cache TTL
    
    this.redxConfig = {
      pickupStoreId: storeConfig?.pickupStoreId || null,
      baseUrl: storeConfig?.redxBaseUrl || creds?.baseUrl || REDX_API_BASE,
      // ✅ Shop ID from credentials or storeConfig
      shopId: creds?.shopId || storeConfig?.shopId || null,
    };
  }

  // ========== GET REDX AUTHENTICATION TOKEN ==========
  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      console.log('🔑 Getting RedX access token...');
      
      if (this.creds.apiToken) {
        console.log('✅ Using provided API token');
        this.accessToken = this.creds.apiToken;
        this.tokenExpiry = Date.now() + 3600 * 1000;
        return this.accessToken;
      }

      const phone = String(this.creds.phone || '').replace(/\D/g, '');
      const normalizedPhone = phone.startsWith('880') ? phone : 
                              phone.startsWith('0') ? `88${phone}` : 
                              `880${phone}`;

      const response = await fetch(REDX_AUTH_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0',
        },
        body: JSON.stringify({
          phone: normalizedPhone,
          password: this.creds.password,
        }),
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        const html = await response.text();
        console.error('❌ Received HTML instead of JSON');
        throw new Error('RedX API returned HTML. Please check your credentials.');
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        const text = await response.text();
        console.error('❌ Failed to parse response:', text.substring(0, 200));
        throw new Error('RedX API returned invalid JSON response');
      }

      if (!response.ok) {
        throw new Error(data?.message || data?.error || 'RedX authentication failed');
      }

      const token = data?.data?.accessToken || data?.accessToken || data?.token;
      
      if (!token) {
        console.error('❌ No token found in response');
        throw new Error('No access token received from RedX');
      }

      this.accessToken = token;
      this.tokenExpiry = Date.now() + (data?.expires_in || 3600) * 1000;
      
      console.log('✅ RedX token obtained successfully');
      return this.accessToken;
      
    } catch (error) {
      console.error('❌ RedX token error:', error);
      throw new Error(`RedX authentication failed: ${error.message}`);
    }
  }

  // ========== GET BASE URL ==========
  getBaseUrl() {
    const url = this.redxConfig.baseUrl || this.creds.baseUrl || REDX_API_BASE;
    return url.replace(/\/$/, '');
  }

  // ========== GET AUTH HEADERS - FIXED ==========
  getAuthHeaders(token) {
    return {
      'API-ACCESS-TOKEN': `Bearer ${token}`,  // ✅ Bearer prefix is REQUIRED
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }

  // ========== FETCH REDX AREAS ==========
  async fetchAreas(districtName = null) {
    try {
      const now = Date.now();
      if (this.areasCache && this.areasCacheTime && (now - this.areasCacheTime) < this.cacheTTL) {
        console.log(`📦 Using cached areas (${this.areasCache.length} areas)`);
        return this.areasCache;
      }

      const token = await this.getAccessToken();
      const baseUrl = this.getBaseUrl();
      
      let url = `${baseUrl}/areas`;
      if (districtName) {
        url += `?district_name=${encodeURIComponent(districtName)}`;
      }
      
      console.log(`📡 Fetching RedX areas: ${url}`);
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(token),
      });

      console.log('📊 Response Status:', response.status);

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        const html = await response.text();
        console.error('❌ Received HTML instead of JSON');
        throw new Error('RedX API returned HTML. Please check the API endpoint.');
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        const text = await response.text();
        console.error('❌ Failed to parse response:', text.substring(0, 200));
        throw new Error('RedX API returned invalid JSON response');
      }

      if (!response.ok) {
        const errorMsg = data?.message || data?.error || `HTTP ${response.status}`;
        throw new Error(errorMsg);
      }
      
      const areas = data?.areas || [];
      
      this.areasCache = areas;
      this.areasCacheTime = Date.now();
      
      console.log(`✅ Fetched ${areas.length} RedX areas`);
      return areas;
      
    } catch (error) {
      console.error('❌ Fetch RedX areas error:', error);
      if (this.areasCache) {
        console.log('⚠️ Using expired cache due to fetch failure');
        return this.areasCache;
      }
      throw error;
    }
  }

  // ========== FIND DELIVERY AREA ID FROM ORDER ADDRESS ==========
  async findDeliveryAreaId(order) {
    const customer = order.customerInfo;
    
    const searchTerms = [
      customer.area || '',
      customer.zone || '',
      customer.city || '',
      customer.division || '',
    ].filter(Boolean);

    console.log('📍 Finding RedX area for address:', {
      division: customer.division,
      city: customer.city,
      zone: customer.zone,
      area: customer.area,
    });

    try {
      // Fetch the FULL area list — don't pre-filter by district_name.
      // RedX's district_name filter requires an EXACT match against its own
      // internal spelling (e.g. it may store "Chapai Nawabganj" with a space,
      // while the customer's address has "Chapainawabganj"). A mismatch makes
      // RedX's API itself throw ("No active area found for provided
      // district_name") before your local fuzzy-matching logic ever runs.
      // So: try the filtered call first (fast path via cache), and if RedX
      // rejects it, fall back to fetching everything and matching locally.
      let areas;
      try {
        areas = await this.fetchAreas(customer.city);
      } catch (filterError) {
        console.log(`⚠️ RedX rejected district_name="${customer.city}" (${filterError.message}). Retrying with full area list...`);
        areas = await this.fetchAreas(); // no filter
      }

      if (!areas || areas.length === 0) {
        console.log('⚠️ No areas found for city:', customer.city);
        return null;
      }

      console.log(`🔍 Searching through ${areas.length} areas...`);

      let matchedArea = null;
      let matchScore = 0;

      for (const area of areas) {
        const areaName = (area.name || '').toLowerCase().trim();
        const areaDistrict = (area.district_name || '').toLowerCase().trim();
        const areaCity = (area.city_name || '').toLowerCase().trim();
        
        let score = 0;

        for (const term of searchTerms) {
          const termLower = term.toLowerCase().trim();
          if (!termLower) continue;

          if (areaName === termLower) {
            score += 100;
          } else if (areaName.includes(termLower) || termLower.includes(areaName)) {
            score += 50;
          } else if (areaDistrict === termLower || areaDistrict.includes(termLower) || termLower.includes(areaDistrict)) {
            score += 30;
          } else if (areaCity === termLower || areaCity.includes(termLower) || termLower.includes(areaCity)) {
            score += 20;
          }
        }

        if (score > matchScore) {
          matchScore = score;
          matchedArea = area;
        }
      }

      if (matchedArea && matchScore > 0) {
        console.log(`✅ Found matching area: ${matchedArea.name} (ID: ${matchedArea.id})`);
        return matchedArea;
      }

      if (areas.length > 0) {
        const firstArea = areas[0];
        console.log(`⚠️ No match found, using first area: ${firstArea.name} (ID: ${firstArea.id})`);
        return firstArea;
      }

      return null;
      
    } catch (error) {
      console.error('❌ Error finding delivery area:', error);
      return null;
    }
  }

  // ========== TEST CONNECTION ==========
  async testConnection() {
    try {
      console.log('🧪 Testing RedX connection...');
      
      if (!this.creds.phone && !this.creds.apiToken) {
        return { 
          success: false, 
          message: 'RedX credentials not configured. Please add API token or phone/password.',
          details: 'API token is required for authentication'
        };
      }

      const token = await this.getAccessToken();
      const baseUrl = this.getBaseUrl();
      const url = `${baseUrl}/areas`;
      
      console.log('📡 Testing areas endpoint:', url);
      console.log('📝 Token (first 20 chars):', token.substring(0, 20) + '...');
      console.log('📝 Header format: API-ACCESS-TOKEN: Bearer <token>');
      
      const response = await fetch(url, {
        headers: this.getAuthHeaders(token),
      });

      console.log('📊 Response Status:', response.status);

      if (response.status === 401) {
        return {
          success: false,
          message: 'RedX authentication failed (401 Unauthorized). Please check that your API token is valid and has not expired.',
          details: 'Generate a new token from RedX Merchant Panel → Developer APIs → Configuration'
        };
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        const html = await response.text();
        console.error('❌ Received HTML instead of JSON');
        throw new Error('RedX API returned HTML. Please check the base URL.');
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        const text = await response.text();
        console.error('❌ Failed to parse response:', text.substring(0, 200));
        throw new Error('RedX API returned invalid JSON');
      }

      if (!response.ok) {
        const errorMsg = data?.message || data?.error || `HTTP ${response.status}`;
        throw new Error(errorMsg);
      }

      const areasCount = data?.areas?.length || 0;
      
      return { 
        success: true, 
        message: `RedX API connected successfully. ${areasCount} delivery areas available.`,
        details: `Areas fetched: ${areasCount}`,
        areas: data?.areas || []
      };
      
    } catch (error) {
      console.error('❌ RedX test connection error:', error);
      return { 
        success: false, 
        message: error.message || 'RedX connection failed',
        details: 'Please check your credentials and API endpoint'
      };
    }
  }

  // ========== CREATE ORDER ==========
  async createOrder(orderData) {
    try {
      console.log('📦 Creating RedX order...');
      
      const token = await this.getAccessToken();
      const baseUrl = this.getBaseUrl();
      
      let areaId = this.redxConfig.deliveryAreaId || this.storeConfig?.redxDeliveryAreaId;
      let areaName = this.redxConfig.deliveryAreaName || this.storeConfig?.redxDeliveryAreaName;
      
      if (!areaId) {
        console.log('📍 No area ID in config, finding from order address...');
        const matchedArea = await this.findDeliveryAreaId(orderData);
        
        if (matchedArea) {
          areaId = matchedArea.id;
          areaName = matchedArea.name;
          console.log(`📍 Found area: ${areaName} (ID: ${areaId})`);
        } else {
          throw new Error(
            'Could not determine RedX delivery area from the order address. ' +
            'Please ensure the address has valid Division, District, Upazila/Thana, and Area.'
          );
        }
      }

      const customer = orderData.customerInfo;
      const cleanPhone = this.cleanPhoneNumber(customer.phone);
      const weightGrams = Math.round((orderData.weight || 0.5) * 1000);
      const codAmount = orderData.paymentMethod === 'cod' ? Math.round(orderData.total || 0) : 0;

      const fullAddress = [
        customer.address,
        customer.area || '',
        customer.zone || '',
        customer.city || '',
        customer.division || ''
      ].filter(Boolean).join(', ');

      const itemDescription = orderData.items
        .map(item => `${item.productName || 'Product'} x${item.quantity || 1}`)
        .join(', ')
        .slice(0, 255);

      const body = {
        customer_name: customer.fullName || 'Customer',
        customer_phone: cleanPhone || '01700000000',
        delivery_area: areaName || customer.city || 'Dhaka',
        delivery_area_id: Number(areaId),
        customer_address: fullAddress.slice(0, 255),
        merchant_invoice_id: orderData.orderNumber || `ORD-${Date.now()}`,
        cash_collection_amount: String(codAmount),
        parcel_weight: Math.max(100, weightGrams),
        instruction: (customer.note || '').slice(0, 255),
        value: Math.round(orderData.total || 0),
        parcel_details_json: [
          {
            name: itemDescription || 'Order items',
            category: 'general',
            value: Math.round(orderData.total || 0),
          },
        ],
      };

      const pickupStoreId = this.redxConfig.pickupStoreId || this.storeConfig?.pickupStoreId;
      if (pickupStoreId) {
        body.pickup_store_id = pickupStoreId;
      }

      console.log('📤 RedX order data:', JSON.stringify(body, null, 2));

      const url = `${baseUrl}/parcel`;
      console.log(`📡 POST ${url}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(body),
      });

      console.log('📊 Response Status:', response.status);

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        const text = await response.text();
        console.error('❌ Failed to parse response:', text.substring(0, 200));
        throw new Error('RedX API returned invalid JSON response');
      }

      if (!response.ok) {
        const errorMsg = data?.message || data?.error || 'RedX parcel creation failed';
        throw new Error(errorMsg);
      }

      const trackingId = data?.tracking_id || data?.data?.tracking_id || data?.id;
      
      // ========== GET SHOP ID FROM CONFIG OR CREDS ==========
      const shopId = this.redxConfig.shopId || this.creds?.shopId || '1046591';
      
      // ========== GENERATE CORRECT TRACKING URL WITH SHOP ID ==========
      const trackingUrl = trackingId && shopId
        ? `https://redx.com.bd/track-parcel/?trackingId=${trackingId}&shopId=${shopId}`
        : (trackingId ? `https://redx.com.bd/track/${trackingId}` : '');

      console.log('✅ Generated tracking URL:', trackingUrl);
      
      return {
        success: true,
        courierOrderId: trackingId ? String(trackingId) : null,
        trackingNumber: trackingId ? String(trackingId) : null,
        trackingUrl: trackingUrl,
        labelUrl: data?.label_url || data?.data?.label_url || '',
        fullResponse: data,
        message: 'Order created successfully with RedX'
      };
      
    } catch (error) {
      console.error('❌ RedX order creation error:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to create RedX order' 
      };
    }
  }

  // ========== FORMAT ORDER DATA ==========
  formatOrderData(order) {
    const customer = order.customerInfo;
    const cleanPhone = this.cleanPhoneNumber(customer.phone);
    const fullAddress = [customer.address, customer.area, customer.zone, customer.city]
      .filter(Boolean).join(', ');

    return {
      merchant_order_id: order.orderNumber || `ORD-${Date.now()}`,
      customer_name: customer.fullName || 'Customer',
      customer_phone: cleanPhone || '01700000000',
      customer_address: fullAddress.slice(0, 255) || 'N/A',
      city: customer.city || 'Dhaka',
      zone: customer.zone || '',
      total_amount: Math.round(order.total || 0),
      cod_amount: order.paymentMethod === 'cod' ? Math.round(order.total || 0) : 0,
      weight: this.calculateTotalWeight(order.items) || 0.5,
      weight_grams: Math.round((this.calculateTotalWeight(order.items) || 0.5) * 1000),
      item_description: order.items.map(item => 
        `${item.productName || 'Product'} x${item.quantity || 1}`
      ).join(', ').slice(0, 255),
      note: (customer.note || '').slice(0, 255)
    };
  }

  // ========== CLEAN PHONE NUMBER ==========
  cleanPhoneNumber(phone) {
    if (!phone) return '01700000000';
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('880')) cleaned = '0' + cleaned.slice(3);
    if (!cleaned.startsWith('0')) cleaned = '0' + cleaned;
    if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
    while (cleaned.length < 11) cleaned = cleaned + '0';
    return cleaned;
  }

  // ========== CALCULATE TOTAL WEIGHT ==========
  calculateTotalWeight(items) {
    if (!items || items.length === 0) return 0.5;
    return items.reduce((sum, item) => {
      const weight = item.weight || item.itemWeight || 0.5;
      return sum + (weight * (item.quantity || 1));
    }, 0);
  }

  // ========== GET TRACKING ==========
  async getTracking(trackingNumber) {
    try {
      const token = await this.getAccessToken();
      const baseUrl = this.getBaseUrl();
      
      const response = await fetch(`${baseUrl}/parcel/track/${trackingNumber}`, {
        headers: this.getAuthHeaders(token),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to get tracking info');
      }
      
      return { 
        success: true, 
        status: data?.status || data?.delivery_status,
        history: data?.tracking || [],
        fullResponse: data 
      };
      
    } catch (error) {
      console.error('❌ RedX tracking error:', error);
      return { success: false, message: error.message };
    }
  }

  // ========== CANCEL ORDER ==========
  async cancelOrder(courierOrderId) {
    try {
      const token = await this.getAccessToken();
      const baseUrl = this.getBaseUrl();
      
      const response = await fetch(`${baseUrl}/parcels`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify({
          entity_type: 'parcel-tracking-id',
          entity_id: courierOrderId,
          update_details: {
            property_name: 'status',
            new_value: 'cancelled',
            reason: 'Cancelled by merchant',
          },
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data?.message || 'Failed to cancel order');
      }
      
      return { 
        success: true, 
        message: 'Order cancelled successfully with RedX',
        fullResponse: data 
      };
      
    } catch (error) {
      console.error('❌ RedX cancel error:', error);
      return { success: false, message: error.message };
    }
  }

  // ========== GET AVAILABLE AREAS ==========
  async getAvailableAreas(districtName = null) {
    return this.fetchAreas(districtName);
  }
}

module.exports = RedxAdapter;