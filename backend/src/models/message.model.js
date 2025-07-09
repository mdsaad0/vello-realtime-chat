import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;



//? This is the message model which will be used to store the messages in the database. The message will have the following fields:
//? senderId: The id of the sender of the message.
//? receiverId: The id of the receiver of the message.
//? text: The text of the message.
//? image: The image of the message.
//? createdAt: The date and time when the message was created.
//? updatedAt: The date and time when the message was updated.
//? The message model is exported as the default export of the module.
