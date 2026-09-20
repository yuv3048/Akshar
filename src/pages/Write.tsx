import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../config";

const TITLE_LIMIT = 100;

interface Blog {
  id: string;
  title: string;
  content: string;
}

function Write() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // LOAD BLOG WHEN EDITING
  // ======================================================

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/signin");
          return;
        }

        const response = await axios.get(
          `${BACKEND_URL}/api/v1/blog/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const blog: Blog = response.data.blog;

        setTitle(blog.title);
        setContent(blog.content);
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

  // ======================================================
  // TITLE
  // ======================================================

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    if (value.length <= TITLE_LIMIT) {
      setTitle(value);
    }
  };

  // ======================================================
  // SAVE BLOG
  // ======================================================

  const saveBlog = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    if (!trimmedContent) {
      setError("Content is required.");
      return;
    }

    if (trimmedTitle.length > TITLE_LIMIT) {
      setError(
        `Title must be ${TITLE_LIMIT} characters or less.`
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/signin");
        return;
      }

      if (isEditMode && id) {
        await axios.put(
          `${BACKEND_URL}/api/v1/blog`,
          {
            id,
            title: trimmedTitle,
            content: trimmedContent,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `${BACKEND_URL}/api/v1/blog`,
          {
            title: trimmedTitle,
            content: trimmedContent,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      navigate("/blogs");
    } catch (error) {
      console.error("Failed to save blog:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/signin");
          return;
        }

        setError(
          error.response?.data?.error ||
            "Unable to save blog. Please try again."
        );
      } else {
        setError("Unable to save blog. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="animate-pulse">
            <div className="mb-8 flex items-center justify-between">
              <div className="h-7 w-32 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-10 w-24 rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>

            <div className="mb-4 h-12 w-4/5 rounded bg-gray-200 dark:bg-gray-800" />

            <div className="space-y-4">
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-11/12 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  const wordCount = content
    .split(/\s+/)
    .filter(Boolean).length;

  const canSave =
    !saving &&
    Boolean(title.trim()) &&
    Boolean(content.trim());

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              {isEditMode ? "Edit Blog" : "Write"}
            </h1>

            {isEditMode && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Make changes to your blog
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={saving}
              className="
                rounded-full
                border
                border-gray-300
                px-4
                py-2
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-100
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:border-gray-700
                dark:text-gray-300
                dark:hover:bg-gray-800
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={saveBlog}
              disabled={!canSave}
              className="
                rounded-full
                bg-gray-900
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-gray-800
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:bg-white
                dark:text-gray-900
                dark:hover:bg-gray-200
              "
            >
              {saving
                ? isEditMode
                  ? "Saving..."
                  : "Publishing..."
                : isEditMode
                  ? "Save Changes"
                  : "Publish"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="
              mb-6
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              font-medium
              text-red-600
              dark:border-red-500/30
              dark:bg-red-500/10
              dark:text-red-400
            "
          >
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Title"
            maxLength={TITLE_LIMIT}
            autoFocus={!isEditMode}
            className="
              w-full
              border-none
              bg-transparent
              text-3xl
              font-bold
              leading-tight
              tracking-tight
              text-gray-900
              outline-none
              placeholder:text-gray-300
              sm:text-5xl
              dark:text-white
              dark:placeholder:text-gray-700
            "
          />

          <div className="mt-2 flex justify-end">
            <span
              className={`text-xs ${
                title.length >= TITLE_LIMIT
                  ? "text-red-500"
                  : "text-gray-400 dark:text-gray-600"
              }`}
            >
              {title.length}/{TITLE_LIMIT}
            </span>
          </div>
        </div>

        {/* Content editor */}
        <div className="mt-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell your story..."
            spellCheck
            className="
              h-[60vh]
              min-h-125
              w-full
              resize-none
              overflow-y-auto
              border-none
              bg-transparent
              pr-2
              text-base
              leading-8
              text-gray-800
              outline-none
              placeholder:text-gray-400
              sm:h-[65vh]
              sm:text-lg
              dark:text-gray-300
              dark:placeholder:text-gray-700
            "
          />
        </div>

        {/* Content information */}
        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-gray-200
            pt-4
            text-xs
            text-gray-400
            dark:border-gray-800
            dark:text-gray-600
          "
        >
          <span>
            {content.length} characters
          </span>

          <span>
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
        </div>
      </div>
    </main>
  );
}

export default Write;