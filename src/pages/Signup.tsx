import { Quote } from "../components/Quote";
import Auth from "../components/Auth";

function Signup() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12 lg:flex-row lg:items-stretch lg:gap-8 lg:px-8">
        
         {/* Quote */}
        <section
          className="
            w-full overflow-hidden rounded-2xl
            border border-indigo-200/60
            bg-linear-to-br from-indigo-50 via-blue-50 to-violet-100
            px-6 py-10
            shadow-sm
            dark:border-indigo-500/20
            dark:from-indigo-950
            dark:via-blue-950
            dark:to-violet-950
            sm:px-10 sm:py-12
            lg:flex-1 lg:px-10 lg:py-10
          "
          >
          <div className="relative flex h-full items-center justify-center">
            {/* Decorative glow */}
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/20" />
            <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-violet-400/20 blur-3xl dark:bg-violet-500/20" />

            <div className="relative z-10 w-full max-w-md">
              <Quote />
            </div>
          </div>
        </section>

        {/* Signup */}
        <section className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900 lg:flex-1">
          <div className="mx-auto w-full max-w-md p-6 sm:p-8 lg:p-10">
            <Auth type="signup" />
          </div>
        </section>
      </div>
    </main>
  );
}

export default Signup;
