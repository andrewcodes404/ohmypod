const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const reviewSchema = new mongoose.Schema({
  podTitle: {
    type : String,
    trim: true,
    // required: 'Please enter a podcast title'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  podUrl: {
    type : String,
    trim: true,
    // required: 'Please enter a url address'
  },

  podImg: String,
  podReview: {
    type: String,
    trim: true
  },
  podScore: Number,
  cat: String,
  created: {
    type: Date,
    default: Date.now
  },

});

// reviewSchema.statics.getTagsList = function() {
//   return this.aggregate([
//     { $unwind: '$tags' },
//     { $group: { _id: '$tags', count: { $sum: 1 } } },
//     { $sort: { count: -1 } }
//   ]);
// }




reviewSchema.pre('save', async function(next) {
  if (!this.isModified('podTitle')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.podTitle);
  // find other stores that have a slug of wes, wes-1, wes-2
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }
  next();
  // TODO make more resiliant so slugs are unique
});
module.exports = mongoose.model('Review', reviewSchema);
