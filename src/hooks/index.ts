import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { BACKEND_URL } from "../config";

interface Blog {
  content: string;
  title: string;
  id: string;
  createdAt: string;
  publishedAt?: string | null;
  author: {
    name: string;
  };
}

export const useBlogs = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        setLoading(true);

        const response = await axios.get(
          `${BACKEND_URL}/api/v1/blog/bulk`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBlogs(response.data.blogs || []);
      } catch (error) {
        console.error(
          "Failed to fetch blogs:",
          error
        );

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401
        ) {
          localStorage.removeItem("token");
          navigate("/signin");
          return;
        }

        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [navigate]);

  return {
    loading,
    blogs,
  };
};