
// // utils/orderEmailService.js
// const nodemailer = require('nodemailer');
// const fs = require('fs');
// const path = require('path');
// const { generateInvoicePDF } = require('./pdfGenerator');

// // Create transporter using environment variables
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT) || 465,
//   secure: true,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: false
//   }
// });

// // Verify connection
// transporter.verify((error, success) => {
//   if (error) {
//     console.error('❌ Order Email Service - Configuration error:', error.message);
//   } else {
//     console.log('✅ Order Email Service is ready');
//     console.log(`📧 Using account: ${process.env.SMTP_USER}`);
//   }
// });

// // BeautyBucket Brand Colors
// const BRAND_COLORS = {
//   primary: '#EE4275',        // Pink
//   primaryLight: '#FFF5F6',   // Light Pink
//   primaryDark: '#CC3355',    // Dark Pink
//   white: '#FFFFFF',          // White
//   black: '#2D1B2E',          // Dark
//   text: '#2D1B2E',           // Dark
//   textLight: '#8B7A8C',      // Light Text
//   textMuted: '#C4B5C5',      // Muted
//   border: '#FFD2DB',         // Pink Border
//   lightBg: '#FFF5F6',        // Light Pink BG
//   success: '#4CAF50',        // Green
//   error: '#F44336',          // Red
//   warning: '#FFC107'         // Yellow
// };

// /**
//  * Format currency (BDT)
//  */
// const formatPrice = (price) => {
//   const numPrice = parseFloat(price) || 0;
//   return `৳${numPrice.toFixed(2)}`;
// };

// /**
//  * Format date
//  */
// const formatDate = (dateString) => {
//   if (!dateString) return 'N/A';
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return 'N/A';
//     return date.toLocaleDateString('en-BD', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   } catch (e) {
//     return 'N/A';
//   }
// };

// /**
//  * Get status badge color
//  */
// const getStatusColor = (status) => {
//   const statusColors = {
//     'placed': '#EE4275',
//     'confirmed': '#EE4275',
//     'processing': '#EE4275',
//     'shipped': '#EE4275',
//     'delivered': '#4CAF50',
//     'cancelled': '#F44336'
//   };
//   return statusColors[status] || '#EE4275';
// };

// const getPaymentStatusColor = (status) => {
//   const statusColors = {
//     'pending': '#FFC107',
//     'paid': '#4CAF50',
//     'failed': '#F44336',
//     'refunded': '#8B7A8C'
//   };
//   return statusColors[status] || '#EE4275';
// };

// /**
//  * Generate order items HTML with unit
//  */
// const generateOrderItemsHTML = (items) => {
//   if (!items || items.length === 0) return '<p style="color: #8B7A8C;">No items found</p>';
  
//   let html = `
//     <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
//       <thead>
//         <tr style="background: #FFF5F6; border-bottom: 2px solid #FFD2DB;">
//           <th style="padding: 12px; text-align: left; font-weight: 600; color: #2D1B2E; font-size: 13px;">Product</th>
//           <th style="padding: 12px; text-align: center; font-weight: 600; color: #2D1B2E; font-size: 13px;">Qty</th>
//           <th style="padding: 12px; text-align: center; font-weight: 600; color: #2D1B2E; font-size: 13px;">Unit</th>
//           <th style="padding: 12px; text-align: right; font-weight: 600; color: #2D1B2E; font-size: 13px;">Price</th>
//           <th style="padding: 12px; text-align: right; font-weight: 600; color: #2D1B2E; font-size: 13px;">Total</th>
//         </tr>
//       </thead>
//       <tbody>
//   `;
  
//   items.forEach((item) => {
//     const price = item.discountPrice > 0 ? item.discountPrice : item.regularPrice;
//     const totalPrice = price * item.quantity;
//     const unit = item.unit || 'pcs';
    
//     const imageUrl = item.image && item.image.startsWith('http') 
//       ? item.image 
//       : (item.image ? `http://localhost:5000${item.image}` : 'https://via.placeholder.com/60/FFD2DB/EE4275?text=BB');
    
//     html += `
//       <tr style="border-bottom: 1px solid #FFD2DB;">
//         <td style="padding: 15px 12px;">
//           <div style="display: flex; align-items: center; gap: 15px;">
//             <img src="${imageUrl}" alt="${item.productName}" 
//                  style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #FFD2DB;">
//             <div>
//               <strong style="color: #2D1B2E; font-size: 14px;">${item.productName}</strong>
//               ${item.discountPrice > 0 ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #EE4275;">🎉 Sale Price Applied</p>` : ''}
//             </div>
//           </div>
//         </td>
//         <td style="padding: 15px 12px; text-align: center; font-size: 14px; color: #2D1B2E;">${item.quantity}</td>
//         <td style="padding: 15px 12px; text-align: center; font-size: 13px; color: #8B7A8C;">${unit}</td>
//         <td style="padding: 15px 12px; text-align: right; font-size: 14px; color: #2D1B2E;">${formatPrice(price)}</td>
//         <td style="padding: 15px 12px; text-align: right; font-weight: 600; color: #EE4275; font-size: 14px;">${formatPrice(totalPrice)}</td>
//       </tr>
//     `;
//   });
  
//   html += `
//       </tbody>
//     </table>
//   `;
  
//   return html;
// };

// /**
//  * Generate order summary HTML
//  */
// const generateOrderSummaryHTML = (order) => {
//   const statusColor = getStatusColor(order.orderStatus);
//   const paymentStatusColor = getPaymentStatusColor(order.paymentStatus);
  
//   return `
//     <div style="background: #FFF5F6; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #FFD2DB;">
//       <h2 style="margin: 0 0 15px 0; color: #2D1B2E; font-size: 18px; font-weight: 700;">Order Summary</h2>
//       <table style="width: 100%; border-collapse: collapse;">
//         <tr>
//           <td style="padding: 8px 0; width: 140px; color: #8B7A8C;"><strong>Order ID:</strong></td>
//           <td style="color: #EE4275; font-weight: 600;">${order.orderNumber || order._id.slice(-8).toUpperCase()}</td>
//         </tr>
//         <tr>
//           <td style="padding: 8px 0; color: #8B7A8C;"><strong>Order Date:</strong></td>
//           <td style="color: #2D1B2E;">${formatDate(order.createdAt)}</td>
//         </tr>
//         <tr>
//           <td style="padding: 8px 0; color: #8B7A8C;"><strong>Order Status:</strong></td>
//           <td><span style="display: inline-block; padding: 4px 12px; background: ${statusColor}20; color: ${statusColor}; border-radius: 20px; font-size: 12px; font-weight: 600;">${order.orderStatus.toUpperCase()}</span></td>
//         </tr>
//         <tr>
//           <td style="padding: 8px 0; color: #8B7A8C;"><strong>Payment Status:</strong></td>
//           <td><span style="display: inline-block; padding: 4px 12px; background: ${paymentStatusColor}20; color: ${paymentStatusColor}; border-radius: 20px; font-size: 12px; font-weight: 600;">${order.paymentStatus.toUpperCase()}</span></td>
//         </tr>
//         <tr>
//           <td style="padding: 8px 0; color: #8B7A8C;"><strong>Payment Method:</strong></td>
//           <td style="color: #2D1B2E;">${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</td>
//         </tr>
//         ${order.paymentMethod === 'cod' ? `
//         <tr>
//           <td style="padding: 8px 0; color: #8B7A8C;"><strong>Payment Due:</strong></td>
//           <td style="color: #2D1B2E;">Pay when you receive your order</td>
//         </tr>
//         ` : ''}
//       </table>
//     </div>
//   `;
// };

// /**
//  * Generate pricing breakdown HTML
//  */
// const generatePricingHTML = (order) => {
//   return `
//     <div style="background: #FFF5F6; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #FFD2DB;">
//       <h2 style="margin: 0 0 15px 0; color: #2D1B2E; font-size: 18px; font-weight: 700;">Price Breakdown</h2>
//       <table style="width: 100%; border-collapse: collapse;">
//         <tr>
//           <td style="padding: 8px 0; color: #8B7A8C;"><strong>Subtotal:</strong></td>
//           <td style="text-align: right; color: #2D1B2E;">${formatPrice(order.subtotal)}</td>
//         </tr>
//         <tr>
//           <td style="padding: 8px 0; color: #8B7A8C;"><strong>Shipping:</strong></td>
//           <td style="text-align: right; color: #2D1B2E;">${formatPrice(order.shippingCost)}</td>
//         </tr>
//         ${order.discount > 0 ? `
//         <tr>
//           <td style="padding: 8px 0; color: #4CAF50;"><strong>Discount:</strong></td>
//           <td style="text-align: right; color: #4CAF50;">-${formatPrice(order.discount)}</td>
//         </tr>
//         ${order.couponCode ? `
//         <tr>
//           <td style="padding: 8px 0; color: #8B7A8C;"><strong>Coupon Applied:</strong></td>
//           <td style="text-align: right; color: #EE4275; font-weight: 600;">${order.couponCode}</td>
//         </tr>
//         ` : ''}
//         ` : ''}
//         <tr style="border-top: 2px solid #FFD2DB; margin-top: 10px;">
//           <td style="padding: 12px 0 0 0; font-size: 18px; font-weight: bold; color: #2D1B2E;"><strong>Total:</strong></td>
//           <td style="padding: 12px 0 0 0; text-align: right; font-size: 20px; font-weight: bold; color: #EE4275;">${formatPrice(order.total)}</td>
//         </tr>
//       </table>
//     </div>
//   `;
// };

// /**
//  * Generate customer info HTML
//  */
// const generateCustomerInfoHTML = (order) => {
//   return `
//     <div style="background: #FFF5F6; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #FFD2DB;">
//       <h2 style="margin: 0 0 15px 0; color: #2D1B2E; font-size: 18px; font-weight: 700;">Customer Information</h2>
//       <table style="width: 100%; border-collapse: collapse;">
//         <tr>
//           <td style="padding: 8px 0; width: 120px; color: #8B7A8C;"><strong>Name:</strong></td>
//           <td style="color: #2D1B2E;">${order.customerInfo?.fullName || 'N/A'}</td>
//         </tr>
//         <tr>
//           <td style="padding: 8px 0; color: #8B7A8C;"><strong>Email:</strong></td>
//           <td><a href="mailto:${order.customerInfo?.email}" style="color: #EE4275; text-decoration: none; font-weight: 600;">${order.customerInfo?.email}</a></td>
//         </tr>
//         <tr>
//           <td style="padding: 8px 0; color: #8B7A8C;"><strong>Phone:</strong></td>
//           <td style="color: #2D1B2E;">${order.customerInfo?.phone || 'N/A'}</td>
//         </tr>
//         <tr>
//           <td style="padding: 8px 0; color: #8B7A8C;"><strong>Address:</strong></td>
//           <td style="color: #2D1B2E;">${order.customerInfo?.address || 'N/A'}</td>
//         </tr>
//         <tr>
//           <td style="padding: 8px 0; color: #8B7A8C;"><strong>Division:</strong></td>
//           <td style="color: #2D1B2E; font-weight: 600;">${order.customerInfo?.division || 'N/A'}</td>
//         </tr>
//         <tr>
//           <td style="padding: 8px 0; color: #8B7A8C;"><strong>City:</strong></td>
//           <td style="color: #2D1B2E;">${order.customerInfo?.city || 'N/A'}</td>
//         </tr>
//         <tr>
//           <td style="padding: 8px 0; color: #8B7A8C;"><strong>Upazila/Thana:</strong></td>
//           <td style="color: #2D1B2E;">${order.customerInfo?.zone || 'N/A'}</td>
//         </tr>
//         ${order.customerInfo?.area ? `
//         <tr>
//           <td style="padding: 8px 0; color: #8B7A8C;"><strong>Union/Area:</strong></td>
//           <td style="color: #2D1B2E;">${order.customerInfo.area}</td>
//         </tr>
//         ` : ''}
//         ${order.customerInfo?.note ? `
//         <tr>
//           <td style="padding: 8px 0; color: #8B7A8C;"><strong>Order Note:</strong></td>
//           <td style="color: #8B7A8C;">${order.customerInfo.note}</td>
//         </tr>
//         ` : ''}
//       </table>
//     </div>
//   `;
// };

// /**
//  * Generate delivery info HTML
//  */
// const generateDeliveryInfoHTML = (order) => {
//   const hasDeliveryNote = order.deliveryNote && order.deliveryNote.trim() !== '';
//   const hasTrackingNumber = order.trackingNumber && order.trackingNumber.trim() !== '';
//   const hasDeliveredDate = order.deliveredAt && order.orderStatus === 'delivered';
//   const hasCancellationReason = order.cancellationReason && order.cancellationReason.trim() !== '' && order.orderStatus === 'cancelled';
  
//   if (!hasDeliveryNote && !hasTrackingNumber && !hasDeliveredDate && !hasCancellationReason) {
//     return '';
//   }
  
//   let bgColor = '#FFF5F6';
//   let borderColor = '#EE4275';
//   let titleColor = '#2D1B2E';
//   let titleIcon = '📝';
  
//   if (order.orderStatus === 'delivered') {
//     bgColor = '#E8F5E9';
//     borderColor = '#4CAF50';
//     titleColor = '#4CAF50';
//     titleIcon = '✅';
//   } else if (order.orderStatus === 'shipped') {
//     bgColor = '#FFF5F6';
//     borderColor = '#EE4275';
//     titleColor = '#EE4275';
//     titleIcon = '🚚';
//   } else if (order.orderStatus === 'cancelled') {
//     bgColor = '#FFEBEE';
//     borderColor = '#F44336';
//     titleColor = '#F44336';
//     titleIcon = '❌';
//   }
  
//   return `
//     <div style="background: ${bgColor}; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${borderColor}; border: 1px solid ${borderColor}30;">
//       <h2 style="margin: 0 0 15px 0; color: ${titleColor}; font-size: 18px; display: flex; align-items: center; gap: 8px; font-weight: 700;">
//         <span>${titleIcon}</span> <span>${order.orderStatus === 'cancelled' ? 'Cancellation Information' : 'Delivery Information'}</span>
//       </h2>
//       <table style="width: 100%; border-collapse: collapse;">
//         ${hasCancellationReason ? `
//         <tr>
//           <td style="padding: 8px 0; width: 140px; color: #8B7A8C;"><strong>Cancellation Reason:</strong></td>
//           <td><div style="background: #FFFFFF; padding: 12px; border-radius: 8px; margin-top: 5px; color: #F44336; border: 1px solid #FFD2DB;">${order.cancellationReason}</div></td>
//         </tr>
//         ` : ''}
//         ${hasDeliveredDate ? `
//         <tr>
//           <td style="padding: 8px 0; width: 140px; color: #8B7A8C;"><strong>Delivered Date:</strong></td>
//           <td style="color: #2D1B2E;">${formatDate(order.deliveredAt)}</td>
//         </tr>
//         ` : ''}
//         ${hasTrackingNumber ? `
//         <tr>
//           <td style="padding: 8px 0; color: #8B7A8C;"><strong>Tracking Number:</strong></td>
//           <td><code style="background: #FFFFFF; padding: 4px 8px; border-radius: 4px; color: #EE4275; border: 1px solid #FFD2DB; font-weight: 600;">${order.trackingNumber}</code></td>
//         </tr>
//         ` : ''}
//         ${hasDeliveryNote ? `
//         <tr>
//           <td style="padding: 8px 0; color: #8B7A8C;"><strong>Delivery Note:</strong></td>
//           <td><div style="background: #FFFFFF; padding: 12px; border-radius: 8px; margin-top: 5px; color: #2D1B2E; border: 1px solid #FFD2DB;">${order.deliveryNote}</div></td>
//         </tr>
//         ` : ''}
//       </table>
//     </div>
//   `;
// };

// /**
//  * Send order placed email to customer with invoice attachment
//  */
// /**
//  * Send order placed email to customer with invoice attachment
//  */
// const sendOrderPlacedEmail = async (order, customerEmail) => {
//   console.log('📧 Sending order placed email to customer...');
  
//   try {
//     if (!customerEmail) {
//       throw new Error('Customer email is missing');
//     }

//     const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
//     const itemsHTML = generateOrderItemsHTML(order.items);
//     const summaryHTML = generateOrderSummaryHTML(order);
//     const pricingHTML = generatePricingHTML(order);
//     const customerInfoHTML = generateCustomerInfoHTML(order);
//     const deliveryInfoHTML = generateDeliveryInfoHTML(order);

//     // Generate PDF invoice and get buffer directly
//   // Generate PDF invoice and get buffer directly
// let pdfBuffer = null;
// try {
//   console.log('📄 Generating PDF invoice for order:', order.orderNumber);
//   console.log('Order data for PDF:', {
//     id: order._id,
//     orderNumber: order.orderNumber,
//     itemsCount: order.items?.length || 0,
//     total: order.total
//   });
  
//   const pdfResult = await generateInvoicePDF(order);
//   console.log('PDF Result:', pdfResult ? 'Success' : 'No result');
  
//   if (pdfResult && pdfResult.buffer) {
//     pdfBuffer = pdfResult.buffer;
//     console.log('✅ PDF generated successfully, size:', pdfBuffer.length, 'bytes');
//   } else {
//     console.warn('⚠️ PDF generation returned no buffer');
//   }
// } catch (pdfError) {
//   console.error('❌ PDF generation error:', pdfError.message);
//   console.error('PDF error stack:', pdfError.stack);
//   // Continue without attachment if PDF fails
// }

//     // Determine header based on order status
//     const statusHeaderMap = {
//       'placed': { emoji: '📦', title: 'Order Placed!', message: 'Your beauty order has been received successfully' },
//       'confirmed': { emoji: '✅', title: 'Order Confirmed!', message: 'Your beauty order has been confirmed' },
//       'processing': { emoji: '⚙️', title: 'Order Processing!', message: 'Your beauty order is being processed' },
//       'shipped': { emoji: '🚚', title: 'Order Shipped!', message: 'Your beauty order has been shipped' },
//       'delivered': { emoji: '🎁', title: 'Order Delivered!', message: 'Your beauty order has been delivered' },
//       'cancelled': { emoji: '❌', title: 'Order Cancelled', message: 'Your beauty order has been cancelled' }
//     };

//     const headerInfo = statusHeaderMap[order.orderStatus] || statusHeaderMap['placed'];
//     const subjectStatus = order.orderStatus === 'placed' ? 'Placed' : 
//                          order.orderStatus === 'confirmed' ? 'Confirmed' :
//                          order.orderStatus === 'processing' ? 'Processing' :
//                          order.orderStatus === 'shipped' ? 'Shipped' :
//                          order.orderStatus === 'delivered' ? 'Delivered' : 'Placed';

//     const mailOptions = {
//       from: `"BeautyBucket" <${process.env.SMTP_USER}>`,
//       to: customerEmail,
//       subject: `${headerInfo.emoji} Order ${subjectStatus}! Order #${order.orderNumber || order._id.slice(-8).toUpperCase()} - BeautyBucket`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <style>
//             body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2D1B2E; margin: 0; padding: 0; background-color: #FFF5F6; }
//             .container { max-width: 700px; margin: 20px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(238, 66, 117, 0.1); border: 1px solid #FFD2DB; }
//             .header { background: linear-gradient(135deg, #EE4275, #FF6B9D); padding: 30px; text-align: center; }
//             .header h1 { color: #FFFFFF; margin: 0; font-size: 28px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 700; }
//             .header p { color: #FFFFFF; margin: 10px 0 0 0; opacity: 0.9; }
//             .content { padding: 35px 30px; }
//             .section-title { font-size: 18px; font-weight: 700; margin: 25px 0 15px 0; display: flex; align-items: center; gap: 8px; color: #2D1B2E; }
//             .button { background: linear-gradient(135deg, #EE4275, #FF6B9D); color: #FFFFFF; padding: 14px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; border: none; }
//             .button:hover { opacity: 0.9; }
//             .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #FFD2DB; text-align: center; }
//             p { color: #8B7A8C; }
//             strong { color: #2D1B2E; }
//             .status-badge { display: inline-block; padding: 6px 18px; background: #EE4275; color: #FFFFFF; border-radius: 20px; font-weight: 600; font-size: 13px; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>
//                 <span>${headerInfo.emoji}</span>
//                 <span>${headerInfo.title}</span>
//               </h1>
//               <p>${headerInfo.message}</p>
//             </div>
//             <div class="content">
//               <p style="margin-bottom: 15px; font-size: 16px;">Dear <strong>${order.customerInfo?.fullName || 'Valued Customer'}</strong>,</p>
//               <p style="margin-bottom: 25px; font-size: 16px; color: #2D1B2E;">
//                 ${order.orderStatus === 'placed' ? 'Thank you for your order! We have received your order and it is now pending confirmation. You will receive another email once your order is confirmed.' :
//                   order.orderStatus === 'confirmed' ? 'Great news! Your order has been confirmed and is being prepared for shipment.' :
//                   order.orderStatus === 'processing' ? 'Your order is now being processed. Our team is preparing your items for shipment.' :
//                   order.orderStatus === 'shipped' ? 'Your order has been shipped and is on its way to you!' :
//                   order.orderStatus === 'delivered' ? 'Your order has been delivered! We hope you love your new products.' :
//                   'Thank you for your order!'}
//               </p>
              
//               ${summaryHTML}
//               ${customerInfoHTML}
//               ${deliveryInfoHTML}
              
//               <div class="section-title">
//                 <span>🛍️</span>
//                 <span>Order Items</span>
//               </div>
//               ${itemsHTML}
              
//               ${pricingHTML}
              
//               <div style="margin: 35px 0 25px; text-align: center;">
//                 <a href="${frontendUrl}/customer/orders" class="button">Track Your Order</a>
//               </div>
              
//               <div class="footer">
//                 <p style="margin-bottom: 5px;">Best regards,</p>
//                 <p style="margin: 0; font-weight: bold; color: #EE4275;">BeautyBucket Team</p>
//                 <p style="font-size: 12px; color: #C4B5C5; margin-top: 15px;">Need help? Contact us at ${process.env.SMTP_USER}</p>
//                 <p style="font-size: 11px; color: #C4B5C5; margin-top: 5px;">❤️ Made with love for beauty</p>
//               </div>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     };

//     // Attach PDF if available
//     if (pdfBuffer) {
//       mailOptions.attachments = [{
//         filename: `Invoice_${order.orderNumber || order._id.slice(-8).toUpperCase()}.pdf`,
//         content: pdfBuffer,
//         contentType: 'application/pdf'
//       }];
//       console.log('📎 PDF attachment added to email');
//     } else {
//       console.warn('⚠️ No PDF attachment available for email');
//     }

//     const result = await transporter.sendMail(mailOptions);
    
//     console.log('✅ Order placed email sent:', result.messageId);
//     return { success: true };
//   } catch (error) {
//     console.error('❌ Order placed email error:', error.message);
//     return { success: false, error: error.message };
//   }
// };

// /**
//  * Send order notification email to admin (for new orders and status updates)
//  */
// const sendOrderNotificationToAdmin = async (order, eventType = 'new') => {
//   console.log('📧 Sending order notification email to admin...');
  
//   try {
//     const adminEmail = process.env.OWNER_EMAIL || process.env.SMTP_USER;
//     const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
//     const itemsHTML = generateOrderItemsHTML(order.items);
//     const summaryHTML = generateOrderSummaryHTML(order);
//     const pricingHTML = generatePricingHTML(order);
//     const customerInfoHTML = generateCustomerInfoHTML(order);
    
//     let headerTitle = '';
//     let headerEmoji = '';
//     let additionalMessage = '';
    
//     if (eventType === 'new') {
//       headerTitle = 'New Order Received!';
//       headerEmoji = '🛍️';
//       additionalMessage = 'A new beauty order has been placed and requires your attention.';
//     } else if (eventType === 'status_update') {
//       const statusInfo = {
//         'confirmed': { title: 'Order Confirmed', emoji: '✅' },
//         'processing': { title: 'Order Processing', emoji: '⚙️' },
//         'shipped': { title: 'Order Shipped', emoji: '🚚' },
//         'delivered': { title: 'Order Delivered', emoji: '📦' },
//         'cancelled': { title: 'Order Cancelled', emoji: '❌' }
//       };
//       const info = statusInfo[order.orderStatus] || { title: 'Order Updated', emoji: '📝' };
//       headerTitle = info.title;
//       headerEmoji = info.emoji;
//       additionalMessage = `Order status has been updated to "${order.orderStatus.toUpperCase()}".`;
//     } else if (eventType === 'payment_update') {
//       const paymentInfo = {
//         'paid': { title: 'Payment Received', emoji: '💰' },
//         'failed': { title: 'Payment Failed', emoji: '⚠️' },
//         'refunded': { title: 'Payment Refunded', emoji: '💸' }
//       };
//       const info = paymentInfo[order.paymentStatus] || { title: 'Payment Updated', emoji: '💳' };
//       headerTitle = info.title;
//       headerEmoji = info.emoji;
//       additionalMessage = `Payment status has been updated to "${order.paymentStatus.toUpperCase()}".`;
//     }
    
//     const result = await transporter.sendMail({
//       from: `"BeautyBucket System" <${process.env.SMTP_USER}>`,
//       to: adminEmail,
//       subject: `${headerEmoji} ${headerTitle} - Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <style>
//             body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2D1B2E; background-color: #FFF5F6; }
//             .container { max-width: 700px; margin: 20px auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(238, 66, 117, 0.1); border: 1px solid #FFD2DB; }
//             .header { background: linear-gradient(135deg, #EE4275, #FF6B9D); padding: 25px 30px; text-align: center; }
//             .header h1 { color: #FFFFFF; margin: 0; font-size: 24px; display: flex; align-items: center; justify-content: center; gap: 10px; font-weight: 700; }
//             .content { padding: 30px; }
//             .button { background: linear-gradient(135deg, #EE4275, #FF6B9D); color: #FFFFFF; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; border: none; }
//             .button:hover { opacity: 0.9; }
//             .section-title { font-size: 18px; font-weight: 700; margin: 25px 0 15px 0; color: #2D1B2E; }
//             p { color: #8B7A8C; }
//             strong { color: #2D1B2E; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>
//                 <span>${headerEmoji}</span>
//                 <span>${headerTitle}</span>
//               </h1>
//             </div>
//             <div class="content">
//               <p>${additionalMessage}</p>
              
//               ${customerInfoHTML}
//               ${summaryHTML}
              
//               <div class="section-title">🛍️ Order Items</div>
//               ${itemsHTML}
              
//               ${pricingHTML}
              
//               <div style="text-align: center; margin: 30px 0;">
//                 <a href="${frontendUrl}/admin/orders" class="button">View Order in Dashboard</a>
//               </div>
              
//               <div style="background: #FFF5F6; padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid #FFD2DB;">
//                 <p style="margin: 0; font-size: 14px; color: #EE4275;">💖 Please review and take necessary action.</p>
//               </div>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     });
    
//     console.log('✅ Admin order notification sent:', result.messageId);
//     return { success: true };
//   } catch (error) {
//     console.error('❌ Admin notification error:', error.message);
//     return { success: false, error: error.message };
//   }
// };

// /**
//  * Send order status update email to customer
//  */
// const sendOrderStatusUpdateEmail = async (order, customerEmail, oldStatus, newStatus) => {
//   console.log('📧 Sending order status update email with full details...');
  
//   try {
//     if (!customerEmail) {
//       throw new Error('Customer email is missing');
//     }
    
//     const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
//     const newStatusColor = getStatusColor(newStatus);
//     const itemsHTML = generateOrderItemsHTML(order.items);
//     const summaryHTML = generateOrderSummaryHTML(order);
//     const pricingHTML = generatePricingHTML(order);
//     const customerInfoHTML = generateCustomerInfoHTML(order);
//     const deliveryInfoHTML = generateDeliveryInfoHTML(order);
    
//     let statusTitle = '';
//     let statusMessage = '';
//     let statusEmoji = '';
    
//     switch(newStatus) {
//       case 'confirmed':
//         statusTitle = 'Order Confirmed!';
//         statusMessage = 'Great news! Your beauty order has been confirmed and is being prepared. Our team is working hard to pack your items carefully.';
//         statusEmoji = '✅';
//         break;
//       case 'processing':
//         statusTitle = 'Order Processing';
//         statusMessage = 'Your beauty order is now being processed. Our team is preparing your items for shipment.';
//         statusEmoji = '⚙️';
//         break;
//       case 'shipped':
//         statusTitle = 'Order Shipped!';
//         statusMessage = 'Your beauty order has been shipped and is on its way to you! Get ready to receive your wonderful products.';
//         statusEmoji = '🚚';
//         break;
//       case 'delivered':
//         statusTitle = 'Order Delivered!';
//         statusMessage = 'Your beauty order has been delivered! We hope you love your new products. Thank you for shopping with BeautyBucket!';
//         statusEmoji = '🎁';
//         break;
//       case 'cancelled':
//         statusTitle = 'Order Cancelled';
//         statusMessage = 'Your beauty order has been cancelled. If you have any questions, please contact our support team.';
//         statusEmoji = '❌';
//         break;
//       default:
//         statusTitle = `Order ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`;
//         statusMessage = `Your order status has been updated to ${newStatus}.`;
//         statusEmoji = '📝';
//     }
    
//     const result = await transporter.sendMail({
//       from: `"BeautyBucket" <${process.env.SMTP_USER}>`,
//       to: customerEmail,
//       subject: `${statusEmoji} ${statusTitle} - Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <style>
//             body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2D1B2E; margin: 0; padding: 0; background-color: #FFF5F6; }
//             .container { max-width: 700px; margin: 20px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(238, 66, 117, 0.1); border: 1px solid #FFD2DB; }
//             .header { background: linear-gradient(135deg, #EE4275, #FF6B9D); padding: 30px; text-align: center; }
//             .header h1 { color: #FFFFFF; margin: 0; font-size: 28px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 700; }
//             .header p { color: #FFFFFF; margin: 10px 0 0 0; opacity: 0.9; }
//             .content { padding: 35px 30px; }
//             .status-box { background: ${newStatusColor}10; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${newStatusColor}; border: 1px solid ${newStatusColor}30; }
//             .status-badge { display: inline-block; padding: 8px 24px; background: ${newStatusColor}; color: #FFFFFF; border-radius: 40px; font-weight: 600; text-transform: uppercase; font-size: 14px; }
//             .section-title { font-size: 18px; font-weight: 700; margin: 25px 0 15px 0; display: flex; align-items: center; gap: 8px; color: #2D1B2E; }
//             .button { background: linear-gradient(135deg, #EE4275, #FF6B9D); color: #FFFFFF; padding: 14px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; border: none; }
//             .button:hover { opacity: 0.9; }
//             .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #FFD2DB; text-align: center; }
//             p { color: #8B7A8C; }
//             strong { color: #2D1B2E; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>
//                 <span>${statusEmoji}</span>
//                 <span>${statusTitle}</span>
//               </h1>
//               <p>Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}</p>
//             </div>
//             <div class="content">
//               <p style="margin-bottom: 25px; font-size: 16px;">Dear <strong>${order.customerInfo?.fullName || 'Valued Customer'}</strong>,</p>
              
//               <div class="status-box">
//                 <div class="status-badge">${newStatus.toUpperCase()}</div>
//                 <p style="margin: 15px 0 0 0;">${statusMessage}</p>
//               </div>
              
//               ${summaryHTML}
//               ${customerInfoHTML}
//               ${deliveryInfoHTML}
              
//               <div class="section-title">
//                 <span>🛍️</span>
//                 <span>Order Items</span>
//               </div>
//               ${itemsHTML}
              
//               ${pricingHTML}
              
//               <div style="margin: 35px 0 25px; text-align: center;">
//                 <a href="${frontendUrl}/customer/orders" class="button">View Order Details</a>
//               </div>
              
//               <div class="footer">
//                 <p style="margin-bottom: 5px;">Best regards,</p>
//                 <p style="margin: 0; font-weight: bold; color: #EE4275;">BeautyBucket Team</p>
//                 <p style="font-size: 12px; color: #C4B5C5; margin-top: 15px;">Need help? Contact us at ${process.env.SMTP_USER}</p>
//                 <p style="font-size: 11px; color: #C4B5C5; margin-top: 5px;">❤️ Made with love for beauty</p>
//               </div>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     });
    
//     console.log('✅ Order status update email sent:', result.messageId);
//     return { success: true };
//   } catch (error) {
//     console.error('❌ Status update email error:', error.message);
//     return { success: false, error: error.message };
//   }
// };

// /**
//  * Send payment status update email to customer
//  */
// const sendPaymentStatusUpdateEmail = async (order, customerEmail, oldStatus, newStatus) => {
//   console.log('📧 Sending payment status update email...');
  
//   try {
//     if (!customerEmail) {
//       throw new Error('Customer email is missing');
//     }
    
//     const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
//     const itemsHTML = generateOrderItemsHTML(order.items);
//     const summaryHTML = generateOrderSummaryHTML(order);
//     const pricingHTML = generatePricingHTML(order);
//     const customerInfoHTML = generateCustomerInfoHTML(order);
    
//     let statusMessage = '';
//     let statusEmoji = '';
//     let statusColor = '#EE4275';
    
//     switch(newStatus) {
//       case 'paid':
//         statusMessage = 'Your payment has been successfully received. Thank you for your purchase!';
//         statusEmoji = '✅';
//         statusColor = '#4CAF50';
//         break;
//       case 'failed':
//         statusMessage = 'Your payment has failed. Please try again or contact your bank.';
//         statusEmoji = '❌';
//         statusColor = '#F44336';
//         break;
//       case 'refunded':
//         statusMessage = 'Your payment has been refunded. The amount will be credited back to your original payment method within 3-5 business days.';
//         statusEmoji = '💰';
//         statusColor = '#8B7A8C';
//         break;
//       default:
//         statusMessage = `Your payment status has been updated to ${newStatus}.`;
//         statusEmoji = '📝';
//         statusColor = '#EE4275';
//     }
    
//     const result = await transporter.sendMail({
//       from: `"BeautyBucket" <${process.env.SMTP_USER}>`,
//       to: customerEmail,
//       subject: `${statusEmoji} Payment Status Update - Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <style>
//             body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2D1B2E; margin: 0; padding: 0; background-color: #FFF5F6; }
//             .container { max-width: 700px; margin: 20px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(238, 66, 117, 0.1); border: 1px solid #FFD2DB; }
//             .header { background: linear-gradient(135deg, #EE4275, #FF6B9D); padding: 30px; text-align: center; }
//             .header h1 { color: #FFFFFF; margin: 0; font-size: 28px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 700; }
//             .header p { color: #FFFFFF; margin: 10px 0 0 0; opacity: 0.9; }
//             .content { padding: 35px 30px; }
//             .status-box { background: ${statusColor}10; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${statusColor}; border: 1px solid ${statusColor}30; }
//             .status-badge { display: inline-block; padding: 8px 24px; background: ${statusColor}; color: #FFFFFF; border-radius: 40px; font-weight: 600; text-transform: uppercase; font-size: 14px; }
//             .section-title { font-size: 18px; font-weight: 700; margin: 25px 0 15px 0; display: flex; align-items: center; gap: 8px; color: #2D1B2E; }
//             .button { background: linear-gradient(135deg, #EE4275, #FF6B9D); color: #FFFFFF; padding: 14px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; border: none; }
//             .button:hover { opacity: 0.9; }
//             .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #FFD2DB; text-align: center; }
//             p { color: #8B7A8C; }
//             strong { color: #2D1B2E; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>
//                 <span>${statusEmoji}</span>
//                 <span>Payment Status Update</span>
//               </h1>
//               <p>Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}</p>
//             </div>
//             <div class="content">
//               <p style="margin-bottom: 25px; font-size: 16px;">Dear <strong>${order.customerInfo?.fullName || 'Valued Customer'}</strong>,</p>
              
//               <div class="status-box">
//                 <div class="status-badge">${newStatus.toUpperCase()}</div>
//                 <p style="margin: 15px 0 0 0;">${statusMessage}</p>
//               </div>
              
//               ${summaryHTML}
//               ${customerInfoHTML}
              
//               <div class="section-title">
//                 <span>🛍️</span>
//                 <span>Order Items</span>
//               </div>
//               ${itemsHTML}
              
//               ${pricingHTML}
              
//               <div style="margin: 35px 0 25px; text-align: center;">
//                 <a href="${frontendUrl}/customer/orders" class="button">View Order Details</a>
//               </div>
              
//               <div class="footer">
//                 <p style="margin-bottom: 5px;">Best regards,</p>
//                 <p style="margin: 0; font-weight: bold; color: #EE4275;">BeautyBucket Team</p>
//                 <p style="font-size: 12px; color: #C4B5C5; margin-top: 15px;">Need help? Contact us at ${process.env.SMTP_USER}</p>
//                 <p style="font-size: 11px; color: #C4B5C5; margin-top: 5px;">❤️ Made with love for beauty</p>
//               </div>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     });
    
//     console.log('✅ Payment status update email sent:', result.messageId);
//     return { success: true };
//   } catch (error) {
//     console.error('❌ Payment status update email error:', error.message);
//     return { success: false, error: error.message };
//   }
// };

// // Export all email functions
// module.exports = {
//   sendOrderPlacedEmail,
//   sendOrderNotificationToAdmin,
//   sendOrderStatusUpdateEmail,
//   sendPaymentStatusUpdateEmail
// };



// utils/orderEmailService.js
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { generateInvoicePDF } = require('./pdfGenerator');

// Create transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Order Email Service - Configuration error:', error.message);
  } else {
    console.log('✅ Order Email Service is ready');
    console.log(`📧 Using account: ${process.env.SMTP_USER}`);
  }
});

// BeautyBucket Brand Colors
const BRAND_COLORS = {
  primary: '#EE4275',
  primaryLight: '#FFF5F6',
  primaryDark: '#CC3355',
  white: '#FFFFFF',
  black: '#2D1B2E',
  text: '#2D1B2E',
  textLight: '#8B7A8C',
  textMuted: '#C4B5C5',
  border: '#FFD2DB',
  lightBg: '#FFF5F6',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107'
};

/**
 * Format currency (BDT)
 */
const formatPrice = (price) => {
  const numPrice = parseFloat(price) || 0;
  return `৳${numPrice.toFixed(2)}`;
};

/**
 * Format date
 */
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return 'N/A';
  }
};

/**
 * Get status badge color
 */
const getStatusColor = (status) => {
  const statusColors = {
    'placed': '#EE4275',
    'confirmed': '#EE4275',
    'processing': '#EE4275',
    'shipped': '#EE4275',
    'delivered': '#4CAF50',
    'cancelled': '#F44336'
  };
  return statusColors[status] || '#EE4275';
};

const getPaymentStatusColor = (status) => {
  const statusColors = {
    'pending': '#FFC107',
    'paid': '#4CAF50',
    'failed': '#F44336',
    'refunded': '#8B7A8C'
  };
  return statusColors[status] || '#EE4275';
};

/**
 * Generate order items HTML with unit - Increased gap between image and product name
 */
/**
 * Generate order items HTML with unit - Email compatible with proper spacing
 */
const generateOrderItemsHTML = (items) => {
  if (!items || items.length === 0) return '<p style="color: #8B7A8C;">No items found</p>';
  
  let html = `
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-family: 'Segoe UI', Arial, sans-serif;">
      <thead>
        <tr style="background: #FFF5F6; border-bottom: 2px solid #FFD2DB;">
          <th style="padding: 12px; text-align: left; font-weight: 600; color: #2D1B2E; font-size: 13px; width: 45%;">Product</th>
          <th style="padding: 12px; text-align: center; font-weight: 600; color: #2D1B2E; font-size: 13px; width: 10%;">Qty</th>
          <th style="padding: 12px; text-align: center; font-weight: 600; color: #2D1B2E; font-size: 13px; width: 10%;">Unit</th>
          <th style="padding: 12px; text-align: right; font-weight: 600; color: #2D1B2E; font-size: 13px; width: 17%;">Price</th>
          <th style="padding: 12px; text-align: right; font-weight: 600; color: #2D1B2E; font-size: 13px; width: 18%;">Total</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  items.forEach((item) => {
    const price = item.discountPrice > 0 ? item.discountPrice : item.regularPrice;
    const totalPrice = price * item.quantity;
    const unit = item.unit || 'pcs';
    
    const imageUrl = item.image && item.image.startsWith('http') 
      ? item.image 
      : (item.image ? `http://localhost:5000${item.image}` : 'https://via.placeholder.com/60/FFD2DB/EE4275?text=BB');
    
    html += `
      <tr style="border-bottom: 1px solid #FFD2DB;">
        <td style="padding: 15px 12px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 85px; vertical-align: middle; padding-right: 25px;">
                <img src="${imageUrl}" alt="${item.productName}" 
                     style="width: 75px; height: 75px; object-fit: cover; border-radius: 8px; border: 1px solid #FFD2DB; display: block;">
              </td>
              <td style="vertical-align: middle; padding-right: 10px;">
                <strong style="color: #2D1B2E; font-size: 15px; display: block; margin-bottom: 4px;">${item.productName}</strong>
                ${item.discountPrice > 0 ? `<span style="font-size: 11px; color: #EE4275; display: block;">🎉 Sale Price Applied</span>` : ''}
              </td>
            </tr>
          </table>
        </td>
        <td style="padding: 15px 12px; text-align: center; font-size: 14px; color: #2D1B2E; font-weight: 500; vertical-align: middle;">${item.quantity}</td>
        <td style="padding: 15px 12px; text-align: center; font-size: 13px; color: #8B7A8C; vertical-align: middle;">${unit}</td>
        <td style="padding: 15px 12px; text-align: right; font-size: 14px; color: #2D1B2E; vertical-align: middle;">${formatPrice(price)}</td>
        <td style="padding: 15px 12px; text-align: right; font-weight: 600; color: #EE4275; font-size: 14px; vertical-align: middle;">${formatPrice(totalPrice)}</td>
      </tr>
    `;
  });
  
  html += `
      </tbody>
    </table>
  `;
  
  return html;
};

/**
 * Generate order summary HTML
 */
const generateOrderSummaryHTML = (order) => {
  const statusColor = getStatusColor(order.orderStatus);
  const paymentStatusColor = getPaymentStatusColor(order.paymentStatus);
  
  return `
    <div style="background: #FFF5F6; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #FFD2DB;">
      <h2 style="margin: 0 0 15px 0; color: #2D1B2E; font-size: 18px; font-weight: 700;">Order Summary</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; width: 140px; color: #8B7A8C;"><strong>Order ID:</strong></td>
          <td style="color: #EE4275; font-weight: 600;">${order.orderNumber || order._id.slice(-8).toUpperCase()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8B7A8C;"><strong>Order Date:</strong></td>
          <td style="color: #2D1B2E;">${formatDate(order.createdAt)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8B7A8C;"><strong>Order Status:</strong></td>
          <td><span style="display: inline-block; padding: 4px 12px; background: ${statusColor}20; color: ${statusColor}; border-radius: 20px; font-size: 12px; font-weight: 600;">${order.orderStatus.toUpperCase()}</span></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8B7A8C;"><strong>Payment Status:</strong></td>
          <td><span style="display: inline-block; padding: 4px 12px; background: ${paymentStatusColor}20; color: ${paymentStatusColor}; border-radius: 20px; font-size: 12px; font-weight: 600;">${order.paymentStatus.toUpperCase()}</span></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8B7A8C;"><strong>Payment Method:</strong></td>
          <td style="color: #2D1B2E;">${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</td>
        </tr>
        ${order.paymentMethod === 'cod' ? `
        <tr>
          <td style="padding: 8px 0; color: #8B7A8C;"><strong>Payment Due:</strong></td>
          <td style="color: #2D1B2E;">Pay when you receive your order</td>
        </tr>
        ` : ''}
      </table>
    </div>
  `;
};

/**
 * Generate pricing breakdown HTML
 */
const generatePricingHTML = (order) => {
  return `
    <div style="background: #FFF5F6; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #FFD2DB;">
      <h2 style="margin: 0 0 15px 0; color: #2D1B2E; font-size: 18px; font-weight: 700;">Price Breakdown</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #8B7A8C;"><strong>Subtotal:</strong></td>
          <td style="text-align: right; color: #2D1B2E;">${formatPrice(order.subtotal)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8B7A8C;"><strong>Shipping:</strong></td>
          <td style="text-align: right; color: #2D1B2E;">${formatPrice(order.shippingCost)}</td>
        </tr>
        ${order.discount > 0 ? `
        <tr>
          <td style="padding: 8px 0; color: #4CAF50;"><strong>Discount:</strong></td>
          <td style="text-align: right; color: #4CAF50;">-${formatPrice(order.discount)}</td>
        </tr>
        ${order.couponCode ? `
        <tr>
          <td style="padding: 8px 0; color: #8B7A8C;"><strong>Coupon Applied:</strong></td>
          <td style="text-align: right; color: #EE4275; font-weight: 600;">${order.couponCode}</td>
        </tr>
        ` : ''}
        ` : ''}
        <tr style="border-top: 2px solid #FFD2DB; margin-top: 10px;">
          <td style="padding: 12px 0 0 0; font-size: 18px; font-weight: bold; color: #2D1B2E;"><strong>Total:</strong></td>
          <td style="padding: 12px 0 0 0; text-align: right; font-size: 20px; font-weight: bold; color: #EE4275;">${formatPrice(order.total)}</td>
        </tr>
      </table>
    </div>
  `;
};

/**
 * Generate customer info HTML
 */
const generateCustomerInfoHTML = (order) => {
  return `
    <div style="background: #FFF5F6; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #FFD2DB;">
      <h2 style="margin: 0 0 15px 0; color: #2D1B2E; font-size: 18px; font-weight: 700;">Customer Information</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; width: 120px; color: #8B7A8C;"><strong>Name:</strong></td>
          <td style="color: #2D1B2E;">${order.customerInfo?.fullName || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8B7A8C;"><strong>Email:</strong></td>
          <td><a href="mailto:${order.customerInfo?.email}" style="color: #EE4275; text-decoration: none; font-weight: 600;">${order.customerInfo?.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8B7A8C;"><strong>Phone:</strong></td>
          <td style="color: #2D1B2E;">${order.customerInfo?.phone || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8B7A8C;"><strong>Address:</strong></td>
          <td style="color: #2D1B2E;">${order.customerInfo?.address || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8B7A8C;"><strong>Division:</strong></td>
          <td style="color: #2D1B2E; font-weight: 600;">${order.customerInfo?.division || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8B7A8C;"><strong>City:</strong></td>
          <td style="color: #2D1B2E;">${order.customerInfo?.city || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8B7A8C;"><strong>Upazila/Thana:</strong></td>
          <td style="color: #2D1B2E;">${order.customerInfo?.zone || 'N/A'}</td>
        </tr>
        ${order.customerInfo?.area ? `
        <tr>
          <td style="padding: 8px 0; color: #8B7A8C;"><strong>Union/Area:</strong></td>
          <td style="color: #2D1B2E;">${order.customerInfo.area}</td>
        </tr>
        ` : ''}
        ${order.customerInfo?.note ? `
        <tr>
          <td style="padding: 8px 0; color: #8B7A8C;"><strong>Order Note:</strong></td>
          <td style="color: #8B7A8C;">${order.customerInfo.note}</td>
        </tr>
        ` : ''}
      </table>
    </div>
  `;
};

/**
 * Generate delivery info HTML
 */
const generateDeliveryInfoHTML = (order) => {
  const hasDeliveryNote = order.deliveryNote && order.deliveryNote.trim() !== '';
  const hasTrackingNumber = order.trackingNumber && order.trackingNumber.trim() !== '';
  const hasDeliveredDate = order.deliveredAt && order.orderStatus === 'delivered';
  const hasCancellationReason = order.cancellationReason && order.cancellationReason.trim() !== '' && order.orderStatus === 'cancelled';
  
  if (!hasDeliveryNote && !hasTrackingNumber && !hasDeliveredDate && !hasCancellationReason) {
    return '';
  }
  
  let bgColor = '#FFF5F6';
  let borderColor = '#EE4275';
  let titleColor = '#2D1B2E';
  let titleIcon = '📝';
  
  if (order.orderStatus === 'delivered') {
    bgColor = '#E8F5E9';
    borderColor = '#4CAF50';
    titleColor = '#4CAF50';
    titleIcon = '✅';
  } else if (order.orderStatus === 'shipped') {
    bgColor = '#FFF5F6';
    borderColor = '#EE4275';
    titleColor = '#EE4275';
    titleIcon = '🚚';
  } else if (order.orderStatus === 'cancelled') {
    bgColor = '#FFEBEE';
    borderColor = '#F44336';
    titleColor = '#F44336';
    titleIcon = '❌';
  }
  
  return `
    <div style="background: ${bgColor}; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${borderColor}; border: 1px solid ${borderColor}30;">
      <h2 style="margin: 0 0 15px 0; color: ${titleColor}; font-size: 18px; display: flex; align-items: center; gap: 8px; font-weight: 700;">
        <span>${titleIcon}</span> <span>${order.orderStatus === 'cancelled' ? 'Cancellation Information' : 'Delivery Information'}</span>
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${hasCancellationReason ? `
        <tr>
          <td style="padding: 8px 0; width: 140px; color: #8B7A8C;"><strong>Cancellation Reason:</strong></td>
          <td><div style="background: #FFFFFF; padding: 12px; border-radius: 8px; margin-top: 5px; color: #F44336; border: 1px solid #FFD2DB;">${order.cancellationReason}</div></td>
        </tr>
        ` : ''}
        ${hasDeliveredDate ? `
        <tr>
          <td style="padding: 8px 0; width: 140px; color: #8B7A8C;"><strong>Delivered Date:</strong></td>
          <td style="color: #2D1B2E;">${formatDate(order.deliveredAt)}</td>
        </tr>
        ` : ''}
        ${hasTrackingNumber ? `
        <tr>
          <td style="padding: 8px 0; color: #8B7A8C;"><strong>Tracking Number:</strong></td>
          <td><code style="background: #FFFFFF; padding: 4px 8px; border-radius: 4px; color: #EE4275; border: 1px solid #FFD2DB; font-weight: 600;">${order.trackingNumber}</code></td>
        </tr>
        ` : ''}
        ${hasDeliveryNote ? `
        <tr>
          <td style="padding: 8px 0; color: #8B7A8C;"><strong>Delivery Note:</strong></td>
          <td><div style="background: #FFFFFF; padding: 12px; border-radius: 8px; margin-top: 5px; color: #2D1B2E; border: 1px solid #FFD2DB;">${order.deliveryNote}</div></td>
        </tr>
        ` : ''}
      </table>
    </div>
  `;
};

/**
 * Send order placed email to customer with invoice attachment
 */
const sendOrderPlacedEmail = async (order, customerEmail) => {
  console.log('📧 Sending order placed email to customer...');
  
  try {
    if (!customerEmail) {
      throw new Error('Customer email is missing');
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const itemsHTML = generateOrderItemsHTML(order.items);
    const summaryHTML = generateOrderSummaryHTML(order);
    const pricingHTML = generatePricingHTML(order);
    const customerInfoHTML = generateCustomerInfoHTML(order);
    const deliveryInfoHTML = generateDeliveryInfoHTML(order);

    // Generate PDF invoice
    let pdfBuffer = null;
    try {
      console.log('📄 Generating PDF invoice for order:', order.orderNumber);
      const pdfResult = await generateInvoicePDF(order);
      if (pdfResult && pdfResult.buffer) {
        pdfBuffer = pdfResult.buffer;
        console.log('✅ PDF generated successfully, size:', pdfBuffer.length, 'bytes');
      } else {
        console.warn('⚠️ PDF generation returned no buffer');
      }
    } catch (pdfError) {
      console.error('❌ PDF generation error:', pdfError.message);
    }

    // Determine header based on order status
    const statusHeaderMap = {
      'placed': { emoji: '📦', title: 'Order Placed!', message: 'Your beauty order has been received successfully' },
      'confirmed': { emoji: '✅', title: 'Order Confirmed!', message: 'Your beauty order has been confirmed' },
      'processing': { emoji: '⚙️', title: 'Order Processing!', message: 'Your beauty order is being processed' },
      'shipped': { emoji: '🚚', title: 'Order Shipped!', message: 'Your beauty order has been shipped' },
      'delivered': { emoji: '🎁', title: 'Order Delivered!', message: 'Your beauty order has been delivered' },
      'cancelled': { emoji: '❌', title: 'Order Cancelled', message: 'Your beauty order has been cancelled' }
    };

    const headerInfo = statusHeaderMap[order.orderStatus] || statusHeaderMap['placed'];
    const subjectStatus = order.orderStatus === 'placed' ? 'Placed' : 
                         order.orderStatus === 'confirmed' ? 'Confirmed' :
                         order.orderStatus === 'processing' ? 'Processing' :
                         order.orderStatus === 'shipped' ? 'Shipped' :
                         order.orderStatus === 'delivered' ? 'Delivered' : 'Placed';

    const mailOptions = {
      from: `"BeautyBucket" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `${headerInfo.emoji} Order ${subjectStatus}! Order #${order.orderNumber || order._id.slice(-8).toUpperCase()} - BeautyBucket`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2D1B2E; margin: 0; padding: 0; background-color: #FFF5F6; }
            .container { max-width: 700px; margin: 20px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(238, 66, 117, 0.1); border: 1px solid #FFD2DB; }
            .header { background: linear-gradient(135deg, #EE4275, #FF6B9D); padding: 30px; text-align: center; }
            .header h1 { color: #FFFFFF; margin: 0; font-size: 28px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 700; }
            .header p { color: #FFFFFF; margin: 10px 0 0 0; opacity: 0.9; }
            .content { padding: 35px 30px; }
            .section-title { font-size: 18px; font-weight: 700; margin: 25px 0 15px 0; display: flex; align-items: center; gap: 8px; color: #2D1B2E; }
            .button { background: linear-gradient(135deg, #EE4275, #FF6B9D); color: #FFFFFF; padding: 14px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; border: none; }
            .button:hover { opacity: 0.9; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #FFD2DB; text-align: center; }
            p { color: #8B7A8C; }
            strong { color: #2D1B2E; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span>${headerInfo.emoji}</span>
                <span>${headerInfo.title}</span>
              </h1>
              <p>${headerInfo.message}</p>
            </div>
            <div class="content">
              <p style="margin-bottom: 15px; font-size: 16px;">Dear <strong>${order.customerInfo?.fullName || 'Valued Customer'}</strong>,</p>
              <p style="margin-bottom: 25px; font-size: 16px; color: #2D1B2E;">
                ${order.orderStatus === 'placed' ? 'Thank you for your order! We have received your order and it is now pending confirmation. You will receive another email once your order is confirmed.' :
                  order.orderStatus === 'confirmed' ? 'Great news! Your order has been confirmed and is being prepared for shipment.' :
                  order.orderStatus === 'processing' ? 'Your order is now being processed. Our team is preparing your items for shipment.' :
                  order.orderStatus === 'shipped' ? 'Your order has been shipped and is on its way to you!' :
                  order.orderStatus === 'delivered' ? 'Your order has been delivered! We hope you love your new products.' :
                  'Thank you for your order!'}
              </p>
              
              ${summaryHTML}
              ${customerInfoHTML}
              ${deliveryInfoHTML}
              
              <div class="section-title">
                <span>🛍️</span>
                <span>Order Items</span>
              </div>
              ${itemsHTML}
              
              ${pricingHTML}
              
              <div style="margin: 35px 0 25px; text-align: center;">
                <a href="${frontendUrl}/customer/orders" class="button">Track Your Order</a>
              </div>
              
              <div class="footer">
                <p style="margin-bottom: 5px;">Best regards,</p>
                <p style="margin: 0; font-weight: bold; color: #EE4275;">BeautyBucket Team</p>
                <p style="font-size: 12px; color: #C4B5C5; margin-top: 15px;">Need help? Contact us at ${process.env.SMTP_USER}</p>
                <p style="font-size: 11px; color: #C4B5C5; margin-top: 5px;">❤️ Made with love for beauty</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Attach PDF if available
    if (pdfBuffer) {
      mailOptions.attachments = [{
        filename: `Invoice_${order.orderNumber || order._id.slice(-8).toUpperCase()}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }];
      console.log('📎 PDF attachment added to email');
    }

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Order placed email sent:', result.messageId);
    return { success: true };
  } catch (error) {
    console.error('❌ Order placed email error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send order notification email to admin
 */
const sendOrderNotificationToAdmin = async (order, eventType = 'new') => {
  console.log('📧 Sending order notification email to admin...');
  
  try {
    const adminEmail = process.env.OWNER_EMAIL || process.env.SMTP_USER;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const itemsHTML = generateOrderItemsHTML(order.items);
    const summaryHTML = generateOrderSummaryHTML(order);
    const pricingHTML = generatePricingHTML(order);
    const customerInfoHTML = generateCustomerInfoHTML(order);
    
    let headerTitle = '';
    let headerEmoji = '';
    let additionalMessage = '';
    
    if (eventType === 'new') {
      headerTitle = 'New Order Received!';
      headerEmoji = '🛍️';
      additionalMessage = 'A new beauty order has been placed and requires your attention.';
    } else if (eventType === 'status_update') {
      const statusInfo = {
        'confirmed': { title: 'Order Confirmed', emoji: '✅' },
        'processing': { title: 'Order Processing', emoji: '⚙️' },
        'shipped': { title: 'Order Shipped', emoji: '🚚' },
        'delivered': { title: 'Order Delivered', emoji: '📦' },
        'cancelled': { title: 'Order Cancelled', emoji: '❌' }
      };
      const info = statusInfo[order.orderStatus] || { title: 'Order Updated', emoji: '📝' };
      headerTitle = info.title;
      headerEmoji = info.emoji;
      additionalMessage = `Order status has been updated to "${order.orderStatus.toUpperCase()}".`;
    } else if (eventType === 'payment_update') {
      const paymentInfo = {
        'paid': { title: 'Payment Received', emoji: '💰' },
        'failed': { title: 'Payment Failed', emoji: '⚠️' },
        'refunded': { title: 'Payment Refunded', emoji: '💸' }
      };
      const info = paymentInfo[order.paymentStatus] || { title: 'Payment Updated', emoji: '💳' };
      headerTitle = info.title;
      headerEmoji = info.emoji;
      additionalMessage = `Payment status has been updated to "${order.paymentStatus.toUpperCase()}".`;
    }
    
    const result = await transporter.sendMail({
      from: `"BeautyBucket System" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `${headerEmoji} ${headerTitle} - Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2D1B2E; background-color: #FFF5F6; }
            .container { max-width: 700px; margin: 20px auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(238, 66, 117, 0.1); border: 1px solid #FFD2DB; }
            .header { background: linear-gradient(135deg, #EE4275, #FF6B9D); padding: 25px 30px; text-align: center; }
            .header h1 { color: #FFFFFF; margin: 0; font-size: 24px; display: flex; align-items: center; justify-content: center; gap: 10px; font-weight: 700; }
            .content { padding: 30px; }
            .button { background: linear-gradient(135deg, #EE4275, #FF6B9D); color: #FFFFFF; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; border: none; }
            .button:hover { opacity: 0.9; }
            .section-title { font-size: 18px; font-weight: 700; margin: 25px 0 15px 0; color: #2D1B2E; }
            p { color: #8B7A8C; }
            strong { color: #2D1B2E; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span>${headerEmoji}</span>
                <span>${headerTitle}</span>
              </h1>
            </div>
            <div class="content">
              <p>${additionalMessage}</p>
              
              ${customerInfoHTML}
              ${summaryHTML}
              
              <div class="section-title">🛍️ Order Items</div>
              ${itemsHTML}
              
              ${pricingHTML}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${frontendUrl}/admin/orders" class="button">View Order in Dashboard</a>
              </div>
              
              <div style="background: #FFF5F6; padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid #FFD2DB;">
                <p style="margin: 0; font-size: 14px; color: #EE4275;">💖 Please review and take necessary action.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('✅ Admin order notification sent:', result.messageId);
    return { success: true };
  } catch (error) {
    console.error('❌ Admin notification error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send order status update email to customer with invoice attachment
 */
const sendOrderStatusUpdateEmail = async (order, customerEmail, oldStatus, newStatus) => {
  console.log('📧 Sending order status update email with full details...');
  
  try {
    if (!customerEmail) {
      throw new Error('Customer email is missing');
    }
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const newStatusColor = getStatusColor(newStatus);
    const itemsHTML = generateOrderItemsHTML(order.items);
    const summaryHTML = generateOrderSummaryHTML(order);
    const pricingHTML = generatePricingHTML(order);
    const customerInfoHTML = generateCustomerInfoHTML(order);
    const deliveryInfoHTML = generateDeliveryInfoHTML(order);

    // Generate PDF invoice
    let pdfBuffer = null;
    try {
      console.log('📄 Generating PDF invoice for status update - Order:', order.orderNumber);
      const pdfResult = await generateInvoicePDF(order);
      if (pdfResult && pdfResult.buffer) {
        pdfBuffer = pdfResult.buffer;
        console.log('✅ PDF generated successfully, size:', pdfBuffer.length, 'bytes');
      } else {
        console.warn('⚠️ PDF generation returned no buffer');
      }
    } catch (pdfError) {
      console.error('❌ PDF generation error:', pdfError.message);
    }
    
    let statusTitle = '';
    let statusMessage = '';
    let statusEmoji = '';
    
    switch(newStatus) {
      case 'confirmed':
        statusTitle = 'Order Confirmed!';
        statusMessage = 'Great news! Your beauty order has been confirmed and is being prepared. Our team is working hard to pack your items carefully.';
        statusEmoji = '✅';
        break;
      case 'processing':
        statusTitle = 'Order Processing';
        statusMessage = 'Your beauty order is now being processed. Our team is preparing your items for shipment.';
        statusEmoji = '⚙️';
        break;
      case 'shipped':
        statusTitle = 'Order Shipped!';
        statusMessage = 'Your beauty order has been shipped and is on its way to you! Get ready to receive your wonderful products.';
        statusEmoji = '🚚';
        break;
      case 'delivered':
        statusTitle = 'Order Delivered!';
        statusMessage = 'Your beauty order has been delivered! We hope you love your new products. Thank you for shopping with BeautyBucket!';
        statusEmoji = '🎁';
        break;
      case 'cancelled':
        statusTitle = 'Order Cancelled';
        statusMessage = 'Your beauty order has been cancelled. If you have any questions, please contact our support team.';
        statusEmoji = '❌';
        break;
      default:
        statusTitle = `Order ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`;
        statusMessage = `Your order status has been updated to ${newStatus}.`;
        statusEmoji = '📝';
    }
    
    const mailOptions = {
      from: `"BeautyBucket" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `${statusEmoji} ${statusTitle} - Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2D1B2E; margin: 0; padding: 0; background-color: #FFF5F6; }
            .container { max-width: 700px; margin: 20px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(238, 66, 117, 0.1); border: 1px solid #FFD2DB; }
            .header { background: linear-gradient(135deg, #EE4275, #FF6B9D); padding: 30px; text-align: center; }
            .header h1 { color: #FFFFFF; margin: 0; font-size: 28px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 700; }
            .header p { color: #FFFFFF; margin: 10px 0 0 0; opacity: 0.9; }
            .content { padding: 35px 30px; }
            .status-box { background: ${newStatusColor}10; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${newStatusColor}; border: 1px solid ${newStatusColor}30; }
            .status-badge { display: inline-block; padding: 8px 24px; background: ${newStatusColor}; color: #FFFFFF; border-radius: 40px; font-weight: 600; text-transform: uppercase; font-size: 14px; }
            .section-title { font-size: 18px; font-weight: 700; margin: 25px 0 15px 0; display: flex; align-items: center; gap: 8px; color: #2D1B2E; }
            .button { background: linear-gradient(135deg, #EE4275, #FF6B9D); color: #FFFFFF; padding: 14px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; border: none; }
            .button:hover { opacity: 0.9; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #FFD2DB; text-align: center; }
            p { color: #8B7A8C; }
            strong { color: #2D1B2E; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span>${statusEmoji}</span>
                <span>${statusTitle}</span>
              </h1>
              <p>Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}</p>
            </div>
            <div class="content">
              <p style="margin-bottom: 25px; font-size: 16px;">Dear <strong>${order.customerInfo?.fullName || 'Valued Customer'}</strong>,</p>
              
              <div class="status-box">
                <div class="status-badge">${newStatus.toUpperCase()}</div>
                <p style="margin: 15px 0 0 0;">${statusMessage}</p>
              </div>
              
              ${summaryHTML}
              ${customerInfoHTML}
              ${deliveryInfoHTML}
              
              <div class="section-title">
                <span>🛍️</span>
                <span>Order Items</span>
              </div>
              ${itemsHTML}
              
              ${pricingHTML}
              
              <div style="margin: 35px 0 25px; text-align: center;">
                <a href="${frontendUrl}/customer/orders" class="button">View Order Details</a>
              </div>
              
              <div class="footer">
                <p style="margin-bottom: 5px;">Best regards,</p>
                <p style="margin: 0; font-weight: bold; color: #EE4275;">BeautyBucket Team</p>
                <p style="font-size: 12px; color: #C4B5C5; margin-top: 15px;">Need help? Contact us at ${process.env.SMTP_USER}</p>
                <p style="font-size: 11px; color: #C4B5C5; margin-top: 5px;">❤️ Made with love for beauty</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Attach PDF if available
    if (pdfBuffer) {
      mailOptions.attachments = [{
        filename: `Invoice_${order.orderNumber || order._id.slice(-8).toUpperCase()}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }];
      console.log('📎 PDF attachment added to status update email');
    }

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Order status update email sent:', result.messageId);
    return { success: true };
  } catch (error) {
    console.error('❌ Status update email error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send payment status update email to customer with invoice attachment
 */
const sendPaymentStatusUpdateEmail = async (order, customerEmail, oldStatus, newStatus) => {
  console.log('📧 Sending payment status update email...');
  
  try {
    if (!customerEmail) {
      throw new Error('Customer email is missing');
    }
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const itemsHTML = generateOrderItemsHTML(order.items);
    const summaryHTML = generateOrderSummaryHTML(order);
    const pricingHTML = generatePricingHTML(order);
    const customerInfoHTML = generateCustomerInfoHTML(order);

    // Generate PDF invoice
    let pdfBuffer = null;
    try {
      console.log('📄 Generating PDF invoice for payment update - Order:', order.orderNumber);
      const pdfResult = await generateInvoicePDF(order);
      if (pdfResult && pdfResult.buffer) {
        pdfBuffer = pdfResult.buffer;
        console.log('✅ PDF generated successfully, size:', pdfBuffer.length, 'bytes');
      } else {
        console.warn('⚠️ PDF generation returned no buffer');
      }
    } catch (pdfError) {
      console.error('❌ PDF generation error:', pdfError.message);
    }
    
    let statusMessage = '';
    let statusEmoji = '';
    let statusColor = '#EE4275';
    
    switch(newStatus) {
      case 'paid':
        statusMessage = 'Your payment has been successfully received. Thank you for your purchase!';
        statusEmoji = '✅';
        statusColor = '#4CAF50';
        break;
      case 'failed':
        statusMessage = 'Your payment has failed. Please try again or contact your bank.';
        statusEmoji = '❌';
        statusColor = '#F44336';
        break;
      case 'refunded':
        statusMessage = 'Your payment has been refunded. The amount will be credited back to your original payment method within 3-5 business days.';
        statusEmoji = '💰';
        statusColor = '#8B7A8C';
        break;
      default:
        statusMessage = `Your payment status has been updated to ${newStatus}.`;
        statusEmoji = '📝';
        statusColor = '#EE4275';
    }
    
    const mailOptions = {
      from: `"BeautyBucket" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `${statusEmoji} Payment Status Update - Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2D1B2E; margin: 0; padding: 0; background-color: #FFF5F6; }
            .container { max-width: 700px; margin: 20px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(238, 66, 117, 0.1); border: 1px solid #FFD2DB; }
            .header { background: linear-gradient(135deg, #EE4275, #FF6B9D); padding: 30px; text-align: center; }
            .header h1 { color: #FFFFFF; margin: 0; font-size: 28px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 700; }
            .header p { color: #FFFFFF; margin: 10px 0 0 0; opacity: 0.9; }
            .content { padding: 35px 30px; }
            .status-box { background: ${statusColor}10; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${statusColor}; border: 1px solid ${statusColor}30; }
            .status-badge { display: inline-block; padding: 8px 24px; background: ${statusColor}; color: #FFFFFF; border-radius: 40px; font-weight: 600; text-transform: uppercase; font-size: 14px; }
            .section-title { font-size: 18px; font-weight: 700; margin: 25px 0 15px 0; display: flex; align-items: center; gap: 8px; color: #2D1B2E; }
            .button { background: linear-gradient(135deg, #EE4275, #FF6B9D); color: #FFFFFF; padding: 14px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; border: none; }
            .button:hover { opacity: 0.9; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #FFD2DB; text-align: center; }
            p { color: #8B7A8C; }
            strong { color: #2D1B2E; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span>${statusEmoji}</span>
                <span>Payment Status Update</span>
              </h1>
              <p>Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}</p>
            </div>
            <div class="content">
              <p style="margin-bottom: 25px; font-size: 16px;">Dear <strong>${order.customerInfo?.fullName || 'Valued Customer'}</strong>,</p>
              
              <div class="status-box">
                <div class="status-badge">${newStatus.toUpperCase()}</div>
                <p style="margin: 15px 0 0 0;">${statusMessage}</p>
              </div>
              
              ${summaryHTML}
              ${customerInfoHTML}
              
              <div class="section-title">
                <span>🛍️</span>
                <span>Order Items</span>
              </div>
              ${itemsHTML}
              
              ${pricingHTML}
              
              <div style="margin: 35px 0 25px; text-align: center;">
                <a href="${frontendUrl}/customer/orders" class="button">View Order Details</a>
              </div>
              
              <div class="footer">
                <p style="margin-bottom: 5px;">Best regards,</p>
                <p style="margin: 0; font-weight: bold; color: #EE4275;">BeautyBucket Team</p>
                <p style="font-size: 12px; color: #C4B5C5; margin-top: 15px;">Need help? Contact us at ${process.env.SMTP_USER}</p>
                <p style="font-size: 11px; color: #C4B5C5; margin-top: 5px;">❤️ Made with love for beauty</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Attach PDF if available
    if (pdfBuffer) {
      mailOptions.attachments = [{
        filename: `Invoice_${order.orderNumber || order._id.slice(-8).toUpperCase()}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      }];
      console.log('📎 PDF attachment added to payment update email');
    }

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Payment status update email sent:', result.messageId);
    return { success: true };
  } catch (error) {
    console.error('❌ Payment status update email error:', error.message);
    return { success: false, error: error.message };
  }
};

// Export all email functions
module.exports = {
  sendOrderPlacedEmail,
  sendOrderNotificationToAdmin,
  sendOrderStatusUpdateEmail,
  sendPaymentStatusUpdateEmail
};