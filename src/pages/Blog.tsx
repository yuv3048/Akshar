import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../config";

interface Blog {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  publishedAt: string | null;

  author: {
    id: string;
    name: string;
  };
}

function Blog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Blog not found.");
      return;
    }

    const fetchBlog = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${BACKEND_URL}/api/v1/blog/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBlog(response.data.blog);
      } catch (error) {
        console.error("Failed to fetch blog:", error);

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401
        ) {
          localStorage.removeItem("token");
          navigate("/signin");
          return;
        }

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 404
        ) {
          setError("Blog not found.");
        } else {
          setError("Unable to load this blog.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  if (loading) {
    return <BlogSkeleton />;
  }

  if (!blog) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        <div className="w-full max-w-md text-center">
          <div className="mb-5 text-5xl">📄</div>

          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {error || "Blog not found."}
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            The story you're looking for may have been removed or doesn't
            exist.
          </p>

          <button
            onClick={() => navigate("/blogs")}
            className="
              mt-6
              rounded-full
              bg-gray-900
              px-5
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-gray-800
              dark:bg-white
              dark:text-gray-900
              dark:hover:bg-gray-200
            "
          >
            Back to Stories
          </button>
        </div>
      </main>
    );
  }

  const authorInitial =
    blog.author.name.trim().charAt(0).toUpperCase() || "A";

  const formattedDate = new Date(blog.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10">

          {/* Main article */}
          <article
            className="
              min-w-0
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-6
              shadow-sm
              dark:border-gray-800
              dark:bg-gray-900
              sm:p-8
              lg:p-10
            "
          >
            {/* Date */}
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              {formattedDate}
            </p>

            {/* Title */}
            <h1
              className="
                wrap-break-words
                text-3xl
                font-bold
                leading-tight
                tracking-tight
                text-gray-900
                dark:text-white
                sm:text-4xl
                lg:text-5xl
              "
            >
              {blog.title}
            </h1>

            {/* Divider */}
            <div className="my-7 h-px bg-gray-200 dark:bg-gray-800 sm:my-8" />

            {/* Content */}
            <div
              className="
                whitespace-pre-wrap
                wrap-break-words
                text-base
                leading-8
                text-gray-700
                dark:text-gray-300
                sm:text-lg
                sm:leading-9
              "
            >
              {blog.content}
            </div>
          </article>

          {/* Author */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-6
                shadow-sm
                dark:border-gray-800
                dark:bg-gray-900
              "
            >
              <p
                className="
                  mb-5
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Author
              </p>

              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-linear-to-br
                    from-blue-600
                    to-indigo-700
                    text-xl
                    font-bold
                    text-white
                    shadow-sm
                  "
                >
                  {authorInitial}
                </div>

                {/* Author information */}
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-gray-900 dark:text-white">
                    {blog.author.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Writer
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function BlogSkeleton() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950 sm:px-6 sm:py-12">
      <div
        className="
          mx-auto
          grid
          w-full
          max-w-6xl
          animate-pulse
          grid-cols-1
          gap-6
          lg:grid-cols-[minmax(0,1fr)_280px]
          lg:gap-10
        "
      >
        {/* Article skeleton */}
        <div
          className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-6
            dark:border-gray-800
            dark:bg-gray-900
            sm:p-8
            lg:p-10
          "
        >
          <div className="mb-5 h-3 w-24 rounded bg-gray-200 dark:bg-gray-800" />

          <div className="mb-3 h-9 w-full max-w-2xl rounded bg-gray-200 dark:bg-gray-800" />

          <div className="mb-8 h-9 w-3/5 rounded bg-gray-200 dark:bg-gray-800" />

          <div className="space-y-4">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-11/12 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>

        {/* Author skeleton */}
        <div
          className="
            h-fit
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-6
            dark:border-gray-800
            dark:bg-gray-900
          "
        >
          <div className="mb-5 h-3 w-16 rounded bg-gray-200 dark:bg-gray-800" />

          <div className="flex items-center gap-4">
            <div className="h-14 w-14 shrink-0 rounded-full bg-gray-200 dark:bg-gray-800" />

            <div className="space-y-2">
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Blog;