const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');



//home
router.get('/', reviewController.homePage);

//Add a Review
router.get('/add',
  authController.isLoggedIn,
  reviewController.addReview
);

router.post('/add',
  reviewController.upload,
  catchErrors(reviewController.resize),
  catchErrors(reviewController.createReview)
);


// Review by slug
router.get('/review/:slug', catchErrors(reviewController.single));

// Edit review
router.get('/review/:slug/edit',
  authController.isLoggedIn,
  catchErrors(reviewController.editReview)
);


// EDIT/UDPDATE REVIEW (POST)
router.post('/add/:slug',
  reviewController.upload,
  catchErrors(reviewController.resize),
  catchErrors(reviewController.updateReview)
);

// EXPLORE TAGS
router.get( '/explore', catchErrors(reviewController.explore));
router.get( '/explore/:cat', catchErrors(reviewController.explore));


/// USER -- USER -- USER -- USER -- USER -- USER -- USER -- USER --

//register GET
router.get('/register', userController.registerForm)
//register POST
router.post('/register',
  userController.validateRegister,
  catchErrors(userController.register),
  authController.login
);

// login GET
router.get('/login', userController.loginForm );
//login POST
router.post('/login', authController.login)

//log-out
router.get('/logout', authController.logout);


//user-edit GET
router.get('/account', authController.isLoggedIn, userController.account);
// user-edit POST
router.post('/account', catchErrors(userController.updateAccount));

//password-forgot GET
router.post('/account/forgot', catchErrors(authController.forgot));
//password reset page GET
router.get('/account/reset/:token', catchErrors(authController.reset));

// password update/save post
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
);

















module.exports = router;
