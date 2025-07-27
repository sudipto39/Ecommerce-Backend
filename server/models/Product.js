const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  images: [{
    type: String,
    required: [true, 'Product image is required']
  }],
  brand: {
    type: String,
    required: [true, 'Brand is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['casual', 'formal', 'sports', 'boots']
  },
  sizes: [{
    size: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative']
    }
  }],
  color: {
    type: String,
    required: [true, 'Color is required']
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot be more than 5']
  },
  numReviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  totalStock: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate total stock from sizes
productSchema.pre('save', function(next) {
  if (this.sizes && this.sizes.length > 0) {
    this.totalStock = this.sizes.reduce((total, size) => total + size.stock, 0);
  }
  next();
});

productSchema.pre('findOneAndUpdate', function(next) {
  if (this._update && this._update.sizes && this._update.sizes.length > 0) {
    this._update.totalStock = this._update.sizes.reduce((total, size) => total + size.stock, 0);
  }
  next();
});

// Add indexes for search functionality
productSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 