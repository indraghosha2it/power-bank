const PathaoAdapter = require('./adapters/PathaoAdapter');
const SteadfastAdapter = require('./adapters/SteadfastAdapter');
const RedxAdapter = require('./adapters/RedxAdapter');

/**
 * Create a courier adapter instance based on slug
 */
function createCourierAdapter(slug, creds, storeConfig) {
  switch (slug.toLowerCase()) {
    case 'pathao':
      return new PathaoAdapter(creds, storeConfig);
    case 'steadfast':
      return new SteadfastAdapter(creds, storeConfig);
    case 'redx':
      return new RedxAdapter(creds, storeConfig);
    default:
      throw new Error(`Unsupported courier: ${slug}`);
  }
}

/**
 * Test connection for a courier
 */
async function testCourierConnection(slug, creds, storeConfig) {
  const adapter = createCourierAdapter(slug, creds, storeConfig);
  return await adapter.testConnection();
}

/**
 * Create delivery order with a courier
 */
async function createCourierOrder(slug, creds, storeConfig, orderData) {
  const adapter = createCourierAdapter(slug, creds, storeConfig);
  return await adapter.createOrder(orderData);
}

/**
 * Get tracking for a courier
 */
async function getCourierTracking(slug, creds, trackingNumber) {
  const adapter = createCourierAdapter(slug, creds, {});
  return await adapter.getTracking(trackingNumber);
}

/**
 * Cancel a courier order
 */
async function cancelCourierOrder(slug, creds, storeConfig, courierOrderId) {
  const adapter = createCourierAdapter(slug, creds, storeConfig);
  return await adapter.cancelOrder(courierOrderId);
}

module.exports = {
  createCourierAdapter,
  testCourierConnection,
  createCourierOrder,
  getCourierTracking,
  cancelCourierOrder
};