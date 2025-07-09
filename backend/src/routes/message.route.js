import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getMessages, getUsersForSidebar, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get("/users",protectRoute,getUsersForSidebar); //? /api/message/users
                                                        //?This line of code defines a GET route for fetching users for the sidebar. The route is protected by the protectRoute middleware, which ensures that only authenticated users can access it. The getUsersForSidebar function is called when a GET request is made to this route, and it handles the logic for retrieving users for the sidebar.
                                                        //?The protectRoute middleware is responsible for adding the user information to the request object, allowing us to access the logged-in user's ID. The getUsersForSidebar function retrieves all users except the logged-in user and excludes their password from the result, returning the filtered users as a JSON response.


router.get("/:id",protectRoute,getMessages) //? /api/message/:id 
                                             //?This line of code defines a GET route for fetching messages between the logged-in user and another user. The route is protected by the protectRoute middleware, which ensures that only authenticated users can access it. The getMessages function is called when a GET request is made to this route, and it handles the logic for retrieving messages between users.
                                             //?The :id parameter in the route URL represents the ID of the user whose messages we want to fetch. The protectRoute middleware is responsible for adding the user information to the request object, allowing us to access the logged-in user's ID.

router.post("/send/:id",protectRoute,sendMessage);   //? /api/message/send/:id
                                                    //?This line of code defines a POST route for sending messages. The route is protected by the protectRoute middleware, which ensures that only authenticated users can access it. The sendMessage function is called when a POST request is made to this route, and it handles the logic for sending messages between users.
                                                    //?The :id parameter in the route URL represents the ID of the user to whom the message is being sent. The protectRoute middleware is responsible for adding the user information to the request object, allowing us to access the logged-in user's ID.

export default router;