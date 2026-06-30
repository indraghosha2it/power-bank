// SmartBuy-BD-backend/lib/courierCredentials.js

const Courier = require('../models/Courier');
const { encryptJson, decryptJson } = require('./credentialCrypto');

// Define credential fields for each courier
const courierCredentialFields = {
  pathao: ['clientId', 'clientSecret', 'username', 'password', 'storeId'],
  steadfast: ['apiKey', 'secretKey', 'storeId'],
  redx: ['phone', 'password', 'storeId']
};

/**
 * Get courier document by slug
 */
async function getCourierDocBySlug(slug) {
  return await Courier.findOne({ slug });
}

/**
 * Check if slug is a valid integration courier
 */
function isIntegrationSlug(slug) {
  return ['pathao', 'steadfast', 'redx'].includes(slug.toLowerCase());
}

/**
 * Merge credential updates (preserve existing values if not provided)
 */
function mergeCredentialUpdates(slug, existing = {}, incoming = {}) {
  const merged = { ...existing };
  const fields = courierCredentialFields[slug] || [];
  
  for (const key of fields) {
    if (incoming[key] !== undefined && incoming[key] !== '' && incoming[key] !== null) {
      merged[key] = String(incoming[key]).trim();
    }
    // If field is not in incoming, keep existing value
  }
  
  return merged;
}

/**
 * Save courier credentials with encryption
 */
async function saveCourierCredentials(courierId, { apiEnabled, credentials, storeConfig, capabilities }) {
  const courier = await Courier.findById(courierId);
  if (!courier) return null;

  // Update API enabled status
  if (typeof apiEnabled === 'boolean') {
    courier.apiEnabled = apiEnabled;
  }

  // Encrypt and save credentials
  if (credentials && isIntegrationSlug(courier.slug)) {
    const existing = decryptJson(courier.credentialsEncrypted);
    const merged = mergeCredentialUpdates(courier.slug, existing, credentials);
    courier.credentialsEncrypted = encryptJson(merged);
  }

  // Update store config
  if (storeConfig) {
    courier.storeConfig = { ...courier.storeConfig, ...storeConfig };
  }

  // Update capabilities
  if (capabilities) {
    courier.capabilities = { ...courier.capabilities, ...capabilities };
  }

  await courier.save();
  return courier;
}

/**
 * Get courier integration details
 */
async function getCourierIntegration(slug) {
  const doc = await getCourierDocBySlug(slug);
  if (!doc) return null;

  let creds = null;
  
  if (doc.credentialsEncrypted) {
    creds = decryptJson(doc.credentialsEncrypted);
  }

  // Check if credentials are configured
  const hasAnyCreds = creds && Object.keys(creds).length > 0;
  
  // Check specific credential fields
  const fields = courierCredentialFields[slug] || [];
  const configuredFields = fields.filter(f => creds && creds[f] && creds[f].trim() !== '');
  
  return {
    slug: doc.slug,
    id: doc._id,
    creds: hasAnyCreds ? creds : null,
    configured: configuredFields.length > 0,
    apiEnabled: doc.apiEnabled,
    storeConfig: doc.storeConfig,
    capabilities: doc.capabilities,
    integrationStatus: doc.integrationStatus,
    configuredFields: configuredFields,
    missingFields: fields.filter(f => !configuredFields.includes(f)),
    doc
  };
}

/**
 * Check if courier credentials are configured
 */
function credentialsConfigured(slug, creds) {
  if (!creds) return false;
  const fields = courierCredentialFields[slug] || [];
  return fields.every(f => creds[f] && creds[f].trim() !== '');
}

module.exports = {
  getCourierDocBySlug,
  isIntegrationSlug,
  mergeCredentialUpdates,
  saveCourierCredentials,
  getCourierIntegration,
  credentialsConfigured,
  courierCredentialFields
};