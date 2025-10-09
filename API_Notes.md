# API - Backend

API notes regarding my project

API calls regarding the user

**Users**
- Fetch users
- Fetch specific user (by ID)
- Create a new user
- update a user
- Delete a user
  
**Orders**
- Get all orders
- get a specific order
- create a specific order
- update a specific order
- delete a specific order

**Products**
- Get a specific product
- Get all products
- Create a specific product
- Update a specific product
- Delete a specific product

**Reviews**
- Get a specific review
- Get all reviews
- Create a specific review
- Update a specific review
- Delete a specific review

## User - Roles

Guest - Ordinary Customer that lacks an account
Member - Ordinary Customer
Maintinace - Approve reviews, help with ordinary questions, can view all of the customers but can't edit allt
(aka. customer service front), can also approve or disaprove reviews and give reasons for them
Admin - Can edit, change roles, full control of all

"id":1,"title":"Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops","price":109.95,"description":"Your perfect p
ack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday
","category":"men's clothing","image":"https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png","rating":{"rate":3.
9,"count":120}

{"id":31,"title":"Modern Elegance Teal Armchair","slug":"modern-elegance-teal-armchair","price":25,"description":"Elevate your living space with this beautifully crafted armchair, featuring a sleek wooden frame
that complements its vibrant teal upholstery. Ideal for adding a pop of color and contemporary style to any room, this chair provides both superb comfort and sophisticated design. Perfect for reading, relaxing, o
r creating a cozy conversation nook.","category":{"id":3,"name":"Furniture","slug":"furniture","image":"https://i.imgur.com/Qphac99.jpeg","creationAt":"2025-10-06T15:04:15.000Z","updatedAt":"2025-10-06T15:04:15.0
00Z"},"images":["https://i.imgur.com/6wkyyIN.jpeg","https://i.imgur.com/Ald3Rec.jpeg","https://i.imgur.com/dIqo03c.jpeg"],"creationAt":"2025-10-06T15:04:15.000Z","updatedAt":"2025-10-06T15:04:15.000Z"}



{"id":31,
"title":"Modern Elegance Teal Armchair",
"slug":"modern-elegance-teal-armchair",
"price":25,"description":"Elevate your living space with this beautifully crafted armchair, featuring a sleek wooden frame
that complements its vibrant teal upholstery. Ideal for adding a pop of color and contemporary style to any room, this chair provides both superb comfort and sophisticated design. Perfect for reading, relaxing, o
r creating a cozy conversation nook.",
"category":
{"id":3,
"name":"Furniture",
"slug":"furniture",
"image":"https://i.imgur.com/Qphac99.jpeg",
"creationAt":"2025-10-06T15:04:15.000Z",
"updatedAt":"2025-10-06T15:04:15.0
00Z"},
"images":
["https://i.imgur.com/6wkyyIN.jpeg",
"https://i.imgur.com/Ald3Rec.jpeg",
"https://i.imgur.com/dIqo03c.jpeg"],
"creationAt":"2025-10-06T15:04:15.000Z",
"updatedAt":"2025-10-06T15:04:15.000Z"}


,{"id":32,"
title":"Elegant Solid Wood Dining Table","slug":"elegant-solid-wood-dining-table",
"price":67,
"description":"Enhance your dining space with this sleek, contemporary dining table, crafted from high-quality solid wo
od with a warm finish. Its sturdy construction and minimalist design make it a perfect addition for any home looking for a touch of elegance. Accommodates up to six guests comfortably and includes a striking frui
t bowl centerpiece. The overhead lighting is not included.",
"category":
{"id":3,
"name":"Furniture",
"slug":"furniture",
"image":"https://i.imgur.com/Qphac99.jpeg",
"creationAt":"2025-10-06T15:04:15.000Z",
"updatedAt":"2025-10-06T15:04:15.000Z"},
"images":["https://i.imgur.com/4lTaHfF.jpeg"],"creationAt":"2025-10-06T15:04:15.000Z","updatedAt":"2025-10-07T10:35:38.000Z"}

"id":1,
"title":"Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
"price":109.95,
"description":"Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday","category":"men's clothing","image"
:"https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
"rating":{"rate":3.9,"count":120}