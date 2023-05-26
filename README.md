# 1. Title

E-Commerce Shopping

# 2. Introduction

The E-Commerce Shopping project aims to develop a comprehensive and user-friendly online shopping platform that allows customers to browse, search, purchase, and payment products conveniently from the comfort of their homes. 
This project is designed to provide an engaging and secure shopping experience for users while ensuring smooth and efficient operations for the online store.

# 3. Technologies And Tools

- Node.js
- Express.js
- JavaScript
- bcrypt library to encrypt password
- nodemailer library to send mails
- multer library to upload files and photos
- MongoDB
- MongoDBCompass
- Mongoose Atlas
- VS Code
- Postman
- Railway Deployment
- Stripe Payment

# 4. Features

## 4.1. User Authentication and Authorization
The platform allows users to create accounts, log in securely, and manage their profiles. User authentication ensures data privacy and secure transactions.

## 4.2. Brand, Category, Subcategory, product Management:
### 4.2.1. Brand Management:

Brand Creation: The E-Commerce Shopping platform allows administrators to create and manage brands associated with the products available on the platform. Each brand can have a name, logo, description, and other relevant details.

### 4.2.2. Category Management:

Category Creation: Administrators can create and manage product categories that group similar items together. Each category can have a name, description, and assigned products.

### 4.2.3. Subcategory Management:

Subcategory Creation: Subcategories allow for further classification within a category, providing a hierarchical structure. Administrators can create and manage subcategories to help users navigate and refine their product searches.

### 4.2.4. Subcategory Management:

Product Catalog: The project provides a well-organized and visually appealing product catalog where users can explore a wide range of products. Each product is accompanied by detailed information, including images, descriptions, prices, and availability.

## 4.3. Search and Filtering

Users can search for specific products using keywords, categories, or filters. Advanced search functionalities enable customers to find desired products quickly and efficiently.

## 4.4. Shopping Cart

A virtual shopping cart system allows users to add products, review the cart contents, update quantities, and remove items before proceeding to checkout. The cart retains the selected items throughout the shopping session.

## 4.5. Secure Payment Processing

The platform integrates a secure payment gateway to facilitate smooth and protected transactions. Users can choose from various payment methods and enter their payment details securely.

## 4.6. Order Management

The system provides order tracking and management functionalities for both users and administrators. Users can view their order history, check the status of their orders, and request returns or cancellations. Administrators can manage orders, update statuses, and handle customer support.

## 4.7. Ratings and Reviews

Users can rate and provide feedback on products they have purchased, contributing to a dynamic and transparent product review system. This feature helps other users make informed purchase decisions.

## 4.8. Wishlist

Users can create and manage a wishlist of desired products for future reference or sharing with others. The wishlist feature enhances user engagement and enables easy access to favorite products.

## 4.9. Notifications

The platform incorporates notifications to keep users updated about order status, promotions, restocked items, and other relevant information. Notifications can be sent via email, SMS, or in-app alerts.

## 4.10. User Profile

The E-Commerce Shopping platform includes a user profile feature that allows customers to create and manage their personal profiles. Users can customize their profile information, such as name, contact details, shipping addresses, and payment preferences. The profile feature also enables users to track their order history, view previous purchases, and manage returns or exchanges. By having a dedicated user profile, customers can easily update their information, streamline future purchases, and have a personalized shopping experience.

## 4.11. File and Photos Upload

The E-Commerce Shopping platform incorporates a file and photo upload feature that allows users to upload files or images related to their purchases or specific product requirements. This feature is particularly useful for customers who need to provide additional specifications, customizations, or reference images for the products they are purchasing.

## 4.12. Password Reset and Checkout Cart Email Notifications

The E-Commerce Shopping platform incorporates an email notification feature that automatically sends emails to users in two specific scenarios: when they forget their password and when they have items in their cart that have not been checked out.

# 5. Setup
## 1. install this project

## 2. create Database using mongoose

## 3. create stripe payment

## 4. create file named config.env and fill it using following data:

### PORT
PORT=
NODE_ENV=development

### DataBase
DB_PASSWORD=
DB_USER=
DB_NAME=

### DataBase URL
DB_URL=

### Images URL
BASE_URL=

### JWT
JWT_SECRET_KEY=
JWT_EXPIRE_TIME=

### Email_Setting
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=
EMAIL_PASSWORD=

### Stripe Setting
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET_KEY=

## 5. open cmd and write this command "npm i" the "npm run start:dev"

******hint payment only production mode after deployment******

