import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            console.log("Sending message to:", selectedUser);
            console.log("Message data:", messageData);
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            console.log("Message sent successfully, server response:", res.data);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages:()=>{ //! This function will be used to subscribe to the new_message event when the component mounts means when the user selects a user to chat with
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        
        socket.on("new_message", (newMessage) => {
           const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;  //! This will check if the new message is from the selected user
            if(!isMessageSentFromSelectedUser) return;  //! This will check if the new message is from the selected user, if not it will not update the messages state
            console.log("New message received:", newMessage);
             set((state) => ({
            messages: [...state.messages, newMessage],
        }));
        })
    },

    unsubscribeFromMessages: () => { //! This function will be used to unsubscribe from the new_message event when the component unmounts means when the user changes or logs out 
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("new_message");  //! This will remove the listener for the new_message event from the socket instance
            console.log("Unsubscribed from new_message event");
        }
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));