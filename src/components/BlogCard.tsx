import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { Link } from "react-router-dom";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishDate: string;
  id: string;
}

export const BlogCard = ({
  id,
  authorName,
  title,
  content,
  publishDate,
}: BlogCardProps) => {
  const readingTime = Math.max(1, Math.ceil(content.length / 100));

  return (
    <Link
      to={`/blog/${id}`}
      className="block w-full"
      aria-label={`Read ${title}`}
    >
      <article
        className="
          w-full
          rounded-2xl
          border
          border-gray-200
          bg-white
          p-5
          shadow-sm
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:shadow-lg
          dark:border-gray-800
          dark:bg-gray-900
          sm:p-6
        "
      >
        {/* Author + Date */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Author */}
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={authorName} />

            <div className="min-w-0">
              <p className="truncate font-semibold text-gray-900 dark:text-white">
                {authorName}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Author
              </p>
            </div>
          </div>

          {/* Date */}
          <span className="text-xs text-gray-400 dark:text-gray-500 sm:text-sm">
            {publishDate}
          </span>
        </div>

        {/* Title */}
        <h2
          className="
            mb-3
            line-clamp-2
            text-xl
            font-bold
            leading-tight
            tracking-tight
            text-gray-900
            dark:text-white
            sm:text-2xl
          "
        >
          {title}
        </h2>

        {/* Content Preview */}
        <p
          className="
            mb-6
            line-clamp-3
            text-sm
            leading-7
            text-gray-600
            dark:text-gray-400
            sm:text-base
          "
        >
          {content}
        </p>

        {/* Bottom */}
        <div
          className="
            flex
            flex-col
            gap-3
            border-t
            border-gray-100
            pt-4
            dark:border-gray-800
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* Read More */}
          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-1.5
              text-sm
              font-semibold
              text-blue-600
              transition-colors
              dark:text-blue-400
            "
          >
            Read more
            <ReadMoreIcon sx={{ fontSize: 18 }} />
          </div>

          {/* Reading Time */}
          <span className="text-xs text-gray-400 dark:text-gray-500 sm:text-sm">
            {readingTime} min read
          </span>
        </div>
      </article>
    </Link>
  );
};

export default function Avatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "A";

  return (
    <div
      className="
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-linear-to-br
        from-blue-600
        to-indigo-700
        shadow-sm
      "
    >
      <span className="text-sm font-bold text-white">
        {initial}
      </span>
    </div>
  );
}