import { useEffect, useState } from "react";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { BACKEND_URL } from "../config";

interface User {
  id: string;
  name: string;
  email: string;
  description: string;
}

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Dark mode is the default
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
      return false;
    }

    return true;
  });

  // Apply theme to the entire application
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Fetch logged-in user
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    axios
      .get(`${BACKEND_URL}/api/v1/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        console.error("Failed to fetch user:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          setUser(null);
          navigate("/signin");
          return;
        }

        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location.pathname, navigate]);

  const toggleTheme = () => {
    setDarkMode((current) => !current);
  };

  const avatarLetter = user?.name?.trim().charAt(0).toUpperCase() || "A";

  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-gray-200/80
        bg-white/90
        backdrop-blur-md
        dark:border-gray-800
        dark:bg-gray-950/90
      "
    >
      <nav
        className="
          mx-auto
          flex
          w-full
          max-w-6xl
          items-center
          justify-between
          px-4
          py-3
          sm:px-6
        "
      >
        {/* Logo */}
        <button
          onClick={() => navigate("/blogs")}
          className="flex items-center gap-2.5"
        >
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-linear-to-br
              from-blue-600
              to-indigo-700
              shadow-sm
            "
          >
            <img
              src="/akshar.png"
              alt="Akshar"
              className="h-9 w-9 object-contain"
            />
          </div>

          <span
            className="
              text-xl
              font-bold
              tracking-tight
              text-gray-900
              dark:text-white
            "
          >
            Akshar
          </span>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-gray-300
              bg-white
              text-gray-700
              transition
              hover:scale-105
              hover:bg-gray-100
              dark:border-gray-700
              dark:bg-gray-900
              dark:text-yellow-300
              dark:hover:bg-gray-800
            "
          >
            {darkMode ? (
              <LightModeIcon fontSize="small" />
            ) : (
              <DarkModeIcon fontSize="small" />
            )}
          </button>

          {!loading && user && (
            <>
              {/* Write */}
              <button
                onClick={() => navigate("/write")}
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  px-3
                  py-2
                  text-sm
                  font-medium
                  text-gray-600
                  transition-colors
                  hover:bg-gray-100
                  hover:text-gray-900
                  dark:text-gray-300
                  dark:hover:bg-gray-800
                  dark:hover:text-white
                  sm:px-4
                "
              >
                <EditNoteIcon fontSize="small" />

                <span className="hidden sm:inline">Write</span>
              </button>

              {/* Profile */}
              <button
                onClick={() => navigate("/profile")}
                title="Profile"
                aria-label="Open profile"
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-900
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:scale-105
                  hover:opacity-80
                  dark:bg-white
                  dark:text-gray-900
                "
              >
                {avatarLetter}
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
