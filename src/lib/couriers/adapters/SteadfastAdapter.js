


// const CourierAdapter = require('./CourierAdapter');

// const STEADFAST_API_BASE = 'https://portal.packzy.com/api/v1';

// class SteadfastAdapter extends CourierAdapter {
//   constructor(creds, storeConfig) {
//     super('steadfast', creds, storeConfig);
//   }

//   getAuthHeaders() {
//     return {
//       'Content-Type': 'application/json',
//       'Api-Key': this.creds.apiKey,
//       'Secret-Key': this.creds.secretKey,
//     };
//   }

//   // ========== HELPER: SAFE JSON PARSE - FIXED ==========
//   async safeParseResponse(response) {
//     // Clone the response before reading to allow multiple reads if needed
//     const clonedResponse = response.clone();
//     const text = await clonedResponse.text();
    
//     console.log('📥 Response text:', text.substring(0, 500));
    
//     // Check if response is HTML
//     if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
//       throw new Error('Steadfast API returned HTML instead of JSON. Please check your credentials.');
//     }
    
//     // Check if response is plain text (like "Account is not active")
//     if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
//       throw new Error(`Steadfast API Error: ${text.trim()}`);
//     }
    
//     try {
//       return JSON.parse(text);
//     } catch (parseError) {
//       throw new Error(`Steadfast API returned invalid JSON: ${text.substring(0, 100)}`);
//     }
//   }

//   // ========== HELPER: GET RESPONSE TEXT WITHOUT CONSUMING BODY ==========
//   async getResponseText(response) {
//     // Clone the response to avoid consuming the body
//     const clonedResponse = response.clone();
//     return await clonedResponse.text();
//   }

//   async testConnection() {
//     console.log('🧪 Testing Steadfast connection...');
//     console.log('🔑 API Key:', this.creds?.apiKey ? `${this.creds.apiKey.slice(0, 6)}...` : '❌ MISSING');
//     console.log('🔑 Secret Key:', this.creds?.secretKey ? `${this.creds.secretKey.slice(0, 4)}...` : '❌ MISSING');
    
//     try {
//       const response = await fetch(`${STEADFAST_API_BASE}/get_balance`, {
//         method: 'GET',
//         headers: this.getAuthHeaders(),
//       });

//       console.log('📊 Response Status:', response.status);

//       // Get the response text once
//       const responseText = await this.getResponseText(response);
//       console.log('📥 Response text:', responseText.substring(0, 500));

//       // Check for common error messages in plain text
//       if (responseText.includes('Account is not active')) {
//         return {
//           success: false,
//           message: 'Steadfast account is not active. Please contact Steadfast support to activate your account.',
//           details: responseText.trim()
//         };
//       }
      
//       if (responseText.includes('Invalid API Key') || responseText.includes('Invalid Secret')) {
//         return {
//           success: false,
//           message: 'Invalid API Key or Secret Key. Please check your credentials in the courier settings.',
//           details: responseText.trim()
//         };
//       }

//       // Try to parse as JSON
//       let data = null;
//       let parseError = null;
      
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         parseError = e;
//       }

//       // If it's HTML or plain text, handle it
//       if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
//         return {
//           success: false,
//           message: 'Steadfast API returned HTML instead of JSON. Please check your credentials.',
//           details: 'The API endpoint may have changed or you may need to contact Steadfast support.'
//         };
//       }

//       if (parseError || !data) {
//         return {
//           success: false,
//           message: `Steadfast API Error: ${responseText.trim() || 'Unknown error'}`,
//           details: responseText.trim()
//         };
//       }

//       if (response.ok) {
//         const balance = data?.current_balance ?? data?.balance ?? 'N/A';
//         return { 
//           success: true, 
//           message: `Steadfast API connected successfully. Balance: ৳${balance}`,
//           details: `Account active with balance ৳${balance}`
//         };
//       }

//       // Handle specific error codes
//       if (response.status === 401) {
//         const msg = data?.message || 'Unauthorized';
//         return {
//           success: false,
//           message: `Steadfast API Error: ${msg}. Make sure you copied the API Key and Secret Key from portal.packzy.com → Settings → API for your active account.`,
//           details: msg
//         };
//       }

//       if (response.status === 403) {
//         return {
//           success: false,
//           message: 'Steadfast account access denied. Please check your account status with Steadfast support.',
//           details: data?.message || 'Access denied'
//         };
//       }

//       return { 
//         success: false, 
//         message: `Steadfast API Error (${response.status}): ${data?.message || 'Unknown error'}`,
//         details: data?.message || 'Unknown error'
//       };
      
//     } catch (error) {
//       console.error('❌ Test connection error:', error);
//       return { 
//         success: false, 
//         message: error.message || 'Steadfast connection failed',
//         details: 'Network error or invalid API endpoint'
//       };
//     }
//   }

//   async createOrder(orderData) {
//     try {
//       console.log('📦 Creating Steadfast order...');

//       const steadfastOrderData = this.formatOrderData(orderData);
//       console.log('📤 Order data:', JSON.stringify(steadfastOrderData, null, 2));
//       console.log(`📡 POST ${STEADFAST_API_BASE}/create_order`);

//       const response = await fetch(`${STEADFAST_API_BASE}/create_order`, {
//         method: 'POST',
//         headers: this.getAuthHeaders(),
//         body: JSON.stringify(steadfastOrderData),
//       });

//       console.log('📊 Response Status:', response.status);

//       // Get response text once
//       const responseText = await this.getResponseText(response);
//       console.log('📥 Response text:', responseText.substring(0, 500));

//       // Check for common error messages in plain text
//       if (responseText.includes('Account is not active')) {
//         throw new Error('Steadfast account is not active. Please contact Steadfast support to activate your account.');
//       }
      
//       if (responseText.includes('Invalid API Key') || responseText.includes('Invalid Secret')) {
//         throw new Error('Invalid API Key or Secret Key. Please check your credentials in the courier settings.');
//       }
      
//       if (responseText.includes('Insufficient balance')) {
//         throw new Error('Insufficient balance in your Steadfast account. Please recharge your account.');
//       }

//       // Try to parse as JSON
//       let data = null;
//       let parseError = null;
      
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         parseError = e;
//       }

//       // If it's HTML or plain text, handle it
//       if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
//         throw new Error('Steadfast API returned HTML instead of JSON. Please check your credentials.');
//       }

//       if (parseError || !data) {
//         throw new Error(`Steadfast API Error: ${responseText.trim() || 'Unknown error'}`);
//       }

//       if (!response.ok) {
//         const errMsg = data?.message || data?.error || `HTTP ${response.status}`;
//         if (response.status === 401) {
//           throw new Error(`Steadfast API Error: ${errMsg}. Please verify your API credentials.`);
//         }
//         if (response.status === 403) {
//           throw new Error(`Steadfast API Error: ${errMsg}. Your account may not be active.`);
//         }
//         throw new Error(`Steadfast API Error: ${errMsg}`);
//       }

//       // Check if the response has the expected structure
//       if (!data || typeof data !== 'object') {
//         throw new Error('Steadfast API returned an invalid response format.');
//       }

//       const orderInfo = data.data || data;
//       return {
//         success: true,
//         courierOrderId: orderInfo?.order_id || orderInfo?.id || null,
//         trackingNumber: orderInfo?.tracking_code || orderInfo?.tracking_number || null,
//         trackingUrl: orderInfo?.tracking_url || `https://portal.packzy.com/track/${orderInfo?.tracking_code}`,
//         labelUrl: orderInfo?.label_url || '',
//         invoiceUrl: orderInfo?.invoice_url || '',
//         fullResponse: data,
//         message: 'Order created successfully with Steadfast',
//       };
      
//     } catch (error) {
//       console.error('❌ Steadfast order creation error:', error);
//       return { 
//         success: false, 
//         message: error.message || 'Failed to create Steadfast order',
//         details: error.stack
//       };
//     }
//   }

//   formatOrderData(order) {
//     const customer = order.customerInfo;
//     const cleanPhone = this.cleanPhoneNumber(customer.phone);
//     const fullAddress = [customer.address, customer.area, customer.zone, customer.city]
//       .filter(Boolean).join(', ');
//     const totalWeight = this.calculateTotalWeight(order.items);
//     const itemDescription = order.items
//       .map(item => `${item.productName} x${item.quantity}`)
//       .join(', ')
//       .slice(0, 255);

//     return {
//       invoice: order.orderNumber || `INV-${Date.now()}`,
//       recipient_name: customer.fullName || 'Customer',
//       recipient_phone: cleanPhone || '01700000000',
//       recipient_address: (fullAddress || customer.address || 'N/A').slice(0, 250),
//       cod_amount: order.paymentMethod === 'cod' ? Math.round(order.total) : 0,
//       note: (customer.note || '').slice(0, 255),
//       item_description: itemDescription || 'Order items',
//       total_lot: 1,
//       delivery_type: 0,
//     };
//   }

//   cleanPhoneNumber(phone) {
//     if (!phone) return '01700000000';
//     let cleaned = phone.replace(/\D/g, '');
//     if (cleaned.startsWith('880')) cleaned = '0' + cleaned.slice(3);
//     if (!cleaned.startsWith('0')) cleaned = '0' + cleaned;
//     if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
//     while (cleaned.length < 11) cleaned = cleaned + '0';
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
//       console.log(`📡 Fetching tracking for: ${trackingNumber}`);
      
//       const response = await fetch(`${STEADFAST_API_BASE}/status_by_trackingcode/${trackingNumber}`, {
//         method: 'GET',
//         headers: this.getAuthHeaders(),
//       });

//       console.log('📊 Response Status:', response.status);

//       // Get response text once
//       const responseText = await this.getResponseText(response);
//       console.log('📥 Response text:', responseText.substring(0, 500));

//       // Try to parse as JSON
//       let data = null;
//       try {
//         data = JSON.parse(responseText);
//       } catch (parseError) {
//         throw new Error(`Steadfast tracking error: ${responseText.trim()}`);
//       }

//       if (!response.ok) {
//         throw new Error(data?.message || 'Failed to get tracking info');
//       }
      
//       return {
//         success: true,
//         status: data.delivery_status || data.status || 'Unknown',
//         history: data.history || [],
//         fullResponse: data,
//       };
      
//     } catch (error) {
//       console.error('❌ Steadfast tracking error:', error);
//       return { 
//         success: false, 
//         message: error.message || 'Failed to get tracking info' 
//       };
//     }
//   }

//   async cancelOrder(courierOrderId) {
//     try {
//       console.log(`📡 Cancelling order: ${courierOrderId}`);
      
//       const response = await fetch(`${STEADFAST_API_BASE}/cancel_order/${courierOrderId}`, {
//         method: 'POST',
//         headers: this.getAuthHeaders(),
//       });

//       console.log('📊 Response Status:', response.status);

//       // Get response text once
//       const responseText = await this.getResponseText(response);
//       console.log('📥 Response text:', responseText.substring(0, 500));

//       // Try to parse as JSON
//       let data = null;
//       try {
//         data = JSON.parse(responseText);
//       } catch (parseError) {
//         throw new Error(`Steadfast cancel error: ${responseText.trim()}`);
//       }

//       if (!response.ok) {
//         throw new Error(data?.message || 'Failed to cancel order');
//       }
      
//       return { 
//         success: true, 
//         message: 'Order cancelled successfully with Steadfast',
//         fullResponse: data 
//       };
      
//     } catch (error) {
//       console.error('❌ Steadfast cancel error:', error);
//       return { 
//         success: false, 
//         message: error.message || 'Failed to cancel order' 
//       };
//     }
//   }
// }

// module.exports = SteadfastAdapter;

// src/lib/couriers/adapters/SteadfastAdapter.js

const CourierAdapter = require('./CourierAdapter');

const STEADFAST_API_BASE = 'https://portal.packzy.com/api/v1';

// ============================================================
// ✅ CookieJar class - MUST BE DEFINED AT THE TOP LEVEL
// ============================================================
class CookieJar {
  constructor() {
    this.cookies = new Map();
  }

  ingest(response) {
    const cookies = response.headers.get('set-cookie') || '';
    const parts = cookies.split(',').map(c => c.trim());
    for (const raw of parts) {
      const [pair] = raw.split(';');
      const eq = pair.indexOf('=');
      if (eq <= 0) continue;
      const name = pair.slice(0, eq).trim();
      const value = pair.slice(eq + 1).trim();
      if (name) this.cookies.set(name, value);
    }
  }

  header() {
    return [...this.cookies.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
  }
}

class SteadfastAdapter extends CourierAdapter {
  constructor(creds, storeConfig) {
    super('steadfast', creds, storeConfig);
  }

  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Api-Key': this.creds.apiKey,
      'Secret-Key': this.creds.secretKey,
    };
  }

  // ========== HELPER: SAFE JSON PARSE ==========
  async safeParseResponse(response) {
    const clonedResponse = response.clone();
    const text = await clonedResponse.text();
    
    console.log('📥 Response text:', text.substring(0, 500));
    
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      throw new Error('Steadfast API returned HTML instead of JSON. Please check your credentials.');
    }
    
    if (!text.trim().startsWith('{') && !text.trim().startsWith('[')) {
      throw new Error(`Steadfast API Error: ${text.trim()}`);
    }
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      throw new Error(`Steadfast API returned invalid JSON: ${text.substring(0, 100)}`);
    }
  }

  async getResponseText(response) {
    const clonedResponse = response.clone();
    return await clonedResponse.text();
  }

  async testConnection() {
    console.log('🧪 Testing Steadfast connection...');
    console.log('🔑 API Key:', this.creds?.apiKey ? `${this.creds.apiKey.slice(0, 6)}...` : '❌ MISSING');
    console.log('🔑 Secret Key:', this.creds?.secretKey ? `${this.creds.secretKey.slice(0, 4)}...` : '❌ MISSING');
    
    try {
      const response = await fetch(`${STEADFAST_API_BASE}/get_balance`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('📊 Response Status:', response.status);

      const responseText = await this.getResponseText(response);
      console.log('📥 Response text:', responseText.substring(0, 500));

      if (responseText.includes('Account is not active')) {
        return {
          success: false,
          message: 'Steadfast account is not active. Please contact Steadfast support to activate your account.',
          details: responseText.trim()
        };
      }
      
      if (responseText.includes('Invalid API Key') || responseText.includes('Invalid Secret')) {
        return {
          success: false,
          message: 'Invalid API Key or Secret Key. Please check your credentials in the courier settings.',
          details: responseText.trim()
        };
      }

      let data = null;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        // Not JSON
      }

      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
        return {
          success: false,
          message: 'Steadfast API returned HTML instead of JSON. Please check your credentials.',
          details: 'The API endpoint may have changed or you may need to contact Steadfast support.'
        };
      }

      if (!data) {
        return {
          success: false,
          message: `Steadfast API Error: ${responseText.trim() || 'Unknown error'}`,
          details: responseText.trim()
        };
      }

      if (response.ok) {
        const balance = data?.current_balance ?? data?.balance ?? 'N/A';
        return { 
          success: true, 
          message: `Steadfast API connected successfully. Balance: ৳${balance}`,
          details: `Account active with balance ৳${balance}`
        };
      }

      if (response.status === 401) {
        return {
          success: false,
          message: `Steadfast API Error: Unauthorized. Make sure you copied the API Key and Secret Key from portal.packzy.com`,
          details: data?.message || 'Unauthorized'
        };
      }

      return { 
        success: false, 
        message: `Steadfast API Error (${response.status}): ${data?.message || 'Unknown error'}`,
        details: data?.message || 'Unknown error'
      };
      
    } catch (error) {
      console.error('❌ Test connection error:', error);
      return { 
        success: false, 
        message: error.message || 'Steadfast connection failed',
        details: 'Network error or invalid API endpoint'
      };
    }
  }

  async createOrder(orderData) {
    try {
      console.log('📦 Creating Steadfast order...');

      const steadfastOrderData = this.formatOrderData(orderData);
      console.log('📤 Order data:', JSON.stringify(steadfastOrderData, null, 2));
      console.log(`📡 POST ${STEADFAST_API_BASE}/create_order`);

      const response = await fetch(`${STEADFAST_API_BASE}/create_order`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(steadfastOrderData),
      });

      console.log('📊 Response Status:', response.status);

      const responseText = await this.getResponseText(response);
      console.log('📥 Response text:', responseText.substring(0, 500));

      if (responseText.includes('Account is not active')) {
        throw new Error('Steadfast account is not active. Please contact Steadfast support to activate your account.');
      }
      
      if (responseText.includes('Invalid API Key') || responseText.includes('Invalid Secret')) {
        throw new Error('Invalid API Key or Secret Key. Please check your credentials in the courier settings.');
      }
      
      if (responseText.includes('Insufficient balance')) {
        throw new Error('Insufficient balance in your Steadfast account. Please recharge your account.');
      }

      let data = null;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        // Not JSON
      }

      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
        throw new Error('Steadfast API returned HTML instead of JSON. Please check your credentials.');
      }

      if (!data) {
        throw new Error(`Steadfast API Error: ${responseText.trim() || 'Unknown error'}`);
      }

      if (!response.ok) {
        const errMsg = data?.message || data?.error || `HTTP ${response.status}`;
        throw new Error(`Steadfast API Error: ${errMsg}`);
      }

      const orderInfo = data.data || data;
      return {
        success: true,
        courierOrderId: orderInfo?.order_id || orderInfo?.id || null,
        trackingNumber: orderInfo?.tracking_code || orderInfo?.tracking_number || null,
        trackingUrl: orderInfo?.tracking_url || `https://portal.packzy.com/track/${orderInfo?.tracking_code}`,
        labelUrl: orderInfo?.label_url || '',
        invoiceUrl: orderInfo?.invoice_url || '',
        fullResponse: data,
        message: 'Order created successfully with Steadfast',
      };
      
    } catch (error) {
      console.error('❌ Steadfast order creation error:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to create Steadfast order',
        details: error.stack
      };
    }
  }

  // ============================================================
  // ✅ ADD getCustomerLifetimeStats HERE
  // ============================================================

  /**
   * Get lifetime delivery stats for a customer phone number
   * Uses Steadfast's fraud check API
   */
  async getCustomerLifetimeStats(phone) {
    try {
      console.log(`🔍 Steadfast: Fetching lifetime stats for ${phone}`);
      
      const cleanPhone = this.cleanPhoneNumber(phone);
      
      // Try API Key method first
      if (this.creds.apiKey && this.creds.secretKey) {
        try {
          const response = await fetch(`https://portal.packzy.com/api/v1/fraud-check/${cleanPhone}`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data?.message || 'Steadfast fraud check failed');
          }

          const delivered = Number(data?.total_delivered || 0);
          const cancelled = Number(data?.total_cancelled || 0);
          const total = delivered + cancelled;

          return {
            success: true,
            delivered,
            cancelled,
            total,
            configured: true
          };
        } catch (apiError) {
          console.log('⚠️ Steadfast API fraud check failed, trying fallback...');
          // Fall through to web scraping method
        }
      }

      // Web scraping fallback (email + password)
      if (this.creds.email && this.creds.password) {
        try {
          const jar = new CookieJar();
          
          // Get login page with CSRF token
          const loginPage = await fetch('https://steadfast.com.bd/login', {
            headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/html' },
          });
          const html = await loginPage.text();
          
          const tokenMatch = html.match(/<input type="hidden" name="_token" value="(.*?)"/);
          const csrfToken = tokenMatch?.[1];
          
          if (!csrfToken) {
            throw new Error('Steadfast login CSRF token not found');
          }

          // Login
          const loginRes = await fetch('https://steadfast.com.bd/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Cookie: jar.header(),
              'User-Agent': 'Mozilla/5.0',
              Accept: 'text/html,application/json',
            },
            body: new URLSearchParams({
              _token: csrfToken,
              email: this.creds.email,
              password: this.creds.password,
            }),
            redirect: 'manual',
          });

          if (loginRes.status !== 302) {
            throw new Error('Steadfast login failed');
          }

          // Get fraud data
          const fraudRes = await fetch(`https://steadfast.com.bd/user/frauds/check/${cleanPhone}`, {
            headers: {
              Cookie: jar.header(),
              Accept: 'application/json',
              'User-Agent': 'Mozilla/5.0',
            },
          });

          const data = await fraudRes.json();

          if (!fraudRes.ok) {
            throw new Error(data?.message || 'Steadfast fraud check failed');
          }

          const delivered = Number(data.total_delivered || 0);
          const cancelled = Number(data.total_cancelled || 0);
          const total = delivered + cancelled;

          return {
            success: true,
            delivered,
            cancelled,
            total,
            configured: true
          };
        } catch (scrapeError) {
          console.error('❌ Steadfast scraping error:', scrapeError);
          return {
            success: false,
            error: scrapeError.message || 'Steadfast request failed',
            configured: true
          };
        }
      }

      return {
        success: false,
        error: 'Steadfast credentials not configured properly',
        configured: false
      };
      
    } catch (error) {
      console.error('❌ Steadfast fraud check error:', error);
      return {
        success: false,
        error: error.message || 'Steadfast request failed',
        configured: true
      };
    }
  }

  // ============================================================
  // ⬆️ END OF getCustomerLifetimeStats
  // ============================================================

  formatOrderData(order) {
    const customer = order.customerInfo;
    const cleanPhone = this.cleanPhoneNumber(customer.phone);
    const fullAddress = [customer.address, customer.area, customer.zone, customer.city]
      .filter(Boolean).join(', ');
    const totalWeight = this.calculateTotalWeight(order.items);
    const itemDescription = order.items
      .map(item => `${item.productName} x${item.quantity}`)
      .join(', ')
      .slice(0, 255);

    return {
      invoice: order.orderNumber || `INV-${Date.now()}`,
      recipient_name: customer.fullName || 'Customer',
      recipient_phone: cleanPhone || '01700000000',
      recipient_address: (fullAddress || customer.address || 'N/A').slice(0, 250),
      cod_amount: order.paymentMethod === 'cod' ? Math.round(order.total) : 0,
      note: (customer.note || '').slice(0, 255),
      item_description: itemDescription || 'Order items',
      total_lot: 1,
      delivery_type: 0,
    };
  }

  cleanPhoneNumber(phone) {
    if (!phone) return '01700000000';
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('880')) cleaned = '0' + cleaned.slice(3);
    if (!cleaned.startsWith('0')) cleaned = '0' + cleaned;
    if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);
    while (cleaned.length < 11) cleaned = cleaned + '0';
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
      console.log(`📡 Fetching tracking for: ${trackingNumber}`);
      
      const response = await fetch(`${STEADFAST_API_BASE}/status_by_trackingcode/${trackingNumber}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('📊 Response Status:', response.status);

      const responseText = await this.getResponseText(response);
      console.log('📥 Response text:', responseText.substring(0, 500));

      let data = null;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Steadfast tracking error: ${responseText.trim()}`);
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to get tracking info');
      }
      
      return {
        success: true,
        status: data.delivery_status || data.status || 'Unknown',
        history: data.history || [],
        fullResponse: data,
      };
      
    } catch (error) {
      console.error('❌ Steadfast tracking error:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to get tracking info' 
      };
    }
  }

  async cancelOrder(courierOrderId) {
    try {
      console.log(`📡 Cancelling order: ${courierOrderId}`);
      
      const response = await fetch(`${STEADFAST_API_BASE}/cancel_order/${courierOrderId}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      console.log('📊 Response Status:', response.status);

      const responseText = await this.getResponseText(response);
      console.log('📥 Response text:', responseText.substring(0, 500));

      let data = null;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Steadfast cancel error: ${responseText.trim()}`);
      }

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to cancel order');
      }
      
      return { 
        success: true, 
        message: 'Order cancelled successfully with Steadfast',
        fullResponse: data 
      };
      
    } catch (error) {
      console.error('❌ Steadfast cancel error:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to cancel order' 
      };
    }
  }
}

module.exports = SteadfastAdapter;