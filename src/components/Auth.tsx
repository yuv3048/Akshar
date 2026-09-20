import { signinInput, signupInput } from "@yuvrajsharma12/medium-common";
import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { GoogleLogin } from "@react-oauth/google";

const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const isSignup = type === "signup";
  const navigate = useNavigate();

  const [postInputs, setPostInputs] = useState<signupInput | signinInput>(
    isSignup
      ? {
          email: "",
          password: "",
          name: "Anonymous",
        }
      : {
          email: "",
          password: "",
        },
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendRequest() {
    setError("");

    const validation = isSignup
      ? signupInput.safeParse(postInputs)
      : signinInput.safeParse(postInputs);

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Invalid input");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type}`,
        postInputs,
      );

      const { jwt } = response.data;

      localStorage.setItem("token", jwt);

      navigate("/blogs");
    } catch (e: any) {
      console.error("Authentication failed:", e);

      const message =
        e.response?.data?.error ||
        e.response?.data?.message ||
        "Something went wrong. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin(credential: string) {
    setError("");

    try {
      setLoading(true);

      const response = await axios.post(`${BACKEND_URL}/api/v1/user/google`, {
        credential,
      });

      const { jwt } = response.data;

      localStorage.setItem("token", jwt);

      navigate("/blogs");
    } catch (error: any) {
      console.error("Google login failed:", error);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Google login failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          {isSignup ? "Create an account" : "Welcome back"}
        </h1>

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in
              </Link>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign up
              </Link>
            </>
          )}
        </p>
      </div>

      <div className="space-y-4">
        {/* Name */}
        {isSignup && (
          <LabelledInput
            label="Name"
            placeholder="Anonymous"
            value={"name" in postInputs ? postInputs.name : ""}
            onChange={(e) =>
              setPostInputs((current) => ({
                ...current,
                name: e.target.value,
              }))
            }
          />
        )}

        {/* Email */}
        <LabelledInput
          label="Email"
          type="email"
          placeholder="yuvi7341@gmail.com"
          value={postInputs.email}
          onChange={(e) =>
            setPostInputs((current) => ({
              ...current,
              email: e.target.value,
            }))
          }
        />

        {/* Password */}
        <LabelledInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={postInputs.password}
          onChange={(e) =>
            setPostInputs((current) => ({
              ...current,
              password: e.target.value,
            }))
          }
        />

        {/* Password requirements */}
        {isSignup && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/70">
            <p className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
              Password must contain:
            </p>

            <div className="space-y-1.5">
              <PasswordRequirement
                valid={postInputs.password.length >= 8}
                text="At least 8 characters"
              />

              <PasswordRequirement
                valid={/[A-Z]/.test(postInputs.password)}
                text="One uppercase letter"
              />

              <PasswordRequirement
                valid={/[a-z]/.test(postInputs.password)}
                text="One lowercase letter"
              />

              <PasswordRequirement
                valid={/[0-9]/.test(postInputs.password)}
                text="One number"
              />

              <PasswordRequirement
                valid={/[^A-Za-z0-9]/.test(postInputs.password)}
                text="One special character"
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
          >
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={sendRequest}
          disabled={loading}
          className="
            mt-2
            w-full
            rounded-xl
            bg-gray-900
            py-3
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-gray-800
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-60
            dark:bg-white
            dark:text-gray-900
            dark:hover:bg-gray-200
          "
        >
          {loading ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
          <span className="text-xs font-medium text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
        </div>

        <div className="flex w-full justify-center items-center">
          <div className="w-full max-w-100 overflow-hidden rounded-xl">
            <GoogleLogin
              onSuccess={(response) => {
                if (response.credential) {
                  handleGoogleLogin(response.credential);
                }
              }}
              onError={() => {
                setError("Google login failed. Please try again.");
              }}
              useOneTap={false}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: LabelledInputType) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
        {label}
      </label>

      <input
        value={value}
        onChange={onChange}
        type={type}
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          bg-white
          px-4
          py-3
          text-gray-900
          placeholder:text-gray-400
          shadow-sm
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/20
          dark:border-gray-700
          dark:bg-gray-800
          dark:text-white
          dark:placeholder:text-gray-500
          dark:focus:border-blue-500
        "
        placeholder={placeholder}
      />
    </div>
  );
}

function PasswordRequirement({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-sm ${
        valid
          ? "text-green-600 dark:text-green-400"
          : "text-gray-500 dark:text-gray-400"
      }`}
    >
      <span className="flex w-4 shrink-0 justify-center font-semibold">
        {valid ? "✓" : "○"}
      </span>

      <span>{text}</span>
    </div>
  );
}

export default Auth;
