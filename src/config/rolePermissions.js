// config/rolePermissions.js
const rolePermissions = {
  super_admin: {
    permissions: ['*'], // All permissions
    dashboardAccess: [
      'analytics', 'users', 'products', 'orders', 'content', 
      'reviews', 'support', 'settings', 'coupons', 'banners', 
      'blogs', 'delivery', 'payments', 'roles'
    ]
  },
  admin: {
    permissions: [
      'view_users', 'create_user', 'update_user',
      'view_products', 'create_product', 'update_product',
      'view_orders', 'update_order', 'manage_payments',
      'view_content', 'create_content', 'update_content',
      'manage_blogs', 'manage_banners', 'manage_coupons',
      'view_settings', 'update_settings',
      'view_reports', 'export_reports', 'view_analytics'
    ],
    dashboardAccess: [
      'analytics', 'users', 'products', 'orders', 'content', 
      'reviews', 'coupons', 'banners', 'blogs', 'payments'
    ]
  },
  moderator: {
    permissions: [
      'view_products', 'create_product', 'update_product',
      'view_content', 'create_content', 'update_content',
      'view_reviews', 'manage_reviews',
      'manage_blogs', 'manage_banners',
      'view_analytics'
    ],
    dashboardAccess: [
      'analytics', 'products', 'content', 'reviews', 'banners', 'blogs'
    ]
  },
  call_center_agent: {
    permissions: [
      'view_orders', 'update_order',
      'view_customers',
      'view_reports',
      'manage_delivery'
    ],
    dashboardAccess: [
      'analytics', 'orders', 'support', 'delivery'
    ]
  },
  customer: {
    permissions: [],
    dashboardAccess: []
  }
};

module.exports = rolePermissions;