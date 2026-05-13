"use client";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/forgot-password/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    );

    const data = await res.json();

    if (res.ok) {
      setMessage("Reset link sent to your email");
    } else {
      setMessage(data.error || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="w-96 space-y-4">
        <h2 className="text-xl font-bold">Forgot Password</h2>
        <p>
          Enter the Email associated with your account at the time of
          registration
        </p>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="w-full bg-purple-600 text-white p-2">
          Send Reset Link
        </button>

        {message && <p className="text-sm text-center">{message}</p>}
      </form>
    </div>
  );
}
