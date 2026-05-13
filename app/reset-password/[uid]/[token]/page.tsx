"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
export default function ResetPassword() {
  const { uid, token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 8) {
      return setMessage("Password must be at least 8 characters");
    }

    if (password !== confirmPassword) {
      return setMessage("Passwords do not match");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/reset-password/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          token,
          password,
        }),
      },
    );

    const data = await res.json();

    if (res.ok) {
      setMessage("Password reset successfully ");
      setTimeout(() => {
        setMessage("Redirecting to login...");
        router.push("/login");
      }, 5000);
    } else {
      setMessage(data.error || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleReset} className="w-96 space-y-4">
        <h2 className="text-xl font-bold">Reset Password</h2>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            className="w-full border p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-2"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full border p-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-2"
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button className="w-full bg-green-600 text-white p-2">
          Reset Password
        </button>

        {message && <p className="text-sm text-center">{message}</p>}
      </form>
    </div>
  );
}
