// const Order = require('../models/Order');
// const Product = require('../models/Product');

// // ============================================================
// // HELPER: Calculate profit for a single order item
// // ============================================================
// const calculateItemProfit = (item) => {
//   // Selling price = discountPrice if exists, else regularPrice
//   const sellingPrice = item.discountPrice && item.discountPrice > 0 
//     ? item.discountPrice 
//     : item.regularPrice;
  
//   // Revenue = selling price × quantity
//   const revenue = sellingPrice * item.quantity;
  
//   // Cost = costPerItem × quantity (get from product if not in order item)
//   // Default to 0 if costPerItem not available
//   const costPerItem = item.costPerItem || item.buyingPrice || 0;
//   const cost = costPerItem * item.quantity;
  
//   // Profit = Revenue - Cost
//   const profit = revenue - cost;
  
//   // Profit Margin = (Profit / Revenue) × 100
//   const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
  
//   return {
//     sellingPrice,
//     revenue,
//     cost,
//     profit,
//     profitMargin
//   };
// };

// // ============================================================
// // HELPER: Get product cost per item
// // ============================================================
// const getProductCost = async (productId) => {
//   try {
//     const product = await Product.findById(productId).select('costPerItem buyingPrice');
//     if (product) {
//       return product.costPerItem || product.buyingPrice || 0;
//     }
//     return 0;
//   } catch (error) {
//     console.error('Error fetching product cost:', error);
//     return 0;
//   }
// };

// // ============================================================
// // GET PROFIT MARGIN DATA
// // @route   GET /api/orders/admin/profit-margin
// // @access  Private (Admin/Moderator/Super Admin)
// // ============================================================
// const getProfitMarginData = async (req, res) => {
//   try {
//     const { 
//       period = 'month', 
//       orderStatus = 'delivered',
//       paymentStatus = 'paid',
//       startDate,
//       endDate,
//       limit = 100
//     } = req.query;
    
//     const userRole = req.user?.role || 'admin';
    
//     // Build date filter
//     let dateFilter = {};
//     const now = new Date();
    
//     if (startDate && endDate) {
//       dateFilter = {
//         createdAt: {
//           $gte: new Date(startDate),
//           $lte: new Date(endDate)
//         }
//       };
//     } else {
//       switch (period) {
//         case 'today':
//           const today = new Date();
//           today.setHours(0, 0, 0, 0);
//           dateFilter = { createdAt: { $gte: today } };
//           break;
//         case 'week':
//           const weekStart = new Date(now);
//           weekStart.setDate(now.getDate() - 7);
//           dateFilter = { createdAt: { $gte: weekStart } };
//           break;
//         case 'month':
//           const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//           dateFilter = { createdAt: { $gte: monthStart } };
//           break;
//         case 'year':
//           const yearStart = new Date(now.getFullYear(), 0, 1);
//           dateFilter = { createdAt: { $gte: yearStart } };
//           break;
//         case 'all':
//         default:
//           dateFilter = {};
//       }
//     }
    
//     // Build query - ONLY delivered and paid orders
//     const query = {
//       orderStatus: 'delivered',
//       paymentStatus: 'paid',
//       ...dateFilter
//     };
    
//     // If user is not super_admin/admin/moderator, restrict access
//     if (!['super_admin', 'admin', 'moderator'].includes(userRole)) {
//       return res.status(403).json({ 
//         success: false, 
//         error: 'Unauthorized to view profit margin data' 
//       });
//     }
    
//     console.log('🔍 Profit Margin Query:', JSON.stringify(query, null, 2));
    
//     // Fetch orders
//     const orders = await Order.find(query)
//       .populate('items.productId', 'costPerItem buyingPrice productName')
//       .sort({ createdAt: -1 })
//       .limit(parseInt(limit));
    
//     if (!orders || orders.length === 0) {
//       return res.json({
//         success: true,
//         data: {
//           summary: {
//             totalOrders: 0,
//             totalRevenue: 0,
//             totalCost: 0,
//             totalProfit: 0,
//             averageProfitMargin: 0
//           },
//           productProfitDetails: [],
//           periodSummary: [],
//           orders: []
//         }
//       });
//     }
    
//     // ============================================================
//     // CALCULATE PROFIT FOR EACH ORDER
//     // ============================================================
//     let totalRevenue = 0;
//     let totalCost = 0;
//     let totalProfit = 0;
    
//     // Product profit aggregation
//     const productProfitMap = {};
    
//     // Period summary (daily)
//     const periodMap = {};
    
//     const processedOrders = orders.map(order => {
//       let orderRevenue = 0;
//       let orderCost = 0;
//       let orderProfit = 0;
      
//       const orderItems = order.items.map(item => {
//         // Get selling price
//         const sellingPrice = item.discountPrice && item.discountPrice > 0 
//           ? item.discountPrice 
//           : item.regularPrice;
        
//         // Get cost per item from product or order item
//         let costPerItem = 0;
//         if (item.productId && typeof item.productId === 'object') {
//           costPerItem = item.productId.costPerItem || item.productId.buyingPrice || 0;
//         } else {
//           // Try to fetch product if not populated
//           costPerItem = 0; // Will use fallback
//         }
        
//         // If costPerItem is 0, try to get from order item (if stored)
//         if (costPerItem === 0 && item.costPerItem) {
//           costPerItem = item.costPerItem;
//         }
        
//         const revenue = sellingPrice * item.quantity;
//         const cost = costPerItem * item.quantity;
//         const profit = revenue - cost;
//         const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
        
//         orderRevenue += revenue;
//         orderCost += cost;
//         orderProfit += profit;
        
//         // Aggregate by product
//         const productId = item.productId?._id || item.productId?.toString() || 'unknown';
//         const productName = item.productName || 'Unknown Product';
//         const productImage = item.image || '';
        
//         if (!productProfitMap[productId]) {
//           productProfitMap[productId] = {
//             productId: productId,
//             productName: productName,
//             image: productImage,
//             totalQuantity: 0,
//             totalRevenue: 0,
//             totalCost: 0,
//             totalProfit: 0,
//             profitMargin: 0,
//             averageSellingPrice: 0,
//             averageBuyingPrice: 0,
//             costPerItem: costPerItem
//           };
//         }
        
//         productProfitMap[productId].totalQuantity += item.quantity;
//         productProfitMap[productId].totalRevenue += revenue;
//         productProfitMap[productId].totalCost += cost;
//         productProfitMap[productId].totalProfit += profit;
//         productProfitMap[productId].averageSellingPrice = 
//           productProfitMap[productId].totalRevenue / productProfitMap[productId].totalQuantity;
//         productProfitMap[productId].averageBuyingPrice = costPerItem;
        
//         return {
//           ...item.toObject(),
//           sellingPrice,
//           costPerItem,
//           revenue,
//           cost,
//           profit,
//           profitMargin
//         };
//       });
      
//       totalRevenue += orderRevenue;
//       totalCost += orderCost;
//       totalProfit += orderProfit;
      
//       // Period summary (by day)
//       const dateKey = order.createdAt.toISOString().split('T')[0];
//       if (!periodMap[dateKey]) {
//         periodMap[dateKey] = {
//           date: dateKey,
//           orders: 0,
//           itemsSold: 0,
//           revenue: 0,
//           cost: 0,
//           profit: 0,
//           profitMargin: 0
//         };
//       }
//       periodMap[dateKey].orders += 1;
//       periodMap[dateKey].itemsSold += order.items.reduce((sum, item) => sum + item.quantity, 0);
//       periodMap[dateKey].revenue += orderRevenue;
//       periodMap[dateKey].cost += orderCost;
//       periodMap[dateKey].profit += orderProfit;
      
//       return {
//         ...order.toObject(),
//         orderRevenue,
//         orderCost,
//         orderProfit,
//         orderProfitMargin: orderRevenue > 0 ? (orderProfit / orderRevenue) * 100 : 0,
//         items: orderItems
//       };
//     });
    
//     // Calculate product profit margins
//     const productProfitDetails = Object.values(productProfitMap).map(p => {
//       const profitMargin = p.totalRevenue > 0 ? (p.totalProfit / p.totalRevenue) * 100 : 0;
//       return {
//         ...p,
//         profitMargin: profitMargin.toFixed(2),
//         totalRevenue: parseFloat(p.totalRevenue.toFixed(2)),
//         totalCost: parseFloat(p.totalCost.toFixed(2)),
//         totalProfit: parseFloat(p.totalProfit.toFixed(2)),
//         averageSellingPrice: parseFloat(p.averageSellingPrice.toFixed(2)),
//         averageBuyingPrice: parseFloat(p.averageBuyingPrice.toFixed(2))
//       };
//     });
    
//     // Calculate period summary
//     const periodSummary = Object.values(periodMap).map(p => {
//       const profitMargin = p.revenue > 0 ? (p.profit / p.revenue) * 100 : 0;
//       return {
//         date: p.date,
//         orders: p.orders,
//         itemsSold: p.itemsSold,
//         revenue: parseFloat(p.revenue.toFixed(2)),
//         cost: parseFloat(p.cost.toFixed(2)),
//         profit: parseFloat(p.profit.toFixed(2)),
//         profitMargin: parseFloat(profitMargin.toFixed(2))
//       };
//     }).sort((a, b) => a.date.localeCompare(b.date));
    
//     // Summary
//     const averageProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    
//     res.json({
//       success: true,
//       data: {
//         summary: {
//           totalOrders: orders.length,
//           totalRevenue: parseFloat(totalRevenue.toFixed(2)),
//           totalCost: parseFloat(totalCost.toFixed(2)),
//           totalProfit: parseFloat(totalProfit.toFixed(2)),
//           averageProfitMargin: parseFloat(averageProfitMargin.toFixed(2))
//         },
//         productProfitDetails: productProfitDetails.sort((a, b) => b.totalProfit - a.totalProfit),
//         periodSummary: periodSummary,
//         orders: processedOrders
//       }
//     });
    
//   } catch (error) {
//     console.error('Get profit margin error:', error);
//     res.status(500).json({ 
//       success: false, 
//       error: error.message || 'Failed to calculate profit margin' 
//     });
//   }
// };

// // ============================================================
// // GET PRODUCT PROFIT MARGIN
// // @route   GET /api/orders/admin/product-profit/:productId
// // @access  Private (Admin/Moderator/Super Admin)
// // ============================================================
// const getProductProfitMargin = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { period = 'month' } = req.query;
    
//     const userRole = req.user?.role || 'admin';
    
//     if (!['super_admin', 'admin', 'moderator'].includes(userRole)) {
//       return res.status(403).json({ 
//         success: false, 
//         error: 'Unauthorized to view profit margin data' 
//       });
//     }
    
//     // Build date filter
//     let dateFilter = {};
//     const now = new Date();
    
//     switch (period) {
//       case 'today':
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         dateFilter = { createdAt: { $gte: today } };
//         break;
//       case 'week':
//         const weekStart = new Date(now);
//         weekStart.setDate(now.getDate() - 7);
//         dateFilter = { createdAt: { $gte: weekStart } };
//         break;
//       case 'month':
//         const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//         dateFilter = { createdAt: { $gte: monthStart } };
//         break;
//       case 'year':
//         const yearStart = new Date(now.getFullYear(), 0, 1);
//         dateFilter = { createdAt: { $gte: yearStart } };
//         break;
//       default:
//         dateFilter = {};
//     }
    
//     const query = {
//       orderStatus: 'delivered',
//       paymentStatus: 'paid',
//       'items.productId': productId,
//       ...dateFilter
//     };
    
//     const orders = await Order.find(query);
    
//     if (!orders || orders.length === 0) {
//       return res.json({
//         success: true,
//         data: {
//           totalOrders: 0,
//           totalQuantity: 0,
//           totalRevenue: 0,
//           totalCost: 0,
//           totalProfit: 0,
//           profitMargin: 0,
//           orders: []
//         }
//       });
//     }
    
//     let totalQuantity = 0;
//     let totalRevenue = 0;
//     let totalCost = 0;
//     let totalProfit = 0;
    
//     const orderDetails = orders.map(order => {
//       let orderQuantity = 0;
//       let orderRevenue = 0;
//       let orderCost = 0;
//       let orderProfit = 0;
      
//       order.items.forEach(item => {
//         if (item.productId.toString() === productId) {
//           const sellingPrice = item.discountPrice && item.discountPrice > 0 
//             ? item.discountPrice 
//             : item.regularPrice;
          
//           let costPerItem = 0;
//           if (item.productId && typeof item.productId === 'object') {
//             costPerItem = item.productId.costPerItem || item.productId.buyingPrice || 0;
//           }
          
//           const revenue = sellingPrice * item.quantity;
//           const cost = costPerItem * item.quantity;
//           const profit = revenue - cost;
          
//           orderQuantity += item.quantity;
//           orderRevenue += revenue;
//           orderCost += cost;
//           orderProfit += profit;
//         }
//       });
      
//       totalQuantity += orderQuantity;
//       totalRevenue += orderRevenue;
//       totalCost += orderCost;
//       totalProfit += orderProfit;
      
//       return {
//         orderId: order._id,
//         orderNumber: order.orderNumber,
//         date: order.createdAt,
//         quantity: orderQuantity,
//         revenue: parseFloat(orderRevenue.toFixed(2)),
//         cost: parseFloat(orderCost.toFixed(2)),
//         profit: parseFloat(orderProfit.toFixed(2)),
//         profitMargin: orderRevenue > 0 ? parseFloat(((orderProfit / orderRevenue) * 100).toFixed(2)) : 0
//       };
//     });
    
//     const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    
//     res.json({
//       success: true,
//       data: {
//         productId,
//         totalOrders: orders.length,
//         totalQuantity,
//         totalRevenue: parseFloat(totalRevenue.toFixed(2)),
//         totalCost: parseFloat(totalCost.toFixed(2)),
//         totalProfit: parseFloat(totalProfit.toFixed(2)),
//         profitMargin: parseFloat(profitMargin.toFixed(2)),
//         orders: orderDetails
//       }
//     });
    
//   } catch (error) {
//     console.error('Get product profit margin error:', error);
//     res.status(500).json({ 
//       success: false, 
//       error: error.message || 'Failed to get product profit margin' 
//     });
//   }
// };

// module.exports = {
//   getProfitMarginData,
//   getProductProfitMargin
// };


const Order = require('../models/Order');
const Product = require('../models/Product');

// ============================================================
// HELPER: Calculate profit for a single order item
// ============================================================
const calculateItemProfit = (item) => {
  // Selling price = discountPrice if exists, else regularPrice
  const sellingPrice = item.discountPrice && item.discountPrice > 0 
    ? item.discountPrice 
    : item.regularPrice;
  
  // Revenue = selling price × quantity
  const revenue = sellingPrice * item.quantity;
  
  // Cost = costPerItem × quantity (get from product if not in order item)
  const costPerItem = item.costPerItem || item.buyingPrice || 0;
  const cost = costPerItem * item.quantity;
  
  // Profit = Revenue - Cost
  const profit = revenue - cost;
  
  // Profit Margin = (Profit / Revenue) × 100
  const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
  
  return {
    sellingPrice,
    revenue,
    cost,
    profit,
    profitMargin
  };
};

// ============================================================
// GET PROFIT MARGIN DATA - FIXED
// @route   GET /api/orders/admin/profit-margin
// @access  Private (Admin/Moderator/Super Admin)
// ============================================================
const getProfitMarginData = async (req, res) => {
  try {
    const { 
      period = 'month', 
      startDate,
      endDate,
      limit = 100
    } = req.query;
    
    const userRole = req.user?.role || 'admin';
    
    // ============================================
    // ✅ FIX: Build date filter properly
    // ============================================
    let dateFilter = {};
    const now = new Date();
    
    if (startDate && endDate) {
      // For custom date ranges
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      dateFilter = {
        createdAt: {
          $gte: start,
          $lte: end
        }
      };
      
      console.log(`📅 Custom date filter: ${start.toISOString()} to ${end.toISOString()}`);
    } else {
      switch (period) {
        case 'today': {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayEnd = new Date(today);
          todayEnd.setHours(23, 59, 59, 999);
          dateFilter = { createdAt: { $gte: today, $lte: todayEnd } };
          break;
        }
        case 'week': {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - 7);
          weekStart.setHours(0, 0, 0, 0);
          const weekEnd = new Date(now);
          weekEnd.setHours(23, 59, 59, 999);
          dateFilter = { createdAt: { $gte: weekStart, $lte: weekEnd } };
          break;
        }
        case 'month': {
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          monthStart.setHours(0, 0, 0, 0);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          monthEnd.setHours(23, 59, 59, 999);
          dateFilter = { createdAt: { $gte: monthStart, $lte: monthEnd } };
          break;
        }
        case 'year': {
          const yearStart = new Date(now.getFullYear(), 0, 1);
          yearStart.setHours(0, 0, 0, 0);
          const yearEnd = new Date(now.getFullYear(), 11, 31);
          yearEnd.setHours(23, 59, 59, 999);
          dateFilter = { createdAt: { $gte: yearStart, $lte: yearEnd } };
          break;
        }
        case 'all':
        default:
          dateFilter = {};
      }
    }
    
    // Build query - ONLY delivered and paid orders
    const query = {
      orderStatus: 'delivered',
      paymentStatus: 'paid',
      ...dateFilter
    };
    
    // If user is not super_admin/admin/moderator, restrict access
    if (!['super_admin', 'admin', 'moderator'].includes(userRole)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized to view profit margin data' 
      });
    }
    
    console.log('🔍 Profit Margin Query:', JSON.stringify(query, null, 2));
    
    // Fetch orders
    const orders = await Order.find(query)
      .populate('items.productId', 'costPerItem buyingPrice productName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    if (!orders || orders.length === 0) {
      return res.json({
        success: true,
        data: {
          summary: {
            totalOrders: 0,
            totalRevenue: 0,
            totalCost: 0,
            totalProfit: 0,
            averageProfitMargin: 0
          },
          productProfitDetails: [],
          periodSummary: [],
          orders: []
        }
      });
    }
    
    // ============================================================
    // CALCULATE PROFIT FOR EACH ORDER
    // ============================================================
    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;
    
    // Product profit aggregation
    const productProfitMap = {};
    
    // Period summary (daily)
    const periodMap = {};
    
    const processedOrders = orders.map(order => {
      let orderRevenue = 0;
      let orderCost = 0;
      let orderProfit = 0;
      
      const orderItems = order.items.map(item => {
        // Get selling price
        const sellingPrice = item.discountPrice && item.discountPrice > 0 
          ? item.discountPrice 
          : item.regularPrice;
        
        // Get cost per item from product or order item
        let costPerItem = 0;
        if (item.productId && typeof item.productId === 'object') {
          costPerItem = item.productId.costPerItem || item.productId.buyingPrice || 0;
        } else {
          costPerItem = 0;
        }
        
        if (costPerItem === 0 && item.costPerItem) {
          costPerItem = item.costPerItem;
        }
        
        const revenue = sellingPrice * item.quantity;
        const cost = costPerItem * item.quantity;
        const profit = revenue - cost;
        const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
        
        orderRevenue += revenue;
        orderCost += cost;
        orderProfit += profit;
        
        // Aggregate by product
        const productId = item.productId?._id || item.productId?.toString() || 'unknown';
        const productName = item.productName || 'Unknown Product';
        const productImage = item.image || '';
        
        if (!productProfitMap[productId]) {
          productProfitMap[productId] = {
            productId: productId,
            productName: productName,
            image: productImage,
            totalQuantity: 0,
            totalRevenue: 0,
            totalCost: 0,
            totalProfit: 0,
            profitMargin: 0,
            averageSellingPrice: 0,
            averageBuyingPrice: 0,
            costPerItem: costPerItem
          };
        }
        
        productProfitMap[productId].totalQuantity += item.quantity;
        productProfitMap[productId].totalRevenue += revenue;
        productProfitMap[productId].totalCost += cost;
        productProfitMap[productId].totalProfit += profit;
        productProfitMap[productId].averageSellingPrice = 
          productProfitMap[productId].totalRevenue / productProfitMap[productId].totalQuantity;
        productProfitMap[productId].averageBuyingPrice = costPerItem;
        
        return {
          ...item.toObject(),
          sellingPrice,
          costPerItem,
          revenue,
          cost,
          profit,
          profitMargin
        };
      });
      
      totalRevenue += orderRevenue;
      totalCost += orderCost;
      totalProfit += orderProfit;
      
      // Period summary (by day)
      const dateKey = order.createdAt.toISOString().split('T')[0];
      if (!periodMap[dateKey]) {
        periodMap[dateKey] = {
          date: dateKey,
          orders: 0,
          itemsSold: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
          profitMargin: 0
        };
      }
      periodMap[dateKey].orders += 1;
      periodMap[dateKey].itemsSold += order.items.reduce((sum, item) => sum + item.quantity, 0);
      periodMap[dateKey].revenue += orderRevenue;
      periodMap[dateKey].cost += orderCost;
      periodMap[dateKey].profit += orderProfit;
      
      return {
        ...order.toObject(),
        orderRevenue,
        orderCost,
        orderProfit,
        orderProfitMargin: orderRevenue > 0 ? (orderProfit / orderRevenue) * 100 : 0,
        items: orderItems
      };
    });
    
    // Calculate product profit margins
    const productProfitDetails = Object.values(productProfitMap).map(p => {
      const profitMargin = p.totalRevenue > 0 ? (p.totalProfit / p.totalRevenue) * 100 : 0;
      return {
        ...p,
        profitMargin: profitMargin.toFixed(2),
        totalRevenue: parseFloat(p.totalRevenue.toFixed(2)),
        totalCost: parseFloat(p.totalCost.toFixed(2)),
        totalProfit: parseFloat(p.totalProfit.toFixed(2)),
        averageSellingPrice: parseFloat(p.averageSellingPrice.toFixed(2)),
        averageBuyingPrice: parseFloat(p.averageBuyingPrice.toFixed(2))
      };
    });
    
    // Calculate period summary
    const periodSummary = Object.values(periodMap).map(p => {
      const profitMargin = p.revenue > 0 ? (p.profit / p.revenue) * 100 : 0;
      return {
        date: p.date,
        orders: p.orders,
        itemsSold: p.itemsSold,
        revenue: parseFloat(p.revenue.toFixed(2)),
        cost: parseFloat(p.cost.toFixed(2)),
        profit: parseFloat(p.profit.toFixed(2)),
        profitMargin: parseFloat(profitMargin.toFixed(2))
      };
    }).sort((a, b) => a.date.localeCompare(b.date));
    
    // Summary
    const averageProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    
    res.json({
      success: true,
      data: {
        summary: {
          totalOrders: orders.length,
          totalRevenue: parseFloat(totalRevenue.toFixed(2)),
          totalCost: parseFloat(totalCost.toFixed(2)),
          totalProfit: parseFloat(totalProfit.toFixed(2)),
          averageProfitMargin: parseFloat(averageProfitMargin.toFixed(2))
        },
        productProfitDetails: productProfitDetails.sort((a, b) => b.totalProfit - a.totalProfit),
        periodSummary: periodSummary,
        orders: processedOrders
      }
    });
    
  } catch (error) {
    console.error('Get profit margin error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to calculate profit margin' 
    });
  }
};

// ============================================================
// GET PRODUCT PROFIT MARGIN
// @route   GET /api/orders/admin/product-profit/:productId
// @access  Private (Admin/Moderator/Super Admin)
// ============================================================
const getProductProfitMargin = async (req, res) => {
  try {
    const { productId } = req.params;
    const { period = 'month', startDate, endDate } = req.query;
    
    const userRole = req.user?.role || 'admin';
    
    if (!['super_admin', 'admin', 'moderator'].includes(userRole)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized to view profit margin data' 
      });
    }
    
    // Build date filter
    let dateFilter = {};
    const now = new Date();
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter = { createdAt: { $gte: start, $lte: end } };
    } else {
      switch (period) {
        case 'today': {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayEnd = new Date(today);
          todayEnd.setHours(23, 59, 59, 999);
          dateFilter = { createdAt: { $gte: today, $lte: todayEnd } };
          break;
        }
        case 'week': {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - 7);
          weekStart.setHours(0, 0, 0, 0);
          const weekEnd = new Date(now);
          weekEnd.setHours(23, 59, 59, 999);
          dateFilter = { createdAt: { $gte: weekStart, $lte: weekEnd } };
          break;
        }
        case 'month': {
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          monthStart.setHours(0, 0, 0, 0);
          const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          monthEnd.setHours(23, 59, 59, 999);
          dateFilter = { createdAt: { $gte: monthStart, $lte: monthEnd } };
          break;
        }
        case 'year': {
          const yearStart = new Date(now.getFullYear(), 0, 1);
          yearStart.setHours(0, 0, 0, 0);
          const yearEnd = new Date(now.getFullYear(), 11, 31);
          yearEnd.setHours(23, 59, 59, 999);
          dateFilter = { createdAt: { $gte: yearStart, $lte: yearEnd } };
          break;
        }
        default:
          dateFilter = {};
      }
    }
    
    const query = {
      orderStatus: 'delivered',
      paymentStatus: 'paid',
      'items.productId': productId,
      ...dateFilter
    };
    
    const orders = await Order.find(query);
    
    if (!orders || orders.length === 0) {
      return res.json({
        success: true,
        data: {
          totalOrders: 0,
          totalQuantity: 0,
          totalRevenue: 0,
          totalCost: 0,
          totalProfit: 0,
          profitMargin: 0,
          orders: []
        }
      });
    }
    
    let totalQuantity = 0;
    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;
    
    const orderDetails = orders.map(order => {
      let orderQuantity = 0;
      let orderRevenue = 0;
      let orderCost = 0;
      let orderProfit = 0;
      
      order.items.forEach(item => {
        if (item.productId.toString() === productId) {
          const sellingPrice = item.discountPrice && item.discountPrice > 0 
            ? item.discountPrice 
            : item.regularPrice;
          
          let costPerItem = 0;
          if (item.productId && typeof item.productId === 'object') {
            costPerItem = item.productId.costPerItem || item.productId.buyingPrice || 0;
          }
          
          const revenue = sellingPrice * item.quantity;
          const cost = costPerItem * item.quantity;
          const profit = revenue - cost;
          
          orderQuantity += item.quantity;
          orderRevenue += revenue;
          orderCost += cost;
          orderProfit += profit;
        }
      });
      
      totalQuantity += orderQuantity;
      totalRevenue += orderRevenue;
      totalCost += orderCost;
      totalProfit += orderProfit;
      
      return {
        orderId: order._id,
        orderNumber: order.orderNumber,
        date: order.createdAt,
        quantity: orderQuantity,
        revenue: parseFloat(orderRevenue.toFixed(2)),
        cost: parseFloat(orderCost.toFixed(2)),
        profit: parseFloat(orderProfit.toFixed(2)),
        profitMargin: orderRevenue > 0 ? parseFloat(((orderProfit / orderRevenue) * 100).toFixed(2)) : 0
      };
    });
    
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    
    res.json({
      success: true,
      data: {
        productId,
        totalOrders: orders.length,
        totalQuantity,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalCost: parseFloat(totalCost.toFixed(2)),
        totalProfit: parseFloat(totalProfit.toFixed(2)),
        profitMargin: parseFloat(profitMargin.toFixed(2)),
        orders: orderDetails
      }
    });
    
  } catch (error) {
    console.error('Get product profit margin error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to get product profit margin' 
    });
  }
};

module.exports = {
  getProfitMarginData,
  getProductProfitMargin
};