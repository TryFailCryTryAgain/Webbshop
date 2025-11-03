# API Docs

This API was built using **Express**, **Typescript**, and **MongoDB**. It provides endpoints for managing users, products, categories, reviews and orders. The API is designed to be scalable, modular and easy to use. Below is a detailed guide on how to set up, run and interact with the API.

---

## Table of Contents



---


## Technologies Used

- **Backend Framework**: Express
- **Programming Language**: TypeScript (can be converted to JavaScript)
- **Database**: MongoDB
  - Mongoose (ODM)
  - MongoDB Compass
  - MongoDB Atlas
- **Environment Management**: dotenv
- **Development Tools**:
  - Nodemon
  - ts-node
  - TypeScript
  - @types/express
  - @types/node
  - jsonwebtoken
  - cors
  - @types/cors
  - bcryptjs
  - @types/bcryptjs

## Project Structure

~~~

src/
├── controller/
│ ├── categoryController.ts
│ ├── orderController.ts
│ ├── ProductController.ts
│ ├── ReviewController.ts
│ ├── UserController.ts
├── middleware/
│ ├── auth.ts
├── model/
│ ├── Categorymodel.ts
│ ├── OrderModel.ts
│ ├── ProductModel.ts
│ ├── ReviewModel.ts
│ ├── UserModel.ts
├── routes/
│ ├── categoryRoutes.ts
│ ├── OrderRoutes.ts
│ ├── productRoutes.ts
│ ├── ReviewRoutes.ts
│ ├── UserRoutes.ts
├── utils /
│ ├── auth.ts
│ ├── db.ts
│ ├── tokenBlacklist.ts
├── server.ts
├── package.json
├── tsconfig.json

~~~


## Setup and Installation

1. **Clone the Repository**:
   - bash
   git clone <repository-url>
   cd <project-folder>¨

2. **Install Dependencies:**
    npm install

3. **Set Up Environment Variables:**
    - Create a .env file in the root directory.
    - Add the following variables:
      MONGO_URI=<your-mongodb-connection-string>
      JWT_SECRET=<Genereate-a-jwt-key-secret>
      JWT_EXPIRES_IN=<How-long-each-token-lasts>

4. **Run the Server:**
    - For development:
      - npm run dev
    - For production:
      - npm run build
      - npm start

## API Endpoints


### User Routes

- GET /user/session - get Current users sessionInfo
- GET /user/ - Fetches all users
- GET /user/first/:first_name - Fetches users by first name
- GET /user/last/:last_name - Fetches users by last name
- GET /user/id/:_id - Fetches users by ID
- POST /user/register/ - Creates a new user
- POST /user/login/ - Logins a user to the system
- PUT /user/:_id - updateds a user by ID
- DELETE /user/:_id - Deletes a user by ID

### Product Routes

- GET /product/ - fetches all products
- GET /product/category/:categoryId - Fetches a product by category ID.
- GET /product/category/slug/:slug - Fetches a product by categorys slug name.
- GET /product/:_id - Fetches a product by ID.
- POST /product/ - Creates a new product.
- PUT /product/:_id - Updates a product by ID.
- DELETE /product/:_id - Deletes a product by ID.

### Order Routes

- GET /order/ - fetches all orders
- GET /order/:_id - fetches order by ID
- GET /order/user/:userId - fetches order by UserId
- POST /order/ - creates a new order
- PUT /order/:_id - updates an existing order
- DELETE /order/:_id - deletes an order

### Review Routes

- GET /review/ - Fetches all reviews.
- GET /review/:_id - fetches a review by ID.
- GET /reivew/product/:productId - fetches reviews by productId
- GET /review/user/:userId - fetches review by userId
- POST /review/ - Creates a new review.
- PUT /review/:_id - updates a review by ID.
- DELETE /review/:_id - deletes a review by ID.

### Category Routes

- GET /category/ - Fetches all categories.
- GET /category/id/:_id - Fetches category by ID
- GET /category/slug/:slug - feches category by Slug name
- POST /category/ - Creates a category
- PUT /category/:_id - Updates a new Category
- Delete /category/:_id - Deletes a Category


## cURL Commands

### Local Server

#### Testing Connection to your MongoDB Cluster
~~~
    curl http://localhost:8080/test
~~~

#### Fetch users
~~~
    curl http://localhost:8080/user/
~~~

#### Fetch users by first name
~~~
    curl http://localhost:8080/user/first/:first_name
~~~

#### Fetch users by last name
~~~
    curl http://localhost:8080/user/last/:last_name
~~~

#### Fetch users by id
~~~
    curl http://localhost:8080/user/id/:_id
~~~

#### Fetch Session Info 
~~~
    curl -X GET http://localhost:8080/user/session \
    -H "Authorization: Bearer access-token"
~~~

#### Update existing user
~~~
    curl -X PUT http://localhost:8080/user/:_id \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer access-token" \
    -d '{"key": "value"}'
~~~

#### Create User
~~~
    curl -X POST http://localhost:8080/user \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer access-token" \
    -d '{"key": "value"}'
~~~

