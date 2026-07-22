

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
//   primary: '#EE4275',
//   primaryLight: '#FFF5F6',
//   primaryDark: '#CC3355',
//   white: '#FFFFFF',
//   black: '#2D1B2E',
//   text: '#2D1B2E',
//   textLight: '#8B7A8C',
//   textMuted: '#C4B5C5',
//   border: '#FFD2DB',
//   lightBg: '#FFF5F6',
//   success: '#4CAF50',
//   error: '#F44336',
//   warning: '#FFC107'
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
//  * Generate order items HTML with unit - Increased gap between image and product name
//  */
// /**
//  * Generate order items HTML with unit - Email compatible with proper spacing
//  */
// const generateOrderItemsHTML = (items) => {
//   if (!items || items.length === 0) return '<p style="color: #8B7A8C;">No items found</p>';
  
//   let html = `
//     <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-family: 'Segoe UI', Arial, sans-serif;">
//       <thead>
//         <tr style="background: #FFF5F6; border-bottom: 2px solid #FFD2DB;">
//           <th style="padding: 12px; text-align: left; font-weight: 600; color: #2D1B2E; font-size: 13px; width: 45%;">Product</th>
//           <th style="padding: 12px; text-align: center; font-weight: 600; color: #2D1B2E; font-size: 13px; width: 10%;">Qty</th>
//           <th style="padding: 12px; text-align: center; font-weight: 600; color: #2D1B2E; font-size: 13px; width: 10%;">Unit</th>
//           <th style="padding: 12px; text-align: right; font-weight: 600; color: #2D1B2E; font-size: 13px; width: 17%;">Price</th>
//           <th style="padding: 12px; text-align: right; font-weight: 600; color: #2D1B2E; font-size: 13px; width: 18%;">Total</th>
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
//           <table style="width: 100%; border-collapse: collapse;">
//             <tr>
//               <td style="width: 85px; vertical-align: middle; padding-right: 25px;">
//                 <img src="${imageUrl}" alt="${item.productName}" 
//                      style="width: 75px; height: 75px; object-fit: cover; border-radius: 8px; border: 1px solid #FFD2DB; display: block;">
//               </td>
//               <td style="vertical-align: middle; padding-right: 10px;">
//                 <strong style="color: #2D1B2E; font-size: 15px; display: block; margin-bottom: 4px;">${item.productName}</strong>
//                 ${item.discountPrice > 0 ? `<span style="font-size: 11px; color: #EE4275; display: block;">🎉 Sale Price Applied</span>` : ''}
//               </td>
//             </tr>
//           </table>
//         </td>
//         <td style="padding: 15px 12px; text-align: center; font-size: 14px; color: #2D1B2E; font-weight: 500; vertical-align: middle;">${item.quantity}</td>
//         <td style="padding: 15px 12px; text-align: center; font-size: 13px; color: #8B7A8C; vertical-align: middle;">${unit}</td>
//         <td style="padding: 15px 12px; text-align: right; font-size: 14px; color: #2D1B2E; vertical-align: middle;">${formatPrice(price)}</td>
//         <td style="padding: 15px 12px; text-align: right; font-weight: 600; color: #EE4275; font-size: 14px; vertical-align: middle;">${formatPrice(totalPrice)}</td>
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

//     // Generate PDF invoice
//     let pdfBuffer = null;
//     try {
//       console.log('📄 Generating PDF invoice for order:', order.orderNumber);
//       const pdfResult = await generateInvoicePDF(order);
//       if (pdfResult && pdfResult.buffer) {
//         pdfBuffer = pdfResult.buffer;
//         console.log('✅ PDF generated successfully, size:', pdfBuffer.length, 'bytes');
//       } else {
//         console.warn('⚠️ PDF generation returned no buffer');
//       }
//     } catch (pdfError) {
//       console.error('❌ PDF generation error:', pdfError.message);
//     }

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
//  * Send order notification email to admin
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
//  * Send order status update email to customer with invoice attachment
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

//     // Generate PDF invoice
//     let pdfBuffer = null;
//     try {
//       console.log('📄 Generating PDF invoice for status update - Order:', order.orderNumber);
//       const pdfResult = await generateInvoicePDF(order);
//       if (pdfResult && pdfResult.buffer) {
//         pdfBuffer = pdfResult.buffer;
//         console.log('✅ PDF generated successfully, size:', pdfBuffer.length, 'bytes');
//       } else {
//         console.warn('⚠️ PDF generation returned no buffer');
//       }
//     } catch (pdfError) {
//       console.error('❌ PDF generation error:', pdfError.message);
//     }
    
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
    
//     const mailOptions = {
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
//     };

//     // Attach PDF if available
//     if (pdfBuffer) {
//       mailOptions.attachments = [{
//         filename: `Invoice_${order.orderNumber || order._id.slice(-8).toUpperCase()}.pdf`,
//         content: pdfBuffer,
//         contentType: 'application/pdf'
//       }];
//       console.log('📎 PDF attachment added to status update email');
//     }

//     const result = await transporter.sendMail(mailOptions);
//     console.log('✅ Order status update email sent:', result.messageId);
//     return { success: true };
//   } catch (error) {
//     console.error('❌ Status update email error:', error.message);
//     return { success: false, error: error.message };
//   }
// };

// /**
//  * Send payment status update email to customer with invoice attachment
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

//     // Generate PDF invoice
//     let pdfBuffer = null;
//     try {
//       console.log('📄 Generating PDF invoice for payment update - Order:', order.orderNumber);
//       const pdfResult = await generateInvoicePDF(order);
//       if (pdfResult && pdfResult.buffer) {
//         pdfBuffer = pdfResult.buffer;
//         console.log('✅ PDF generated successfully, size:', pdfBuffer.length, 'bytes');
//       } else {
//         console.warn('⚠️ PDF generation returned no buffer');
//       }
//     } catch (pdfError) {
//       console.error('❌ PDF generation error:', pdfError.message);
//     }
    
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
    
//     const mailOptions = {
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
//     };

//     // Attach PDF if available
//     if (pdfBuffer) {
//       mailOptions.attachments = [{
//         filename: `Invoice_${order.orderNumber || order._id.slice(-8).toUpperCase()}.pdf`,
//         content: pdfBuffer,
//         contentType: 'application/pdf'
//       }];
//       console.log('📎 PDF attachment added to payment update email');
//     }

//     const result = await transporter.sendMail(mailOptions);
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

// HyperVolt Brand Colors - Updated
const BRAND_COLORS = {
  primary: '#0D506F',      // Main HyperVolt blue
  primaryLight: '#E8F0F5',
  primaryDark: '#0A3D55',
  secondary: '#06B6D4',    // Cyan accent
  white: '#FFFFFF',
  black: '#1A1A2E',
  text: '#1A1A2E',
  textLight: '#64748B',
  textMuted: '#94A3B8',
  border: '#0D506F30',
  lightBg: '#F0F7FA',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B'
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
 * Get status badge color - Updated for all statuses
 */
const getStatusColor = (status) => {
  const statusColors = {
    'placed': '#0D506F',
    'follow_up': '#0D506F',
    'accepted': '#0D506F',
    'approved': '#0D506F',
    'ready_to_ship': '#0D506F',
    'courier_assigned': '#0D506F',
    'rejected': '#EF4444',
    'cancelled': '#EF4444',
    'reminder': '#F59E0B',
    'processing': '#0D506F',
    'shipped': '#0D506F',
    'out_for_delivery': '#F59E0B',
    'delivered': '#22C55E',
    'refunded': '#94A3B8',
    'failed': '#EF4444'
  };
  return statusColors[status] || '#0D506F';
};

const getPaymentStatusColor = (status) => {
  const statusColors = {
    'pending': '#F59E0B',
    'paid': '#22C55E',
    'failed': '#EF4444',
    'refunded': '#94A3B8',
    'partial': '#F59E0B'
  };
  return statusColors[status] || '#0D506F';
};

/**
 * Get status display label
 */
const getStatusLabel = (status) => {
  const labels = {
    'placed': 'Order Placed',
    'follow_up': 'Follow Up',
    'accepted': 'Accepted',
    'approved': 'Approved',
    'ready_to_ship': 'Ready to Ship',
    'courier_assigned': 'Courier Assigned',
    'rejected': 'Rejected',
    'cancelled': 'Cancelled',
    'reminder': 'Reminder',
    'processing': 'Courier Assigned',
    'shipped': 'Shipped',
    'out_for_delivery': 'Out for Delivery',
    'delivered': 'Delivered',
    'refunded': 'Refunded',
    'failed': 'Failed'
  };
  return labels[status] || status;
};

/**
 * Generate order items HTML with color swatches
 */
const generateOrderItemsHTML = (items) => {
  if (!items || items.length === 0) return '<p style="color: #64748B;">No items found</p>';
  
  let html = `
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-family: 'Segoe UI', Arial, sans-serif;">
      <thead>
        <tr style="background: #F0F7FA; border-bottom: 2px solid #0D506F30;">
          <th style="padding: 12px; text-align: left; font-weight: 600; color: #1A1A2E; font-size: 13px; width: 40%;">Product</th>
          <th style="padding: 12px; text-align: center; font-weight: 600; color: #1A1A2E; font-size: 13px; width: 12%;">Color</th>
          <th style="padding: 12px; text-align: center; font-weight: 600; color: #1A1A2E; font-size: 13px; width: 8%;">Qty</th>
          <th style="padding: 12px; text-align: center; font-weight: 600; color: #1A1A2E; font-size: 13px; width: 10%;">Unit</th>
          <th style="padding: 12px; text-align: right; font-weight: 600; color: #1A1A2E; font-size: 13px; width: 15%;">Price</th>
          <th style="padding: 12px; text-align: right; font-weight: 600; color: #1A1A2E; font-size: 13px; width: 15%;">Total</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  items.forEach((item) => {
    const price = item.discountPrice > 0 ? item.discountPrice : item.regularPrice;
    const unit = item.unit || 'pcs';
    
    // Handle colors - if item has colors array, show each color
    let colorRows = [];
    if (item.colors && item.colors.length > 0) {
      colorRows = item.colors.map(c => ({
        color: c.color,
        quantity: c.quantity || 0,
        price: c.price || price
      }));
    } else if (item.selectedColor) {
      colorRows = [{
        color: item.selectedColor,
        quantity: item.quantity || 0,
        price: price
      }];
    } else {
      colorRows = [{
        color: null,
        quantity: item.quantity || 0,
        price: price
      }];
    }
    
    const imageUrl = item.image && item.image.startsWith('http') 
      ? item.image 
      : (item.image ? `${process.env.FRONTEND_URL || 'http://localhost:3000'}${item.image}` : 'https://via.placeholder.com/60/0D506F/06B6D4?text=HV');
    
    // Show product name only on first color row
    colorRows.forEach((colorRow, idx) => {
      const isFirst = idx === 0;
      const totalPrice = colorRow.price * colorRow.quantity;
      
      html += `
        <tr style="border-bottom: 1px solid #0D506F20;">
          ${isFirst ? `
          <td style="padding: 15px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 70px; vertical-align: middle; padding-right: 15px;">
                  <img src="${imageUrl}" alt="${item.productName}" 
                       style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #0D506F30; display: block;">
                </td>
                <td style="vertical-align: middle; padding-right: 10px;">
                  <strong style="color: #1A1A2E; font-size: 14px; display: block; margin-bottom: 4px;">${item.productName}</strong>
                  ${item.discountPrice > 0 ? `<span style="font-size: 11px; color: #06B6D4; display: block;">🎉 Sale Price Applied</span>` : ''}
                </td>
              </tr>
            </table>
          </td>
          ` : `
          <td style="padding: 15px 12px;">
            <div style="padding-left: 70px; color: #64748B; font-size: 13px;">
              └─ ${colorRow.color ? '' : ''}
            </div>
          </td>
          `}
          <td style="padding: 15px 12px; text-align: center; vertical-align: middle;">
            ${colorRow.color ? `
              <div style="display: inline-block; width: 20px; height: 20px; border-radius: 50%; border: 2px solid #0D506F30; background-color: ${colorRow.color};"></div>
            ` : `<span style="color: #94A3B8; font-size: 12px;">—</span>`}
          </td>
          <td style="padding: 15px 12px; text-align: center; font-size: 14px; color: #1A1A2E; font-weight: 500; vertical-align: middle;">${colorRow.quantity}</td>
          <td style="padding: 15px 12px; text-align: center; font-size: 13px; color: #64748B; vertical-align: middle;">${isFirst ? unit : ''}</td>
          <td style="padding: 15px 12px; text-align: right; font-size: 14px; color: #1A1A2E; vertical-align: middle;">${isFirst ? formatPrice(colorRow.price) : ''}</td>
          <td style="padding: 15px 12px; text-align: right; font-weight: 600; color: #06B6D4; font-size: 14px; vertical-align: middle;">${formatPrice(totalPrice)}</td>
        </tr>
      `;
    });
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
  const statusLabel = getStatusLabel(order.orderStatus);
  
  return `
    <div style="background: #F0F7FA; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #0D506F30;">
      <h2 style="margin: 0 0 15px 0; color: #1A1A2E; font-size: 18px; font-weight: 700;">Order Summary</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; width: 140px; color: #64748B;"><strong>Order ID:</strong></td>
          <td style="color: #06B6D4; font-weight: 600;">${order.orderNumber || order._id.slice(-8).toUpperCase()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Order Date:</strong></td>
          <td style="color: #1A1A2E;">${formatDate(order.createdAt)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Order Status:</strong></td>
          <td><span style="display: inline-block; padding: 4px 12px; background: ${statusColor}20; color: ${statusColor}; border-radius: 20px; font-size: 12px; font-weight: 600;">${statusLabel}</span></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Payment Status:</strong></td>
          <td><span style="display: inline-block; padding: 4px 12px; background: ${paymentStatusColor}20; color: ${paymentStatusColor}; border-radius: 20px; font-size: 12px; font-weight: 600;">${order.paymentStatus.toUpperCase()}</span></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Payment Method:</strong></td>
          <td style="color: #1A1A2E;">${order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'online' ? 'Online Payment' : order.paymentMethod.toUpperCase()}</td>
        </tr>
        ${order.paymentMethod === 'cod' ? `
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Payment Due:</strong></td>
          <td style="color: #1A1A2E;">Pay when you receive your order</td>
        </tr>
        ` : ''}
        ${order.couponCode ? `
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Coupon Applied:</strong></td>
          <td style="color: #06B6D4; font-weight: 600;">${order.couponCode}</td>
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
    <div style="background: #F0F7FA; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #0D506F30;">
      <h2 style="margin: 0 0 15px 0; color: #1A1A2E; font-size: 18px; font-weight: 700;">Price Breakdown</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Subtotal:</strong></td>
          <td style="text-align: right; color: #1A1A2E;">${formatPrice(order.subtotal)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Shipping:</strong></td>
          <td style="text-align: right; color: #1A1A2E;">${formatPrice(order.shippingCost)}</td>
        </tr>
        ${order.discount > 0 ? `
        <tr>
          <td style="padding: 8px 0; color: #22C55E;"><strong>Discount:</strong></td>
          <td style="text-align: right; color: #22C55E;">-${formatPrice(order.discount)}</td>
        </tr>
        ` : ''}
        <tr style="border-top: 2px solid #0D506F30; margin-top: 10px;">
          <td style="padding: 12px 0 0 0; font-size: 18px; font-weight: bold; color: #1A1A2E;"><strong>Total:</strong></td>
          <td style="padding: 12px 0 0 0; text-align: right; font-size: 20px; font-weight: bold; color: #06B6D4;">${formatPrice(order.total)}</td>
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
    <div style="background: #F0F7FA; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #0D506F30;">
      <h2 style="margin: 0 0 15px 0; color: #1A1A2E; font-size: 18px; font-weight: 700;">Customer Information</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; width: 120px; color: #64748B;"><strong>Name:</strong></td>
          <td style="color: #1A1A2E;">${order.customerInfo?.fullName || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Email:</strong></td>
          <td><a href="mailto:${order.customerInfo?.email}" style="color: #06B6D4; text-decoration: none; font-weight: 600;">${order.customerInfo?.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Phone:</strong></td>
          <td style="color: #1A1A2E;">${order.customerInfo?.phone || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Address:</strong></td>
          <td style="color: #1A1A2E;">${order.customerInfo?.address || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Division:</strong></td>
          <td style="color: #1A1A2E; font-weight: 600;">${order.customerInfo?.division || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>City:</strong></td>
          <td style="color: #1A1A2E;">${order.customerInfo?.city || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Upazila/Thana:</strong></td>
          <td style="color: #1A1A2E;">${order.customerInfo?.zone || 'N/A'}</td>
        </tr>
        ${order.customerInfo?.area ? `
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Union/Area:</strong></td>
          <td style="color: #1A1A2E;">${order.customerInfo.area}</td>
        </tr>
        ` : ''}
        ${order.customerInfo?.note ? `
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Order Note:</strong></td>
          <td style="color: #64748B;">${order.customerInfo.note}</td>
        </tr>
        ` : ''}
      </table>
    </div>
  `;
};

/**
 * Generate delivery info HTML
 */
// const generateDeliveryInfoHTML = (order) => {
//   const hasDeliveryNote = order.deliveryNote && order.deliveryNote.trim() !== '';
//   const hasTrackingNumber = order.trackingNumber && order.trackingNumber.trim() !== '';
//   const hasDeliveredDate = order.deliveredAt && order.orderStatus === 'delivered';
//   const hasCancellationReason = order.cancellationReason && order.cancellationReason.trim() !== '' && order.orderStatus === 'cancelled';
//   const hasRejectionReason = order.rejectionReason && order.rejectionReason.trim() !== '' && order.orderStatus === 'rejected';
  
//   if (!hasDeliveryNote && !hasTrackingNumber && !hasDeliveredDate && !hasCancellationReason && !hasRejectionReason) {
//     return '';
//   }
  
//   let bgColor = '#F0F7FA';
//   let borderColor = '#0D506F';
//   let titleColor = '#1A1A2E';
//   let titleIcon = '📝';
  
//   if (order.orderStatus === 'delivered') {
//     bgColor = '#F0FDF4';
//     borderColor = '#22C55E';
//     titleColor = '#22C55E';
//     titleIcon = '✅';
//   } else if (['shipped', 'out_for_delivery'].includes(order.orderStatus)) {
//     bgColor = '#F0F7FA';
//     borderColor = '#06B6D4';
//     titleColor = '#06B6D4';
//     titleIcon = '🚚';
//   } else if (order.orderStatus === 'cancelled' || order.orderStatus === 'rejected') {
//     bgColor = '#FEF2F2';
//     borderColor = '#EF4444';
//     titleColor = '#EF4444';
//     titleIcon = '❌';
//   }
  
//   let reasonText = '';
//   if (order.orderStatus === 'cancelled' && hasCancellationReason) {
//     reasonText = `Cancellation Reason: ${order.cancellationReason}`;
//   } else if (order.orderStatus === 'rejected' && hasRejectionReason) {
//     reasonText = `Rejection Reason: ${order.rejectionReason}`;
//   }
  
//   return `
//     <div style="background: ${bgColor}; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${borderColor}; border: 1px solid ${borderColor}30;">
//       <h2 style="margin: 0 0 15px 0; color: ${titleColor}; font-size: 18px; display: flex; align-items: center; gap: 8px; font-weight: 700;">
//         <span>${titleIcon}</span> <span>${getStatusLabel(order.orderStatus)}</span>
//       </h2>
//       <table style="width: 100%; border-collapse: collapse;">
//         ${reasonText ? `
//         <tr>
//           <td style="padding: 8px 0; width: 140px; color: #64748B;"><strong>${order.orderStatus === 'cancelled' ? 'Cancellation' : 'Rejection'} Reason:</strong></td>
//           <td><div style="background: #FFFFFF; padding: 12px; border-radius: 8px; margin-top: 5px; color: ${borderColor}; border: 1px solid ${borderColor}30;">${reasonText}</div></td>
//         </tr>
//         ` : ''}
//         ${hasDeliveredDate ? `
//         <tr>
//           <td style="padding: 8px 0; width: 140px; color: #64748B;"><strong>Delivered Date:</strong></td>
//           <td style="color: #1A1A2E;">${formatDate(order.deliveredAt)}</td>
//         </tr>
//         ` : ''}
//         ${hasTrackingNumber ? `
//         <tr>
//           <td style="padding: 8px 0; color: #64748B;"><strong>Tracking Number:</strong></td>
//           <td><code style="background: #FFFFFF; padding: 4px 8px; border-radius: 4px; color: #06B6D4; border: 1px solid #0D506F30; font-weight: 600;">${order.trackingNumber}</code></td>
//         </tr>
//         ` : ''}
//         ${order.deliveryService?.courierName ? `
//         <tr>
//           <td style="padding: 8px 0; color: #64748B;"><strong>Courier:</strong></td>
//           <td style="color: #1A1A2E; font-weight: 600;">${order.deliveryService.courierName}</td>
//         </tr>
//         ` : ''}
//         ${order.deliveryService?.trackingUrl ? `
//         <tr>
//           <td style="padding: 8px 0; color: #64748B;"><strong>Track Link:</strong></td>
//           <td><a href="${order.deliveryService.trackingUrl}" target="_blank" style="color: #06B6D4; text-decoration: none; font-weight: 600;">Track Your Order</a></td>
//         </tr>
//         ` : ''}
//         ${hasDeliveryNote ? `
//         <tr>
//           <td style="padding: 8px 0; color: #64748B;"><strong>Delivery Note:</strong></td>
//           <td><div style="background: #FFFFFF; padding: 12px; border-radius: 8px; margin-top: 5px; color: #1A1A2E; border: 1px solid #0D506F30;">${order.deliveryNote}</div></td>
//         </tr>
//         ` : ''}
//       </table>
//     </div>
//   `;
// };


// In orderEmailService.js - Update the deliveryInfoHTML function

/**
 * Generate delivery info HTML
 */
const generateDeliveryInfoHTML = (order) => {
  const hasDeliveryNote = order.deliveryNote && order.deliveryNote.trim() !== '';
  const hasTrackingNumber = order.trackingNumber && order.trackingNumber.trim() !== '';
  const hasDeliveredDate = order.deliveredAt && order.orderStatus === 'delivered';
  const hasCancellationReason = order.cancellationReason && order.cancellationReason.trim() !== '' && order.orderStatus === 'cancelled';
  const hasRejectionReason = order.rejectionReason && order.rejectionReason.trim() !== '' && order.orderStatus === 'rejected';
  
  // Check for courier info
  const hasCourier = order.deliveryService && order.deliveryService.courierName;
  const hasTrackingUrl = order.deliveryService && order.deliveryService.trackingUrl;
  const hasCourierOrderId = order.deliveryService && order.deliveryService.courierOrderId;
  
  if (!hasDeliveryNote && !hasTrackingNumber && !hasDeliveredDate && !hasCancellationReason && !hasRejectionReason && !hasCourier) {
    return '';
  }
  
  let bgColor = '#F0F7FA';
  let borderColor = '#0D506F';
  let titleColor = '#1A1A2E';
  let titleIcon = '📝';
  
  if (order.orderStatus === 'delivered') {
    bgColor = '#F0FDF4';
    borderColor = '#22C55E';
    titleColor = '#22C55E';
    titleIcon = '✅';
  } else if (['shipped', 'out_for_delivery'].includes(order.orderStatus)) {
    bgColor = '#F0F7FA';
    borderColor = '#06B6D4';
    titleColor = '#06B6D4';
    titleIcon = '🚚';
  } else if (order.orderStatus === 'processing' || order.orderStatus === 'courier_assigned') {
    bgColor = '#F0F7FA';
    borderColor = '#06B6D4';
    titleColor = '#06B6D4';
    titleIcon = '📦';
  } else if (order.orderStatus === 'cancelled' || order.orderStatus === 'rejected') {
    bgColor = '#FEF2F2';
    borderColor = '#EF4444';
    titleColor = '#EF4444';
    titleIcon = '❌';
  }
  
  let reasonText = '';
  if (order.orderStatus === 'cancelled' && hasCancellationReason) {
    reasonText = `Cancellation Reason: ${order.cancellationReason}`;
  } else if (order.orderStatus === 'rejected' && hasRejectionReason) {
    reasonText = `Rejection Reason: ${order.rejectionReason}`;
  }
  
  return `
    <div style="background: ${bgColor}; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${borderColor}; border: 1px solid ${borderColor}30;">
      <h2 style="margin: 0 0 15px 0; color: ${titleColor}; font-size: 18px; display: flex; align-items: center; gap: 8px; font-weight: 700;">
        <span>${titleIcon}</span> <span>${getStatusLabel(order.orderStatus)}</span>
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${reasonText ? `
        <tr>
          <td style="padding: 8px 0; width: 140px; color: #64748B;"><strong>${order.orderStatus === 'cancelled' ? 'Cancellation' : 'Rejection'} Reason:</strong></td>
          <td><div style="background: #FFFFFF; padding: 12px; border-radius: 8px; margin-top: 5px; color: ${borderColor}; border: 1px solid ${borderColor}30;">${reasonText}</div></td>
        </tr>
        ` : ''}
        ${hasDeliveredDate ? `
        <tr>
          <td style="padding: 8px 0; width: 140px; color: #64748B;"><strong>Delivered Date:</strong></td>
          <td style="color: #1A1A2E;">${formatDate(order.deliveredAt)}</td>
        </tr>
        ` : ''}
        ${hasTrackingNumber ? `
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Tracking Number:</strong></td>
          <td><code style="background: #FFFFFF; padding: 4px 8px; border-radius: 4px; color: #06B6D4; border: 1px solid #0D506F30; font-weight: 600;">${order.trackingNumber}</code></td>
        </tr>
        ` : ''}
        ${hasCourier ? `
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Courier Service:</strong></td>
          <td style="color: #1A1A2E; font-weight: 600;">${order.deliveryService.courierName}</td>
        </tr>
        ` : ''}
        ${hasCourierOrderId ? `
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Courier Order ID:</strong></td>
          <td style="color: #1A1A2E; font-weight: 600;">${order.deliveryService.courierOrderId}</td>
        </tr>
        ` : ''}
        ${hasTrackingUrl ? `
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Track Your Order:</strong></td>
          <td><a href="${order.deliveryService.trackingUrl}" target="_blank" style="color: #06B6D4; text-decoration: none; font-weight: 600; display: inline-block; padding: 8px 16px; background: #06B6D4; color: #FFFFFF; border-radius: 8px; background: linear-gradient(135deg, #06B6D4, #0D506F);">📦 Track Order on ${order.deliveryService.courierName || 'Courier'}</a></td>
        </tr>
        ` : ''}
        ${hasDeliveryNote ? `
        <tr>
          <td style="padding: 8px 0; color: #64748B;"><strong>Delivery Note:</strong></td>
          <td><div style="background: #FFFFFF; padding: 12px; border-radius: 8px; margin-top: 5px; color: #1A1A2E; border: 1px solid #0D506F30;">${order.deliveryNote}</div></td>
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
    // const adminEmail = process.env.OWNER_EMAIL || process.env.SMTP_USER;
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

    // Header based on order status
    const statusLabel = getStatusLabel(order.orderStatus);
    const statusEmoji = order.orderStatus === 'placed' ? '📦' : 
                        order.orderStatus === 'follow_up' ? '📞' :
                        order.orderStatus === 'accepted' ? '✅' :
                        order.orderStatus === 'approved' ? '✅' :
                        order.orderStatus === 'ready_to_ship' ? '📦' :
                        order.orderStatus === 'courier_assigned' ? '🚚' :
                        order.orderStatus === 'rejected' ? '❌' :
                        order.orderStatus === 'cancelled' ? '❌' :
                        order.orderStatus === 'reminder' ? '⏰' :
                        order.orderStatus === 'processing' ? '⚙️' :
                        order.orderStatus === 'shipped' ? '🚚' :
                        order.orderStatus === 'out_for_delivery' ? '🚚' :
                        order.orderStatus === 'delivered' ? '🎁' : '📦';

    const mailOptions = {
      from: `"HyperVolt" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      // Send copy to admin
      subject: `${statusEmoji} Order ${statusLabel}! - Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1A1A2E; margin: 0; padding: 0; background-color: #F0F7FA; }
            .container { max-width: 700px; margin: 20px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(13, 80, 111, 0.1); border: 1px solid #0D506F30; }
            .header { background: linear-gradient(135deg, #0D506F, #06B6D4); padding: 30px; text-align: center; }
            .header h1 { color: #FFFFFF; margin: 0; font-size: 28px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 700; }
            .header p { color: #FFFFFF; margin: 10px 0 0 0; opacity: 0.9; }
            .content { padding: 35px 30px; }
            .section-title { font-size: 18px; font-weight: 700; margin: 25px 0 15px 0; display: flex; align-items: center; gap: 8px; color: #1A1A2E; }
            .button { background: linear-gradient(135deg, #06B6D4, #0D506F); color: #FFFFFF; padding: 14px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; border: none; }
            .button:hover { opacity: 0.9; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #0D506F30; text-align: center; }
            p { color: #64748B; }
            strong { color: #1A1A2E; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span>${statusEmoji}</span>
                <span>Order ${statusLabel}!</span>
              </h1>
              <p>Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}</p>
            </div>
            <div class="content">
              <p style="margin-bottom: 25px; font-size: 16px;">Dear <strong>${order.customerInfo?.fullName || 'Valued Customer'}</strong>,</p>
              <p style="margin-bottom: 25px; font-size: 16px; color: #1A1A2E;">
                ${order.orderStatus === 'placed' ? 'Thank you for your order! We have received your order and it is now pending confirmation. You will receive another email once your order is confirmed.' :
                  order.orderStatus === 'follow_up' ? 'Your order is being reviewed by our team. We will contact you shortly for confirmation.' :
                  order.orderStatus === 'accepted' ? 'Great news! Your order has been accepted and is being prepared.' :
                  order.orderStatus === 'approved' ? 'Your order has been approved and is ready for processing.' :
                  order.orderStatus === 'ready_to_ship' ? 'Your order is packed and ready to be shipped!' :
                  order.orderStatus === 'courier_assigned' ? 'A courier has been assigned to deliver your order.' :
                  order.orderStatus === 'processing' ? 'Your order is being processed by the courier service.' :
                  order.orderStatus === 'shipped' ? 'Your order has been shipped and is on its way to you!' :
                  order.orderStatus === 'out_for_delivery' ? 'Your order is out for delivery! Get ready to receive it.' :
                  order.orderStatus === 'delivered' ? 'Your order has been delivered! We hope you love your new products.' :
                  order.orderStatus === 'cancelled' ? 'Your order has been cancelled. If you have any questions, please contact our support team.' :
                  order.orderStatus === 'rejected' ? 'Your order has been rejected. Please contact our support team for more information.' :
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
  <a href="${frontendUrl}/track" class="button" style="color: #FFFFFF; text-decoration: none; display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #06B6D4, #0D506F); border-radius: 8px; font-weight: 600; font-size: 16px; border: none;">
    Track Your Order
  </a>
</div>
              
              <div class="footer">
                <p style="margin-bottom: 5px;">Best regards,</p>
                <p style="margin: 0; font-weight: bold; color: #06B6D4;">HyperVolt Team</p>
                <p style="font-size: 12px; color: #94A3B8; margin-top: 15px;">Need help? Contact us at ${process.env.SMTP_USER}</p>
                <p style="font-size: 11px; color: #94A3B8; margin-top: 5px;">⚡ Powering Your Digital Life</p>
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
    console.log('📧 Admin copy sent to:', adminEmail);
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
    const deliveryInfoHTML = generateDeliveryInfoHTML(order);
    const statusLabel = getStatusLabel(order.orderStatus);
    
    let headerTitle = '';
    let headerEmoji = '';
    let additionalMessage = '';
    
    if (eventType === 'new') {
      headerTitle = 'New Order Received!';
      headerEmoji = '🛍️';
      additionalMessage = 'A new order has been placed and requires your attention.';
    } else if (eventType === 'status_update') {
      headerTitle = `Order ${statusLabel}`;
      headerEmoji = '📝';
      additionalMessage = `Order status has been updated to "${statusLabel}".`;
    } else if (eventType === 'payment_update') {
      const paymentInfo = {
        'paid': { title: 'Payment Received', emoji: '💰' },
        'failed': { title: 'Payment Failed', emoji: '⚠️' },
        'refunded': { title: 'Payment Refunded', emoji: '💸' },
        'partial': { title: 'Partial Payment', emoji: '💳' }
      };
      const info = paymentInfo[order.paymentStatus] || { title: 'Payment Updated', emoji: '💳' };
      headerTitle = info.title;
      headerEmoji = info.emoji;
      additionalMessage = `Payment status has been updated to "${order.paymentStatus.toUpperCase()}".`;
    }
    
    const result = await transporter.sendMail({
      from: `"HyperVolt System" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `${headerEmoji} ${headerTitle} - Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1A1A2E; background-color: #F0F7FA; }
            .container { max-width: 700px; margin: 20px auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(13, 80, 111, 0.1); border: 1px solid #0D506F30; }
            .header { background: linear-gradient(135deg, #0D506F, #06B6D4); padding: 25px 30px; text-align: center; }
            .header h1 { color: #FFFFFF; margin: 0; font-size: 24px; display: flex; align-items: center; justify-content: center; gap: 10px; font-weight: 700; }
            .content { padding: 30px; }
            .button { background: linear-gradient(135deg, #06B6D4, #0D506F); color: #FFFFFF; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; border: none; }
            .button:hover { opacity: 0.9; }
            .section-title { font-size: 18px; font-weight: 700; margin: 25px 0 15px 0; color: #1A1A2E; }
            p { color: #64748B; }
            strong { color: #1A1A2E; }
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
              ${deliveryInfoHTML}
              
              <div class="section-title">🛍️ Order Items</div>
              ${itemsHTML}
              
              ${pricingHTML}
              
             <div style="text-align: center; margin: 30px 0;">
  <a href="${frontendUrl}/authorize/orders" class="button" style="color: #FFFFFF; text-decoration: none; display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #06B6D4, #0D506F); border-radius: 8px; font-weight: 600; font-size: 16px; border: none; cursor: pointer;">
    View Order in Dashboard
  </a>
</div>
              
              <div style="background: #F0F7FA; padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid #0D506F30;">
                <p style="margin: 0; font-size: 14px; color: #06B6D4;">⚡ Please review and take necessary action.</p>
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
// const sendOrderStatusUpdateEmail = async (order, customerEmail, oldStatus, newStatus) => {
//   console.log('📧 Sending order status update email with full details...');
  
//   try {
//     if (!customerEmail) {
//       throw new Error('Customer email is missing');
//     }
    
//     const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
//     const adminEmail = process.env.OWNER_EMAIL || process.env.SMTP_USER;
//     const newStatusColor = getStatusColor(newStatus);
//     const newStatusLabel = getStatusLabel(newStatus);
//     const itemsHTML = generateOrderItemsHTML(order.items);
//     const summaryHTML = generateOrderSummaryHTML(order);
//     const pricingHTML = generatePricingHTML(order);
//     const customerInfoHTML = generateCustomerInfoHTML(order);
//     const deliveryInfoHTML = generateDeliveryInfoHTML(order);

//     // Generate PDF invoice
//     let pdfBuffer = null;
//     try {
//       console.log('📄 Generating PDF invoice for status update - Order:', order.orderNumber);
//       const pdfResult = await generateInvoicePDF(order);
//       if (pdfResult && pdfResult.buffer) {
//         pdfBuffer = pdfResult.buffer;
//         console.log('✅ PDF generated successfully, size:', pdfBuffer.length, 'bytes');
//       } else {
//         console.warn('⚠️ PDF generation returned no buffer');
//       }
//     } catch (pdfError) {
//       console.error('❌ PDF generation error:', pdfError.message);
//     }
    
//     let statusMessage = '';
//     let statusEmoji = '';
    
//     switch(newStatus) {
//       case 'placed':
//         statusMessage = 'Your order has been placed successfully. We are processing your order.';
//         statusEmoji = '📦';
//         break;
//       case 'follow_up':
//         statusMessage = 'Your order is being reviewed by our team. We will contact you shortly.';
//         statusEmoji = '📞';
//         break;
//       case 'accepted':
//         statusMessage = 'Great news! Your order has been accepted and is being prepared.';
//         statusEmoji = '✅';
//         break;
//       case 'approved':
//         statusMessage = 'Your order has been approved and is ready for processing.';
//         statusEmoji = '✅';
//         break;
//       case 'ready_to_ship':
//         statusMessage = 'Your order is packed and ready to be shipped!';
//         statusEmoji = '📦';
//         break;
//       case 'courier_assigned':
//         statusMessage = 'A courier has been assigned to deliver your order.';
//         statusEmoji = '🚚';
//         break;
//       case 'processing':
//         statusMessage = 'Your order is being processed by the courier service.';
//         statusEmoji = '⚙️';
//         break;
//       case 'shipped':
//         statusMessage = 'Your order has been shipped and is on its way to you!';
//         statusEmoji = '🚚';
//         break;
//       case 'out_for_delivery':
//         statusMessage = 'Your order is out for delivery! Get ready to receive it.';
//         statusEmoji = '🚚';
//         break;
//       case 'delivered':
//         statusMessage = 'Your order has been delivered! We hope you love your new products.';
//         statusEmoji = '🎁';
//         break;
//       case 'cancelled':
//         statusMessage = 'Your order has been cancelled. If you have any questions, please contact our support team.';
//         statusEmoji = '❌';
//         break;
//       case 'rejected':
//         statusMessage = 'Your order has been rejected. Please contact our support team for more information.';
//         statusEmoji = '❌';
//         break;
//       case 'reminder':
//         statusMessage = 'A reminder has been set regarding your order.';
//         statusEmoji = '⏰';
//         break;
//       default:
//         statusMessage = `Your order status has been updated to ${newStatusLabel}.`;
//         statusEmoji = '📝';
//     }
    
//     const mailOptions = {
//       from: `"HyperVolt" <${process.env.SMTP_USER}>`,
//       to: customerEmail,
//       bcc: adminEmail,  // Send copy to admin
//       subject: `${statusEmoji} Order ${newStatusLabel}! - Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <style>
//             body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1A1A2E; margin: 0; padding: 0; background-color: #F0F7FA; }
//             .container { max-width: 700px; margin: 20px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(13, 80, 111, 0.1); border: 1px solid #0D506F30; }
//             .header { background: linear-gradient(135deg, #0D506F, #06B6D4); padding: 30px; text-align: center; }
//             .header h1 { color: #FFFFFF; margin: 0; font-size: 28px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 700; }
//             .header p { color: #FFFFFF; margin: 10px 0 0 0; opacity: 0.9; }
//             .content { padding: 35px 30px; }
//             .status-box { background: ${newStatusColor}10; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${newStatusColor}; border: 1px solid ${newStatusColor}30; }
//             .status-badge { display: inline-block; padding: 8px 24px; background: ${newStatusColor}; color: #FFFFFF; border-radius: 40px; font-weight: 600; text-transform: uppercase; font-size: 14px; }
//             .section-title { font-size: 18px; font-weight: 700; margin: 25px 0 15px 0; display: flex; align-items: center; gap: 8px; color: #1A1A2E; }
//             .button { background: linear-gradient(135deg, #06B6D4, #0D506F); color: #FFFFFF; padding: 14px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; border: none; }
//             .button:hover { opacity: 0.9; }
//             .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #0D506F30; text-align: center; }
//             p { color: #64748B; }
//             strong { color: #1A1A2E; }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>
//                 <span>${statusEmoji}</span>
//                 <span>Order ${newStatusLabel}!</span>
//               </h1>
//               <p>Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}</p>
//             </div>
//             <div class="content">
//               <p style="margin-bottom: 25px; font-size: 16px;">Dear <strong>${order.customerInfo?.fullName || 'Valued Customer'}</strong>,</p>
              
//               <div class="status-box">
//                 <div class="status-badge">${newStatusLabel.toUpperCase()}</div>
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
//                 <a href="${frontendUrl}/track" class="button">View Order Details</a>
//               </div>
              
//               <div class="footer">
//                 <p style="margin-bottom: 5px;">Best regards,</p>
//                 <p style="margin: 0; font-weight: bold; color: #06B6D4;">HyperVolt Team</p>
//                 <p style="font-size: 12px; color: #94A3B8; margin-top: 15px;">Need help? Contact us at ${process.env.SMTP_USER}</p>
//                 <p style="font-size: 11px; color: #94A3B8; margin-top: 5px;">⚡ Powering Your Digital Life</p>
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
//       console.log('📎 PDF attachment added to status update email');
//     }

//     const result = await transporter.sendMail(mailOptions);
//     console.log('✅ Order status update email sent:', result.messageId);
//     console.log('📧 Admin copy sent to:', adminEmail);
//     return { success: true };
//   } catch (error) {
//     console.error('❌ Status update email error:', error.message);
//     return { success: false, error: error.message };
//   }
// };


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
    const adminEmail = process.env.OWNER_EMAIL || process.env.SMTP_USER;
    const newStatusColor = getStatusColor(newStatus);
    const newStatusLabel = getStatusLabel(newStatus);
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
    
    let statusMessage = '';
    let statusEmoji = '';
    
    switch(newStatus) {
      case 'placed':
        statusMessage = 'Your order has been placed successfully. We are processing your order.';
        statusEmoji = '📦';
        break;
      case 'follow_up':
        statusMessage = 'Your order is being reviewed by our team. We will contact you shortly.';
        statusEmoji = '📞';
        break;
      case 'accepted':
        statusMessage = 'Great news! Your order has been accepted and is being prepared.';
        statusEmoji = '✅';
        break;
      case 'approved':
        statusMessage = 'Your order has been approved and is ready for processing.';
        statusEmoji = '✅';
        break;
      case 'ready_to_ship':
        statusMessage = 'Your order is packed and ready to be shipped!';
        statusEmoji = '📦';
        break;
      case 'courier_assigned':
        statusMessage = 'A courier has been assigned to deliver your order.';
        statusEmoji = '🚚';
        break;
      case 'processing':
        // Get courier name if available
        const courierName = order.deliveryService?.courierName || 'courier';
        statusMessage = `Your order has been assigned to ${courierName} for delivery.You can now track your order using the tracking details below.`;
        statusEmoji = '🚚';
        break;
      case 'shipped':
        statusMessage = 'Your order has been shipped and is on its way to you!';
        statusEmoji = '🚚';
        break;
      case 'out_for_delivery':
        statusMessage = 'Your order is out for delivery! Get ready to receive it.';
        statusEmoji = '🚚';
        break;
      case 'delivered':
        statusMessage = 'Your order has been delivered! We hope you love your new products.';
        statusEmoji = '🎁';
        break;
      case 'cancelled':
        statusMessage = 'Your order has been cancelled. If you have any questions, please contact our support team.';
        statusEmoji = '❌';
        break;
      case 'rejected':
        statusMessage = 'Your order has been rejected. Please contact our support team for more information.';
        statusEmoji = '❌';
        break;
      case 'reminder':
        statusMessage = 'A reminder has been sent regarding your order.';
        statusEmoji = '⏰';
        break;
      default:
        statusMessage = `Your order status has been updated to ${newStatusLabel}.`;
        statusEmoji = '📝';
    }
    
    const mailOptions = {
      from: `"HyperVolt" <${process.env.SMTP_USER}>`,
      to: customerEmail,
     
      subject: `${statusEmoji} Order ${newStatusLabel}! - Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1A1A2E; margin: 0; padding: 0; background-color: #F0F7FA; }
            .container { max-width: 700px; margin: 20px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(13, 80, 111, 0.1); border: 1px solid #0D506F30; }
            .header { background: linear-gradient(135deg, #0D506F, #06B6D4); padding: 30px; text-align: center; }
            .header h1 { color: #FFFFFF; margin: 0; font-size: 28px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 700; }
            .header p { color: #FFFFFF; margin: 10px 0 0 0; opacity: 0.9; }
            .content { padding: 35px 30px; }
            .status-box { background: ${newStatusColor}10; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${newStatusColor}; border: 1px solid ${newStatusColor}30; }
            .status-badge { display: inline-block; padding: 8px 24px; background: ${newStatusColor}; color: #FFFFFF; border-radius: 40px; font-weight: 600; text-transform: uppercase; font-size: 14px; }
            .section-title { font-size: 18px; font-weight: 700; margin: 25px 0 15px 0; display: flex; align-items: center; gap: 8px; color: #1A1A2E; }
            .button { background: linear-gradient(135deg, #06B6D4, #0D506F); color: #FFFFFF; padding: 14px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; border: none; }
            .button:hover { opacity: 0.9; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #0D506F30; text-align: center; }
            p { color: #64748B; }
            strong { color: #1A1A2E; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span>${statusEmoji}</span>
                <span>Order ${newStatusLabel}!</span>
              </h1>
              <p>Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}</p>
            </div>
            <div class="content">
              <p style="margin-bottom: 25px; font-size: 16px;">Dear <strong>${order.customerInfo?.fullName || 'Valued Customer'}</strong>,</p>
              
              <div class="status-box">
                <div class="status-badge">${newStatusLabel.toUpperCase()}</div>
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
  <a href="${frontendUrl}/track" class="button" style="color: #FFFFFF; text-decoration: none; display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #06B6D4, #0D506F); border-radius: 8px; font-weight: 600; font-size: 16px; border: none;">
    View Order Details
  </a>
</div>
              
              <div class="footer">
                <p style="margin-bottom: 5px;">Best regards,</p>
                <p style="margin: 0; font-weight: bold; color: #06B6D4;">HyperVolt Team</p>
                <p style="font-size: 12px; color: #94A3B8; margin-top: 15px;">Need help? Contact us at ${process.env.SMTP_USER}</p>
                <p style="font-size: 11px; color: #94A3B8; margin-top: 5px;">⚡ Powering Your Digital Life</p>
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
    console.log('📧 Admin copy sent to:', adminEmail);
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
    // const adminEmail = process.env.OWNER_EMAIL || process.env.SMTP_USER;
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
    let statusColor = '#0D506F';
    
    switch(newStatus) {
      case 'paid':
        statusMessage = 'Your payment has been successfully received. Thank you for your purchase!';
        statusEmoji = '✅';
        statusColor = '#22C55E';
        break;
      case 'failed':
        statusMessage = 'Your payment has failed. Please try again or contact your bank.';
        statusEmoji = '❌';
        statusColor = '#EF4444';
        break;
      case 'refunded':
        statusMessage = 'Your payment has been refunded. The amount will be credited back to your original payment method within 3-5 business days.';
        statusEmoji = '💰';
        statusColor = '#94A3B8';
        break;
      case 'partial':
        statusMessage = 'Your payment has been partially received. Please complete the remaining payment.';
        statusEmoji = '💳';
        statusColor = '#F59E0B';
        break;
      default:
        statusMessage = `Your payment status has been updated to ${newStatus}.`;
        statusEmoji = '📝';
        statusColor = '#0D506F';
    }
    
    const mailOptions = {
      from: `"HyperVolt" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      // bcc: adminEmail,  // Send copy to admin
      subject: `${statusEmoji} Payment Status Update - Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1A1A2E; margin: 0; padding: 0; background-color: #F0F7FA; }
            .container { max-width: 700px; margin: 20px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(13, 80, 111, 0.1); border: 1px solid #0D506F30; }
            .header { background: linear-gradient(135deg, #0D506F, #06B6D4); padding: 30px; text-align: center; }
            .header h1 { color: #FFFFFF; margin: 0; font-size: 28px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 700; }
            .header p { color: #FFFFFF; margin: 10px 0 0 0; opacity: 0.9; }
            .content { padding: 35px 30px; }
            .status-box { background: ${statusColor}10; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${statusColor}; border: 1px solid ${statusColor}30; }
            .status-badge { display: inline-block; padding: 8px 24px; background: ${statusColor}; color: #FFFFFF; border-radius: 40px; font-weight: 600; text-transform: uppercase; font-size: 14px; }
            .section-title { font-size: 18px; font-weight: 700; margin: 25px 0 15px 0; display: flex; align-items: center; gap: 8px; color: #1A1A2E; }
            .button { background: linear-gradient(135deg, #06B6D4, #0D506F); color: #FFFFFF; padding: 14px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; border: none; }
            .button:hover { opacity: 0.9; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #0D506F30; text-align: center; }
            p { color: #64748B; }
            strong { color: #1A1A2E; }
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
                <p style="margin: 0; font-weight: bold; color: #06B6D4;">HyperVolt Team</p>
                <p style="font-size: 12px; color: #94A3B8; margin-top: 15px;">Need help? Contact us at ${process.env.SMTP_USER}</p>
                <p style="font-size: 11px; color: #94A3B8; margin-top: 5px;">⚡ Powering Your Digital Life</p>
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
    console.log('📧 Admin copy sent to:', adminEmail);
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