



// // D:\Smart-Gadget\Gadget-backend\src\lib\couriers\steadfastAdapter.js

// const CourierAdapter = require('./courierAdapter');

// // Try different base URLs if needed
// const STEADFAST_API_BASE = 'https://steadfast.com.bd/api/v1';
// // const STEADFAST_API_BASE = 'https://api.steadfast.com.bd/api/v1';

// class SteadfastAdapter extends CourierAdapter {
//   constructor(creds, storeConfig) {
//     super('steadfast', creds, storeConfig);
//   }

//   /**
//    * Get auth headers for Steadfast API
//    */
//   getAuthHeaders() {
//     return {
//       'Content-Type': 'application/json',
//       'Api-Key': this.creds.apiKey,
//       'Secret-Key': this.creds.secretKey,
//     };
//   }

//   /**
//    * Test connection to Steadfast API
//    * Try multiple approaches
//    */
//   async testConnection() {
//     console.log('🧪 Testing Steadfast connection...');
//     console.log('📦 API Key:', this.creds.apiKey ? 'Present' : 'Missing');
//     console.log('📦 Secret Key:', this.creds.secretKey ? 'Present' : 'Missing');

//     const errors = [];
//     const methods = [
//       // Method 1: Try /auth/test
//       async () => {
//         console.log('📡 Trying /auth/test...');
//         const response = await fetch(`${STEADFAST_API_BASE}/auth/test`, {
//           method: 'GET',
//           headers: this.getAuthHeaders(),
//         });
//         const data = await response.json();
//         console.log('📊 /auth/test response:', data);
//         if (response.ok || data.success) {
//           return { success: true, message: 'Steadfast API connected successfully', data };
//         }
//         throw new Error(data?.message || 'Authentication failed');
//       },

//       // Method 2: Try /status
//       async () => {
//         console.log('📡 Trying /status...');
//         const response = await fetch(`${STEADFAST_API_BASE}/status`, {
//           method: 'GET',
//           headers: this.getAuthHeaders(),
//         });
//         const data = await response.json();
//         console.log('📊 /status response:', data);
//         if (response.ok || data.success) {
//           return { success: true, message: 'Steadfast API connected successfully', data };
//         }
//         throw new Error(data?.message || 'Status check failed');
//       },

//       // Method 3: Try /ping
//       async () => {
//         console.log('📡 Trying /ping...');
//         const response = await fetch(`${STEADFAST_API_BASE}/ping`, {
//           method: 'GET',
//           headers: this.getAuthHeaders(),
//         });
//         const data = await response.json();
//         console.log('📊 /ping response:', data);
//         if (response.ok || data.success) {
//           return { success: true, message: 'Steadfast API connected successfully', data };
//         }
//         throw new Error(data?.message || 'Ping failed');
//       },

//       // Method 4: Try to get rates (this will validate auth)
//       async () => {
//         console.log('📡 Trying to get rates (with dummy data)...');
//         const response = await fetch(`${STEADFAST_API_BASE}/rate`, {
//           method: 'POST',
//           headers: this.getAuthHeaders(),
//           body: JSON.stringify({
//             recipient_address: 'Test Address',
//             recipient_city: 'Dhaka',
//             weight: 0.5,
//             cod_amount: 0
//           }),
//         });
//         const data = await response.json();
//         console.log('📊 /rate response:', data);
//         // Even if rate check fails, if we get a response with auth error, we know auth works
//         if (response.ok) {
//           return { success: true, message: 'Steadfast API connected successfully', data };
//         }
//         // If it's an auth error, the connection test fails
//         if (response.status === 401 || response.status === 403) {
//           throw new Error('Invalid API Key or Secret Key');
//         }
//         // For other errors, we might still be connected
//         return { success: true, message: 'Steadfast API is reachable', data };
//       },

//       // Method 5: Try list of available methods (if exists)
//       async () => {
//         console.log('📡 Trying GET /...');
//         const response = await fetch(`${STEADFAST_API_BASE}/`, {
//           method: 'GET',
//           headers: this.getAuthHeaders(),
//         });
//         const data = await response.json();
//         console.log('📊 GET / response:', data);
//         if (response.ok || data.success) {
//           return { success: true, message: 'Steadfast API connected successfully', data };
//         }
//         throw new Error(data?.message || 'Root endpoint failed');
//       },
//     ];

//     // Try each method until one works
//     for (const method of methods) {
//       try {
//         const result = await method();
//         return result;
//       } catch (error) {
//         console.log(`❌ Method failed:`, error.message);
//         errors.push(error.message);
//         // Continue to next method
//       }
//     }

//     // If all methods failed
//     console.log('❌ All connection methods failed');
//     return {
//       success: false,
//       message: `Failed to connect to Steadfast API. Errors: ${errors.join('; ')}. Please check your API Key and Secret Key.`
//     };
//   }

//   /**
//    * Create a delivery order with Steadfast
//    */
//   async createOrder(orderData) {
//     try {
//       // Format order data for Steadfast
//       const steadfastOrderData = this.formatOrderData(orderData);

//       const response = await fetch(`${STEADFAST_API_BASE}/create_order`, {
//         method: 'POST',
//         headers: this.getAuthHeaders(),
//         body: JSON.stringify(steadfastOrderData),
//       });

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(data?.message || 'Steadfast order creation failed');
//       }

//       return {
//         success: true,
//         courierOrderId: data.data?.order_id || data.order_id,
//         trackingNumber: data.data?.tracking_code || data.tracking_code,
//         trackingUrl: data.data?.tracking_url || `https://steadfast.com.bd/track/${data.tracking_code}`,
//         labelUrl: data.data?.label_url || '',
//         invoiceUrl: data.data?.invoice_url || '',
//         fullResponse: data,
//         message: 'Order created successfully with Steadfast'
//       };
//     } catch (error) {
//       console.error('❌ Steadfast order creation error:', error);
//       return {
//         success: false,
//         message: error.message
//       };
//     }
//   }

//   /**
//    * Format order data for Steadfast API
//    */
//   formatOrderData(order) {
//     return {
//       invoice: order.orderNumber || `INV-${Date.now()}`,
//       recipient_name: order.customerInfo.fullName,
//       recipient_phone: order.customerInfo.phone,
//       recipient_address: `${order.customerInfo.address}, ${order.customerInfo.area || ''}, ${order.customerInfo.zone || ''}, ${order.customerInfo.city || ''}`,
//       cod_amount: order.paymentMethod === 'cod' ? order.total : 0,
//       note: order.customerInfo.note || '',
//       parcel_weight: this.calculateTotalWeight(order.items),
//       items: order.items.map(item => ({
//         name: item.productName,
//         quantity: item.quantity,
//         price: item.discountPrice || item.regularPrice
//       }))
//     };
//   }

//   /**
//    * Get tracking information from Steadfast
//    */
//   async getTracking(trackingNumber) {
//     try {
//       const response = await fetch(`${STEADFAST_API_BASE}/track/${trackingNumber}`, {
//         method: 'GET',
//         headers: this.getAuthHeaders(),
//       });

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(data?.message || 'Failed to get tracking info');
//       }

//       return {
//         success: true,
//         status: data.data?.status || 'Unknown',
//         location: data.data?.location || '',
//         history: data.data?.history || [],
//         estimatedDelivery: data.data?.expected_delivery_date || '',
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
//    * Cancel a Steadfast delivery order
//    */
//   async cancelOrder(courierOrderId) {
//     try {
//       const response = await fetch(`${STEADFAST_API_BASE}/cancel_order/${courierOrderId}`, {
//         method: 'POST',
//         headers: this.getAuthHeaders(),
//       });

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(data?.message || 'Failed to cancel order');
//       }

//       return {
//         success: true,
//         message: 'Order cancelled successfully with Steadfast',
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
//    * Get delivery rates from Steadfast
//    */
//   async getRates(orderData) {
//     try {
//       const response = await fetch(`${STEADFAST_API_BASE}/rate`, {
//         method: 'POST',
//         headers: this.getAuthHeaders(),
//         body: JSON.stringify({
//           recipient_address: orderData.address || '',
//           recipient_city: orderData.city || 'Dhaka',
//           weight: this.calculateTotalWeight(orderData.items || []),
//           cod_amount: orderData.paymentMethod === 'cod' ? orderData.total : 0
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(data?.message || 'Failed to get rates');
//       }

//       return {
//         success: true,
//         rates: data,
//         deliveryCharge: data.delivery_charge || 0,
//         codCharge: data.cod_charge || 0,
//         totalCharge: data.total_charge || 0
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: error.message
//       };
//     }
//   }

//   /**
//    * Helper methods
//    */
//   calculateTotalWeight(items) {
//     return items.reduce((sum, item) => sum + (item.weight || 0.5) * item.quantity, 0);
//   }
// }
// D:\Smart-Gadget\Gadget-backend\src\lib\couriers\steadfastAdapter.js



// 2
// const CourierAdapter = require('./courierAdapter');

// // ✅ CORRECT BASE URL from official documentation
// const STEADFAST_API_BASE = 'https://portal.packzy.com/api/v1';

// class SteadfastAdapter extends CourierAdapter {
//   constructor(creds, storeConfig) {
//     super('steadfast', creds, storeConfig);
//   }

//   /**
//    * Get auth headers for Steadfast API
//    */
//   getAuthHeaders() {
//     return {
//       'Content-Type': 'application/json',
//       'Api-Key': this.creds.apiKey,
//       'Secret-Key': this.creds.secretKey,
//     };
//   }

//   /**
//    * Test connection to Steadfast API
//    * Using /get_balance endpoint as per documentation
//    */
//   async testConnection() {
//     console.log('🧪 Testing Steadfast connection...');
//     console.log('📦 API Key:', this.creds.apiKey ? `Present (${this.creds.apiKey.substring(0, 8)}...)` : 'Missing');
//     console.log('📦 Secret Key:', this.creds.secretKey ? 'Present' : 'Missing');

//     try {
//       // ✅ Use /get_balance endpoint to test connection
//       const endpoint = `${STEADFAST_API_BASE}/get_balance`;
//       console.log(`📡 Trying: GET ${endpoint}`);

//       const response = await fetch(endpoint, {
//         method: 'GET',
//         headers: this.getAuthHeaders(),
//       });

//       console.log(`📊 Response Status: ${response.status}`);

//       const data = await response.json();
//       console.log('📊 Response data:', JSON.stringify(data, null, 2));

//       // ✅ Check if successful
//       if (response.ok && data.status === 200) {
//         return {
//           success: true,
//           message: 'Steadfast API connected successfully',
//           data: {
//             balance: data.current_balance || 0,
//             response: data
//           }
//         };
//       }

//       // Handle specific error responses
//       if (response.status === 401 || response.status === 403) {
//         return {
//           success: false,
//           message: 'Invalid API Key or Secret Key. Please check your credentials.'
//         };
//       }

//       if (response.status === 404) {
//         return {
//           success: false,
//           message: 'API endpoint not found. Please check if the API URL is correct.'
//         };
//       }

//       // For other errors
//       const errorMsg = data?.message || data?.error || `HTTP ${response.status}`;
//       return {
//         success: false,
//         message: `Steadfast API error: ${errorMsg}`
//       };

//     } catch (error) {
//       console.error('❌ Test connection error:', error);
      
//       if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
//         return {
//           success: false,
//           message: 'Cannot reach Steadfast API server. Please check your internet connection.'
//         };
//       }

//       return {
//         success: false,
//         message: error.message || 'Connection failed'
//       };
//     }
//   }

//   /**
//    * Create a delivery order with Steadfast
//    * Using /create_order endpoint as per documentation
//    */
//   async createOrder(orderData) {
//     try {
//       console.log('📦 Creating Steadfast order...');
      
//       const steadfastOrderData = this.formatOrderData(orderData);
//       console.log('📤 Order data:', JSON.stringify(steadfastOrderData, null, 2));

//       const endpoint = `${STEADFAST_API_BASE}/create_order`;
//       console.log(`📡 POST ${endpoint}`);

//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: this.getAuthHeaders(),
//         body: JSON.stringify(steadfastOrderData),
//       });

//       console.log(`📊 Response Status: ${response.status}`);

//       const data = await response.json();
//       console.log('📥 Response:', JSON.stringify(data, null, 2));

//       // ✅ Check response based on documentation
//       if (response.ok && data.status === 200 && data.consignment) {
//         const consignment = data.consignment;
        
//         return {
//           success: true,
//           courierOrderId: consignment.consignment_id,
//           trackingNumber: consignment.tracking_code,
//           trackingUrl: `https://steadfast.com.bd/track/${consignment.tracking_code}`,
//           labelUrl: '',
//           invoiceUrl: '',
//           fullResponse: data,
//           message: data.message || 'Order created successfully with Steadfast'
//         };
//       }

//       // Handle error response
//       const errorMsg = data?.message || data?.error || 'Steadfast order creation failed';
//       throw new Error(errorMsg);

//     } catch (error) {
//       console.error('❌ Steadfast order creation error:', error);
//       return {
//         success: false,
//         message: error.message
//       };
//     }
//   }

//   /**
//    * Format order data for Steadfast API
//    * Based on official documentation
//    */
//   formatOrderData(order) {
//     const customer = order.customerInfo;
    
//     // ✅ Clean phone number (must be 11 digits)
//     const cleanPhone = this.cleanPhoneNumber(customer.phone);
    
//     // ✅ Build full address (within 250 characters)
//     const fullAddress = [
//       customer.address,
//       customer.area || '',
//       customer.zone || '',
//       customer.city || ''
//     ].filter(Boolean).join(', ').slice(0, 250);
    
//     // ✅ Calculate total weight
//     const totalWeight = this.calculateTotalWeight(order.items);
    
//     // ✅ Format items description
//     const itemDescription = order.items
//       .map(item => `${item.productName} x${item.quantity}`)
//       .join(', ')
//       .slice(0, 255);

//     // ✅ Steadfast API format based on documentation
//     return {
//       invoice: order.orderNumber || `INV-${Date.now()}`,
//       recipient_name: customer.fullName.slice(0, 100),
//       recipient_phone: cleanPhone,
//       recipient_address: fullAddress,
//       cod_amount: order.paymentMethod === 'cod' ? Math.round(order.total) : 0,
//       note: (customer.note || '').slice(0, 255),
//       item_description: itemDescription,
//       total_lot: order.items.reduce((sum, item) => sum + item.quantity, 0),
//       delivery_type: 0, // 0 = home delivery, 1 = point delivery
//     };
//   }

//   /**
//    * Clean phone number for Steadfast
//    * Must be exactly 11 digits
//    */
//   cleanPhoneNumber(phone) {
//     if (!phone) return '01700000000';
    
//     // Remove all non-numeric characters
//     let cleaned = phone.replace(/\D/g, '');
    
//     // If it starts with 880, remove it (keep 0)
//     if (cleaned.startsWith('880')) {
//       cleaned = '0' + cleaned.slice(3);
//     }
    
//     // If it doesn't start with 0, add it
//     if (!cleaned.startsWith('0')) {
//       cleaned = '0' + cleaned;
//     }
    
//     // Ensure it's exactly 11 digits
//     if (cleaned.length > 11) {
//       cleaned = cleaned.slice(0, 11);
//     }
    
//     while (cleaned.length < 11) {
//       cleaned = cleaned + '0';
//     }
    
//     return cleaned;
//   }

//   /**
//    * Get tracking information from Steadfast
//    * Using /status_by_trackingcode endpoint
//    */
//   async getTracking(trackingNumber) {
//     try {
//       const endpoint = `${STEADFAST_API_BASE}/status_by_trackingcode/${trackingNumber}`;
//       console.log(`📡 GET ${endpoint}`);
      
//       const response = await fetch(endpoint, {
//         method: 'GET',
//         headers: this.getAuthHeaders(),
//       });

//       const data = await response.json();
//       console.log('📥 Tracking response:', JSON.stringify(data, null, 2));

//       if (response.ok && data.status === 200) {
//         return {
//           success: true,
//           status: data.delivery_status || 'Unknown',
//           location: '',
//           history: [],
//           estimatedDelivery: '',
//           fullResponse: data
//         };
//       }

//       throw new Error(data?.message || 'Failed to get tracking info');
//     } catch (error) {
//       return {
//         success: false,
//         message: error.message
//       };
//     }
//   }

//   /**
//    * Cancel a Steadfast delivery order
//    * Using /create_return_request endpoint
//    */
//   async cancelOrder(courierOrderId) {
//     try {
//       const endpoint = `${STEADFAST_API_BASE}/create_return_request`;
//       console.log(`📡 POST ${endpoint}`);
      
//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: this.getAuthHeaders(),
//         body: JSON.stringify({
//           consignment_id: parseInt(courierOrderId),
//           reason: 'Cancelled by merchant'
//         }),
//       });

//       const data = await response.json();
//       console.log('📥 Cancel response:', JSON.stringify(data, null, 2));

//       if (response.ok) {
//         return {
//           success: true,
//           message: 'Return request created successfully',
//           fullResponse: data
//         };
//       }

//       throw new Error(data?.message || 'Failed to cancel order');
//     } catch (error) {
//       return {
//         success: false,
//         message: error.message
//       };
//     }
//   }

//   /**
//    * Get delivery rates from Steadfast
//    * Using /rate endpoint
//    */
//   async getRates(orderData) {
//     try {
//       const endpoint = `${STEADFAST_API_BASE}/rate`;
//       console.log(`📡 POST ${endpoint}`);
      
//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: this.getAuthHeaders(),
//         body: JSON.stringify({
//           recipient_address: orderData.address || '',
//           recipient_city: orderData.city || 'Dhaka',
//           weight: this.calculateTotalWeight(orderData.items || []),
//           cod_amount: orderData.paymentMethod === 'cod' ? orderData.total : 0
//         }),
//       });

//       const data = await response.json();

//       if (response.ok && data.status === 200) {
//         return {
//           success: true,
//           rates: data,
//           deliveryCharge: data.delivery_charge || 0,
//           codCharge: data.cod_charge || 0,
//           totalCharge: data.total_charge || 0
//         };
//       }

//       throw new Error(data?.message || 'Failed to get rates');
//     } catch (error) {
//       return {
//         success: false,
//         message: error.message
//       };
//     }
//   }

//   /**
//    * Get current balance
//    * Using /get_balance endpoint
//    */
//   async getBalance() {
//     try {
//       const endpoint = `${STEADFAST_API_BASE}/get_balance`;
//       console.log(`📡 GET ${endpoint}`);
      
//       const response = await fetch(endpoint, {
//         method: 'GET',
//         headers: this.getAuthHeaders(),
//       });

//       const data = await response.json();

//       if (response.ok && data.status === 200) {
//         return {
//           success: true,
//           balance: data.current_balance || 0,
//           fullResponse: data
//         };
//       }

//       throw new Error(data?.message || 'Failed to get balance');
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

// module.exports = SteadfastAdapter;


// D:\Smart-Gadget\Gadget-backend\src\lib\couriers\steadfastAdapter.js

const CourierAdapter = require('./courierAdapter');

// ✅ CORRECT BASE URL from official documentation
const STEADFAST_API_BASE = 'https://portal.packzy.com/api/v1';

class SteadfastAdapter extends CourierAdapter {
  constructor(creds, storeConfig) {
    super('steadfast', creds, storeConfig);
  }

  /**
   * Get auth headers for Steadfast API
   */
  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Api-Key': this.creds.apiKey,
      'Secret-Key': this.creds.secretKey,
    };
  }

  /**
   * Test connection to Steadfast API
   */
  async testConnection() {
    console.log('🧪 Testing Steadfast connection...');
    console.log('📦 API Key:', this.creds.apiKey ? `Present (${this.creds.apiKey.substring(0, 8)}...)` : 'Missing');
    console.log('📦 Secret Key:', this.creds.secretKey ? 'Present' : 'Missing');

    try {
      const endpoint = `${STEADFAST_API_BASE}/get_balance`;
      console.log(`📡 Trying: GET ${endpoint}`);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log(`📊 Response Status: ${response.status}`);

      // ✅ Handle plain text response
      const contentType = response.headers.get('content-type');
      let data;
      let responseText = '';

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('📊 Response data:', JSON.stringify(data, null, 2));
      } else {
        responseText = await response.text();
        console.log('📊 Response text:', responseText);
        
        // Check for account status messages
        if (responseText.includes('Account is')) {
          return {
            success: false,
            message: `Steadfast API Error: ${responseText}. Please contact Steadfast support to activate your account for API access.`
          };
        }
        
        return {
          success: false,
          message: `Steadfast API Error: ${responseText || 'Unknown error'}`
        };
      }

      if (response.ok && data.status === 200) {
        return {
          success: true,
          message: 'Steadfast API connected successfully',
          data: {
            balance: data.current_balance || 0,
            response: data
          }
        };
      }

      const errorMsg = data?.message || data?.error || `HTTP ${response.status}`;
      return {
        success: false,
        message: `Steadfast API error: ${errorMsg}`
      };

    } catch (error) {
      console.error('❌ Test connection error:', error);
      return {
        success: false,
        message: error.message || 'Connection failed'
      };
    }
  }

  /**
   * Create a delivery order with Steadfast
   */
  async createOrder(orderData) {
    try {
      console.log('📦 Creating Steadfast order...');
      
      const steadfastOrderData = this.formatOrderData(orderData);
      console.log('📤 Order data:', JSON.stringify(steadfastOrderData, null, 2));

      const endpoint = `${STEADFAST_API_BASE}/create_order`;
      console.log(`📡 POST ${endpoint}`);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(steadfastOrderData),
      });

      console.log(`📊 Response Status: ${response.status}`);

      // ✅ Handle plain text response
      const contentType = response.headers.get('content-type');
      let data;
      let responseText = '';

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('📥 Response:', JSON.stringify(data, null, 2));
      } else {
        responseText = await response.text();
        console.log('📥 Response text:', responseText);
        
        if (response.status === 401) {
          // Check for account status message
          if (responseText.includes('Account is')) {
            return {
              success: false,
              message: `Steadfast API Error: ${responseText}. Please contact Steadfast support to activate your account.`
            };
          }
          return {
            success: false,
            message: 'Authentication failed. Please check your Steadfast API Key and Secret Key.'
          };
        }
        
        return {
          success: false,
          message: `Steadfast API Error: ${responseText || 'Unknown error'}`
        };
      }

      if (response.ok && data.status === 200 && data.consignment) {
        const consignment = data.consignment;
        
        return {
          success: true,
          courierOrderId: consignment.consignment_id,
          trackingNumber: consignment.tracking_code,
          trackingUrl: `https://steadfast.com.bd/track/${consignment.tracking_code}`,
          labelUrl: '',
          invoiceUrl: '',
          fullResponse: data,
          message: data.message || 'Order created successfully with Steadfast'
        };
      }

      const errorMsg = data?.message || data?.error || 'Steadfast order creation failed';
      throw new Error(errorMsg);

    } catch (error) {
      console.error('❌ Steadfast order creation error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Format order data for Steadfast API
   */
  formatOrderData(order) {
    const customer = order.customerInfo;
    
    const cleanPhone = this.cleanPhoneNumber(customer.phone);
    
    const fullAddress = [
      customer.address,
      customer.area || '',
      customer.zone || '',
      customer.city || ''
    ].filter(Boolean).join(', ').slice(0, 250);
    
    // ✅ Fix: Handle undefined productName
    const itemDescription = order.items
      .map(item => `${item.productName || 'Product'} x${item.quantity || 1}`)
      .join(', ')
      .slice(0, 255);

    const totalLot = order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);

    return {
      invoice: order.orderNumber || `INV-${Date.now()}`,
      recipient_name: customer.fullName.slice(0, 100),
      recipient_phone: cleanPhone,
      recipient_address: fullAddress,
      cod_amount: order.paymentMethod === 'cod' ? Math.round(order.total) : 0,
      note: (customer.note || '').slice(0, 255),
      item_description: itemDescription || 'Products',
      total_lot: totalLot || 1,
      delivery_type: 0,
    };
  }

  /**
   * Clean phone number for Steadfast
   */
  cleanPhoneNumber(phone) {
    if (!phone) return '01700000000';
    
    let cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.startsWith('880')) {
      cleaned = '0' + cleaned.slice(3);
    }
    
    if (!cleaned.startsWith('0')) {
      cleaned = '0' + cleaned;
    }
    
    if (cleaned.length > 11) {
      cleaned = cleaned.slice(0, 11);
    }
    
    while (cleaned.length < 11) {
      cleaned = cleaned + '0';
    }
    
    return cleaned;
  }

  /**
   * Get tracking information from Steadfast
   */
  async getTracking(trackingNumber) {
    try {
      const endpoint = `${STEADFAST_API_BASE}/status_by_trackingcode/${trackingNumber}`;
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        return {
          success: false,
          message: `Steadfast API error: ${text || 'Unknown error'}`
        };
      }

      if (response.ok && data.status === 200) {
        return {
          success: true,
          status: data.delivery_status || 'Unknown',
          location: '',
          history: [],
          estimatedDelivery: '',
          fullResponse: data
        };
      }

      throw new Error(data?.message || 'Failed to get tracking info');
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Cancel a Steadfast delivery order
   */
  async cancelOrder(courierOrderId) {
    try {
      const endpoint = `${STEADFAST_API_BASE}/create_return_request`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          consignment_id: parseInt(courierOrderId),
          reason: 'Cancelled by merchant'
        }),
      });

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        return {
          success: false,
          message: `Steadfast API error: ${text || 'Unknown error'}`
        };
      }

      if (response.ok) {
        return {
          success: true,
          message: 'Return request created successfully',
          fullResponse: data
        };
      }

      throw new Error(data?.message || 'Failed to cancel order');
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get delivery rates from Steadfast
   */
  async getRates(orderData) {
    try {
      const endpoint = `${STEADFAST_API_BASE}/rate`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          recipient_address: orderData.address || '',
          recipient_city: orderData.city || 'Dhaka',
          weight: this.calculateTotalWeight(orderData.items || []),
          cod_amount: orderData.paymentMethod === 'cod' ? orderData.total : 0
        }),
      });

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        return {
          success: false,
          message: `Steadfast API error: ${text || 'Unknown error'}`
        };
      }

      if (response.ok && data.status === 200) {
        return {
          success: true,
          rates: data,
          deliveryCharge: data.delivery_charge || 0,
          codCharge: data.cod_charge || 0,
          totalCharge: data.total_charge || 0
        };
      }

      throw new Error(data?.message || 'Failed to get rates');
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get current balance
   */
  async getBalance() {
    try {
      const endpoint = `${STEADFAST_API_BASE}/get_balance`;
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        return {
          success: false,
          message: `Steadfast API error: ${text || 'Unknown error'}`
        };
      }

      if (response.ok && data.status === 200) {
        return {
          success: true,
          balance: data.current_balance || 0,
          fullResponse: data
        };
      }

      throw new Error(data?.message || 'Failed to get balance');
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Helper: Calculate total weight
   */
  calculateTotalWeight(items) {
    if (!items || items.length === 0) return 0.5;
    
    return items.reduce((sum, item) => {
      const weight = item.weight || item.itemWeight || 0.5;
      return sum + (weight * (item.quantity || 1));
    }, 0);
  }
}

module.exports = SteadfastAdapter;