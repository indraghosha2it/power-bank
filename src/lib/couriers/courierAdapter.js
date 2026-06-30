// SmartBuy-BD-backend/lib/couriers/courierAdapter.js

/**
 * Base Courier Adapter class
 * All courier adapters should extend this class
 */
class CourierAdapter {
  constructor(slug, creds, storeConfig) {
    this.slug = slug;
    this.creds = creds;
    this.storeConfig = storeConfig;
  }

  /**
   * Test connection to courier API
   */
  async testConnection() {
    throw new Error('testConnection must be implemented by subclass');
  }

  /**
   * Create a delivery order
   */
  async createOrder(orderData) {
    throw new Error('createOrder must be implemented by subclass');
  }

  /**
   * Get tracking information
   */
  async getTracking(trackingNumber) {
    throw new Error('getTracking must be implemented by subclass');
  }

  /**
   * Cancel a delivery order
   */
  async cancelOrder(courierOrderId) {
    throw new Error('cancelOrder must be implemented by subclass');
  }

  /**
   * Get delivery rates/charges
   */
  async getRates(orderData) {
    throw new Error('getRates must be implemented by subclass');
  }

  /**
   * Format order data for courier API
   */
  formatOrderData(order) {
    // Default implementation - should be overridden by subclasses
    return {
      recipient_name: order.customerInfo.fullName,
      recipient_phone: order.customerInfo.phone,
      recipient_address: order.customerInfo.address,
      city: order.customerInfo.city,
      zone: order.customerInfo.zone,
      area: order.customerInfo.area,
      total_amount: order.total,
      items: order.items.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.discountPrice || item.regularPrice
      }))
    };
  }
}

module.exports = CourierAdapter;