const categoryRoutes = require('./categoryRoutes');
const subCategoryRoutes = require('./subCategoryRoutes');
const brandsRoutes = require('./brandRoutes');
const productsRoutes = require('./productRoutes');
const usersRoutes = require('./userRoutes');
const authsRoutes = require('./authRoutes');
const reviewsRoutes = require('./reviewRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const addresseslistRoutes = require('./addresseslistRoutes');
const couponsRoutes = require('./couponRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');


exports.mountRoutes = (app) =>{
    app.use("/api/v1/categories", categoryRoutes);
    app.use("/api/v1/subcategories", subCategoryRoutes);
    app.use("/api/v1/brands", brandsRoutes);
    app.use("/api/v1/products", productsRoutes);
    app.use("/api/v1/users", usersRoutes);
    app.use("/api/v1/auths", authsRoutes);
    app.use("/api/v1/reviews", reviewsRoutes);
    app.use("/api/v1/wishlist", wishlistRoutes);
    app.use("/api/v1/addresseslist", addresseslistRoutes);
    app.use("/api/v1/coupons", couponsRoutes);
    app.use("/api/v1/cart", cartRoutes);
    app.use("/api/v1/orders", orderRoutes);
}