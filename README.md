******* Folder Structer ********
productReview/
├── controllers/
│   └── controlles.js
├── models/
│   └── models.js
├── routes/
│   └── routes.js
├── middlewares/
│   └── middleware.js
├── config/
│   └── mongoDbConfig.js
├── .env
├── package.json
├── server.js
└── README.md

Running the project
* Navigate to the productReview directory.
* Install dependencies: npm install
* Start the server: node index.js

Notes
* Ensure MongoDB URIs in the .env file is correctly configured with your MongoDB Atlas credentials.
* Change JWT_SECRET in the .env as needed.

* Register 
URL: http://localhost:9090/register
Method: POST
Body:
{
"username":<USER_NAME>,
"password":<PASSWORD>,
"email":<EMAIL_ID>
}

 * Login
URL: http://localhost:9090/login
Method: POST
Body:
{
"username":<USER_NAME>,
"password":<PASSWORD>,
}
If username and passwrod is verified you will get JWT Token in response

* Add Review (Requires JWT Token)

URL: http://localhost:9090/reviews
Method: POST
Headers:
{
  "Authorization": "<JWT_TOKEN>"
}
Body:
{
    "productId": "3",
    "username": "Charles",
    "rating": 3,
    "comment": "Good one"
}

* Get Reviews of a product(Requires JWT Token)
URL: http://localhost:9090/reviews/3
Method: GET
Headers:
{
  "Authorization": "<JWT_TOKEN>"
}

* Add reply to review (Requires JWT Token)
URL: http://localhost:9090/reviews/3/reply
Method: GET
Headers:
{
  "Authorization": "<JWT_TOKEN>"
}
Body:
{
"username":"Charles",
"reply": "Thankyou for the feedback"
}