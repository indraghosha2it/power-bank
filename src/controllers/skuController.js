

// // backend/src/controllers/skuController.js
// const Product = require('../models/Product');

// // Generate unique SKU for products
// const generateUniqueSku = async (req, res) => {
//   try {
//     // Find the most recent product with a BB- SKU
//     const lastProduct = await Product.findOne({ 
//       skuCode: { $regex: /^BB-/ } 
//     }).sort({ createdAt: -1 });
    
//     let newSkuCode;
    
//     if (lastProduct && lastProduct.skuCode) {
//       const lastSku = lastProduct.skuCode;
//       const parts = lastSku.split('-');
      
//       if (parts.length === 3) {
//         const lastSequence = parseInt(parts[2]);
//         if (!isNaN(lastSequence)) {
//           const newSequence = lastSequence + 1;
//           const timestamp = Date.now().toString().slice(0, 5);
//           newSkuCode = `BB-${timestamp}-${newSequence}`;
          
//           const existing = await Product.findOne({ skuCode: newSkuCode });
//           if (!existing) {
//             return res.json({
//               success: true,
//               data: { skuCode: newSkuCode }
//             });
//           }
//         }
//       }
//     }
    
//     // Fallback: generate with timestamp and random number
//     const timestamp = Date.now().toString().slice(0, 5);
//     const randomNum = Math.floor(Math.random() * 1000);
//     newSkuCode = `BB-${timestamp}-${1000 + randomNum}`;
    
//     let isUnique = false;
//     let attempts = 0;
//     while (!isUnique && attempts < 5) {
//       const existing = await Product.findOne({ skuCode: newSkuCode });
//       if (!existing) {
//         isUnique = true;
//       } else {
//         const newRandom = Math.floor(Math.random() * 1000);
//         newSkuCode = `BB-${timestamp}-${1000 + newRandom}`;
//       }
//       attempts++;
//     }
    
//     res.json({
//       success: true,
//       data: { skuCode: newSkuCode }
//     });
    
//   } catch (error) {
//     console.error('Generate SKU error:', error);
//     // Fallback with timestamp
//     const fallbackSku = `BB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
//     res.json({
//       success: true,
//       data: { skuCode: fallbackSku }
//     });
//   }
// };

// // Validate SKU uniqueness
// const validateSku = async (req, res) => {
//   try {
//     const { skuCode } = req.params;
//     const { excludeId } = req.query;
    
//     const query = { skuCode };
//     if (excludeId) {
//       query._id = { $ne: excludeId };
//     }
    
//     const existingProduct = await Product.findOne(query);
    
//     res.json({
//       success: true,
//       data: {
//         isUnique: !existingProduct,
//         message: existingProduct ? `SKU already used by: ${existingProduct.productName}` : 'SKU is available'
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// module.exports = { 
//   generateUniqueSku, 
//   validateSku
// };

// backend/src/controllers/skuController.js
const Product = require('../models/Product');

// Generate unique SKU for products with HV- prefix
const generateUniqueSku = async (req, res) => {
  try {
    // Find the most recent product with a HV- SKU
    const lastProduct = await Product.findOne({ 
      skuCode: { $regex: /^HV-/ } 
    }).sort({ createdAt: -1 });
    
    let newSkuCode;
    
    if (lastProduct && lastProduct.skuCode) {
      const lastSku = lastProduct.skuCode;
      const parts = lastSku.split('-');
      
      if (parts.length === 3) {
        const lastSequence = parseInt(parts[2]);
        if (!isNaN(lastSequence)) {
          const newSequence = lastSequence + 1;
          const timestamp = Date.now().toString().slice(0, 5);
          newSkuCode = `HV-${timestamp}-${newSequence}`;
          
          const existing = await Product.findOne({ skuCode: newSkuCode });
          if (!existing) {
            return res.json({
              success: true,
              data: { skuCode: newSkuCode }
            });
          }
        }
      }
    }
    
    // If no existing HV- SKU found, start from 1001
    const timestamp = Date.now().toString().slice(0, 5);
    let baseSequence = 1001;
    
    // Check if any HV- SKU exists at all
    const anyHvSku = await Product.findOne({ 
      skuCode: { $regex: /^HV-/ } 
    });
    
    if (!anyHvSku) {
      newSkuCode = `HV-${timestamp}-${baseSequence}`;
    } else {
      // Fallback: generate with timestamp and random number
      const randomNum = Math.floor(Math.random() * 1000);
      newSkuCode = `HV-${timestamp}-${baseSequence + randomNum}`;
    }
    
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      const existing = await Product.findOne({ skuCode: newSkuCode });
      if (!existing) {
        isUnique = true;
      } else {
        const newRandom = Math.floor(Math.random() * 1000);
        newSkuCode = `HV-${timestamp}-${baseSequence + newRandom}`;
      }
      attempts++;
    }
    
    res.json({
      success: true,
      data: { skuCode: newSkuCode }
    });
    
  } catch (error) {
    console.error('Generate SKU error:', error);
    // Fallback with timestamp
    const fallbackSku = `HV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    res.json({
      success: true,
      data: { skuCode: fallbackSku }
    });
  }
};

// Validate SKU uniqueness
const validateSku = async (req, res) => {
  try {
    const { skuCode } = req.params;
    const { excludeId } = req.query;
    
    const query = { skuCode };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const existingProduct = await Product.findOne(query);
    
    res.json({
      success: true,
      data: {
        isUnique: !existingProduct,
        message: existingProduct ? `SKU already used by: ${existingProduct.productName}` : 'SKU is available'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = { 
  generateUniqueSku, 
  validateSku
};