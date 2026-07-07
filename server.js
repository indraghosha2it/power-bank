// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');

// // Load environment variables
// dotenv.config();

// // Import routes
// const authRoutes = require('./src/routes/authRoutes');
// const adminRoutes = require('./src/routes/adminRoutes');
// const categoryRoutes = require('./src/routes/categoryRoutes');
// const productRoutes = require('./src/routes/productRoutes');
// const bannerRoutes = require('./src/routes/bannerRoutes');

// const uploadRoutes = require('./src/routes/uploadRoutes');

// const blogRoutes = require('./src/routes/blogRoutes');
// const reviewRoutes = require('./src/routes/reviewRoutes');

// const searchRoutes = require('./src/routes/searchRoutes');
// const contactRoutes = require('./src/routes/contactRoutes');
// const promotionalRoutes = require('./src/routes/promotionalRoutes');
// const popupRoutes = require('./src/routes/popupRoutes');
// const cartRoutes = require('./src/routes/cartRoutes');
// const couponRoutes = require('./src/routes/couponRoutes');
// const wishlistRoutes = require('./src/routes/wishlistRoutes');
// const orderRoutes = require('./src/routes/orderRoutes');


// const paymentRoutes = require('./src/routes/paymentRoutes');
// // Add this with your other route imports
// const deliveryRoutes = require('./src/routes/deliveryRoutes');

// const barcodeRoutes = require('./src/routes/barcodeRoutes');
// // In your main server file (server.js or app.js)
// const brandRoutes = require('./src/routes/brandRoutes');

// const adminCourierRoutes = require('./src/routes/adminCourierRoutes');

// // Add with other route imports
// const tagRoutes = require('./src/routes/tagRoutes');
// const footerRoutes = require('./src/routes/footerRoutes');










// // Add with other routes




// // Add after other route registrations


// // Initialize Express app
// const app = express();

// // Middleware
// // app.use(cors({
// //   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
// //   credentials: true
// // }));
// // Middleware
// const allowedOrigins = [
//   'hhttps://gregarious-profiterole-514180.netlify.app',
//    'http://localhost:3000',
//    'https://super-cat-51b8ab.netlify.app',
//   'http://localhost:3001',
//   'http://localhost:5000',

//   process.env.FRONTEND_URL // Keep this for flexibility
// ].filter(Boolean); // Remove any undefined values

// app.use(cors({
//   origin: function(origin, callback) {
//     // Allow requests with no origin (like mobile apps, curl, etc)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id']
// }));

// // Body parsers - ADD THESE FIRST
// app.use(express.json({ limit: '100mb' }));
// app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// // ADD THIS JSON SYNTAX ERROR HANDLER - Place it after body parsers but before routes
// app.use((err, req, res, next) => {
//   if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
//     console.error('❌ JSON Syntax Error:', err.message);
//     return res.status(400).json({ 
//       success: false, 
//       error: 'Invalid JSON payload. Please check your request format.' 
//     });
//   }
//   next();
// });


// // MongoDB Connection - REMOVED deprecated options
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI);

//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//     console.log(`📊 Database: ${conn.connection.name}`);
    
//     return conn;
//   } catch (error) {
//     console.error('❌ MongoDB connection failed:', error.message);
//     process.exit(1);
//   }
// };

// // Connect to database
// connectDB();



// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/categories', categoryRoutes); 
// app.use('/api/products', productRoutes); 
// app.use('/api/banners', bannerRoutes);
// app.use('/uploads', express.static('uploads'));

// app.use('/api/upload', uploadRoutes);

// app.use('/api/blogs', blogRoutes);
// app.use('/api/reviews', reviewRoutes);

// app.use('/api/search', searchRoutes);
// app.use('/api/contact', contactRoutes);
// app.use('/api', promotionalRoutes);
// app.use('/api', popupRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/wishlist', wishlistRoutes);

// app.use('/api/orders', orderRoutes);

// app.use('/api/coupons', couponRoutes);

// app.use('/api/payments', paymentRoutes);

// app.use('/api/delivery', deliveryRoutes);
// app.use('/api/barcodes', barcodeRoutes);

// app.use('/api/brands', brandRoutes);
// app.use('/api/footer', footerRoutes);           
// app.use('/api/footer-admin', footerRoutes);


// // Add with other route registrations
// app.use('/api/admin', adminCourierRoutes);
// app.use('/api/tags', tagRoutes);
// // Basic test route
// app.get('/api/test', (req, res) => {
//   res.json({ 
//     message: 'API is working!', 
//     timestamp: new Date().toISOString()
//   });
// });

// // Health check route
// app.get('/api/health', (req, res) => {
//   res.json({
//     status: 'OK',
//     message: 'Server is running',
//     timestamp: new Date().toISOString(),
//     mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
//     database: mongoose.connection.name
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ 
//     error: 'Route not found',
//     path: req.originalUrl,
//     method: req.method
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('❌ Error:', err.stack);
//   res.status(500).json({ 
//     error: 'Something went wrong!',
//     message: err.message,
//     path: req.originalUrl
//   });
// });

// // Graceful shutdown
// process.on('SIGINT', async () => {
//   await mongoose.connection.close();
//   console.log('👋 MongoDB connection closed');
//   process.exit(0);
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
// });




const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const productRoutes = require('./src/routes/productRoutes');
const bannerRoutes = require('./src/routes/bannerRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const blogRoutes = require('./src/routes/blogRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const searchRoutes = require('./src/routes/searchRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
const promotionalRoutes = require('./src/routes/promotionalRoutes');
const popupRoutes = require('./src/routes/popupRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const couponRoutes = require('./src/routes/couponRoutes');
const wishlistRoutes = require('./src/routes/wishlistRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const deliveryRoutes = require('./src/routes/deliveryRoutes');
const barcodeRoutes = require('./src/routes/barcodeRoutes');
const brandRoutes = require('./src/routes/brandRoutes');
const adminCourierRoutes = require('./src/routes/adminCourierRoutes');
const tagRoutes = require('./src/routes/tagRoutes');
const footerRoutes = require('./src/routes/footerRoutes');
// Add with other route imports
const navbarRoutes = require('./src/routes/navbarRoutes');

// 🆕 Import role routes
const roleRoutes = require('./src/routes/roleRoutes');


const dashboardRoutes = require('./src/routes/dashboardRoutes');

const homepageRoutes = require('./src/routes/homepageRoutes');
const termsRoutes = require('./src/routes/termsRoutes');
// Add with other route imports
const privacyRoutes = require('./src/routes/privacyRoutes');
const contactAdminRoutes = require('./src/routes/contactMainRoute');





// Initialize Express app
const app = express();

// ============================================
// CORS MIDDLEWARE
// ============================================
const allowedOrigins = [
  'https://gregarious-profiterole-514180.netlify.app',
  'http://localhost:3000',
  'https://super-cat-51b8ab.netlify.app',
  'http://localhost:3001',
  'http://localhost:5000',
  process.env.FRONTEND_URL // Keep this for flexibility
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id']
}));

// ============================================
// BODY PARSERS
// ============================================
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// JSON Syntax Error Handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('❌ JSON Syntax Error:', err.message);
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid JSON payload. Please check your request format.' 
    });
  }
  next();
});

// ============================================
// MONGODB CONNECTION
// ============================================
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

connectDB();

// ============================================
// STATIC FILES
// ============================================
app.use('/uploads', express.static('uploads'));

// ============================================
// API ROUTES
// ============================================

// Auth Routes
app.use('/api/auth', authRoutes);

// 🆕 Role Management Routes (Super Admin only)
app.use('/api/roles', roleRoutes);

// 🆕 Dashboard Routes (Protected)
app.use('/api/dashboard', dashboardRoutes);

// Admin Routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminCourierRoutes);

// Category & Product Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/tags', tagRoutes);

// Content Routes
app.use('/api/banners', bannerRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/reviews', reviewRoutes);

// Upload Routes
app.use('/api/upload', uploadRoutes);

// Search Routes
app.use('/api/search', searchRoutes);

// Contact Routes
app.use('/api/contact', contactRoutes);

// Promotional & Popup Routes
app.use('/api', promotionalRoutes);
app.use('/api', popupRoutes);

// Cart & Wishlist Routes
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Order Routes
app.use('/api/orders', orderRoutes);

// Coupon Routes
app.use('/api/coupons', couponRoutes);

// Payment Routes
app.use('/api/payments', paymentRoutes);

// Delivery Routes
app.use('/api/delivery', deliveryRoutes);

// Barcode Routes
app.use('/api/barcodes', barcodeRoutes);

// Footer Routes
app.use('/api/footer', footerRoutes);
app.use('/api/footer-admin', footerRoutes);
// Add with other route registrations
app.use('/api/homepage', homepageRoutes);
app.use('/api/admin/homepage', homepageRoutes);



// Add with other route registrations
app.use('/api/terms', termsRoutes);
app.use('/api/admin/terms', termsRoutes);
// Add with other route registrations
app.use('/api/privacy', privacyRoutes);
app.use('/api/admin/privacy', privacyRoutes);


// Add with other route registrations
app.use('/api/contact', contactAdminRoutes);
app.use('/api/admin/contact', contactAdminRoutes);




// Add with other route registrations
app.use('/api/navbar', navbarRoutes);
app.use('/api/admin/navbar', navbarRoutes);

// ============================================
// TEST & HEALTH ROUTES
// ============================================

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!', 
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    database: mongoose.connection.name,
    environment: process.env.NODE_ENV || 'development',
    // 🆕 Show available routes info
    routes: {
      auth: '/api/auth',
      roles: '/api/roles',
      dashboard: '/api/dashboard',
      admin: '/api/admin',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      payments: '/api/payments'
    }
  });
});

// 🆕 Role info endpoint (for frontend to check available roles)
app.get('/api/roles-info', (req, res) => {
  res.json({
    success: true,
    data: {
      roles: {
        super_admin: {
          name: 'Super Admin',
          description: 'Full system access, can manage all users and roles',
          level: 5
        },
        admin: {
          name: 'Admin',
          description: 'Can manage users, products, orders, and content',
          level: 4
        },
        moderator: {
          name: 'Moderator',
          description: 'Can manage products, content, and reviews',
          level: 3
        },
        call_center_agent: {
          name: 'Call Center Agent',
          description: 'Can manage orders, delivery, and customer support',
          level: 2
        },
        customer: {
          name: 'Customer',
          description: 'Regular customer access',
          level: 1
        }
      },
      dashboardSections: [
        'analytics',
        'users',
        'products',
        'orders',
        'content',
        'reviews',
        'support',
        'settings',
        'coupons',
        'banners',
        'blogs',
        'delivery',
        'payments',
        'roles'
      ]
    }
  });
});

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!',
    message: err.message,
    path: req.originalUrl
  });
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 MongoDB connection closed');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  console.log('👋 MongoDB connection closed (SIGTERM)');
  process.exit(0);
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Roles info: http://localhost:${PORT}/api/roles-info`);
  console.log('\n📌 Available Routes:');
  console.log(`  POST   /api/auth/login`);
  console.log(`  POST   /api/auth/register`);
  console.log(`  GET    /api/auth/me`);
  console.log(`  GET    /api/dashboard`);
  console.log(`  GET    /api/roles/dashboard-access`);
  console.log(`  GET    /api/roles/users (Super Admin only)`);
  console.log(`  PUT    /api/roles/update/:userId (Super Admin only)`);
  console.log(`  POST   /api/auth/super-admin/create-staff (Super Admin only)`);
});