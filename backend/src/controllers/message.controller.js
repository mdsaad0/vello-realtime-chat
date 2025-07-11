import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js"//?This line of code imports the Cloudinary configuration from the config file. It allows us to use Cloudinary's functionality for image uploading and management.
import { getReceiverSocketId,io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;  //?This line of code retrieves the ID of the currently logged-in user from the request object. The protectRoute middleware is responsible for adding the user information to the request object.
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");  //?What this line of code does is it fetches all users except the logged-in user and excludes their password from the result.
        res.status(200).json(filteredUsers); //?This line of code sends a JSON response with a status code of 200 (OK) and the filtered users as the response body.
                                            //?The response will contain an array of user objects, each representing a user in the system, excluding the logged-in user.
                                            //? so in front how we can get this filtered users is by using the useChatStore hook, which will call this API endpoint to fetch the users for the sidebar. res.data will contain the filtered users, and we can use it to display the list of users in the sidebar of the chat application.
    }
    catch (error) {
        console.error("Error fetching users for sidebar:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getMessages = async (req, res) => {
    try{
        const { id:userToChatId } = req.params; //?This line of code extracts the id parameter from the request parameters. This id is expected to be the ID of the user whose messages we want to fetch.
        const myId = req.user._id; //?This line of code retrieves the ID of the currently logged-in user from the request object. The protectRoute middleware is responsible for adding the user information to the request object.

        const messages=await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        }); //?This line of code uses the Message model to find messages that match either of the two conditions specified in the $or operator. It retrieves messages where the logged-in user is the sender and the other user is the receiver, or vice versa.
        res.status(200).json(messages); //?This line of code sends a JSON response with a status code of 200 (OK) and the messages as the response body.
    }
    catch (error) {
        console.error("Error fetching messages:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessage=async (req,res)=>{
    try{
        const {text,image}=req.body; //?This line of code extracts the text and image properties from the request body. These properties are expected to contain the message text and an optional image associated with the message.
        const { id:receiverId } = req.params; //?This line of code extracts the id parameter from the request parameters. This id is expected to be the ID of the user to whom the message is being sent.
        const senderId = req.user._id; //?This line of code retrieves the ID of the currently logged-in user from the request object. The protectRoute middleware is responsible for adding the user information to the request object.

        let imageUrl;
        if(image){
            //Uploading base64 image to cloudinary
            const uploadResponse=await cloudinary.uploader.upload(image); //?This line of code uploads the base64 image to Cloudinary and stores the response in the uploadResponse variable. The cloudinary.uploader.upload function is used to handle the image upload.
            imageUrl=uploadResponse.secure_url; //?This line of code retrieves the secure URL of the uploaded image from the uploadResponse object and stores it in the imageUrl variable.
        }
            const newMessage=new Message({
                senderId,
                receiverId,
                text,
                image:imageUrl
            });

            await newMessage.save(); //?This line of code saves the new message to the database using the save method of the Message model.

            const receiverSocketId=getReceiverSocketId(receiverId); //?This line of code retrieves the socket ID of the receiver using the getReceiverSocketId function. This function is expected to return the socket ID of the user with the given receiverId.
            if(receiverSocketId){
                io.to(receiverSocketId).emit("new_message", newMessage); //?This line of code emits a "new_message" event to the socket associated with the receiver's socket ID. The event contains the newly created message. This event is used to notify the receiver of a new message in real-time.
            }




            res.status(201).json(newMessage); //?This line of code sends a JSON response with a status code of 201 (Created) and the newly created message as the response body.
        }
    
    catch(error){
        console.error("Error sending message:", error.message);
        return res.status(500).json({error: "Internal server error" });
    }
}