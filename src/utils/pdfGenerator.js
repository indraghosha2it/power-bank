


// // utils/pdfGenerator.js - CommonJS version with correct jspdf import
// const { jsPDF } = require('jspdf');
// require('jspdf-autotable');

// // Helper function to format currency (BDT)
// const formatPrice = (price) => {
//   return new Intl.NumberFormat('en-BD', {
//     style: 'currency',
//     currency: 'BDT',
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2
//   }).format(price || 0);
// };

// // Helper function to format date
// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-BD', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   });
// };

// // Helper function to convert image to base64
// const imageToBase64 = async (imageUrl) => {
//   try {
//     if (imageUrl?.startsWith('data:image')) {
//       return imageUrl;
//     }
//     if (!imageUrl) return null;
//     const response = await fetch(imageUrl);
//     const blob = await response.blob();
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   } catch (error) {
//     console.error('Error converting image to base64:', error);
//     return null;
//   }
// };

// // Get company initials for logo fallback
// const getCompanyInitials = (companyName) => {
//   if (!companyName) return 'BB';
//   return companyName
//     .split(' ')
//     .map(word => word[0])
//     .join('')
//     .toUpperCase()
//     .substring(0, 2);
// };

// // BeautyBucket Theme Colors
// const COLORS = {
//   primary: '#EE4275',
//   secondary: '#FFF5F6',
//   accent: '#FF6B9D',
//   neutral: '#FFFFFF',
//   lightGray: '#FFF5F6',
//   border: '#FFD2DB',
//   text: '#2D1B2E',
//   textLight: '#8B7A8C',
//   paid: '#4CAF50',
//   unpaid: '#F44336',
//   partial: '#FFC107'
// };

// const generateInvoicePDF = async (order) => {
//   try {
//     // Create a new jsPDF instance
//     const doc = new jsPDF({
//       orientation: 'portrait',
//       unit: 'mm',
//       format: 'a4'
//     });

//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();
//     const margin = 15;
//     const contentWidth = pageWidth - (2 * margin);
//     let yPos = margin;

//     // Load company logo from /logo.png
//     let companyLogoBase64 = null;
//     try {
//       companyLogoBase64 = await imageToBase64('/logo.png');
//     } catch (error) {
//       console.error('Failed to load logo:', error);
//     }

//     // ==================== HEADER ====================
//     // Colored header bar
//     doc.setFillColor(238, 66, 117);
//     doc.rect(0, 0, pageWidth, 32, 'F');
    
//     // White rounded rectangle for content
//     doc.setFillColor(COLORS.neutral);
//     doc.roundedRect(margin, yPos, contentWidth, 26, 2, 2, 'F');

//     const logoSize = 18;
//     const logoMaxWidth = 22;
//     const logoMaxHeight = 18;
//     const logoX = margin + 5;
//     const logoY = yPos + 4;

//     // Logo or initials
//     if (companyLogoBase64) {
//       try {
//         const img = new Image();
//         img.src = companyLogoBase64;
        
//         await new Promise((resolve) => {
//           img.onload = resolve;
//         });
        
//         let imgWidth = img.width;
//         let imgHeight = img.height;
//         let finalWidth = logoSize;
//         let finalHeight = logoSize;
        
//         const aspectRatio = imgWidth / imgHeight;
        
//         if (aspectRatio > 1) {
//           finalWidth = logoSize;
//           finalHeight = logoSize / aspectRatio;
//         } else {
//           finalHeight = logoSize;
//           finalWidth = logoSize * aspectRatio;
//         }
        
//         if (finalWidth > logoMaxWidth) {
//           finalWidth = logoMaxWidth;
//           finalHeight = finalWidth / aspectRatio;
//         }
//         if (finalHeight > logoMaxHeight) {
//           finalHeight = logoMaxHeight;
//           finalWidth = finalHeight * aspectRatio;
//         }
        
//         const offsetX = (logoSize - finalWidth) / 2;
//         const offsetY = (logoSize - finalHeight) / 2;
        
//         doc.addImage(companyLogoBase64, 'PNG', logoX + offsetX, logoY + offsetY, finalWidth, finalHeight);
//       } catch (error) {
//         const initials = getCompanyInitials('BeautyBucket');
//         doc.setFillColor(238, 66, 117);
//         doc.roundedRect(logoX, logoY, logoSize, logoSize, 2, 2, 'F');
//         doc.setFontSize(9);
//         doc.setFont('helvetica', 'bold');
//         doc.setTextColor(COLORS.neutral);
//         doc.text(initials, logoX + logoSize/2, logoY + logoSize/2 + 1, { align: 'center' });
//       }
//     } else {
//       const initials = getCompanyInitials('BeautyBucket');
//       doc.setFillColor(238, 66, 117);
//       doc.roundedRect(logoX, logoY, logoSize, logoSize, 2, 2, 'F');
//       doc.setFontSize(9);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(COLORS.neutral);
//       doc.text(initials, logoX + logoSize/2, logoY + logoSize/2 + 1, { align: 'center' });
//     }

//     const companyX = logoX + logoSize + 8;

//     // Split "BeautyBucket" into two parts with different colors
//     const beautyText = 'Beauty';
//     const bucketText = 'Bucket';
//     const textX = companyX;
//     const textY = logoY + 4;

//     // Draw "Beauty" in pink
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(238, 66, 117);
//     doc.text(beautyText, textX, textY);

//     // Calculate width of "Beauty" to position "Bucket" next to it
//     const beautyWidth = doc.getTextWidth(beautyText);

//     // Draw "Bucket" in default text color
//     doc.setTextColor(COLORS.text);
//     doc.text(bucketText, textX + beautyWidth, textY);

//     doc.setFontSize(7);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(COLORS.textLight);
    
//     doc.setFont('helvetica', 'bold');
//     doc.text('Contact: ', companyX, logoY + 9);
//     const contactLabelWidth = doc.getTextWidth('Contact: ');
//     doc.setFont('helvetica', 'normal');
//     doc.text('+8801XXXXXXXXX', companyX + contactLabelWidth, logoY + 9);

//     doc.setFontSize(6.5);
//     doc.text('info@beautybucket.com', companyX, logoY + 13);

//     doc.setFontSize(6);
//     const companyAddressLines = doc.splitTextToSize('House #470, Avenue 6, Road 6, Mirpur DOHS, Dhaka', 70);
//     doc.text(companyAddressLines, companyX, logoY + 17);

//     const rightAlignX = pageWidth - margin - 5;
    
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(238, 66, 117);
//     const invoiceNoText = 'INVOICE NO: ';
//     const orderNumber = order.orderNumber || order._id.slice(-8).toUpperCase();
//     doc.text(invoiceNoText, rightAlignX - doc.getTextWidth(invoiceNoText + orderNumber), yPos + 8);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(COLORS.text);
//     doc.text(orderNumber, rightAlignX, yPos + 8, { align: 'right' });

//     doc.setFontSize(6.5);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(COLORS.textLight);
    
//     const orderDate = formatDate(order.createdAt);
//     const status = order.orderStatus?.toUpperCase() || 'PLACED';
//     const paymentMethod = order.paymentMethod?.toUpperCase() || 'COD';
    
//     doc.text(`Date: ${orderDate}`, rightAlignX, yPos + 11.5, { align: 'right' });
    
//     let statusColor = COLORS.unpaid;
//     if (status === 'DELIVERED') statusColor = COLORS.paid;
//     else if (status === 'CANCELLED') statusColor = COLORS.unpaid;
//     doc.setTextColor(statusColor);
//     doc.text(`Status: ${status}`, rightAlignX, yPos + 15.5, { align: 'right' });
//     doc.setTextColor(COLORS.textLight);
    
//     doc.text(`Payment: ${paymentMethod}`, rightAlignX, yPos + 19.5, { align: 'right' });

//     // ==================== CUSTOMER & DELIVERY INFO SECTION ====================
//     yPos += 34;
    
//     // Customer Info (Left Column)
//     const customerColWidth = (contentWidth / 2) - 3;
//     const addressColWidth = (contentWidth / 2) - 3;
    
//     let leftColHeight = 25;
//     let rightColHeight = 25;
    
//     // Calculate heights for customer info
//     const customerInfoLines = [
//       `Name: ${order.customerInfo.fullName || 'N/A'}`,
//       order.customerInfo.email ? `Email: ${order.customerInfo.email}` : null,
//       `Phone: ${order.customerInfo.phone || 'N/A'}`,
//       `Address: ${order.customerInfo.address || 'N/A'}`
//     ].filter(Boolean);
//     leftColHeight = Math.max(leftColHeight, 10 + (customerInfoLines.length * 4.5));
    
//     // Calculate heights for delivery address
//     const deliveryAddressLines = [
//       order.customerInfo.area ? `Area/Union: ${order.customerInfo.area}` : null,
//       order.customerInfo.zone ? `Upazila/Thana: ${order.customerInfo.zone}` : null,
//       order.customerInfo.city ? `District/City: ${order.customerInfo.city}` : null,
//       order.customerInfo.division ? `Division: ${order.customerInfo.division}` : null,
//       // order.customerInfo.zipCode ? `Zip Code: ${order.customerInfo.zipCode}` : null
//     ].filter(Boolean);
//     rightColHeight = Math.max(rightColHeight, 10 + (deliveryAddressLines.length * 4.5));
    
//     const colHeight = Math.max(leftColHeight, rightColHeight, 35);
    
//     // Left Column - Customer Info
//     doc.setFillColor(245, 245, 250);
//     doc.roundedRect(margin, yPos, customerColWidth, colHeight, 2, 2, 'F');
    
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(238, 66, 117);
//     doc.text('CUSTOMER INFO', margin + 5, yPos + 5);
    
//     let leftY = yPos + 10;
//     doc.setFontSize(6.5);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(COLORS.text);
    
//     // Name
//     doc.setFont('helvetica', 'bold');
//     doc.text('Name:', margin + 5, leftY);
//     doc.setFont('helvetica', 'normal');
//     doc.text(order.customerInfo.fullName || 'N/A', margin + 30, leftY);
//     leftY += 4.5;
    
//     // Email (if exists)
//     if (order.customerInfo.email) {
//       doc.setFont('helvetica', 'bold');
//       doc.text('Email:', margin + 5, leftY);
//       doc.setFont('helvetica', 'normal');
//       doc.text(order.customerInfo.email, margin + 30, leftY);
//       leftY += 4.5;
//     }
    
//     // Phone
//     doc.setFont('helvetica', 'bold');
//     doc.text('Phone:', margin + 5, leftY);
//     doc.setFont('helvetica', 'normal');
//     doc.text(order.customerInfo.phone || 'N/A', margin + 30, leftY);
//     leftY += 4.5;
    
//     // Address
//     doc.setFont('helvetica', 'bold');
//     doc.text('Address:', margin + 5, leftY);
//     doc.setFont('helvetica', 'normal');
//     const addressValue = order.customerInfo.address || 'N/A';
//     const addressLines = doc.splitTextToSize(addressValue, customerColWidth - 35);
//     for (let i = 0; i < addressLines.length; i++) {
//       const xPos = i === 0 ? margin + 30 : margin + 5 + 5;
//       doc.text(addressLines[i], xPos, leftY + (i * 4));
//     }
    
//     // Right Column - Delivery Address
//     const addressColX = margin + customerColWidth + 6;
//     doc.setFillColor(245, 245, 250);
//     doc.roundedRect(addressColX, yPos, addressColWidth, colHeight, 2, 2, 'F');
    
//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(238, 66, 117);
//     doc.text('DELIVERY ADDRESS', addressColX + 5, yPos + 5);
    
//     let rightY = yPos + 10;
//     doc.setFontSize(6.5);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(COLORS.text);
    
//     // Area/Union
//     if (order.customerInfo.area) {
//       doc.setFont('helvetica', 'bold');
//       doc.text('Area/Union:', addressColX + 5, rightY);
//       doc.setFont('helvetica', 'normal');
//       doc.text(order.customerInfo.area, addressColX + 40, rightY);
//       rightY += 4.5;
//     }
    
//     // Upazila/Thana
//     if (order.customerInfo.zone) {
//       doc.setFont('helvetica', 'bold');
//       doc.text('Upazila/Thana:', addressColX + 5, rightY);
//       doc.setFont('helvetica', 'normal');
//       doc.text(order.customerInfo.zone, addressColX + 40, rightY);
//       rightY += 4.5;
//     }
    
//     // District/City
//     if (order.customerInfo.city) {
//       doc.setFont('helvetica', 'bold');
//       doc.text('District/City:', addressColX + 5, rightY);
//       doc.setFont('helvetica', 'normal');
//       doc.text(order.customerInfo.city, addressColX + 40, rightY);
//       rightY += 4.5;
//     }
    
//     // Division
//     if (order.customerInfo.division) {
//       doc.setFont('helvetica', 'bold');
//       doc.text('Division:', addressColX + 5, rightY);
//       doc.setFont('helvetica', 'normal');
//       doc.text(order.customerInfo.division, addressColX + 40, rightY);
//       rightY += 4.5;
//     }
    
//     // Zip Code
//     // if (order.customerInfo.zipCode) {
//     //   doc.setFont('helvetica', 'bold');
//     //   doc.text('Zip Code:', addressColX + 5, rightY);
//     //   doc.setFont('helvetica', 'normal');
//     //   doc.text(order.customerInfo.zipCode, addressColX + 40, rightY);
//     // }
    
//     yPos += colHeight + 10;

//     // ==================== ITEMS TABLE ====================
//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(COLORS.text);
//     doc.text('ORDER ITEMS', margin, yPos);
//     yPos += 5;

//     // Table Column Positions
//     const colPositions = {
//       item: margin + 3,
//       product: margin + 10,
//       unit: margin + contentWidth - 95,
//       qty: margin + contentWidth - 70,
//       price: margin + contentWidth - 45,
//       total: margin + contentWidth - 10
//     };

//     // Table Header
//     doc.setFillColor(238, 66, 117);
//     doc.rect(margin, yPos, contentWidth, 7, 'F');

//     doc.setFontSize(7);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(COLORS.neutral);

//     doc.text('#', colPositions.item, yPos + 4.5);
//     doc.text('Product', colPositions.product, yPos + 4.5);
//     doc.text('Unit', colPositions.unit, yPos + 4.5);
//     doc.text('Qty', colPositions.qty, yPos + 4.5, { align: 'right' });
//     doc.text('Price', colPositions.price, yPos + 4.5, { align: 'right' });
//     doc.text('Total', colPositions.total, yPos + 4.5, { align: 'right' });

//     yPos += 10;

//     let rowCount = 0;
//     const orderItems = order.items || [];
    
//     orderItems.forEach((item, index) => {
//       const price = item.discountPrice || item.regularPrice || 0;
//       const totalPrice = price * (item.quantity || 0);
//       const isEven = rowCount % 2 === 0;
      
//       const rowHeight = 7;
      
//       // Check if we need a new page
//       if (yPos + rowHeight > pageHeight - 55) {
//         doc.addPage();
//         yPos = margin + 10;
//         rowCount = 0;
        
//         // Re-draw header on new page
//         doc.setFillColor(238, 66, 117);
//         doc.rect(margin, yPos, contentWidth, 7, 'F');
//         doc.setFontSize(7);
//         doc.setFont('helvetica', 'bold');
//         doc.setTextColor(COLORS.neutral);
//         doc.text('#', colPositions.item, yPos + 4.5);
//         doc.text('Product', colPositions.product, yPos + 4.5);
//         doc.text('Unit', colPositions.unit, yPos + 4.5);
//         doc.text('Qty', colPositions.qty, yPos + 4.5, { align: 'right' });
//         doc.text('Price', colPositions.price, yPos + 4.5, { align: 'right' });
//         doc.text('Total', colPositions.total, yPos + 4.5, { align: 'right' });
//         yPos += 10;
//       }

//       // Row background
//       if (isEven) {
//         doc.setFillColor(255, 245, 246);
//         doc.rect(margin, yPos - 2, contentWidth, rowHeight, 'F');
//       }

//       doc.setFontSize(6.5);
//       doc.setFont('helvetica', 'normal');
//       doc.setTextColor(COLORS.text);

//       const textY = yPos + 4;
      
//       doc.text((index + 1).toString(), colPositions.item, textY);
      
//       // Product name with truncation
//       let productName = item.productName || '';
//       const maxWidth = 60;
//       while (doc.getTextWidth(productName) > maxWidth && productName.length > 3) {
//         productName = productName.substring(0, productName.length - 1);
//       }
//       if (productName !== (item.productName || '')) {
//         productName = productName.substring(0, productName.length - 3) + '...';
//       }
//       doc.text(productName, colPositions.product, textY);
      
//       doc.text(item.unit || 'pcs', colPositions.unit, textY);
//       doc.text((item.quantity || 0).toString(), colPositions.qty, textY, { align: 'right' });
//       doc.text(formatPrice(price), colPositions.price, textY, { align: 'right' });
      
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(238, 66, 117);
//       doc.text(formatPrice(totalPrice), colPositions.total, textY, { align: 'right' });
      
//       yPos += rowHeight;
//       rowCount++;
//     });

//     yPos += 5;

//     // ==================== SUMMARY SECTION ====================
//     const summaryWidth = 85;
//     const summaryX = pageWidth - margin - summaryWidth;
    
//     doc.setFillColor(255, 245, 246);
//     doc.setDrawColor(238, 66, 117);
//     doc.setLineWidth(0.3);
//     doc.roundedRect(summaryX, yPos, summaryWidth, 45, 2, 2, 'FD');

//     doc.setFontSize(8);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(238, 66, 117);
//     doc.text('SUMMARY', summaryX + 3, yPos + 5);

//     let summaryY = yPos + 9;
//     doc.setFontSize(6.5);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(COLORS.text);

//     const subtotal = order.subtotal || 0;
//     const shippingCost = order.shippingCost || 0;
//     const discount = order.discount || 0;
//     const total = order.total || 0;

//     doc.text('Subtotal:', summaryX + 3, summaryY);
//     doc.text(formatPrice(subtotal), summaryX + summaryWidth - 3, summaryY, { align: 'right' });
//     summaryY += 4.5;

//     doc.text('Shipping:', summaryX + 3, summaryY);
//     doc.text(formatPrice(shippingCost), summaryX + summaryWidth - 3, summaryY, { align: 'right' });
//     summaryY += 4.5;

//     if (discount > 0) {
//       doc.setTextColor(COLORS.paid);
//       doc.text('Discount:', summaryX + 3, summaryY);
//       doc.text(`-${formatPrice(discount)}`, summaryX + summaryWidth - 3, summaryY, { align: 'right' });
//       doc.setTextColor(COLORS.text);
//       summaryY += 4.5;
//     }

//     doc.setDrawColor(238, 66, 117);
//     doc.setLineWidth(0.3);
//     doc.line(summaryX + 3, summaryY - 1, summaryX + summaryWidth - 3, summaryY - 1);
    
//     summaryY += 2;
    
//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(238, 66, 117);
//     doc.text('TOTAL:', summaryX + 3, summaryY);
//     doc.text(formatPrice(total), summaryX + summaryWidth - 3, summaryY, { align: 'right' });

//     // Payment status
//     summaryY += 5;
//     doc.setFontSize(5.5);
//     doc.setFont('helvetica', 'normal');
    
//     const paymentStatus = order.paymentStatus?.toUpperCase() || 'PENDING';
//     if (paymentStatus === 'PAID') {
//       doc.setTextColor(COLORS.paid);
//       doc.text(`✓ Payment Status: ${paymentStatus}`, summaryX + 3, summaryY);
//     } else if (paymentStatus === 'PENDING') {
//       doc.setTextColor(COLORS.unpaid);
//       doc.text(` Payment Status: ${paymentStatus}`, summaryX + 3, summaryY);
//     } else {
//       doc.setTextColor(COLORS.textLight);
//       doc.text(`Payment Status: ${paymentStatus}`, summaryX + 3, summaryY);
//     }

//     yPos += 55;

//     // ==================== ORDER NOTES ====================
//     if (order.customerInfo?.note) {
//       if (yPos > pageHeight - 35) {
//         doc.addPage();
//         yPos = margin + 10;
//       }
      
//       doc.setDrawColor(238, 66, 117);
//       doc.setLineWidth(0.3);
//       doc.line(margin, yPos, pageWidth - margin, yPos);
//       yPos += 5;
      
//       doc.setFontSize(7);
//       doc.setFont('helvetica', 'bold');
//       doc.setTextColor(238, 66, 117);
//       doc.text('ORDER NOTES:', margin, yPos);
      
//       doc.setFontSize(6);
//       doc.setFont('helvetica', 'normal');
//       doc.setTextColor(COLORS.textLight);
      
//       const noteLines = doc.splitTextToSize(order.customerInfo.note, contentWidth);
//       doc.text(noteLines, margin, yPos + 4);
//       yPos += (noteLines.length * 4) + 10;
//     }

//     // ==================== FOOTER ====================
//     const footerY = pageHeight - 8;
    
//     doc.setDrawColor(238, 66, 117);
//     doc.setLineWidth(0.3);
//     doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);
    
//     doc.setFontSize(5.5);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(139, 122, 140);
    
//     doc.text('Thank you for shopping with BeautyBucket! ✨', pageWidth / 2, footerY, { align: 'center' });
//     doc.text('For any queries, contact us at support@beautybucket.com', pageWidth / 2, footerY + 4, { align: 'center' });
//     doc.text('This is a system generated invoice.', pageWidth / 2, footerY + 8, { align: 'center' });

//     // ==================== RETURN PDF BUFFER ====================
//     const pdfBuffer = doc.output('arraybuffer');
    
//     return { 
//       success: true, 
//       fileName: `Invoice_${orderNumber}.pdf`,
//       buffer: Buffer.from(pdfBuffer)
//     };
    
//   } catch (error) {
//     console.error('PDF Generation Error:', error);
//     throw error;
//   }
// };

// module.exports = { generateInvoicePDF };


// utils/pdfGenerator.js - Complete version with logo support
const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const fs = require('fs');
const path = require('path');

// Helper function to format currency (BDT)
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price || 0);
};

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper function to load image from file system and convert to base64
const loadLocalImageToBase64 = (imagePath) => {
  try {
    // Try multiple possible locations
    const possiblePaths = [
      path.join(__dirname, '../../public', imagePath.replace(/^\//, '').replace(/^public\//, '')),
      path.join(__dirname, '../..', imagePath),
      path.join(__dirname, '../../', imagePath),
      path.join(process.cwd(), 'public', 'logo.png'),
      path.join(process.cwd(), 'logo.png'),
      path.join(__dirname, '../../public/logo.png'),
      path.join(__dirname, '../public/logo.png')
    ];
    
    for (const fullPath of possiblePaths) {
      if (fs.existsSync(fullPath)) {
        console.log('📁 Logo found at:', fullPath);
        const imageBuffer = fs.readFileSync(fullPath);
        const base64 = imageBuffer.toString('base64');
        const ext = path.extname(fullPath).toLowerCase();
        const mimeType = ext === '.png' ? 'image/png' : 
                        ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 
                        ext === '.svg' ? 'image/svg+xml' : 'image/png';
        return `data:${mimeType};base64,${base64}`;
      }
    }
    
    console.warn('⚠️ Logo file not found in any of the expected locations');
    return null;
  } catch (error) {
    console.error('Error loading local image:', error);
    return null;
  }
};

// Get company initials for logo fallback
const getCompanyInitials = (companyName) => {
  if (!companyName) return 'BB';
  return companyName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// BeautyBucket Theme Colors
const COLORS = {
  primary: '#EE4275',
  secondary: '#FFF5F6',
  accent: '#FF6B9D',
  neutral: '#FFFFFF',
  lightGray: '#FFF5F6',
  border: '#FFD2DB',
  text: '#2D1B2E',
  textLight: '#8B7A8C',
  paid: '#4CAF50',
  unpaid: '#F44336',
  partial: '#FFC107'
};

const generateInvoicePDF = async (order) => {
  try {
    // Create a new jsPDF instance
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (2 * margin);
    let yPos = margin;

    // ==================== LOAD COMPANY LOGO FROM LOCAL FILE ====================
    let companyLogoBase64 = null;
    try {
      console.log('🖼️ Looking for logo...');
      companyLogoBase64 = loadLocalImageToBase64('logo.png');
      if (companyLogoBase64) {
        console.log('✅ Logo loaded successfully');
      } else {
        console.warn('⚠️ Logo not found, using initials fallback');
      }
    } catch (error) {
      console.error('Failed to load logo:', error);
    }

    // ==================== HEADER ====================
    // Colored header bar
    doc.setFillColor(238, 66, 117);
    doc.rect(0, 0, pageWidth, 32, 'F');
    
    // White rounded rectangle for content
    doc.setFillColor(COLORS.neutral);
    doc.roundedRect(margin, yPos, contentWidth, 26, 2, 2, 'F');

    const logoSize = 18;
    const logoMaxWidth = 22;
    const logoMaxHeight = 18;
    const logoX = margin + 5;
    const logoY = yPos + 4;

    // Display Logo or Initials
    if (companyLogoBase64) {
      try {
        // Add the image to PDF
        doc.addImage(companyLogoBase64, 'PNG', logoX, logoY, logoSize, logoSize);
        console.log('✅ Logo displayed in PDF');
      } catch (error) {
        console.error('Error displaying logo in PDF:', error.message);
        // Fallback to initials
        const initials = getCompanyInitials('BeautyBucket');
        doc.setFillColor(238, 66, 117);
        doc.roundedRect(logoX, logoY, logoSize, logoSize, 2, 2, 'F');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.neutral);
        doc.text(initials, logoX + logoSize/2, logoY + logoSize/2 + 1, { align: 'center' });
      }
    } else {
      // No logo, show initials
      const initials = getCompanyInitials('BeautyBucket');
      doc.setFillColor(238, 66, 117);
      doc.roundedRect(logoX, logoY, logoSize, logoSize, 2, 2, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(COLORS.neutral);
      doc.text(initials, logoX + logoSize/2, logoY + logoSize/2 + 1, { align: 'center' });
    }

    const companyX = logoX + logoSize + 8;

    // Split "BeautyBucket" into two parts with different colors
    const beautyText = 'Beauty';
    const bucketText = 'Bucket';
    const textX = companyX;
    const textY = logoY + 4;

    // Draw "Beauty" in pink
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(238, 66, 117);
    doc.text(beautyText, textX, textY);

    // Calculate width of "Beauty" to position "Bucket" next to it
    const beautyWidth = doc.getTextWidth(beautyText);

    // Draw "Bucket" in default text color
    doc.setTextColor(COLORS.text);
    doc.text(bucketText, textX + beautyWidth, textY);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.textLight);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Contact: ', companyX, logoY + 9);
    const contactLabelWidth = doc.getTextWidth('Contact: ');
    doc.setFont('helvetica', 'normal');
    doc.text('+8801XXXXXXXXX', companyX + contactLabelWidth, logoY + 9);

    doc.setFontSize(6.5);
    doc.text('info@beautybucket.com', companyX, logoY + 13);

    doc.setFontSize(6);
    const companyAddressLines = doc.splitTextToSize('House #470, Avenue 6, Road 6, Mirpur DOHS, Dhaka', 70);
    doc.text(companyAddressLines, companyX, logoY + 17);

    const rightAlignX = pageWidth - margin - 5;
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(238, 66, 117);
    const invoiceNoText = 'INVOICE NO: ';
    const orderNumber = order.orderNumber || order._id.slice(-8).toUpperCase();
    doc.text(invoiceNoText, rightAlignX - doc.getTextWidth(invoiceNoText + orderNumber), yPos + 8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.text);
    doc.text(orderNumber, rightAlignX, yPos + 8, { align: 'right' });

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.textLight);
    
    const orderDate = formatDate(order.createdAt);
    const status = order.orderStatus?.toUpperCase() || 'PLACED';
    const paymentMethod = order.paymentMethod?.toUpperCase() || 'COD';
    
    doc.text(`Date: ${orderDate}`, rightAlignX, yPos + 11.5, { align: 'right' });
    
    let statusColor = COLORS.unpaid;
    if (status === 'DELIVERED') statusColor = COLORS.paid;
    else if (status === 'CANCELLED') statusColor = COLORS.unpaid;
    doc.setTextColor(statusColor);
    doc.text(`Status: ${status}`, rightAlignX, yPos + 15.5, { align: 'right' });
    doc.setTextColor(COLORS.textLight);
    
    doc.text(`Payment: ${paymentMethod}`, rightAlignX, yPos + 19.5, { align: 'right' });

    // ==================== CUSTOMER & DELIVERY INFO SECTION ====================
    yPos += 34;
    
    // Customer Info (Left Column)
    const customerColWidth = (contentWidth / 2) - 3;
    const addressColWidth = (contentWidth / 2) - 3;
    
    let leftColHeight = 25;
    let rightColHeight = 25;
    
    // Calculate heights for customer info
    const customerInfoLines = [
      `Name: ${order.customerInfo.fullName || 'N/A'}`,
      order.customerInfo.email ? `Email: ${order.customerInfo.email}` : null,
      `Phone: ${order.customerInfo.phone || 'N/A'}`,
      `Address: ${order.customerInfo.address || 'N/A'}`
    ].filter(Boolean);
    leftColHeight = Math.max(leftColHeight, 10 + (customerInfoLines.length * 4.5));
    
    // Calculate heights for delivery address
    const deliveryAddressLines = [
      order.customerInfo.area ? `Area/Union: ${order.customerInfo.area}` : null,
      order.customerInfo.zone ? `Upazila/Thana: ${order.customerInfo.zone}` : null,
      order.customerInfo.city ? `District/City: ${order.customerInfo.city}` : null,
      order.customerInfo.division ? `Division: ${order.customerInfo.division}` : null,
    ].filter(Boolean);
    rightColHeight = Math.max(rightColHeight, 10 + (deliveryAddressLines.length * 4.5));
    
    const colHeight = Math.max(leftColHeight, rightColHeight, 35);
    
    // Left Column - Customer Info
    doc.setFillColor(245, 245, 250);
    doc.roundedRect(margin, yPos, customerColWidth, colHeight, 2, 2, 'F');
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(238, 66, 117);
    doc.text('CUSTOMER INFO', margin + 5, yPos + 5);
    
    let leftY = yPos + 10;
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.text);
    
    // Name
    doc.setFont('helvetica', 'bold');
    doc.text('Name:', margin + 5, leftY);
    doc.setFont('helvetica', 'normal');
    doc.text(order.customerInfo.fullName || 'N/A', margin + 30, leftY);
    leftY += 4.5;
    
    // Email (if exists)
    if (order.customerInfo.email) {
      doc.setFont('helvetica', 'bold');
      doc.text('Email:', margin + 5, leftY);
      doc.setFont('helvetica', 'normal');
      doc.text(order.customerInfo.email, margin + 30, leftY);
      leftY += 4.5;
    }
    
    // Phone
    doc.setFont('helvetica', 'bold');
    doc.text('Phone:', margin + 5, leftY);
    doc.setFont('helvetica', 'normal');
    doc.text(order.customerInfo.phone || 'N/A', margin + 30, leftY);
    leftY += 4.5;
    
    // Address
    doc.setFont('helvetica', 'bold');
    doc.text('Address:', margin + 5, leftY);
    doc.setFont('helvetica', 'normal');
    const addressValue = order.customerInfo.address || 'N/A';
    const addressLines = doc.splitTextToSize(addressValue, customerColWidth - 35);
    for (let i = 0; i < addressLines.length; i++) {
      const xPos = i === 0 ? margin + 30 : margin + 5 + 5;
      doc.text(addressLines[i], xPos, leftY + (i * 4));
    }
    
    // Right Column - Delivery Address
    const addressColX = margin + customerColWidth + 6;
    doc.setFillColor(245, 245, 250);
    doc.roundedRect(addressColX, yPos, addressColWidth, colHeight, 2, 2, 'F');
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(238, 66, 117);
    doc.text('DELIVERY ADDRESS', addressColX + 5, yPos + 5);
    
    let rightY = yPos + 10;
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.text);
    
    // Area/Union
    if (order.customerInfo.area) {
      doc.setFont('helvetica', 'bold');
      doc.text('Area/Union:', addressColX + 5, rightY);
      doc.setFont('helvetica', 'normal');
      doc.text(order.customerInfo.area, addressColX + 40, rightY);
      rightY += 4.5;
    }
    
    // Upazila/Thana
    if (order.customerInfo.zone) {
      doc.setFont('helvetica', 'bold');
      doc.text('Upazila/Thana:', addressColX + 5, rightY);
      doc.setFont('helvetica', 'normal');
      doc.text(order.customerInfo.zone, addressColX + 40, rightY);
      rightY += 4.5;
    }
    
    // District/City
    if (order.customerInfo.city) {
      doc.setFont('helvetica', 'bold');
      doc.text('District/City:', addressColX + 5, rightY);
      doc.setFont('helvetica', 'normal');
      doc.text(order.customerInfo.city, addressColX + 40, rightY);
      rightY += 4.5;
    }
    
    // Division
    if (order.customerInfo.division) {
      doc.setFont('helvetica', 'bold');
      doc.text('Division:', addressColX + 5, rightY);
      doc.setFont('helvetica', 'normal');
      doc.text(order.customerInfo.division, addressColX + 40, rightY);
      rightY += 4.5;
    }
    
    yPos += colHeight + 10;

    // ==================== ITEMS TABLE ====================
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.text);
    doc.text('ORDER ITEMS', margin, yPos);
    yPos += 5;

    // Table Column Positions
    const colPositions = {
      item: margin + 3,
      product: margin + 10,
      unit: margin + contentWidth - 95,
      qty: margin + contentWidth - 70,
      price: margin + contentWidth - 45,
      total: margin + contentWidth - 10
    };

    // Table Header
    doc.setFillColor(238, 66, 117);
    doc.rect(margin, yPos, contentWidth, 7, 'F');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(COLORS.neutral);

    doc.text('#', colPositions.item, yPos + 4.5);
    doc.text('Product', colPositions.product, yPos + 4.5);
    doc.text('Unit', colPositions.unit, yPos + 4.5);
    doc.text('Qty', colPositions.qty, yPos + 4.5, { align: 'right' });
    doc.text('Price', colPositions.price, yPos + 4.5, { align: 'right' });
    doc.text('Total', colPositions.total, yPos + 4.5, { align: 'right' });

    yPos += 10;

    let rowCount = 0;
    const orderItems = order.items || [];
    
    orderItems.forEach((item, index) => {
      const price = item.discountPrice || item.regularPrice || 0;
      const totalPrice = price * (item.quantity || 0);
      const isEven = rowCount % 2 === 0;
      
      const rowHeight = 7;
      
      // Check if we need a new page
      if (yPos + rowHeight > pageHeight - 55) {
        doc.addPage();
        yPos = margin + 10;
        rowCount = 0;
        
        // Re-draw header on new page
        doc.setFillColor(238, 66, 117);
        doc.rect(margin, yPos, contentWidth, 7, 'F');
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.neutral);
        doc.text('#', colPositions.item, yPos + 4.5);
        doc.text('Product', colPositions.product, yPos + 4.5);
        doc.text('Unit', colPositions.unit, yPos + 4.5);
        doc.text('Qty', colPositions.qty, yPos + 4.5, { align: 'right' });
        doc.text('Price', colPositions.price, yPos + 4.5, { align: 'right' });
        doc.text('Total', colPositions.total, yPos + 4.5, { align: 'right' });
        yPos += 10;
      }

      // Row background
      if (isEven) {
        doc.setFillColor(255, 245, 246);
        doc.rect(margin, yPos - 2, contentWidth, rowHeight, 'F');
      }

      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(COLORS.text);

      const textY = yPos + 4;
      
      doc.text((index + 1).toString(), colPositions.item, textY);
      
      // Product name with truncation
      let productName = item.productName || '';
      const maxWidth = 60;
      while (doc.getTextWidth(productName) > maxWidth && productName.length > 3) {
        productName = productName.substring(0, productName.length - 1);
      }
      if (productName !== (item.productName || '')) {
        productName = productName.substring(0, productName.length - 3) + '...';
      }
      doc.text(productName, colPositions.product, textY);
      
      doc.text(item.unit || 'pcs', colPositions.unit, textY);
      doc.text((item.quantity || 0).toString(), colPositions.qty, textY, { align: 'right' });
      doc.text(formatPrice(price), colPositions.price, textY, { align: 'right' });
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(238, 66, 117);
      doc.text(formatPrice(totalPrice), colPositions.total, textY, { align: 'right' });
      
      yPos += rowHeight;
      rowCount++;
    });

    yPos += 5;

    // ==================== SUMMARY SECTION ====================
    const summaryWidth = 85;
    const summaryX = pageWidth - margin - summaryWidth;
    
    doc.setFillColor(255, 245, 246);
    doc.setDrawColor(238, 66, 117);
    doc.setLineWidth(0.3);
    doc.roundedRect(summaryX, yPos, summaryWidth, 45, 2, 2, 'FD');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(238, 66, 117);
    doc.text('SUMMARY', summaryX + 3, yPos + 5);

    let summaryY = yPos + 9;
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.text);

    const subtotal = order.subtotal || 0;
    const shippingCost = order.shippingCost || 0;
    const discount = order.discount || 0;
    const total = order.total || 0;

    doc.text('Subtotal:', summaryX + 3, summaryY);
    doc.text(formatPrice(subtotal), summaryX + summaryWidth - 3, summaryY, { align: 'right' });
    summaryY += 4.5;

    doc.text('Shipping:', summaryX + 3, summaryY);
    doc.text(formatPrice(shippingCost), summaryX + summaryWidth - 3, summaryY, { align: 'right' });
    summaryY += 4.5;

    if (discount > 0) {
      doc.setTextColor(COLORS.paid);
      doc.text('Discount:', summaryX + 3, summaryY);
      doc.text(`-${formatPrice(discount)}`, summaryX + summaryWidth - 3, summaryY, { align: 'right' });
      doc.setTextColor(COLORS.text);
      summaryY += 4.5;
    }

    doc.setDrawColor(238, 66, 117);
    doc.setLineWidth(0.3);
    doc.line(summaryX + 3, summaryY - 1, summaryX + summaryWidth - 3, summaryY - 1);
    
    summaryY += 2;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(238, 66, 117);
    doc.text('TOTAL:', summaryX + 3, summaryY);
    doc.text(formatPrice(total), summaryX + summaryWidth - 3, summaryY, { align: 'right' });

    // Payment status
    summaryY += 5;
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    
    const paymentStatus = order.paymentStatus?.toUpperCase() || 'PENDING';
    if (paymentStatus === 'PAID') {
      doc.setTextColor(COLORS.paid);
      doc.text(`✓ Payment Status: ${paymentStatus}`, summaryX + 3, summaryY);
    } else if (paymentStatus === 'PENDING') {
      doc.setTextColor(COLORS.unpaid);
      doc.text(` Payment Status: ${paymentStatus}`, summaryX + 3, summaryY);
    } else {
      doc.setTextColor(COLORS.textLight);
      doc.text(`Payment Status: ${paymentStatus}`, summaryX + 3, summaryY);
    }

    yPos += 55;

    // ==================== ORDER NOTES ====================
    if (order.customerInfo?.note) {
      if (yPos > pageHeight - 35) {
        doc.addPage();
        yPos = margin + 10;
      }
      
      doc.setDrawColor(238, 66, 117);
      doc.setLineWidth(0.3);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 5;
      
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(238, 66, 117);
      doc.text('ORDER NOTES:', margin, yPos);
      
      doc.setFontSize(6);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(COLORS.textLight);
      
      const noteLines = doc.splitTextToSize(order.customerInfo.note, contentWidth);
      doc.text(noteLines, margin, yPos + 4);
      yPos += (noteLines.length * 4) + 10;
    }

    // ==================== FOOTER ====================
    const footerY = pageHeight - 8;
    
    doc.setDrawColor(238, 66, 117);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);
    
    doc.setFontSize(5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(139, 122, 140);
    
    doc.text('Thank you for shopping with BeautyBucket! ✨', pageWidth / 2, footerY, { align: 'center' });
    doc.text('For any queries, contact us at support@beautybucket.com', pageWidth / 2, footerY + 4, { align: 'center' });
   

    // ==================== RETURN PDF BUFFER ====================
    const pdfBuffer = doc.output('arraybuffer');
    
    return { 
      success: true, 
      fileName: `Invoice_${orderNumber}.pdf`,
      buffer: Buffer.from(pdfBuffer)
    };
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
};

module.exports = { generateInvoicePDF };