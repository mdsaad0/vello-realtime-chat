import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

import { useEffect } from "react";

import { CloudCog, Loader } from "lucide-react";
import { Toaster} from "react-hot-toast";

const App = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const onlineUsers = useAuthStore((state) => state.onlineUsers);

  
  const theme = useThemeStore((state) => state.theme);
  
  console.log("Online Users:", {onlineUsers});

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);



  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={ !authUser ? <SignUpPage /> : <Navigate to="/" /> } />
        <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to="/" /> } />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
