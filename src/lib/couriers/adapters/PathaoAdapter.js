


// const CourierAdapter = require('./CourierAdapter');
// const { getPathaoCityId, getPathaoZoneId } = require('../zoneMapping');

// const PATHAO_API_BASE = 'https://api-hermes.pathao.com';

// class PathaoAdapter extends CourierAdapter {
//   constructor(creds, storeConfig) {
//     super('pathao', creds, storeConfig);
//     this.accessToken = null;
//     this.tokenExpiry = null;
//   }

//   async getAccessToken() {
//     if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
//       return this.accessToken;
//     }

//     try {
//       console.log('🔑 Getting Pathao access token...');

//       const response = await fetch(`${PATHAO_API_BASE}/aladdin/api/v1/issue-token`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           client_id: this.creds.clientId,
//           client_secret: this.creds.clientSecret,
//           username: this.creds.username,
//           password: this.creds.password,
//           grant_type: 'password',
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         console.error('❌ Pathao auth error:', data);
//         throw new Error(data?.message || 'Pathao authentication failed');
//       }

//       this.accessToken = data.access_token;
//       this.tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000;

//       console.log('✅ Pathao token obtained successfully');
//       return this.accessToken;
//     } catch (error) {
//       console.error('❌ Pathao token error:', error);
//       throw new Error(`Pathao authentication failed: ${error.message}`);
//     }
//   }

//   async testConnection() {
//     try {
//       await this.getAccessToken();
//       const storeId = this.storeConfig.pathaoStoreId || this.creds.storeId;
//       if (!storeId) {
//         throw new Error('Pathao store_id is required');
//       }
//       return {
//         success: true,
//         message: 'Pathao API connected successfully',
//         storeId: storeId
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.message
//       };
//     }
//   }

//   async createOrder(orderData) {
//     try {
//       console.log('📦 Creating Pathao order...');

//       const token = await this.getAccessToken();
//       const storeId = this.storeConfig.pathaoStoreId || this.creds.storeId;

//       if (!storeId) {
//         throw new Error('Pathao store_id is required');
//       }

//       const pathaoOrderData = await this.formatOrderData(orderData, storeId);
//       console.log('📤 Pathao API request:', JSON.stringify(pathaoOrderData, null, 2));

//       const response = await fetch(`${PATHAO_API_BASE}/aladdin/api/v1/orders`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(pathaoOrderData),
//       });

//       const data = await response.json();

//       // ========== IMPROVED ERROR HANDLING ==========
//       if (!response.ok) {
//         console.error('❌ Pathao error response:', JSON.stringify(data, null, 2));

//         // Check for detailed error messages from Pathao
//         let errorMessage = 'Pathao order creation failed';
        
//         if (data.errors) {
//           // Pathao returns errors in different formats
//           if (typeof data.errors === 'object') {
//             const errorMessages = [];
//             for (const [field, messages] of Object.entries(data.errors)) {
//               if (Array.isArray(messages)) {
//                 errorMessages.push(`${field}: ${messages.join(', ')}`);
//               } else if (typeof messages === 'string') {
//                 errorMessages.push(`${field}: ${messages}`);
//               } else if (typeof messages === 'object') {
//                 // Handle nested error objects
//                 for (const [subField, subMessages] of Object.entries(messages)) {
//                   if (Array.isArray(subMessages)) {
//                     errorMessages.push(`${field}.${subField}: ${subMessages.join(', ')}`);
//                   } else {
//                     errorMessages.push(`${field}.${subField}: ${subMessages}`);
//                   }
//                 }
//               }
//             }
//             errorMessage = `Pathao API errors: ${errorMessages.join(', ')}`;
//           } else if (typeof data.errors === 'string') {
//             errorMessage = `Pathao API error: ${data.errors}`;
//           } else {
//             errorMessage = `Pathao API error: ${JSON.stringify(data.errors)}`;
//           }
//         } else if (data.message) {
//           errorMessage = `Pathao API error: ${data.message}`;
//         } else if (data.error) {
//           errorMessage = `Pathao API error: ${data.error}`;
//         }

//         // Check for specific validation errors
//         if (data.code === 422 || data.status === 422) {
//           errorMessage = `Validation Error: ${errorMessage}`;
//         }

//         throw new Error(errorMessage);
//       }

//       const orderInfo = data.data || data;
//       return {
//         success: true,
//         courierOrderId: orderInfo.id || orderInfo.order_id,
//         trackingNumber: orderInfo.tracking_number || orderInfo.consignment_id || orderInfo.id,
//         trackingUrl: orderInfo.tracking_url || `https://pathao.com/bd/customer-tracking/?consignment_id=${orderInfo.consignment_id}`,
//         labelUrl: orderInfo.label_url || '',
//         invoiceUrl: orderInfo.invoice_url || '',
//         fullResponse: data,
//         message: 'Order created successfully with Pathao'
//       };
//     } catch (error) {
//       console.error('❌ Pathao order creation error:', error);
//       return {
//         success: false,
//         message: error.message
//       };
//     }
//   }

//   async formatOrderData(order, storeId) {
//     const customer = order.customerInfo;

//     console.log('📍 Formatting Pathao order data:');
//     console.log('  Customer:', customer.fullName);
//     console.log('  Phone:', customer.phone);
//     console.log('  City:', customer.city);
//     console.log('  Zone:', customer.zone);
//     console.log('  Address:', customer.address);

//     // ========== FIX: Get city ID with better handling ==========
//     let cityId;
//     try {
//       cityId = getPathaoCityId(customer.city);
//       console.log(`  City ID: ${cityId}`);
//     } catch (error) {
//       console.error('❌ Error getting city ID:', error);
//       cityId = 1; // Default to Dhaka
//     }

//     // ========== FIX: Get zone ID with better handling ==========
//     let zoneId;
//     try {
//       zoneId = getPathaoZoneId(cityId, customer.zone);
//       console.log(`  Zone ID: ${zoneId}`);
//     } catch (error) {
//       console.error('❌ Error getting zone ID:', error);
//       zoneId = 0; // Default to first zone
//     }

//     // Calculate total weight
//     const totalWeight = Math.max(0.5, this.calculateTotalWeight(order.items));
//     const totalQuantity = order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
//     const codAmount = order.paymentMethod === 'cod' ? Math.round(order.total) : 0;

//     // ========== FIX: Clean phone number ==========
//     const cleanPhone = this.cleanPhoneNumber(customer.phone);

//     // Build full address
//     const fullAddress = [
//       customer.address,
//       customer.area || '',
//       customer.zone || '',
//       customer.city || ''
//     ].filter(Boolean).join(', ');

//     const itemDescription = order.items
//       .map(item => `${item.productName || 'Product'} x${item.quantity}`)
//       .join(', ')
//       .slice(0, 255);

//     // ========== FIX: Ensure merchant_order_id is unique and valid ==========
//     const merchantOrderId = order.orderNumber || `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`;

//     const pathaoData = {
//       store_id: parseInt(storeId),
//       merchant_order_id: merchantOrderId,
//       recipient_name: customer.fullName || 'Customer',
//       recipient_phone: cleanPhone || '01700000000',
//       recipient_address: (fullAddress || customer.address || 'N/A').slice(0, 255),
//       recipient_city: cityId || 1,
//       recipient_zone: zoneId || 0,
//       delivery_type: 48, // Regular delivery
//       item_description: itemDescription || 'Order items',
//       item_quantity: Math.max(1, totalQuantity),
//       item_weight: Math.round(totalWeight * 100) / 100,
//       item_type: 2, // Parcel
//       amount_to_collect: codAmount || 0,
//       special_instruction: (customer.note || '').slice(0, 255),
//       parcel_value: Math.round(order.total || 0),
//     };

//     console.log('📤 Final Pathao data:', JSON.stringify(pathaoData, null, 2));
//     return pathaoData;
//   }

//   // ========== ADD PHONE CLEANING ==========
//   cleanPhoneNumber(phone) {
//     if (!phone) return '01700000000';
//     let cleaned = phone.replace(/\D/g, '');
//     // Handle 880 prefix
//     if (cleaned.startsWith('880')) {
//       cleaned = '0' + cleaned.slice(3);
//     }
//     // Ensure it starts with 0
//     if (!cleaned.startsWith('0')) {
//       cleaned = '0' + cleaned;
//     }
//     // Ensure exactly 11 digits (for BD numbers)
//     if (cleaned.length > 11) {
//       cleaned = cleaned.slice(0, 11);
//     }
//     while (cleaned.length < 11) {
//       cleaned = cleaned + '0';
//     }
//     return cleaned;
//   }

//   calculateTotalWeight(items) {
//     if (!items || items.length === 0) return 0.5;
//     return items.reduce((sum, item) => {
//       const weight = item.weight || item.itemWeight || 0.5;
//       return sum + (weight * (item.quantity || 1));
//     }, 0);
//   }

//   async getTracking(trackingNumber) {
//     try {
//       const token = await this.getAccessToken();
      
//       const response = await fetch(`${PATHAO_API_BASE}/aladdin/api/v1/orders/${trackingNumber}/tracking`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data?.message || 'Failed to get tracking info');
//       }

//       return {
//         success: true,
//         status: data.status,
//         location: data.location,
//         history: data.history || [],
//         estimatedDelivery: data.estimated_delivery,
//         fullResponse: data
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.message
//       };
//     }
//   }

//   async cancelOrder(courierOrderId) {
//     try {
//       const token = await this.getAccessToken();
      
//       const response = await fetch(`${PATHAO_API_BASE}/aladdin/api/v1/orders/${courierOrderId}/cancel`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data?.message || 'Failed to cancel order');
//       }

//       return {
//         success: true,
//         message: 'Order cancelled successfully with Pathao',
//         fullResponse: data
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.message
//       };
//     }
//   }
// }

// module.exports = PathaoAdapter;


const CourierAdapter = require('./CourierAdapter');

const PATHAO_API_BASE = 'https://api-hermes.pathao.com';

class PathaoAdapter extends CourierAdapter {
  constructor(creds, storeConfig) {
    super('pathao', creds, storeConfig);
    this.accessToken = null;
    this.tokenExpiry = null;

    // ========== CITY/ZONE CACHE (replaces static zoneMapping.js) ==========
    this.cityCache = null;
    this.cityCacheTime = null;
    this.zoneCache = new Map(); // cityId -> { zones, time }
    this.cacheTTL = 6 * 60 * 60 * 1000; // 6 hours
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      console.log('🔑 Getting Pathao access token...');

      const response = await fetch(`${PATHAO_API_BASE}/aladdin/api/v1/issue-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: this.creds.clientId,
          client_secret: this.creds.clientSecret,
          username: this.creds.username,
          password: this.creds.password,
          grant_type: 'password',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Pathao auth error:', data);
        throw new Error(data?.message || 'Pathao authentication failed');
      }

      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000;

      console.log('✅ Pathao token obtained successfully');
      return this.accessToken;
    } catch (error) {
      console.error('❌ Pathao token error:', error);
      throw new Error(`Pathao authentication failed: ${error.message}`);
    }
  }

  async testConnection() {
    try {
      await this.getAccessToken();
      const storeId = this.storeConfig.pathaoStoreId || this.creds.storeId;
      if (!storeId) {
        throw new Error('Pathao store_id is required');
      }
      return {
        success: true,
        message: 'Pathao API connected successfully',
        storeId: storeId
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // ========================================================================
  // ========== DYNAMIC CITY / ZONE RESOLUTION (LIVE FROM PATHAO API) ==========
  // ========================================================================

  normalize(str) {
    return (str || '')
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }

  async fetchCities() {
    const now = Date.now();
    if (this.cityCache && this.cityCacheTime && (now - this.cityCacheTime) < this.cacheTTL) {
      return this.cityCache;
    }

    try {
      const token = await this.getAccessToken();
      console.log('📡 Fetching Pathao city list...');

      const response = await fetch(`${PATHAO_API_BASE}/aladdin/api/v1/countries/1/city-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to fetch Pathao city list');
      }

      const cities = data?.data?.data || [];
      if (!cities.length) {
        throw new Error('Pathao returned an empty city list');
      }

      this.cityCache = cities;
      this.cityCacheTime = now;
      console.log(`✅ Fetched ${cities.length} Pathao cities`);
      return cities;
    } catch (error) {
      console.error('❌ Fetch Pathao cities error:', error);
      if (this.cityCache) {
        console.log('⚠️ Using stale city cache due to fetch failure');
        return this.cityCache;
      }
      throw error;
    }
  }

  async fetchZones(cityId) {
    const now = Date.now();
    const cached = this.zoneCache.get(cityId);
    if (cached && (now - cached.time) < this.cacheTTL) {
      return cached.zones;
    }

    try {
      const token = await this.getAccessToken();
      console.log(`📡 Fetching Pathao zone list for city ${cityId}...`);

      const response = await fetch(`${PATHAO_API_BASE}/aladdin/api/v1/cities/${cityId}/zone-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || `Failed to fetch Pathao zone list for city ${cityId}`);
      }

      const zones = data?.data?.data || [];
      this.zoneCache.set(cityId, { zones, time: now });
      console.log(`✅ Fetched ${zones.length} Pathao zones for city ${cityId}`);
      return zones;
    } catch (error) {
      console.error(`❌ Fetch Pathao zones error for city ${cityId}:`, error);
      if (cached) {
        console.log('⚠️ Using stale zone cache due to fetch failure');
        return cached.zones;
      }
      throw error;
    }
  }

  /**
   * Resolve a district/city name (e.g. "Barguna") to a real Pathao city_id
   */
  async resolveCityId(districtName) {
    const cities = await this.fetchCities();
    const needle = this.normalize(districtName);

    if (!needle) {
      console.log('⚠️ No district provided, defaulting to Dhaka');
      const dhaka = cities.find(c => this.normalize(c.city_name) === 'dhaka');
      return dhaka ? dhaka.city_id : cities[0].city_id;
    }

    // Exact match first
    let match = cities.find(c => this.normalize(c.city_name) === needle);

    // Partial match fallback
    if (!match) {
      match = cities.find(c => {
        const cityName = this.normalize(c.city_name);
        return cityName.includes(needle) || needle.includes(cityName);
      });
    }

    if (!match) {
      console.log(`⚠️ Pathao city "${districtName}" not found, defaulting to Dhaka`);
      match = cities.find(c => this.normalize(c.city_name) === 'dhaka') || cities[0];
    } else {
      console.log(`📍 Pathao city resolved: "${districtName}" → "${match.city_name}" (ID: ${match.city_id})`);
    }

    return match.city_id;
  }

  /**
   * Resolve a zone/upazila name (e.g. "Amtali") to a real Pathao zone_id
   * that is guaranteed to belong to the given cityId.
   */
  async resolveZoneId(cityId, zoneName) {
    const zones = await this.fetchZones(cityId);

    if (!zones.length) {
      throw new Error(`No Pathao delivery zones available for city ID ${cityId}`);
    }

    const needle = this.normalize(zoneName);

    let match = null;
    if (needle) {
      // Exact match first
      match = zones.find(z => this.normalize(z.zone_name) === needle);

      // Partial match fallback
      if (!match) {
        match = zones.find(z => {
          const zoneNameNorm = this.normalize(z.zone_name);
          return zoneNameNorm.includes(needle) || needle.includes(zoneNameNorm);
        });
      }
    }

    if (!match) {
      console.log(`⚠️ Pathao zone "${zoneName}" not found for city ${cityId}, using first available zone: "${zones[0].zone_name}"`);
      match = zones[0];
    } else {
      console.log(`📍 Pathao zone resolved: "${zoneName}" → "${match.zone_name}" (ID: ${match.zone_id})`);
    }

    return match.zone_id;
  }

  // ========================================================================

  // async createOrder(orderData) {
  //   try {
  //     console.log('📦 Creating Pathao order...');

  //     const token = await this.getAccessToken();
  //     const storeId = this.storeConfig.pathaoStoreId || this.creds.storeId;

  //     if (!storeId) {
  //       throw new Error('Pathao store_id is required');
  //     }

  //     const pathaoOrderData = await this.formatOrderData(orderData, storeId);
  //     console.log('📤 Pathao API request:', JSON.stringify(pathaoOrderData, null, 2));

  //     const response = await fetch(`${PATHAO_API_BASE}/aladdin/api/v1/orders`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(pathaoOrderData),
  //     });

  //     const data = await response.json();

  //     // ========== IMPROVED ERROR HANDLING ==========
  //     if (!response.ok) {
  //       console.error('❌ Pathao error response:', JSON.stringify(data, null, 2));

  //       let errorMessage = 'Pathao order creation failed';

  //       if (data.errors) {
  //         if (typeof data.errors === 'object') {
  //           const errorMessages = [];
  //           for (const [field, messages] of Object.entries(data.errors)) {
  //             if (Array.isArray(messages)) {
  //               errorMessages.push(`${field}: ${messages.join(', ')}`);
  //             } else if (typeof messages === 'string') {
  //               errorMessages.push(`${field}: ${messages}`);
  //             } else if (typeof messages === 'object') {
  //               for (const [subField, subMessages] of Object.entries(messages)) {
  //                 if (Array.isArray(subMessages)) {
  //                   errorMessages.push(`${field}.${subField}: ${subMessages.join(', ')}`);
  //                 } else {
  //                   errorMessages.push(`${field}.${subField}: ${subMessages}`);
  //                 }
  //               }
  //             }
  //           }
  //           errorMessage = `Pathao API errors: ${errorMessages.join(', ')}`;
  //         } else if (typeof data.errors === 'string') {
  //           errorMessage = `Pathao API error: ${data.errors}`;
  //         } else {
  //           errorMessage = `Pathao API error: ${JSON.stringify(data.errors)}`;
  //         }
  //       } else if (data.message) {
  //         errorMessage = `Pathao API error: ${data.message}`;
  //       } else if (data.error) {
  //         errorMessage = `Pathao API error: ${data.error}`;
  //       }

  //       if (data.code === 422 || data.status === 422) {
  //         errorMessage = `Validation Error: ${errorMessage}`;
  //       }

  //       throw new Error(errorMessage);
  //     }

  //     const orderInfo = data.data || data;
  //     return {
  //       success: true,
  //       courierOrderId: orderInfo.id || orderInfo.order_id,
  //       trackingNumber: orderInfo.tracking_number || orderInfo.consignment_id || orderInfo.id,
  //       trackingUrl: orderInfo.tracking_url || `https://pathao.com/bd/customer-tracking/?consignment_id=${orderInfo.consignment_id}`,
  //       labelUrl: orderInfo.label_url || '',
  //       invoiceUrl: orderInfo.invoice_url || '',
  //       fullResponse: data,
  //       message: 'Order created successfully with Pathao'
  //     };
  //   } catch (error) {
  //     console.error('❌ Pathao order creation error:', error);
  //     return {
  //       success: false,
  //       message: error.message
  //     };
  //   }
  // }
// PathaoAdapter.js - Update the createOrder method

async createOrder(orderData) {
  try {
    console.log('📦 Creating Pathao order...');

    const token = await this.getAccessToken();
    const storeId = this.storeConfig.pathaoStoreId || this.creds.storeId;

    if (!storeId) {
      throw new Error('Pathao store_id is required');
    }

    const pathaoOrderData = await this.formatOrderData(orderData, storeId);
    console.log('📤 Pathao API request:', JSON.stringify(pathaoOrderData, null, 2));

    const response = await fetch(`${PATHAO_API_BASE}/aladdin/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(pathaoOrderData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Pathao error response:', JSON.stringify(data, null, 2));
      // ... error handling
    }

    const orderInfo = data.data || data;
    const consignmentId = orderInfo.consignment_id || orderInfo.id || orderInfo.order_id;
    
    // ========== GET CUSTOMER PHONE FROM ORDER DATA ==========
    const customerPhone = orderData.customerInfo?.phone || '';
    const cleanPhone = this.cleanPhoneNumber(customerPhone);

    // ========== GENERATE CORRECT TRACKING URL ==========
    const trackingUrl = consignmentId && cleanPhone
      ? `https://merchant.pathao.com/tracking?consignment_id=${consignmentId}&phone=${cleanPhone}`
      : '';

    console.log('✅ Generated tracking URL:', trackingUrl);

    return {
      success: true,
      courierOrderId: consignmentId,
      trackingNumber: consignmentId,
      trackingUrl: trackingUrl,  // ✅ This is what gets stored in the order
      labelUrl: orderInfo.label_url || '',
      invoiceUrl: orderInfo.invoice_url || '',
      fullResponse: data,
      message: 'Order created successfully with Pathao'
    };
  } catch (error) {
    console.error('❌ Pathao order creation error:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

  async formatOrderData(order, storeId) {
    const customer = order.customerInfo;

    console.log('📍 Formatting Pathao order data:');
    console.log('  Customer:', customer.fullName);
    console.log('  Phone:', customer.phone);
    console.log('  City:', customer.city);
    console.log('  Zone:', customer.zone);
    console.log('  Address:', customer.address);

    // ========== RESOLVE CITY ID (LIVE FROM PATHAO) ==========
    let cityId;
    try {
      cityId = await this.resolveCityId(customer.city);
      console.log(`  City ID: ${cityId}`);
    } catch (error) {
      console.error('❌ Error resolving Pathao city ID:', error);
      throw new Error(`Could not resolve a valid Pathao city for "${customer.city}": ${error.message}`);
    }

    // ========== RESOLVE ZONE ID (LIVE FROM PATHAO, SCOPED TO CITY) ==========
    let zoneId;
    try {
      zoneId = await this.resolveZoneId(cityId, customer.zone);
      console.log(`  Zone ID: ${zoneId}`);
    } catch (error) {
      console.error('❌ Error resolving Pathao zone ID:', error);
      throw new Error(
        `Could not resolve a valid Pathao delivery zone for "${customer.zone}" in city "${customer.city}": ${error.message}`
      );
    }

    // Calculate total weight
    const totalWeight = Math.max(0.5, this.calculateTotalWeight(order.items));
    const totalQuantity = order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const codAmount = order.paymentMethod === 'cod' ? Math.round(order.total) : 0;

    // ========== CLEAN PHONE NUMBER ==========
    const cleanPhone = this.cleanPhoneNumber(customer.phone);

    // Build full address
    const fullAddress = [
      customer.address,
      customer.area || '',
      customer.zone || '',
      customer.city || ''
    ].filter(Boolean).join(', ');

    const itemDescription = order.items
      .map(item => `${item.productName || 'Product'} x${item.quantity}`)
      .join(', ')
      .slice(0, 255);

    // ========== ENSURE merchant_order_id IS UNIQUE AND VALID ==========
    const merchantOrderId = order.orderNumber || `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const pathaoData = {
      store_id: parseInt(storeId),
      merchant_order_id: merchantOrderId,
      recipient_name: customer.fullName || 'Customer',
      recipient_phone: cleanPhone || '01700000000',
      recipient_address: (fullAddress || customer.address || 'N/A').slice(0, 255),
      recipient_city: cityId,
      recipient_zone: zoneId,
      delivery_type: 48, // Regular delivery
      item_description: itemDescription || 'Order items',
      item_quantity: Math.max(1, totalQuantity),
      item_weight: Math.round(totalWeight * 100) / 100,
      item_type: 2, // Parcel
      amount_to_collect: codAmount || 0,
      special_instruction: (customer.note || '').slice(0, 255),
      parcel_value: Math.round(order.total || 0),
    };

    console.log('📤 Final Pathao data:', JSON.stringify(pathaoData, null, 2));
    return pathaoData;
  }

  // ========== CLEAN PHONE NUMBER ==========
  cleanPhoneNumber(phone) {
    if (!phone) return '01700000000';
    let cleaned = phone.replace(/\D/g, '');
    // Handle 880 prefix
    if (cleaned.startsWith('880')) {
      cleaned = '0' + cleaned.slice(3);
    }
    // Ensure it starts with 0
    if (!cleaned.startsWith('0')) {
      cleaned = '0' + cleaned;
    }
    // Ensure exactly 11 digits (for BD numbers)
    if (cleaned.length > 11) {
      cleaned = cleaned.slice(0, 11);
    }
    while (cleaned.length < 11) {
      cleaned = cleaned + '0';
    }
    return cleaned;
  }

  calculateTotalWeight(items) {
    if (!items || items.length === 0) return 0.5;
    return items.reduce((sum, item) => {
      const weight = item.weight || item.itemWeight || 0.5;
      return sum + (weight * (item.quantity || 1));
    }, 0);
  }

  async getTracking(trackingNumber) {
    try {
      const token = await this.getAccessToken();

      const response = await fetch(`${PATHAO_API_BASE}/aladdin/api/v1/orders/${trackingNumber}/tracking`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to get tracking info');
      }

      return {
        success: true,
        status: data.status,
        location: data.location,
        history: data.history || [],
        estimatedDelivery: data.estimated_delivery,
        fullResponse: data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  async cancelOrder(courierOrderId) {
    try {
      const token = await this.getAccessToken();

      const response = await fetch(`${PATHAO_API_BASE}/aladdin/api/v1/orders/${courierOrderId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to cancel order');
      }

      return {
        success: true,
        message: 'Order cancelled successfully with Pathao',
        fullResponse: data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  // ========== PUBLIC HELPERS (useful for a settings/debug UI) ==========
  async getAvailableCities() {
    return this.fetchCities();
  }

  async getAvailableZones(cityId) {
    return this.fetchZones(cityId);
  }
}

module.exports = PathaoAdapter;