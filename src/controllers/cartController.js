
// const Cart = require('../models/Cart');
// const Product = require('../models/Product');

// // Helper to get cart for user or session
// const getCart = async (userId, sessionId) => {
//   let query = {};
//   if (userId) {
//     query = { userId };
//   } else if (sessionId) {
//     query = { sessionId };
//   } else {
//     return null;
//   }
//   return await Cart.findOne(query);
// };

// // @desc    Get user's cart
// // @route   GET /api/cart
// // @access  Public (with sessionId) or Private (with token)
// const getCartItems = async (req, res) => {
//   try {
//     const userId = req.user?._id;
//     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
//     let cart = null;
    
//     if (userId) {
//       cart = await Cart.findOne({ userId });
//     } else if (sessionId) {
//       cart = await Cart.findOne({ sessionId });
//     }
    
//     if (!cart) {
//       return res.status(200).json({ 
//         success: true, 
//         data: { items: [], totalItems: 0, subtotal: 0 } 
//       });
//     }
    
//     res.json({ success: true, data: cart });
//   } catch (error) {
//     console.error('Get cart error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // @desc    Add item to cart with color
// // @route   POST /api/cart
// // @access  Public (with sessionId) or Private (with token)
// const addToCart = async (req, res) => {
//   try {
//     const { productId, quantity = 1, selectedColor = null } = req.body;
//     const userId = req.user?._id;
    
//     if (!productId) {
//       return res.status(400).json({ success: false, error: 'Product ID is required' });
//     }
    
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ success: false, error: 'Product not found' });
//     }
    
//     const requestedQuantity = parseInt(quantity) || 1;
//     if (requestedQuantity < 1) {
//       return res.status(400).json({ success: false, error: 'Quantity must be at least 1' });
//     }
    
//     if (product.stockQuantity < requestedQuantity) {
//       return res.status(400).json({ success: false, error: `Only ${product.stockQuantity} items available in stock` });
//     }
    
//     // Validate color if provided
//     if (selectedColor && product.colors && product.colors.length > 0) {
//       if (!product.colors.includes(selectedColor)) {
//         return res.status(400).json({ success: false, error: 'Color not available for this product' });
//       }
//     }
    
//     // If product has colors but no color selected, allow it but warn
//     const productHasColors = product.colors && product.colors.length > 0;
//     const colorToUse = productHasColors ? (selectedColor || null) : null;
    
//     let cart;
    
//     if (userId) {
//       cart = await Cart.findOne({ userId });
//       if (!cart) {
//         cart = new Cart({
//           userId: userId,
//           sessionId: null,
//           items: []
//         });
//       }
//     } else {
//       let sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
//       if (!sessionId) {
//         sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//       }
//       cart = await Cart.findOne({ sessionId });
//       if (!cart) {
//         cart = new Cart({
//           userId: null,
//           sessionId: sessionId,
//           items: []
//         });
//       }
//       if (!req.headers['x-session-id']) {
//         res.cookie('sessionId', sessionId, {
//           httpOnly: true,
//           maxAge: 30 * 24 * 60 * 60 * 1000,
//           sameSite: 'lax'
//         });
//       }
//       cart._tempSessionId = sessionId;
//     }
    
//     // Check if product with same color already exists
//     const existingItemIndex = cart.items.findIndex(
//       item => item.productId.toString() === productId && 
//               (item.selectedColor === colorToUse || (!item.selectedColor && !colorToUse))
//     );
    
//     if (existingItemIndex >= 0) {
//       const newQuantity = cart.items[existingItemIndex].quantity + requestedQuantity;
//       if (product.stockQuantity < newQuantity) {
//         return res.status(400).json({ 
//           success: false, 
//           error: `Cannot add ${requestedQuantity} more. Only ${product.stockQuantity - cart.items[existingItemIndex].quantity} additional items available.` 
//         });
//       }
//       cart.items[existingItemIndex].quantity = newQuantity;
//     } else {
//       cart.items.push({
//         productId: product._id,
//         productName: product.productName,
//         productSlug: product.slug || product._id.toString(),
//         image: product.images && product.images[0]?.url || '',
//         regularPrice: product.regularPrice,
//         discountPrice: product.discountPrice || 0,
//         quantity: requestedQuantity,
//         stockQuantity: product.stockQuantity,
//         unit: product.unit || 'pcs',
//         selectedColor: colorToUse,
//         productHasColors: productHasColors
//       });
//     }
    
//     cart.updateTotals();
//     await cart.save();
    
//     const responseData = {
//       success: true,
//       data: cart,
//       message: requestedQuantity > 1 ? `${requestedQuantity} items added to cart` : 'Item added to cart'
//     };
    
//     if (!userId && cart._tempSessionId) {
//       responseData.sessionId = cart._tempSessionId;
//       delete cart._tempSessionId;
//     }
    
//     res.json(responseData);
    
//   } catch (error) {
//     console.error('Add to cart error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // @desc    Update cart item (quantity or color)
// // @route   PUT /api/cart/:itemId
// // @access  Public (with sessionId) or Private (with token)
// const updateCartItem = async (req, res) => {
//   try {
//     const { itemId } = req.params;
//     const { quantity, selectedColor } = req.body;
//     const userId = req.user?._id;
//     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
//     let cart;
//     if (userId) {
//       cart = await Cart.findOne({ userId });
//     } else if (sessionId) {
//       cart = await Cart.findOne({ sessionId });
//     } else {
//       return res.status(401).json({ success: false, error: 'Cart not found' });
//     }
    
//     if (!cart) {
//       return res.status(404).json({ success: false, error: 'Cart not found' });
//     }
    
//     const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
//     if (itemIndex === -1) {
//       return res.status(404).json({ success: false, error: 'Item not found in cart' });
//     }
    
//     const currentItem = cart.items[itemIndex];
//     const product = await Product.findById(currentItem.productId);
    
//     // Handle color change
//     if (selectedColor !== undefined) {
//       if (!product) {
//         return res.status(404).json({ success: false, error: 'Product not found' });
//       }
      
//       // Check if the color is available
//       if (product.colors && product.colors.length > 0) {
//         if (!product.colors.includes(selectedColor)) {
//           return res.status(400).json({ success: false, error: 'Selected color is not available' });
//         }
        
//         // Check if same product with same color already exists (merge)
//         const duplicateItemIndex = cart.items.findIndex(
//           (item, idx) => idx !== itemIndex && 
//                         item.productId.toString() === currentItem.productId.toString() && 
//                         item.selectedColor === selectedColor
//         );
        
//         if (duplicateItemIndex !== -1) {
//           // Merge quantities
//           const newQuantity = cart.items[duplicateItemIndex].quantity + currentItem.quantity;
//           cart.items[duplicateItemIndex].quantity = newQuantity;
//           cart.items.splice(itemIndex, 1);
          
//           cart.updateTotals();
//           await cart.save();
          
//           return res.json({ success: true, data: cart });
//         }
        
//         currentItem.selectedColor = selectedColor;
//       }
//     }
    
//     // Handle quantity change
//     if (quantity !== undefined) {
//       if (quantity <= 0) {
//         cart.items.splice(itemIndex, 1);
//       } else {
//         if (product && product.stockQuantity < quantity) {
//           return res.status(400).json({ success: false, error: 'Insufficient stock' });
//         }
//         currentItem.quantity = quantity;
//       }
//     }
    
//     cart.updateTotals();
//     await cart.save();
    
//     res.json({ success: true, data: cart });
//   } catch (error) {
//     console.error('Update cart error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // @desc    Remove item from cart
// // @route   DELETE /api/cart/:itemId
// // @access  Public (with sessionId) or Private (with token)
// const removeFromCart = async (req, res) => {
//   try {
//     const { itemId } = req.params;
//     const userId = req.user?._id;
//     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
//     let cart;
//     if (userId) {
//       cart = await Cart.findOne({ userId });
//     } else if (sessionId) {
//       cart = await Cart.findOne({ sessionId });
//     } else {
//       return res.status(401).json({ success: false, error: 'Cart not found' });
//     }
    
//     if (!cart) {
//       return res.status(404).json({ success: false, error: 'Cart not found' });
//     }
    
//     const itemToRemove = cart.items.find(item => item._id.toString() === itemId);
//     if (!itemToRemove) {
//       return res.status(404).json({ success: false, error: 'Item not found in cart' });
//     }
    
//     cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    
//     cart.updateTotals();
//     await cart.save();
    
//     res.json({ success: true, data: cart });
//   } catch (error) {
//     console.error('Remove from cart error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // @desc    Remove all items of a product
// // @route   DELETE /api/cart/product/:productId
// // @access  Public (with sessionId) or Private (with token)
// const removeProductFromCart = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const userId = req.user?._id;
//     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
//     let cart;
//     if (userId) {
//       cart = await Cart.findOne({ userId });
//     } else if (sessionId) {
//       cart = await Cart.findOne({ sessionId });
//     } else {
//       return res.status(401).json({ success: false, error: 'Cart not found' });
//     }
    
//     if (!cart) {
//       return res.status(404).json({ success: false, error: 'Cart not found' });
//     }
    
//     cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    
//     cart.updateTotals();
//     await cart.save();
    
//     res.json({ success: true, data: cart });
//   } catch (error) {
//     console.error('Remove product from cart error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // @desc    Clear cart
// // @route   DELETE /api/cart
// // @access  Public (with sessionId) or Private (with token)
// const clearCart = async (req, res) => {
//   try {
//     const userId = req.user?._id;
//     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
//     if (!userId && !sessionId) {
//       return res.status(401).json({ success: false, error: 'Cart not found' });
//     }
    
//     const cart = await getCart(userId, sessionId);
//     if (cart) {
//       cart.items = [];
//       cart.totalItems = 0;
//       cart.subtotal = 0;
//       cart.updatedAt = new Date();
//       await cart.save();
//     }
    
//     res.json({ success: true, message: 'Cart cleared', data: { items: [], totalItems: 0, subtotal: 0 } });
//   } catch (error) {
//     console.error('Clear cart error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // @desc    Merge guest cart with user cart after login
// // @route   POST /api/cart/merge
// // @access  Private
// const mergeCart = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const sessionId = req.body.sessionId;
    
//     if (!sessionId) {
//       return res.json({ success: true, message: 'No guest cart to merge' });
//     }
    
//     const guestCart = await Cart.findOne({ sessionId });
    
//     if (!guestCart || guestCart.items.length === 0) {
//       return res.json({ success: true, message: 'No items to merge' });
//     }
    
//     let userCart = await Cart.findOne({ userId });
    
//     if (!userCart) {
//       guestCart.userId = userId;
//       guestCart.sessionId = null;
//       userCart = guestCart;
//       userCart.updateTotals();
//       await userCart.save();
//     } else {
//       for (const guestItem of guestCart.items) {
//         const existingItemIndex = userCart.items.findIndex(
//           item => item.productId.toString() === guestItem.productId.toString() && 
//                   item.selectedColor === guestItem.selectedColor
//         );
        
//         if (existingItemIndex >= 0) {
//           userCart.items[existingItemIndex].quantity += guestItem.quantity;
//         } else {
//           userCart.items.push({
//             productId: guestItem.productId,
//             productName: guestItem.productName,
//             productSlug: guestItem.productSlug,
//             image: guestItem.image,
//             regularPrice: guestItem.regularPrice,
//             discountPrice: guestItem.discountPrice,
//             quantity: guestItem.quantity || 1,
//             stockQuantity: guestItem.stockQuantity,
//             unit: guestItem.unit || 'pcs',
//             selectedColor: guestItem.selectedColor || null,
//             productHasColors: guestItem.productHasColors || false
//           });
//         }
//       }
      
//       userCart.updateTotals();
//       await userCart.save();
//       await guestCart.deleteOne();
//     }
    
//     res.json({ 
//       success: true, 
//       message: 'Cart merged successfully',
//       data: userCart
//     });
//   } catch (error) {
//     console.error('Merge cart error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // @desc    Check cart status for multiple products
// // @route   POST /api/cart/check-status
// // @access  Public (with sessionId) or Private (with token)
// const checkCartStatus = async (req, res) => {
//   try {
//     const { productIds } = req.body;
//     const userId = req.user?._id;
//     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
//     let cart = null;
//     if (userId) {
//       cart = await Cart.findOne({ userId });
//     } else if (sessionId) {
//       cart = await Cart.findOne({ sessionId });
//     }
    
//     const inCartMap = {};
//     if (cart && cart.items) {
//       productIds.forEach(productId => {
//         inCartMap[productId] = cart.items.some(item => item.productId.toString() === productId);
//       });
//     } else {
//       productIds.forEach(productId => {
//         inCartMap[productId] = false;
//       });
//     }
    
//     res.json({ success: true, data: inCartMap });
//   } catch (error) {
//     console.error('Check cart status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // @desc    Check if product is in cart
// // @route   GET /api/cart/check/:productId
// // @access  Public
// const checkCartItem = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const userId = req.user?._id;
//     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
//     let cart = null;
//     if (userId) {
//       cart = await Cart.findOne({ userId });
//     } else if (sessionId) {
//       cart = await Cart.findOne({ sessionId });
//     }
    
//     let inCart = false;
//     if (cart && cart.items) {
//       inCart = cart.items.some(item => item.productId.toString() === productId);
//     }
    
//     res.json({ success: true, data: { inCart } });
//   } catch (error) {
//     console.error('Check cart item error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// module.exports = {
//   getCartItems,
//   addToCart,
//   updateCartItem,
//   removeFromCart,
//   removeProductFromCart,
//   clearCart,
//   mergeCart,
//   checkCartStatus,
//   checkCartItem,
// };

// controllers/cartController.js

const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ========== HELPER: Get cart by userId or sessionId ==========
const getCart = async (userId, sessionId) => {
  let query = {};
  if (userId) {
    query = { userId };
  } else if (sessionId) {
    query = { sessionId };
  } else {
    return null;
  }
  return await Cart.findOne(query);
};

// ========== HELPER: Get session ID from request ==========
const getSessionId = (req) => {
  // If user is logged in, return null (don't use sessionId)
  if (req.user && req.user._id) {
    return null;
  }
  
  return req.headers['x-session-id'] || 
         req.cookies?.sessionId || 
         req.body.sessionId || 
         null;
};

// ========== GET CART ==========
const getCartItems = async (req, res) => {
  try {
    const userId = req.user?._id;
    const sessionId = getSessionId(req);
    
    console.log('📦 Get Cart - UserId:', userId || 'guest', 'SessionId:', sessionId || 'none');
    
    let cart = null;
    
    // IMPORTANT: Prioritize userId over sessionId
    if (userId) {
      cart = await Cart.findOne({ userId });
      console.log('🔍 Looking for user cart with userId:', userId);
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
      console.log('🔍 Looking for guest cart with sessionId:', sessionId);
    }
    
    if (!cart) {
      return res.status(200).json({ 
        success: true, 
        data: { items: [], totalItems: 0, subtotal: 0 } 
      });
    }
    
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== GET USER CART ==========
const getUserCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not authenticated' 
      });
    }
    
    console.log('👤 Get User Cart - User ID:', userId);
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      // Create empty cart if doesn't exist
      cart = new Cart({
        userId: userId,
        sessionId: null,
        items: [],
        totalItems: 0,
        subtotal: 0
      });
      await cart.save();
      console.log('🆕 Created new empty cart for user:', userId);
    }
    
    console.log(`📦 User cart has ${cart.items.length} items`);
    
    res.json({ 
      success: true, 
      data: cart 
    });
  } catch (error) {
    console.error('Get user cart error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== ADD TO CART ==========
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, selectedColor = null } = req.body;
    const userId = req.user?._id;
    
    if (!productId) {
      return res.status(400).json({ success: false, error: 'Product ID is required' });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    const requestedQuantity = parseInt(quantity) || 1;
    if (requestedQuantity < 1) {
      return res.status(400).json({ success: false, error: 'Quantity must be at least 1' });
    }
    
    if (product.stockQuantity < requestedQuantity) {
      return res.status(400).json({ success: false, error: `Only ${product.stockQuantity} items available in stock` });
    }
    
    // Validate color if provided
    if (selectedColor && product.colors && product.colors.length > 0) {
      if (!product.colors.includes(selectedColor)) {
        return res.status(400).json({ success: false, error: 'Color not available for this product' });
      }
    }
    
    const productHasColors = product.colors && product.colors.length > 0;
    const colorToUse = productHasColors ? (selectedColor || null) : null;
    
    let cart;
    let sessionId = getSessionId(req);
    let isNewSession = false;
    
    if (userId) {
      // Logged in user - use userId
      cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({
          userId: userId,
          sessionId: null,
          items: []
        });
      }
    } else {
      // Guest user - use or create session ID
      if (!sessionId) {
        sessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        isNewSession = true;
        console.log('🆕 Generated new session ID:', sessionId);
      }
      
      cart = await Cart.findOne({ sessionId });
      if (!cart) {
        cart = new Cart({
          userId: null,
          sessionId: sessionId,
          items: []
        });
        isNewSession = true;
      }
    }
    
    // Check if product with same color already exists
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && 
              (item.selectedColor === colorToUse || (!item.selectedColor && !colorToUse))
    );
    
    if (existingItemIndex >= 0) {
      const newQuantity = cart.items[existingItemIndex].quantity + requestedQuantity;
      if (product.stockQuantity < newQuantity) {
        return res.status(400).json({ 
          success: false, 
          error: `Cannot add ${requestedQuantity} more. Only ${product.stockQuantity - cart.items[existingItemIndex].quantity} additional items available.` 
        });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      cart.items.push({
        productId: product._id,
        productName: product.productName,
        productSlug: product.slug || product._id.toString(),
        image: product.images && product.images[0]?.url || '',
        regularPrice: product.regularPrice,
        discountPrice: product.discountPrice || 0,
        quantity: requestedQuantity,
        stockQuantity: product.stockQuantity,
        unit: product.unit || 'pcs',
        selectedColor: colorToUse,
        productHasColors: productHasColors
      });
    }
    
    cart.updateTotals();
    await cart.save();
    
    const responseData = {
      success: true,
      data: cart,
      message: requestedQuantity > 1 ? `${requestedQuantity} items added to cart` : 'Item added to cart'
    };
    
    // Return session ID to frontend for guest users
    if (!userId && sessionId) {
      responseData.sessionId = sessionId;
      responseData.isNewSession = isNewSession;
    }
    
    res.json(responseData);
    
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== UPDATE CART ITEM ==========
const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity, selectedColor } = req.body;
    const userId = req.user?._id;
    const sessionId = getSessionId(req);
    
    let cart;
    if (userId) {
      cart = await Cart.findOne({ userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    } else {
      return res.status(401).json({ success: false, error: 'Cart not found' });
    }
    
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: 'Item not found in cart' });
    }
    
    const currentItem = cart.items[itemIndex];
    const product = await Product.findById(currentItem.productId);
    
    // Handle color change
    if (selectedColor !== undefined) {
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      
      if (product.colors && product.colors.length > 0) {
        if (!product.colors.includes(selectedColor)) {
          return res.status(400).json({ success: false, error: 'Selected color is not available' });
        }
        
        // Check if same product with same color already exists (merge)
        const duplicateItemIndex = cart.items.findIndex(
          (item, idx) => idx !== itemIndex && 
                        item.productId.toString() === currentItem.productId.toString() && 
                        item.selectedColor === selectedColor
        );
        
        if (duplicateItemIndex !== -1) {
          const newQuantity = cart.items[duplicateItemIndex].quantity + currentItem.quantity;
          cart.items[duplicateItemIndex].quantity = newQuantity;
          cart.items.splice(itemIndex, 1);
          
          cart.updateTotals();
          await cart.save();
          
          return res.json({ success: true, data: cart });
        }
        
        currentItem.selectedColor = selectedColor;
      }
    }
    
    // Handle quantity change
    if (quantity !== undefined) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        if (product && product.stockQuantity < quantity) {
          return res.status(400).json({ success: false, error: 'Insufficient stock' });
        }
        currentItem.quantity = quantity;
      }
    }
    
    cart.updateTotals();
    await cart.save();
    
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== REMOVE FROM CART ==========
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?._id;
    const sessionId = getSessionId(req);
    
    console.log('🗑️ Remove Item - UserId:', userId || 'guest', 'SessionId:', sessionId || 'none', 'ItemId:', itemId);
    
    let cart;
    
    // IMPORTANT: Prioritize userId over sessionId
    if (userId) {
      cart = await Cart.findOne({ userId });
      console.log('🔍 Looking for user cart with userId:', userId);
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
      console.log('🔍 Looking for guest cart with sessionId:', sessionId);
    } else {
      return res.status(401).json({ success: false, error: 'Cart not found' });
    }
    
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }
    
    const itemToRemove = cart.items.find(item => item._id.toString() === itemId);
    if (!itemToRemove) {
      return res.status(404).json({ success: false, error: 'Item not found in cart' });
    }
    
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    
    cart.updateTotals();
    await cart.save();
    
    console.log(`✅ Removed item ${itemId}, ${cart.items.length} items remaining`);
    
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== REMOVE PRODUCT FROM CART ==========
const removeProductFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user?._id;
    const sessionId = getSessionId(req);
    
    console.log('🗑️ Remove Product - UserId:', userId || 'guest', 'SessionId:', sessionId || 'none');
    
    let cart;
    
    // IMPORTANT: Prioritize userId over sessionId
    if (userId) {
      cart = await Cart.findOne({ userId });
      console.log('🔍 Looking for user cart with userId:', userId);
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
      console.log('🔍 Looking for guest cart with sessionId:', sessionId);
    } else {
      return res.status(401).json({ success: false, error: 'Cart not found' });
    }
    
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }
    
    // Filter out items with the specified productId
    const originalLength = cart.items.length;
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    
    if (cart.items.length === originalLength) {
      return res.status(404).json({ success: false, error: 'Product not found in cart' });
    }
    
    cart.updateTotals();
    await cart.save();
    
    console.log(`✅ Removed product ${productId}, ${cart.items.length} items remaining`);
    
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Remove product from cart error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== CLEAR CART ==========
const clearCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const sessionId = getSessionId(req);
    
    console.log('🗑️ Clear Cart - UserId:', userId || 'guest', 'SessionId:', sessionId || 'none');
    
    if (!userId && !sessionId) {
      return res.status(401).json({ success: false, error: 'Cart not found' });
    }
    
    let cart = null;
    
    // IMPORTANT: Prioritize userId over sessionId
    if (userId) {
      cart = await Cart.findOne({ userId });
      console.log('🔍 Looking for user cart with userId:', userId);
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
      console.log('🔍 Looking for guest cart with sessionId:', sessionId);
    }
    
    if (!cart) {
      // If no cart found, return success with empty cart
      return res.json({ 
        success: true, 
        message: 'Cart already empty', 
        data: { items: [], totalItems: 0, subtotal: 0 } 
      });
    }
    
    cart.items = [];
    cart.totalItems = 0;
    cart.subtotal = 0;
    cart.updatedAt = new Date();
    await cart.save();
    
    console.log('✅ Cart cleared successfully');
    
    res.json({ 
      success: true, 
      message: 'Cart cleared', 
      data: { items: [], totalItems: 0, subtotal: 0 } 
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== MERGE CART ==========
const mergeCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const sessionId = req.body.sessionId || getSessionId(req);
    
    console.log('🔄 Merge Cart - Request Info:', {
      userId: userId || 'not logged in',
      sessionId: sessionId || 'none',
      hasAuth: !!req.user,
      bodySessionId: req.body.sessionId
    });
    
    if (!sessionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'No session ID provided for merge' 
      });
    }
    
    if (userId) {
      console.log('👤 Logged in user - Merging guest cart with user cart');
      
      const guestCart = await Cart.findOne({ sessionId });
      
      if (!guestCart || guestCart.items.length === 0) {
        console.log('📭 No guest cart items to merge');
        return res.json({ 
          success: true, 
          message: 'No items to merge',
          data: await Cart.findOne({ userId }) || { items: [], totalItems: 0, subtotal: 0 }
        });
      }
      
      console.log(`📦 Guest cart has ${guestCart.items.length} items to merge`);
      
      let userCart = await Cart.findOne({ userId });
      
      if (!userCart) {
        guestCart.userId = userId;
        guestCart.sessionId = null;
        userCart = guestCart;
        userCart.updateTotals();
        await userCart.save();
        console.log('✅ Guest cart moved to user (no existing user cart)');
      } else {
        console.log(`📦 User cart has ${userCart.items.length} items before merge`);
        
        for (const guestItem of guestCart.items) {
          const existingItemIndex = userCart.items.findIndex(
            item => item.productId.toString() === guestItem.productId.toString() && 
                    item.selectedColor === guestItem.selectedColor
          );
          
          if (existingItemIndex >= 0) {
            userCart.items[existingItemIndex].quantity += guestItem.quantity;
            console.log(`🔄 Updated existing item: ${guestItem.productName} +${guestItem.quantity}`);
          } else {
            userCart.items.push({
              productId: guestItem.productId,
              productName: guestItem.productName,
              productSlug: guestItem.productSlug,
              image: guestItem.image,
              regularPrice: guestItem.regularPrice,
              discountPrice: guestItem.discountPrice,
              quantity: guestItem.quantity || 1,
              stockQuantity: guestItem.stockQuantity,
              unit: guestItem.unit || 'pcs',
              selectedColor: guestItem.selectedColor || null,
              productHasColors: guestItem.productHasColors || false
            });
            console.log(`➕ Added new item: ${guestItem.productName}`);
          }
        }
        
        userCart.updateTotals();
        await userCart.save();
        await guestCart.deleteOne();
        console.log(`✅ Guest cart merged into user cart (${userCart.items.length} items total)`);
      }
      
      return res.json({ 
        success: true, 
        message: 'Cart merged successfully',
        data: userCart
      });
    } else {
      console.log('👤 Guest user - Returning guest cart');
      
      const guestCart = await Cart.findOne({ sessionId });
      
      if (!guestCart) {
        return res.json({ 
          success: true, 
          message: 'No guest cart found',
          data: { items: [], totalItems: 0, subtotal: 0 }
        });
      }
      
      return res.json({ 
        success: true, 
        message: 'Guest cart retrieved',
        data: guestCart
      });
    }
  } catch (error) {
    console.error('❌ Merge cart error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== CHECK CART STATUS ==========
const checkCartStatus = async (req, res) => {
  try {
    const { productIds } = req.body;
    const userId = req.user?._id;
    const sessionId = getSessionId(req);
    
    let cart = null;
    if (userId) {
      cart = await Cart.findOne({ userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }
    
    const inCartMap = {};
    if (cart && cart.items) {
      productIds.forEach(productId => {
        inCartMap[productId] = cart.items.some(item => item.productId.toString() === productId);
      });
    } else {
      productIds.forEach(productId => {
        inCartMap[productId] = false;
      });
    }
    
    res.json({ success: true, data: inCartMap });
  } catch (error) {
    console.error('Check cart status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== CHECK CART ITEM ==========
const checkCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user?._id;
    const sessionId = getSessionId(req);
    
    let cart = null;
    if (userId) {
      cart = await Cart.findOne({ userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }
    
    let inCart = false;
    if (cart && cart.items) {
      inCart = cart.items.some(item => item.productId.toString() === productId);
    }
    
    res.json({ success: true, data: { inCart } });
  } catch (error) {
    console.error('Check cart item error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getCartItems,
  addToCart,
  getUserCart,
  updateCartItem,
  removeFromCart,
  removeProductFromCart,
  clearCart,
  mergeCart,
  checkCartStatus,
  checkCartItem,
};