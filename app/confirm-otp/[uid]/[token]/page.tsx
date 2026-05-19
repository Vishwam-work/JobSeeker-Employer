"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ConfirmOtpPage() {
  const params = useParams();
  const uid = params.uid as string;
  const token = params.token as string;

  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

    const handleConfirmOtp = async (
    e: React.FormEvent<HTMLFormElement>
    ) => {
    e.preventDefault();

    if (otp.length !== 6) {
        setMessage("Please enter a valid 6-digit OTP");
        return;
    }

    try {
        setLoading(true);
        setMessage("");

        const employerToken = localStorage.getItem("employeer_token");

        if (!employerToken) {
        setMessage("Please login first.");
        router.push("/login");
        return;
        }

        const payload = {
        uid,
        token,
        otp,
        };

        console.log("Payload:", payload);

        const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/verify-sub-user-otp/`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${employerToken}`,
            },
            body: JSON.stringify(payload),
        }
        );

        const data = await res.json();
        console.log("Response:", data);

        if (res.ok) {
        setMessage(
            data.message || "OTP verified successfully."
        );

        setTimeout(() => {
            router.push("/login");
        }, 3000);
        } else {
        if (typeof data === "object") {
            const errors = Object.values(data)
            .flat()
            .join(", ");
            setMessage(
            errors ||
                data.detail ||
                data.error ||
                "Invalid OTP"
            );
        } else {
            setMessage("Invalid OTP");
        }
        }
    } catch (error) {
        console.error("Confirm OTP Error:", error);
        setMessage("Something went wrong. Please try again.");
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleConfirmOtp}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">
          Confirm OTP
        </h2>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          className="w-full border rounded-lg p-3"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, ""))
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Confirm OTP"}
        </button>

        {message && (
          <p className="text-sm text-center text-red-600">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}