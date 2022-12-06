const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,

}  = require("../utils/validators/reviewValidators");

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductIdAndUserIdToBody
} = require("../services/reviewServices");

const { protect, allowedTo } = require("../services/authServices");


router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(protect, allowedTo("user"), setProductIdAndUserIdToBody, createReviewValidator, createReview);
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(protect, allowedTo("user"), updateReviewValidator, updateReview)
  .delete(protect, allowedTo("user", "admin", "manager"), deleteReviewValidator, deleteReview);

module.exports = router;
