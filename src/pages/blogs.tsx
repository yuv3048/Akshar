import { BlogCard } from "../components/BlogCard";
import { useBlogs } from "../hooks";

function Blogs() {
  const { loading, blogs } = useBlogs();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-gray-950 dark:text-white sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-3xl">

        {/* Page heading */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Stories
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Ideas, experiences and things worth sharing.
          </p>
        </div>

        {/* Blog list */}
        <div className="flex flex-col gap-5 sm:gap-6">
          {loading ? (
            <>
              <BlogSkeleton />
              <BlogSkeleton />
              <BlogSkeleton />
            </>
          ) : blogs.length > 0 ? (
            blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                authorName={blog.author.name}
                title={blog.title}
                content={blog.content}
                publishDate={new Date(blog.createdAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )}
              />
            ))
          ) : (
            <EmptyBlogs />
          )}
        </div>
      </div>
    </main>
  );
}

function BlogSkeleton() {
  return (
    <div className="w-full animate-pulse rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      {/* Author */}
      <div className="mb-5 flex items-center gap-3">
        <div className="h-9 w-9 shrink-0 rounded-full bg-gray-200 dark:bg-gray-800" />

        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-2 w-16 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>

      {/* Title */}
      <div className="mb-4 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />

      {/* Content */}
      <div className="space-y-3">
        <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-3 w-11/12 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* Date */}
      <div className="mt-6 h-3 w-24 rounded bg-gray-200 dark:bg-gray-800" />
    </div>
  );
}

function EmptyBlogs() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center dark:border-gray-700 dark:bg-gray-900">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        No stories yet
      </h2>

      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        There are no published stories to show right now.
      </p>
    </div>
  );
}

export default Blogs;