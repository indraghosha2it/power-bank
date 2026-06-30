// // D:\Smart-Gadget\Gadget-backend\src\lib\couriers\pathaoAdapter.js

// const CourierAdapter = require('./courierAdapter');

// const PATHAO_API_BASE = 'https://api-hermes.pathao.com';

// // ========== COMPLETE BANGLADESH CITY MAPPING ==========
// const PATHAO_CITY_IDS = {
//   'dhaka': 1,
//   'chittagong': 2,
//   'khulna': 3,
//   'rajshahi': 4,
//   'barisal': 5,
//   'sylhet': 6,
//   'rangpur': 7,
//   'mymensingh': 8,
//   'gazipur': 9,
//   'narayanganj': 10,
//   'tangail': 11,
//   'kishoreganj': 12,
//   'manikganj': 13,
//   'munshiganj': 14,
//   'narsingdi': 15,
//   'faridpur': 16,
//   'madaripur': 17,
//   'shariatpur': 18,
//   'rajbari': 19,
//   'gopalganj': 20,
//   'cumilla': 21,
//   'feni': 22,
//   'noakhali': 23,
//   'chandpur': 24,
//   'lakshmipur': 25,
//   'brahmanbaria': 26,
//   'rangamati': 27,
//   'khagrachari': 28,
//   'bandarban': 29,
//   "cox's bazar": 30,
//   'jessore': 31,
//   'satkhira': 32,
//   'bagerhat': 33,
//   'jhenaidah': 34,
//   'kushtia': 35,
//   'chuadanga': 36,
//   'meherpur': 37,
//   'magura': 38,
//   'narail': 39,
//   'sirajganj': 40,
//   'pabna': 41,
//   'bogura': 42,
//   'naogaon': 43,
//   'nawabganj': 44,
//   'natore': 45,
//   'joypurhat': 46,
//   'chapainawabganj': 47,
//   'bhola': 48,
//   'patuakhali': 49,
//   'barguna': 50,
//   'jhalokati': 51,
//   'pirojpur': 52,
//   'moulvibazar': 53,
//   'habiganj': 54,
//   'sunamganj': 55,
//   'dinajpur': 56,
//   'nilphamari': 57,
//   'lalmonirhat': 58,
//   'kurigram': 59,
//   'gaibandha': 60,
//   'thakurgaon': 61,
//   'panchagarh': 62,
//   'jamalpur': 63,
//   'netrokona': 64,
//   'sherpur': 65,
// };

// // ========== PATHAO ZONE MAPPING BY CITY ID ==========
// const PATHAO_ZONE_IDS = {
//   // Dhaka (city_id: 1)
//   1: {
//     'gulshan': 1,
//     'banani': 2,
//     'baridhara': 3,
//     'mohakhali': 4,
//     'tejgaon': 5,
//     'farmgate': 6,
//     'kawran bazar': 7,
//     'dhanmondi': 8,
//     'lalmatia': 9,
//     'mohammadpur': 10,
//     'shyamoli': 11,
//     'mirpur': 12,
//     'pallabi': 13,
//     'uttara': 14,
//     'tongi': 15,
//     'savar': 16,
//     'keraniganj': 17,
//     'narayanganj': 18,
//     'demra': 19,
//     'jatrabari': 20,
//     'badda': 21,
//     'hatirjheel': 22,
//     'moghbazar': 23,
//     'shahbagh': 24,
//     'ramna': 25,
//     'paltan': 26,
//     'motijheel': 27,
//     'sadarghat': 28,
//     'kamarpara': 29,
//     'kallayanpur': 30,
//     'adabar': 31,
//     'shyampur': 32,
//     'sayedabad': 33,
//     'kadamtali': 34,
//     'khilgaon': 35,
//     'basabo': 36,
//     'mugda': 37,
//     'khilkhet': 38,
//     'vashantek': 39,
//     'dakshinkhan': 40,
//     'uttarkhan': 41,
//     'baishtek': 42,
//     'ashkona': 43,
//     'bijaynagar': 44,
//     'shahjahanpur': 45,
//     'sutrapur': 46,
//     'chakbazar': 47,
//     'kotwali': 48,
//     'hazaribagh': 49,
//     'new market': 50,
//     'azimpur': 51,
//     'jigatola': 52,
//     'science lab': 53,
//     'khamarbari': 54,
//     'shantinagar': 55,
//     'malibagh': 56,
//     'rampura': 57,
//     'sabujbagh': 58,
//     'bashabo': 59,
//     'goran': 60,
//     'khilbarirtek': 61,
//     'turag': 62,
//     'bimanbandar': 63,
//     'dakshin khan': 64,
//     'uttar khan': 65,
//     'matuail': 66,
//     'south keraniganj': 67,
//   },
//   // Chittagong (city_id: 2)
//   2: {
//     'agrabad': 1,
//     'pahartali': 2,
//     'hathazari': 3,
//     'raozan': 4,
//     'rangunia': 5,
//     'boalkhali': 6,
//     'patiya': 7,
//     'anwara': 8,
//     'sitakunda': 9,
//     'sandwip': 10,
//     'mirsharai': 11,
//     'banshkhali': 12,
//     'chandanaish': 13,
//     'satkania': 14,
//     'lohagara': 15,
//     'fatikchhari': 16,
//     'nazirhat': 17,
//     'panchlaish': 18,
//     'chawkbazar': 19,
//     'double mooring': 20,
//     'khulshi': 21,
//     'halishahar': 23,
//   },
//   // Khulna (city_id: 3)
//   3: {
//     'sonadanga': 1,
//     'khulna sadar': 2,
//     'dighalia': 3,
//     'paikgachha': 4,
//     'batiaghata': 5,
//     'dakop': 6,
//     'rupsha': 7,
//     'terokhada': 8,
//     'phultala': 9,
//     'koyra': 10,
//   },
//   // Rajshahi (city_id: 4)
//   4: {
//     'rajshahi sadar': 1,
//     'boalia': 2,
//     'motihar': 3,
//     'shah makhdum': 4,
//     'paba': 5,
//     'godagari': 6,
//     'tanore': 7,
//     'mohanpur': 8,
//     'bagha': 9,
//     'puthia': 10,
//     'charghat': 11,
//     'durgapur': 12,
//   },
//   // Barisal (city_id: 5)
//   5: {
//     'barisal sadar': 1,
//     'airport': 2,
//     'kashipur': 3,
//     'babuganj': 4,
//     'banaripara': 5,
//     'agailjhara': 6,
//     'muladi': 7,
//     'hizla': 8,
//     'mehendiganj': 9,
//     'wazirpur': 10,
//     'gournadi': 11,
//   },
//   // Sylhet (city_id: 6)
//   6: {
//     'sylhet sadar': 1,
//     'shahporan': 2,
//     'dakshin surma': 3,
//     'biyanibazar': 4,
//     'balaganj': 5,
//     'bishwanath': 6,
//     'osmani nagar': 7,
//     'fenchuganj': 8,
//     'golapganj': 9,
//     'kanaighat': 10,
//     'jaintiapur': 11,
//     'companiganj': 12,
//     'gowainghat': 13,
//     'zakiganj': 14,
//   },
//   // Rangpur (city_id: 7)
//   7: {
//     'rangpur sadar': 1,
//     'kaunia': 2,
//     'pirgachha': 3,
//     'pirganj': 4,
//     'mithapukur': 5,
//     'badarganj': 6,
//     'taraganj': 7,
//     'gangachara': 8,
//   },
//   // Mymensingh (city_id: 8)
//   8: {
//     'mymensingh sadar': 1,
//     'gouripur': 2,
//     'trishal': 3,
//     'muktagachha': 4,
//     'bhaluka': 5,
//     'fulpur': 6,
//     'haluaghat': 7,
//     'nandail': 8,
//     'phulbaria': 9,
//     'ishwarganj': 10,
//     'tarakanda': 11,
//   }
// };

// // ========== OTHER CITY ZONES ==========
// // For cities without specific zone mapping, we'll use default zone 0
// // Pathao accepts zone 0 as "Other/Unknown" zone

// class PathaoAdapter extends CourierAdapter {
//   constructor(creds, storeConfig) {
//     super('pathao', creds, storeConfig);
//     this.accessToken = null;
//     this.tokenExpiry = null;
//   }

//   /**
//    * Get access token from Pathao API
//    */
//   async getAccessToken() {
//     if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
//       return this.accessToken;
//     }

//     try {
//       console.log('🔑 Getting Pathao access token...');
      
//       const response = await fetch(`${PATHAO_API_BASE}/aladdin/api/v1/issue-token`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
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

//   /**
//    * Get city ID from name
//    */
//   getCityId(cityName) {
//     if (!cityName) return 1;
    
//     const normalized = cityName.toLowerCase().trim();
    
//     if (!isNaN(cityName) && parseInt(cityName) > 0) {
//       return parseInt(cityName);
//     }
    
//     if (PATHAO_CITY_IDS[normalized]) {
//       return PATHAO_CITY_IDS[normalized];
//     }
    
//     // Try removing suffixes
//     const suffixes = [' district', ' city', ' nagar', ' pur', ' ganj'];
//     for (const suffix of suffixes) {
//       if (normalized.endsWith(suffix)) {
//         const withoutSuffix = normalized.slice(0, -suffix.length);
//         if (PATHAO_CITY_IDS[withoutSuffix]) {
//           return PATHAO_CITY_IDS[withoutSuffix];
//         }
//       }
//     }
    
//     // Try partial match
//     for (const [key, value] of Object.entries(PATHAO_CITY_IDS)) {
//       if (normalized.includes(key) || key.includes(normalized)) {
//         return value;
//       }
//     }
    
//     console.log(`⚠️ City "${cityName}" not found, defaulting to Dhaka (ID: 1)`);
//     return 1;
//   }

//   /**
//    * Get zone ID from city ID and zone name
//    * Returns 0 (default zone) if zone not found
//    */
//   getZoneId(cityId, zoneName) {
//     if (!zoneName) return 0;
    
//     const normalizedZone = zoneName.toLowerCase().trim();
    
//     // Check if it's already an ID
//     if (!isNaN(zoneName) && parseInt(zoneName) >= 0) {
//       return parseInt(zoneName);
//     }
    
//     // Get zones for the city
//     const cityZones = PATHAO_ZONE_IDS[cityId];
//     if (!cityZones) {
//       console.log(`⚠️ No zones found for city ID ${cityId}, using default zone 0`);
//       return 0;
//     }
    
//     // Direct lookup
//     if (cityZones[normalizedZone]) {
//       return cityZones[normalizedZone];
//     }
    
//     // Try removing suffixes
//     const suffixes = [' upazila', ' thana', ' model', ' pur', ' para', ' bazar', ' sadar'];
//     for (const suffix of suffixes) {
//       if (normalizedZone.endsWith(suffix)) {
//         const withoutSuffix = normalizedZone.slice(0, -suffix.length);
//         if (cityZones[withoutSuffix]) {
//           return cityZones[withoutSuffix];
//         }
//       }
//     }
    
//     // Try partial match
//     for (const [key, value] of Object.entries(cityZones)) {
//       if (normalizedZone.includes(key) || key.includes(normalizedZone) ||
//           normalizedZone.startsWith(key) || key.startsWith(normalizedZone)) {
//         return value;
//       }
//     }
    
//     // ✅ ZONE NOT FOUND - USE DEFAULT ZONE 0
//     console.log(`⚠️ Zone "${zoneName}" not found for city ${cityId}, using default zone 0 (Pathao accepts this as "Other" zone)`);
//     return 0;
//   }

//   /**
//    * Test connection to Pathao API
//    */
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

//   /**
//    * Create a delivery order with Pathao
//    */
//   async createOrder(orderData) {
//     try {
//       console.log('📦 Creating Pathao order...');
      
//       const token = await this.getAccessToken();
//       const storeId = this.storeConfig.pathaoStoreId || this.creds.storeId;

//       if (!storeId) {
//         throw new Error('Pathao store_id is required');
//       }

//       // Format order data for Pathao API
//       const pathaoOrderData = this.formatOrderData(orderData, storeId);
//       console.log('📤 Pathao API request data:', JSON.stringify(pathaoOrderData, null, 2));

//       const response = await fetch(`${PATHAO_API_BASE}/aladdin/api/v1/orders`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(pathaoOrderData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         if (data.errors) {
//           const errorMessages = [];
//           if (typeof data.errors === 'object') {
//             for (const [field, messages] of Object.entries(data.errors)) {
//               if (Array.isArray(messages)) {
//                 errorMessages.push(`${field}: ${messages.join(', ')}`);
//               } else {
//                 errorMessages.push(`${field}: ${messages}`);
//               }
//             }
//           }
//           const errorString = errorMessages.join(', ');
//           throw new Error(`Pathao API errors: ${errorString}`);
//         }
//         throw new Error(data?.message || 'Pathao order creation failed');
//       }

//       return {
//         success: true,
//         courierOrderId: data.id || data.order_id || data.data?.id,
//         trackingNumber: data.tracking_number || data.data?.tracking_number || data.id,
//         trackingUrl: data.tracking_url || data.data?.tracking_url || `https://pathao.com/track/${data.id}`,
//         labelUrl: data.label_url || data.data?.label_url || '',
//         invoiceUrl: data.invoice_url || data.data?.invoice_url || '',
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

//   /**
//    * Format order data for Pathao API
//    */
//   formatOrderData(order, storeId) {
//     const customer = order.customerInfo;
    
//     // Get city ID from district name
//     const cityId = this.getCityId(customer.city);
    
//     // Get zone ID - if not found, use 0 (default/other zone)
//     const zoneId = this.getZoneId(cityId, customer.zone);
    
//     // Log the mapping
//     console.log(`📍 Location mapping: City "${customer.city}" → ${cityId}, Zone "${customer.zone}" → ${zoneId}`);
    
//     // Calculate total weight (minimum 0.1 kg)
//     const totalWeight = Math.max(0.1, this.calculateTotalWeight(order.items));
    
//     // Calculate total quantity
//     const totalQuantity = order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
//     // Format COD amount (must be integer)
//     const codAmount = order.paymentMethod === 'cod' ? Math.round(order.total) : 0;
    
//     // Get item description (max 255 characters)
//     const itemDescription = order.items
//       .map(item => `${item.productName} x${item.quantity}`)
//       .join(', ')
//       .slice(0, 255);
    
//     // Build the complete address
//     const fullAddress = [
//       customer.address,
//       customer.area || '',
//       customer.zone || '',
//       customer.city || ''
//     ].filter(Boolean).join(', ');

//     // ✅ Pathao API request format - ALL FIELDS CORRECT
//     return {
//       store_id: parseInt(storeId),
//       merchant_order_id: order.orderNumber || `ORD-${Date.now()}`,
//       recipient_name: customer.fullName,
//       recipient_phone: customer.phone,
//       recipient_address: fullAddress || customer.address,
//       recipient_city: cityId,                    // ✅ Integer ID
//       recipient_zone: zoneId,                    // ✅ Integer ID (0 = default/other)
//       delivery_type: 1,                          // ✅ 1 = Regular
//       item_description: itemDescription,
//       item_quantity: totalQuantity,              // ✅ Integer
//       item_weight: Math.round(totalWeight * 100) / 100, // ✅ Number
//       item_type: 1,                              // ✅ 1 = Parcel
//       amount_to_collect: codAmount,              // ✅ Integer
//       special_instruction: (customer.note || '').slice(0, 255),
//       parcel_value: Math.round(order.total),
//     };
//   }

//   /**
//    * Get tracking information from Pathao
//    */
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

//   /**
//    * Cancel a Pathao delivery order
//    */
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

//   /**
//    * Helper: Calculate total weight
//    */
//   calculateTotalWeight(items) {
//     if (!items || items.length === 0) return 0.5;
    
//     return items.reduce((sum, item) => {
//       const weight = item.weight || item.itemWeight || 0.5;
//       return sum + (weight * (item.quantity || 1));
//     }, 0);
//   }
// }

// module.exports = PathaoAdapter;


// D:\Smart-Gadget\Gadget-backend\src\lib\couriers\pathaoAdapter.js

const CourierAdapter = require('./courierAdapter');
const { getPathaoCityId, getPathaoZoneId } = require('./pathaoZoneMapping');

const PATHAO_API_BASE = 'https://api-hermes.pathao.com';

class PathaoAdapter extends CourierAdapter {
  constructor(creds, storeConfig) {
    super('pathao', creds, storeConfig);
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      console.log('🔑 Getting Pathao access token...');
      
      const response = await fetch(`${PATHAO_API_BASE}/aladdin/api/v1/issue-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  async createOrder(orderData) {
    try {
      console.log('📦 Creating Pathao order...');
      
      const token = await this.getAccessToken();
      const storeId = this.storeConfig.pathaoStoreId || this.creds.storeId;

      if (!storeId) {
        throw new Error('Pathao store_id is required');
      }

      const pathaoOrderData = this.formatOrderData(orderData, storeId);
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
        
        if (data.errors) {
          const errorMessages = [];
          if (typeof data.errors === 'object') {
            for (const [field, messages] of Object.entries(data.errors)) {
              if (Array.isArray(messages)) {
                errorMessages.push(`${field}: ${messages.join(', ')}`);
              } else {
                errorMessages.push(`${field}: ${messages}`);
              }
            }
          }
          throw new Error(`Pathao API errors: ${errorMessages.join(', ')}`);
        }
        throw new Error(data?.message || 'Pathao order creation failed');
      }

      return {
        success: true,
        courierOrderId: data.id || data.order_id,
        trackingNumber: data.tracking_number || data.id,
        trackingUrl: data.tracking_url || `https://pathao.com/track/${data.id}`,
        labelUrl: data.label_url || '',
        invoiceUrl: data.invoice_url || '',
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

  formatOrderData(order, storeId) {
    const customer = order.customerInfo;
    
    // Get city ID using mapping
    const cityId = getPathaoCityId(customer.city);
    
    // Get zone ID using mapping (will be 0 if not found)
    const zoneId = getPathaoZoneId(customer.city, customer.zone);
    
    console.log(`📍 Location mapping: "${customer.city}" → ${cityId}, "${customer.zone}" → ${zoneId}`);
    
    // Calculate weight
    const totalWeight = Math.max(0.1, this.calculateTotalWeight(order.items));
    const totalQuantity = order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const codAmount = order.paymentMethod === 'cod' ? Math.round(order.total) : 0;
    
    const itemDescription = order.items
      .map(item => `${item.productName} x${item.quantity}`)
      .join(', ')
      .slice(0, 255);

    // Build address
    const fullAddress = [
      customer.address,
      customer.area || '',
      customer.zone || '',
      customer.city || ''
    ].filter(Boolean).join(', ');

    // Pathao API format
    return {
      store_id: parseInt(storeId),
      merchant_order_id: order.orderNumber || `ORD-${Date.now()}`,
      recipient_name: customer.fullName,
      recipient_phone: customer.phone,
      recipient_address: fullAddress || customer.address,
      recipient_city: cityId,
      recipient_zone: zoneId,  // 0 if not found (Pathao accepts 0)
      delivery_type: 1,
      item_description: itemDescription,
      item_quantity: totalQuantity,
      item_weight: Math.round(totalWeight * 100) / 100,
      item_type: 1,
      amount_to_collect: codAmount,
      special_instruction: (customer.note || '').slice(0, 255),
      parcel_value: Math.round(order.total),
    };
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
}

module.exports = PathaoAdapter;