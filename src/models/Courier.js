// // SmartBuy-BD-backend/models/Courier.js

// const mongoose = require('mongoose');

// const courierSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: true, 
//     trim: true 
//   },
//   slug: { 
//     type: String, 
//     required: true, 
//     unique: true, 
//     lowercase: true 
//   },
//   apiEnabled: { 
//     type: Boolean, 
//     default: false 
//   },
//   credentialsEncrypted: { 
//     type: String, 
//     default: '' 
//   },
//   storeConfig: {
//     pathaoStoreId: { type: Number, default: null },
//     pathaoStoreName: { type: String, default: '' },
//     // Add other store-specific configs
//   },
//   integrationStatus: {
//     lastTestedAt: { type: Date, default: null },
//     lastTestOk: { type: Boolean, default: false },
//     lastTestMessage: { type: String, default: '' },
//   },
//   capabilities: {
//     canTrack: { type: Boolean, default: true },
//     canReturn: { type: Boolean, default: true },
//     requiresWeight: { type: Boolean, default: true },
//     requiresDimensions: { type: Boolean, default: false },
//   },
//   deliveryChargeConfig: {
//     baseCharge: { type: Number, default: 0 },
//     perKgCharge: { type: Number, default: 0 },
//     insideDhakaCharge: { type: Number, default: 0 },
//     outsideDhakaCharge: { type: Number, default: 0 },
//   },
//   isActive: { 
//     type: Boolean, 
//     default: true 
//   }
// }, {
//   timestamps: true
// });

// module.exports = mongoose.models.Courier || mongoose.model('Courier', courierSchema);



const mongoose = require('mongoose');

const courierSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  apiEnabled: { type: Boolean, default: false },
  credentialsEncrypted: { type: String, default: '' },
  storeConfig: {
    pathaoStoreId: { type: Number, default: null },
    pathaoStoreName: { type: String, default: '' }
  },
  integrationStatus: {
    lastTestedAt: { type: Date, default: null },
    lastTestOk: { type: Boolean, default: false },
    lastTestMessage: { type: String, default: '' }
  },
  capabilities: {
    canTrack: { type: Boolean, default: true },
    canReturn: { type: Boolean, default: true },
    requiresWeight: { type: Boolean, default: true },
    requiresDimensions: { type: Boolean, default: false }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.models.Courier || mongoose.model('Courier', courierSchema);