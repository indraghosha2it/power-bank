const Tag = require('../models/Tag');

// Helper function to extract public ID from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
      const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
      const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
      return publicId;
    }
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
  }
  return null;
};

// @desc    Create a new tag
// @route   POST /api/tags
// @access  Private (Admin/Moderator)
const createTag = async (req, res) => {
  try {
    const { name, image } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Tag name is required' });
    }

    if (!image || !image.url) {
      return res.status(400).json({ success: false, error: 'Tag image is required' });
    }

    // Check if tag already exists
    const existingTag = await Tag.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } 
    });
    
    if (existingTag) {
      return res.status(400).json({ 
        success: false, 
        error: `Tag "${name}" already exists` 
      });
    }

    // Create tag
    const tag = await Tag.create({
      name: name.trim(),
      image: {
        url: image.url,
        publicId: image.publicId
      },
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: tag,
      message: 'Tag created successfully'
    });
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while creating tag'
    });
  }
};

// @desc    Get all tags
// @route   GET /api/tags
// @access  Public
const getTags = async (req, res) => {
  try {
    const { isActive } = req.query;
    
    let query = {};
    
    if (isActive === 'true') {
      query.isActive = true;
    } else if (isActive === 'false') {
      query.isActive = false;
    }
    
    const tags = await Tag.find(query)
      .sort({ name: 1 })
      .populate('createdBy', 'name email');
    
    res.json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching tags'
    });
  }
};

// @desc    Get single tag by ID
// @route   GET /api/tags/:id
// @access  Public
const getTagById = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!tag) {
      return res.status(404).json({ success: false, error: 'Tag not found' });
    }
    
    res.json({
      success: true,
      data: tag
    });
  } catch (error) {
    console.error('Get tag error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching tag'
    });
  }
};

// @desc    Update tag
// @route   PUT /api/tags/:id
// @access  Private (Admin/Moderator)
const updateTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    
    if (!tag) {
      return res.status(404).json({ success: false, error: 'Tag not found' });
    }
    
    const { name, image, isActive } = req.body;
    
    // Update fields
    if (name && name.trim()) {
      // Check if new name conflicts with existing tag
      const existingTag = await Tag.findOne({ 
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
        _id: { $ne: tag._id }
      });
      
      if (existingTag) {
        return res.status(400).json({ 
          success: false, 
          error: `Tag "${name}" already exists` 
        });
      }
      
      tag.name = name.trim();
    }
    
    if (image && image.url) {
      tag.image = {
        url: image.url,
        publicId: image.publicId
      };
    }
    
    if (isActive !== undefined) {
      tag.isActive = isActive;
    }
    
    await tag.save();
    
    res.json({
      success: true,
      data: tag,
      message: 'Tag updated successfully'
    });
  } catch (error) {
    console.error('Update tag error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while updating tag'
    });
  }
};

// @desc    Delete tag
// @route   DELETE /api/tags/:id
// @access  Private (Admin only)
const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    
    if (!tag) {
      return res.status(404).json({ success: false, error: 'Tag not found' });
    }
    
    await tag.deleteOne();
    
    res.json({
      success: true,
      message: 'Tag deleted successfully'
    });
  } catch (error) {
    console.error('Delete tag error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while deleting tag'
    });
  }
};

// @desc    Toggle tag active status
// @route   PUT /api/tags/:id/toggle
// @access  Private (Admin/Moderator)
const toggleTagStatus = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    
    if (!tag) {
      return res.status(404).json({ success: false, error: 'Tag not found' });
    }
    
    tag.isActive = !tag.isActive;
    await tag.save();
    
    res.json({
      success: true,
      data: tag,
      message: `Tag ${tag.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Toggle tag status error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while toggling tag status'
    });
  }
};

module.exports = {
  createTag,
  getTags,
  getTagById,
  updateTag,
  deleteTag,
  toggleTagStatus
};