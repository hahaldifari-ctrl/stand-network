"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "../../lib/api";

const API_BASE_URL = "http://localhost:3001";

async function registerUser(
  name: string,
  email: string,
  password: string,
) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }

    if (response.status === 400) {
      throw new Error("INVALID_REGISTRATION");
    }

    throw new Error(`Registration failed: ${response.status}`);
  }

  return response.json();
}

function RegisterForm() {
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      await registerUser(name.trim(), email.trim(), password);

      const result = await login(email.trim(), password);

      localStorage.setItem("stand_access_token", result.accessToken);
      localStorage.setItem("stand_user", JSON.stringify(result.user));

      const returnUrl = searchParams.get("returnUrl");

      if (
        returnUrl &&
        returnUrl.startsWith("/") &&
        !returnUrl.startsWith("//")
      ) {
        window.location.href = returnUrl;
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "EMAIL_ALREADY_EXISTS"
      ) {
        setError(
          "An account with this email already exists. Please sign in instead.",
        );
      } else if (
        error instanceof Error &&
        error.message === "INVALID_REGISTRATION"
      ) {
        setError(
          "Please check your information and make sure all fields are valid.",
        );
      } else {
        setError(
          "We could not create your account. Please check your connection and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 rounded-3xl border border-stone-200 bg-white p-7 shadow-sm sm:p-9"
    >
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800"
        >
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="text-sm font-semibold text-stone-800"
        >
          Full name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3.5 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
          placeholder="Your full name"
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="email"
          className="text-sm font-semibold text-stone-800"
        >
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3.5 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
          placeholder="you@example.com"
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="password"
          className="text-sm font-semibold text-stone-800"
        >
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3.5 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
          placeholder="At least 8 characters"
        />

        <p className="mt-2 text-xs text-stone-500">
          Use at least 8 characters.
        </p>
      </div>

      <div className="mt-5">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-semibold text-stone-800"
        >
          Confirm password
        </label>

        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-stone-300 px-4 py-3.5 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
          placeholder="Enter your password again"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-7 w-full rounded-full bg-stone-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="mt-6 text-center text-sm text-stone-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-amber-700 hover:text-amber-800"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

function RegisterPageContent() {
  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-stone-900"
          >
            STAND<span className="text-amber-700">.</span>
          </Link>

          <Link
            href="/"
            className="text-sm font-semibold text-stone-600 transition hover:text-stone-900"
          >
            ← Back to STAND Network
          </Link>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-81px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Join STAND Network
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950">
              Stand with them
            </h1>

            <p className="mt-4 leading-7 text-stone-600">
              Create an account to pray, respond to needs, and help support
              communities facing persecution and faith-based violence.
            </p>
          </div>

          <Suspense
            fallback={
              <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-7 text-center shadow-sm sm:p-9">
                <p className="text-sm text-stone-600">
                  Loading registration...
                </p>
              </div>
            }
          >
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return <RegisterPageContent />;
}