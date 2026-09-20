function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Akshar. All rights reserved.
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Built with React, TypeScript &amp; Hono
        </p>
      </div>
    </footer>
  );
}

export default Footer;