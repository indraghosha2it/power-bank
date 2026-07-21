const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('☁️ Cloudinary Configuration:');
console.log('  - Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET');
console.log('  - API Key:', process.env.CLOUDINARY_API_KEY ? '✅ SET' : '❌ MISSING');
console.log('  - API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ SET' : '❌ MISSING');
console.log('  - Folder:', process.env.CLOUDINARY_FOLDER || 'power-bank');

// ============================================
// HELPER FUNCTIONS
// ============================================

// Helper function to format Cloudinary resource
function formatCloudinaryResource(resource) {
  return {
    public_id: resource.public_id,
    url: resource.secure_url || resource.url,
    resource_type: resource.resource_type || 'image',
    format: resource.format,
    width: resource.width,
    height: resource.height,
    created_at: resource.created_at,
    bytes: resource.bytes,
    folder: resource.folder || '',
    filename: resource.public_id.split('/').pop(),
  };
}



// Get all media (images and videos) from a folder
// Get all media (images and videos) from a folder and its subfolders
// Get all media (images and videos) from a folder and its subfolders
// router.get('/', protect, isAdmin, async (req, res) => {
//   try {
//     const { folder, q, next_cursor } = req.query;
    
//     console.log('📁 Media Library Request:');
//     console.log('  - Folder:', folder || 'root');
//     console.log('  - Search:', q || 'none');
//     console.log('  - Next Cursor:', next_cursor || 'none');
    
//     let allResources = [];
//     let nextCursor = null;
    
//     // ✅ FIX: Use search API for better subfolder handling
//     try {
//       let searchExpression = '';
      
//       if (folder && folder.trim() !== '') {
//         // Search for files in folder and all subfolders
//         // This matches: power-bank/* (all files in power-bank and subfolders)
//         const folderPath = folder.endsWith('/') ? folder : folder + '/';
//         searchExpression = `folder:${folderPath}*`;
//         console.log(`  🔍 Searching in folder: ${folderPath}*`);
//       } else {
//         // Search for all files
//         searchExpression = '*';
//       }
      
//       // Add search term if provided
//       if (q && q.trim()) {
//         searchExpression += ` AND filename:${q}*`;
//       }
      
//       console.log(`  🔎 Search expression: ${searchExpression}`);
      
//       const searchOptions = {
//         expression: searchExpression,
//         max_results: 30,
//         resource_type: 'all',
//       };
      
//       if (next_cursor) {
//         searchOptions.next_cursor = next_cursor;
//       }
      
//       const result = await cloudinary.search
//         .expression(searchExpression)
//         .max_results(30)
//         .execute();
      
//       allResources = result.resources || [];
//       nextCursor = result.next_cursor || null;
      
//       console.log(`📊 Found ${allResources.length} items`);
      
//     } catch (searchError) {
//       console.error('❌ Search API error:', searchError.message);
      
//       // Fallback: Use resources API with prefix
//       console.log('⚠️ Falling back to resources API...');
      
//       const options = {
//         max_results: 30,
//         type: 'upload',
//       };
      
//       if (next_cursor) {
//         options.next_cursor = next_cursor;
//       }
      
//       if (folder && folder.trim() !== '') {
//         const folderPrefix = folder.endsWith('/') ? folder : folder + '/';
//         options.prefix = folderPrefix;
//         console.log(`  📂 Using prefix: ${folderPrefix}`);
//       }
      
//       // Fetch images
//       try {
//         const imageResult = await cloudinary.api.resources({
//           ...options,
//           resource_type: 'image'
//         });
        
//         if (imageResult.resources && imageResult.resources.length > 0) {
//           allResources = allResources.concat(imageResult.resources);
//           nextCursor = imageResult.next_cursor || nextCursor;
//           console.log(`📸 Found ${imageResult.resources.length} images`);
//         }
//       } catch (imageError) {
//         console.log('⚠️ Error fetching images:', imageError.message);
//       }
      
//       // Fetch videos
//       try {
//         const videoResult = await cloudinary.api.resources({
//           ...options,
//           resource_type: 'video'
//         });
        
//         if (videoResult.resources && videoResult.resources.length > 0) {
//           allResources = allResources.concat(videoResult.resources);
//           nextCursor = videoResult.next_cursor || nextCursor;
//           console.log(`🎬 Found ${videoResult.resources.length} videos`);
//         }
//       } catch (videoError) {
//         console.log('⚠️ Error fetching videos:', videoError.message);
//       }
//     }
    
//     const formattedItems = allResources.map(formatCloudinaryResource);
    
//     return res.json({
//       items: formattedItems,
//       next_cursor: nextCursor,
//       total: formattedItems.length,
//       folder: folder || 'root'
//     });
    
//   } catch (error) {
//     console.error('❌ Error fetching media:', error);
//     return res.status(500).json({ 
//       error: 'Failed to fetch media',
//       details: error.message 
//     });
//   }
// });


// Get all media (images and videos) from a folder and its subfolders
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const { folder, q, next_cursor } = req.query;
    
    // ✅ Set default folder to power-bank if not specified
    const targetFolder = folder || process.env.CLOUDINARY_FOLDER || 'power-bank';
    
    console.log('📁 Media Library Request:');
    console.log('  - Folder:', targetFolder);
    console.log('  - Search:', q || 'none');
    console.log('  - Next Cursor:', next_cursor || 'none');
    
    let allResources = [];
    let nextCursor = null;
    
    // Use search API for better subfolder handling
    try {
      let searchExpression = '';
      
      // Always search in power-bank folder and subfolders
      const folderPath = targetFolder.endsWith('/') ? targetFolder : targetFolder + '/';
      searchExpression = `folder:${folderPath}*`;
      console.log(`  🔍 Searching in folder: ${folderPath}*`);
      
      // Add search term if provided
      if (q && q.trim()) {
        searchExpression += ` AND filename:${q}*`;
      }
      
      console.log(`  🔎 Search expression: ${searchExpression}`);
      
      const searchOptions = {
        expression: searchExpression,
        max_results: 30,
        resource_type: 'all',
      };
      
      if (next_cursor) {
        searchOptions.next_cursor = next_cursor;
      }
      
      const result = await cloudinary.search
        .expression(searchExpression)
        .max_results(30)
        .execute();
      
      allResources = result.resources || [];
      nextCursor = result.next_cursor || null;
      
      console.log(`📊 Found ${allResources.length} items`);
      
    } catch (searchError) {
      console.error('❌ Search API error:', searchError.message);
      
      // Fallback: Use resources API with prefix
      console.log('⚠️ Falling back to resources API...');
      
      const options = {
        max_results: 30,
        type: 'upload',
      };
      
      if (next_cursor) {
        options.next_cursor = next_cursor;
      }
      
      const folderPrefix = targetFolder.endsWith('/') ? targetFolder : targetFolder + '/';
      options.prefix = folderPrefix;
      console.log(`  📂 Using prefix: ${folderPrefix}`);
      
      // Fetch images
      try {
        const imageResult = await cloudinary.api.resources({
          ...options,
          resource_type: 'image'
        });
        
        if (imageResult.resources && imageResult.resources.length > 0) {
          allResources = allResources.concat(imageResult.resources);
          nextCursor = imageResult.next_cursor || nextCursor;
          console.log(`📸 Found ${imageResult.resources.length} images`);
        }
      } catch (imageError) {
        console.log('⚠️ Error fetching images:', imageError.message);
      }
      
      // Fetch videos
      try {
        const videoResult = await cloudinary.api.resources({
          ...options,
          resource_type: 'video'
        });
        
        if (videoResult.resources && videoResult.resources.length > 0) {
          allResources = allResources.concat(videoResult.resources);
          nextCursor = videoResult.next_cursor || nextCursor;
          console.log(`🎬 Found ${videoResult.resources.length} videos`);
        }
      } catch (videoError) {
        console.log('⚠️ Error fetching videos:', videoError.message);
      }
    }
    
    const formattedItems = allResources.map(formatCloudinaryResource);
    
    return res.json({
      items: formattedItems,
      next_cursor: nextCursor,
      total: formattedItems.length,
      folder: targetFolder
    });
    
  } catch (error) {
    console.error('❌ Error fetching media:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch media',
      details: error.message 
    });
  }
});

// Get all folders (including subfolders)
router.get('/folders', protect, isAdmin, async (req, res) => {
  try {
    console.log('📁 Fetching all folders...');
    
    const result = await cloudinary.api.root_folders({ max_results: 50 });
    
    const rootFolders = result.folders.map(f => f.name);
    console.log(`📁 Found ${rootFolders.length} root folders`);
    
    // Add root folder if not already present
    const rootFolder = process.env.CLOUDINARY_FOLDER || 'power-bank';
    if (!rootFolders.includes(rootFolder)) {
      rootFolders.unshift(rootFolder);
    }
    
    // Get subfolders
    let allFolders = [...rootFolders];
    for (const folder of rootFolders) {
      try {
        const subResult = await cloudinary.api.sub_folders(folder);
        subResult.folders.forEach(sub => {
          allFolders.push(`${folder}/${sub.name}`);
        });
      } catch (e) {
        // Ignore subfolder errors
      }
    }
    
    console.log(`📁 Total folders: ${allFolders.length}`);
    
    return res.json({ 
      folders: allFolders,
      rootFolders: rootFolders
    });
  } catch (error) {
    console.error('❌ Error fetching folders:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch folders',
      details: error.message 
    });
  }
});

// Get subfolders of a specific folder
router.get('/folders/:folder', protect, isAdmin, async (req, res) => {
  try {
    const { folder } = req.params;
    console.log(`📁 Fetching subfolders for: ${folder}`);
    
    const result = await cloudinary.api.sub_folders(folder);
    
    return res.json({ 
      folders: result.folders,
      parent: folder
    });
  } catch (error) {
    console.error('❌ Error fetching subfolders:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch subfolders',
      details: error.message 
    });
  }
});

// Delete media
router.delete('/', protect, isAdmin, async (req, res) => {
  try {
    const { public_ids, resource_type } = req.body;
    
    if (!public_ids || !Array.isArray(public_ids) || public_ids.length === 0) {
      return res.status(400).json({ 
        error: 'No public_ids provided' 
      });
    }
    
    console.log(`🗑️ Deleting ${public_ids.length} items...`);
    
    const results = [];
    for (const publicId of public_ids) {
      try {
        // Determine resource type if not specified
        let type = resource_type || 'image';
        // Auto-detect based on public_id pattern
        if (publicId.includes('/video/') || publicId.startsWith('video/')) {
          type = 'video';
        }
        
        const result = await cloudinary.uploader.destroy(publicId, {
          resource_type: type,
          invalidate: true,
        });
        results.push({ publicId, result });
        console.log(`  ✅ Deleted: ${publicId}`);
      } catch (error) {
        console.error(`  ❌ Error deleting ${publicId}:`, error.message);
        results.push({ publicId, error: error.message });
      }
    }
    
    const successful = results.filter(r => r.result?.result === 'ok');
    const failed = results.filter(r => r.error || r.result?.result !== 'ok');
    
    return res.json({
      success: true,
      deleted: successful.length,
      failed: failed.length,
      results,
    });
  } catch (error) {
    console.error('❌ Error deleting media:', error);
    return res.status(500).json({ 
      error: 'Failed to delete media',
      details: error.message 
    });
  }
});

// ============================================
// TEST & DEBUG ROUTES
// ============================================

// Config test - check Cloudinary configuration
router.get('/config-test', protect, isAdmin, async (req, res) => {
  try {
    console.log('🔍 Testing Cloudinary configuration...');
    
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'MISSING',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'MISSING',
      folder: process.env.CLOUDINARY_FOLDER || 'power-bank'
    };
    
    const result = await cloudinary.api.ping();
    
    console.log('✅ Cloudinary configuration test passed');
    
    return res.json({
      success: true,
      message: 'Cloudinary is configured correctly',
      config: config,
      ping: result
    });
  } catch (error) {
    console.error('❌ Cloudinary config test failed:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Debug endpoint - get detailed information
router.get('/debug', protect, isAdmin, async (req, res) => {
  try {
    console.log('🔍 DEBUG: Testing Cloudinary API calls');
    
    const results = {
      timestamp: new Date().toISOString(),
      attempts: {}
    };
    
    // Attempt 1: Get images only
    try {
      const imageResult = await cloudinary.api.resources({
        resource_type: 'image',
        max_results: 10,
        type: 'upload',
      });
      results.attempts.images = {
        success: true,
        count: imageResult.resources?.length || 0,
        sample: imageResult.resources?.slice(0, 3).map(r => ({
          public_id: r.public_id,
          url: r.secure_url
        }))
      };
      console.log(`📸 Debug: Found ${imageResult.resources?.length || 0} images`);
    } catch (error) {
      results.attempts.images = {
        success: false,
        error: error.message
      };
      console.log('⚠️ Debug: Error fetching images:', error.message);
    }
    
    // Attempt 2: Get videos only
    try {
      const videoResult = await cloudinary.api.resources({
        resource_type: 'video',
        max_results: 10,
        type: 'upload',
      });
      results.attempts.videos = {
        success: true,
        count: videoResult.resources?.length || 0,
        sample: videoResult.resources?.slice(0, 3).map(r => ({
          public_id: r.public_id,
          url: r.secure_url
        }))
      };
      console.log(`🎬 Debug: Found ${videoResult.resources?.length || 0} videos`);
    } catch (error) {
      results.attempts.videos = {
        success: false,
        error: error.message
      };
      console.log('⚠️ Debug: Error fetching videos:', error.message);
    }
    
    // Attempt 3: Get all resources combined
    try {
      const allImages = await cloudinary.api.resources({
        resource_type: 'image',
        max_results: 50,
        type: 'upload',
      });
      
      const allVideos = await cloudinary.api.resources({
        resource_type: 'video',
        max_results: 50,
        type: 'upload',
      });
      
      const combined = [
        ...(allImages.resources || []),
        ...(allVideos.resources || [])
      ];
      
      results.attempts.combined = {
        success: true,
        total: combined.length,
        images: allImages.resources?.length || 0,
        videos: allVideos.resources?.length || 0,
      };
      console.log(`📊 Debug: Total combined items: ${combined.length}`);
    } catch (error) {
      results.attempts.combined = {
        success: false,
        error: error.message
      };
      console.log('⚠️ Debug: Error fetching combined:', error.message);
    }
    
    // Attempt 4: Using search API
    try {
      const searchResult = await cloudinary.search
        .expression('*')
        .max_results(10)
        .execute();
      
      results.attempts.search = {
        success: true,
        count: searchResult.resources?.length || 0,
        sample: searchResult.resources?.slice(0, 3).map(r => ({
          public_id: r.public_id,
          resource_type: r.resource_type
        }))
      };
      console.log(`🔎 Debug: Search found ${searchResult.resources?.length || 0} items`);
    } catch (error) {
      results.attempts.search = {
        success: false,
        error: error.message
      };
      console.log('⚠️ Debug: Search API error:', error.message);
    }
    
    // Get root folders
    try {
      const folderResult = await cloudinary.api.root_folders({ max_results: 50 });
      results.folders = folderResult.folders.map(f => f.name);
      console.log(`📁 Debug: Found ${results.folders.length} root folders`);
    } catch (error) {
      results.folders = [];
      results.folderError = error.message;
      console.log('⚠️ Debug: Error fetching folders:', error.message);
    }
    
    // Cloudinary config
    results.config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET',
      api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
      folder: process.env.CLOUDINARY_FOLDER || 'power-bank'
    };
    
    console.log('✅ Debug complete');
    
    return res.json(results);
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Get all resources without any filters (for testing)
router.get('/all', protect, isAdmin, async (req, res) => {
  try {
    console.log('📁 Fetching ALL resources from Cloudinary...');
    
    // Get images
    const imageResult = await cloudinary.api.resources({
      resource_type: 'image',
      max_results: 50,
      type: 'upload',
    });
    
    // Get videos
    const videoResult = await cloudinary.api.resources({
      resource_type: 'video',
      max_results: 50,
      type: 'upload',
    });
    
    const allItems = [
      ...(imageResult.resources || []),
      ...(videoResult.resources || [])
    ];
    
    console.log(`📊 Found ${allItems.length} total items (${imageResult.resources?.length || 0} images, ${videoResult.resources?.length || 0} videos)`);
    
    return res.json({
      success: true,
      total: allItems.length,
      images: imageResult.resources?.length || 0,
      videos: videoResult.resources?.length || 0,
      items: allItems.map(formatCloudinaryResource),
      next_cursor: imageResult.next_cursor || videoResult.next_cursor || null,
    });
  } catch (error) {
    console.error('❌ Error fetching all resources:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;