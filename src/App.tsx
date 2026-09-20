import { useEffect, useState } from "react";
import axios from "axios";

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Blog from "./pages/Blog";
import Blogs from "./pages/blogs";
import Write from "./pages/Write";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";

import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Header from "./components/Header";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { BACKEND_URL } from "./config";

function HomeRedirect() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      // No token
      if (!token) {
        setAuthenticated(false);
        setChecking(false);
        return;
      }

      try {
        await axios.get(`${BACKEND_URL}/api/v1/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Token is valid
        setAuthenticated(true);
      } catch (error) {
        console.error("Token verification failed:", error);

        // Invalid / expired token
        localStorage.removeItem("token");
        setAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };

    verifyToken();
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white" />

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (authenticated) {
    return <Navigate to="/blogs" replace />;
  }

  return <Navigate to="/signup" replace />;
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Header />

          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blog/:id" element={<Blog />} />
              <Route path="/write" element={<Write />} />
              <Route path="/write/:id" element={<Write />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<HomeRedirect />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
