import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import { BACKEND_URL } from "../config";

interface User {
  id: string;
  name: string;
  email: string;
  description: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ======================================================
  // FETCH PROFILE
  // ======================================================

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [profileResponse, postsResponse] =
        await Promise.all([
          axios.get(
            `${BACKEND_URL}/api/v1/user/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          axios.get(
            `${BACKEND_URL}/api/v1/user/posts`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

      const fetchedUser: User =
        profileResponse.data.user;

      setUser(fetchedUser);
      setPosts(postsResponse.data.posts || []);

      setName(fetchedUser.name);
      setDescription(
        fetchedUser.description || ""
      );
    } catch (error) {
      console.error(
        "PROFILE FETCH ERROR:",
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

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
            "Unable to load profile. Please try again."
        );
      } else {
        setError(
          "Unable to load profile. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    fetchProfile();
  }, [navigate]);

  // ======================================================
  // SAVE PROFILE
  // ======================================================

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    const trimmedName = name.trim();
    const trimmedDescription =
      description.trim();

    if (!trimmedName) {
      setError("Name cannot be empty.");
      return;
    }

    if (trimmedName.length > 50) {
      setError(
        "Name must be 50 characters or less."
      );
      return;
    }

    if (trimmedDescription.length > 500) {
      setError(
        "Description must be 500 characters or less."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await axios.put(
        `${BACKEND_URL}/api/v1/user/profile`,
        {
          name: trimmedName,
          description: trimmedDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser: User =
        response.data.user;

      setUser(updatedUser);
      setName(updatedUser.name);
      setDescription(
        updatedUser.description || ""
      );

      setIsEditing(false);
    } catch (error) {
      console.error(
        "PROFILE UPDATE ERROR:",
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

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
            "Unable to update profile. Please try again."
        );
      } else {
        setError(
          "Unable to update profile. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // CANCEL EDIT
  // ======================================================

  const handleCancelEdit = () => {
    if (!user) return;

    setName(user.name);
    setDescription(user.description || "");

    setIsEditing(false);
    setError("");
  };

  // ======================================================
  // DELETE BLOG
  // ======================================================

  const handleDeleteBlog = async (
    id: string
  ) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await axios.delete(
        `${BACKEND_URL}/api/v1/blog/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((currentPosts) =>
        currentPosts.filter(
          (post) => post.id !== id
        )
      );
    } catch (error) {
      console.error(
        "DELETE BLOG ERROR:",
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

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
            "Unable to delete blog. Please try again."
        );
      } else {
        setError(
          "Unable to delete blog. Please try again."
        );
      }
    } finally {
      setDeletingId(null);
    }
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  // ======================================================
  // HELPERS
  // ======================================================

  const getInitial = () => {
    if (!user?.name?.trim()) {
      return "?";
    }

    return user.name
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  const getPreview = (content: string) => {
    const cleanContent = content
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (cleanContent.length <= 180) {
      return cleanContent;
    }

    return `${cleanContent.slice(0, 180)}...`;
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950 sm:px-6">
        <div className="mx-auto max-w-5xl animate-pulse">

          <div className="h-8 w-40 rounded bg-gray-200 dark:bg-gray-800" />

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="h-20 w-20 shrink-0 rounded-full bg-gray-200 dark:bg-gray-800" />

              <div className="space-y-3">
                <div className="h-6 w-48 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-64 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>

            <div className="mt-8 h-20 rounded bg-gray-200 dark:bg-gray-800" />
          </div>

          <div className="mt-10 h-7 w-32 rounded bg-gray-200 dark:bg-gray-800" />

          <div className="mt-5 space-y-4">
            <div className="h-32 rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="h-32 rounded-xl bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </main>
    );
  }

  // ======================================================
  // FAILED TO LOAD
  // ======================================================

  if (!user) {
    return (
      <main className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        <div className="text-center">

          <p className="text-gray-600 dark:text-gray-400">
            {error || "Unable to load your profile."}
          </p>

          <button
            onClick={fetchProfile}
            className="
              mt-4
              rounded-lg
              bg-gray-900
              px-5
              py-2
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
            Try Again
          </button>

        </div>
      </main>
    );
  }

  // ======================================================
  // PROFILE
  // ======================================================

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 transition-colors dark:bg-gray-950 dark:text-white sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">

        {/* ERROR */}

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
              text-red-600
              dark:border-red-900
              dark:bg-red-950/40
              dark:text-red-400
            "
          >
            {error}
          </div>
        )}

        {/* ==================================================
            PROFILE CARD
            ================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-5
            shadow-sm
            dark:border-gray-800
            dark:bg-gray-900
            sm:p-8
          "
        >

          {/* Profile header */}

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

            <div className="flex min-w-0 items-center gap-4 sm:gap-5">

              {/* Avatar */}

              <div
                className="
                  flex
                  h-16
                  w-16
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-900
                  text-2xl
                  font-semibold
                  text-white
                  dark:bg-white
                  dark:text-gray-900
                  sm:h-20
                  sm:w-20
                  sm:text-3xl
                "
              >
                {getInitial()}
              </div>

              {/* User */}

              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold sm:text-2xl">
                  {user.name}
                </h1>

                <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>

            </div>

            {!isEditing && (
              <button
                onClick={() => {
                  setError("");
                  setIsEditing(true);
                }}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-gray-300
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-100
                  dark:border-gray-700
                  dark:text-gray-200
                  dark:hover:bg-gray-800
                  sm:w-auto
                "
              >
                <EditIcon fontSize="small" />
                Edit Profile
              </button>
            )}

          </div>

          {/* ==================================================
              EDIT PROFILE
              ================================================== */}

          {isEditing ? (
            <div
              className="
                mt-8
                border-t
                border-gray-200
                pt-6
                dark:border-gray-800
              "
            >

              {/* Name */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="profile-name"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </label>

                  <span className="text-xs text-gray-400 dark:text-gray-600">
                    {name.length}/50
                  </span>
                </div>

                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  maxLength={50}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Your name"
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-4
                    py-3
                    text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-black
                    focus:ring-1
                    focus:ring-black
                    dark:border-gray-700
                    dark:bg-gray-950
                    dark:text-white
                    dark:placeholder:text-gray-600
                    dark:focus:border-white
                    dark:focus:ring-white
                  "
                />
              </div>

              {/* Email */}

              <div className="mt-5">
                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>

                <input
                  id="profile-email"
                  type="email"
                  value={user.email}
                  disabled
                  className="
                    w-full
                    cursor-not-allowed
                    rounded-lg
                    border
                    border-gray-200
                    bg-gray-100
                    px-4
                    py-3
                    text-gray-500
                    dark:border-gray-800
                    dark:bg-gray-800
                    dark:text-gray-500
                  "
                />

                <p className="mt-1 text-xs text-gray-400 dark:text-gray-600">
                  Email cannot be changed.
                </p>
              </div>

              {/* Description */}

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="profile-description"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Description
                  </label>

                  <span className="text-xs text-gray-400 dark:text-gray-600">
                    {description.length}/500
                  </span>

                </div>

                <textarea
                  id="profile-description"
                  value={description}
                  maxLength={500}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Tell readers something about yourself..."
                  rows={5}
                  className="
                    w-full
                    resize-none
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-4
                    py-3
                    text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-black
                    focus:ring-1
                    focus:ring-black
                    dark:border-gray-700
                    dark:bg-gray-950
                    dark:text-white
                    dark:placeholder:text-gray-600
                    dark:focus:border-white
                    dark:focus:ring-white
                  "
                />
              </div>

              {/* Buttons */}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-gray-900
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-gray-800
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    dark:bg-white
                    dark:text-gray-900
                    dark:hover:bg-gray-200
                    sm:w-auto
                  "
                >
                  <SaveIcon fontSize="small" />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-gray-300
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-gray-700
                    transition
                    hover:bg-gray-100
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    dark:border-gray-700
                    dark:text-gray-200
                    dark:hover:bg-gray-800
                    sm:w-auto
                  "
                >
                  <CloseIcon fontSize="small" />
                  Cancel
                </button>

              </div>
            </div>
          ) : (
            /* ABOUT */

            <div
              className="
                mt-8
                border-t
                border-gray-200
                pt-6
                dark:border-gray-800
              "
            >
              <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                About
              </h2>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-gray-700 dark:text-gray-300">
                {user.description ||
                  "No description added yet."}
              </p>
            </div>
          )}
        </section>

        {/* ==================================================
            MY BLOGS
            ================================================== */}

        <section className="mt-10">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h2 className="text-2xl font-bold">
                My Blogs
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {posts.length}{" "}
                {posts.length === 1
                  ? "blog"
                  : "blogs"}
              </p>
            </div>

            <button
              onClick={() => navigate("/write")}
              className="
                w-full
                rounded-lg
                bg-gray-900
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-gray-800
                dark:bg-white
                dark:text-gray-900
                dark:hover:bg-gray-200
                sm:w-auto
              "
            >
              Write Blog
            </button>

          </div>

          {/* No blogs */}

          {posts.length === 0 ? (
            <div
              className="
                mt-5
                rounded-2xl
                border
                border-dashed
                border-gray-300
                bg-white
                px-5
                py-16
                text-center
                dark:border-gray-700
                dark:bg-gray-900
              "
            >
              <h3 className="text-lg font-semibold">
                No blogs yet
              </h3>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Start writing your first blog.
              </p>

              <button
                onClick={() => navigate("/write")}
                className="
                  mt-5
                  rounded-lg
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
                Create Blog
              </button>
            </div>
          ) : (
            <div className="mt-5 space-y-4">

              {posts.map((post) => (
                <article
                  key={post.id}
                  className="
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-5
                    shadow-sm
                    transition
                    hover:shadow-md
                    dark:border-gray-800
                    dark:bg-gray-900
                    sm:p-6
                  "
                >
                  <div className="flex flex-col gap-5">

                    {/* Blog information */}

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/blog/${post.id}`
                        )
                      }
                      className="w-full text-left"
                    >
                      <div className="flex flex-wrap items-start gap-2">

                        <h3 className="min-w-0 wrap-break-words text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
                          {post.title}
                        </h3>

                        <span
                          className={`
                            shrink-0
                            rounded-full
                            px-2.5
                            py-1
                            text-xs
                            font-medium
                            ${
                              post.published
                                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            }
                          `}
                        >
                          {post.published
                            ? "Published"
                            : "Draft"}
                        </span>

                      </div>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                        {getPreview(
                          post.content
                        )}
                      </p>

                      <p className="mt-4 text-xs text-gray-400 dark:text-gray-600">
                        Created{" "}
                        {new Date(
                          post.createdAt
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </p>
                    </button>

                    {/* Actions */}

                    <div className="flex flex-col gap-2 border-t border-gray-200 pt-4 dark:border-gray-800 sm:flex-row sm:justify-end">

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/write/${post.id}`
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-1.5
                          rounded-lg
                          border
                          border-gray-300
                          px-3
                          py-2
                          text-sm
                          font-medium
                          text-gray-700
                          transition
                          hover:bg-gray-100
                          dark:border-gray-700
                          dark:text-gray-200
                          dark:hover:bg-gray-800
                          sm:w-auto
                        "
                      >
                        <EditIcon fontSize="small" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteBlog(
                            post.id
                          )
                        }
                        disabled={
                          deletingId === post.id
                        }
                        className="
                          flex
                          w-full
                          items-center
                          justify-center
                          gap-1.5
                          rounded-lg
                          border
                          border-red-200
                          px-3
                          py-2
                          text-sm
                          font-medium
                          text-red-600
                          transition
                          hover:bg-red-50
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                          dark:border-red-900
                          dark:text-red-400
                          dark:hover:bg-red-950/40
                          sm:w-auto
                        "
                      >
                        <DeleteIcon fontSize="small" />

                        {deletingId === post.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>
                  </div>
                </article>
              ))}

            </div>
          )}
        </section>

        {/* ==================================================
            LOGOUT
            ================================================== */}

        <div
          className="
            mt-12
            border-t
            border-gray-200
            py-8
            dark:border-gray-800
          "
        >
          <button
            onClick={handleLogout}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-red-200
              px-5
              py-3
              text-sm
              font-medium
              text-red-600
              transition
              hover:bg-red-50
              dark:border-red-900
              dark:text-red-400
              dark:hover:bg-red-950/40
              sm:mx-auto
              sm:w-auto
            "
          >
            <LogoutIcon fontSize="small" />
            Logout
          </button>
        </div>

      </div>
    </main>
  );
}

export default Profile;