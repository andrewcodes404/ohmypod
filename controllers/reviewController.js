const mongoose = require('mongoose');
const Review = mongoose.model('Review');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');


//expand to see img npm settings
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That filetype isn\'t allowed!' }, false);
    }
  }
};
exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written the photo to our filesystem, keep going!
  next();
};



// HOMEPAGE
exports.homePage = async (req, res) => {
  const reviews = await Review.find()
  // req.flash('success', `Successfully Created`);
  res.render('frontPage', {title: 'HomePage', reviews});
};



// SINGLE homePage
exports.single = async (req, res, next) => {
  const slugParam = req.params.slug;
  const review = await Review.findOne({slug : slugParam})
  res.render('single', {title: review.podTitle, review})
};



// ADD-CREATE-GET
exports.addReview = (req, res) => {
  res.render('editReview', { title: 'Add Review' });
};


// ADD-CREATE-POST
// //just to check what is getting sent in the POST
// exports.createReview = (req, res) => {res.json(req.body);};
exports.createReview = async (req, res) => {
  const review = await (new Review(req.body)).save();
  req.flash('success', `${review.podTitle} created`);
  res.redirect(`/review/${review.slug}`);
};


// EDIT
exports.editReview = async (req, res) => {
  const review = await Review.findOne({slug : req.params.slug});
  res.render('editReview', { title: `Edit ${review.name}`, review});
};

//UPDATE
exports.updateReview = async (req, res) => {
  const review = await Review.findOneAndUpdate({ slug: req.params.slug }, req.body, {
    new: true, // return the new store instead of the old one
    runValidators: true
  }).exec();
  req.flash('success', `Success <span class="highlight">${review.podTitle}</span> updated`);
  res.redirect(`/review/${review.slug}`);
};


// EXPLORE

exports.explore = async (req, res) => {
  const catParam = req.params.cat;
  if (req.params.cat){
    const reviews = await Review.find({cat : req.params.cat})
    res.render('explore', {catParam, reviews});
  }
  else {
    const reviews = await Review.find()
    res.render('explore', {catParam, reviews});
  }
}

//
// exports.explore = async ({ params: { cat: catParam } }, res) => {
//
//   const reviews = await Review.find(catParam ? { cat: catParam } : undefined);
//
//   res.render('explore', { catParam, reviews });
// }




exports.lols = "ha"
