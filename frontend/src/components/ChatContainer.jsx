import { useChatStore } from '../store/useChatStore';
import { useEffect,useRef } from 'react';

import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons//MessageSkeleton'; // Assuming you have a MessageSkeleton component for loading state
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utilis';

const ChatContainer = () => {
  const {  messages,isMessagesLoading, getMessages, selectedUser, subscribeToMessages, unsubscribeFromMessages  } = useChatStore();
  const { authUser }=useAuthStore();

  const messageEndRef=useRef(null);  //! This will be used to scroll to the bottom of the chat container when a new message is received
  

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages(); // Subscribe to new messages when the component mounts 
    
    return () =>  unsubscribeFromMessages(); // Unsubscribe from messages when the component unmounts

  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);


  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // This effect will run whenever messages change, scrolling to the bottom of the chat container




  if (isMessagesLoading) {
    return (
    <div className=' flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <MessageSkeleton/>
      <MessageInput />
    </div>
  )
  }
  return (
    <div className="flex-1 flex flex-col overflow-auto">

      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef} // Attach the ref to the last message to scroll to it
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className=" size-35 rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer