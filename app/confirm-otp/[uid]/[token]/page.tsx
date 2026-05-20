"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ConfirmOtpPage() {
  const params = useParams();
  const uid = params.uid as string;
  const token = params.token as string;

  const router = useRouter();

  // OTP Array State
  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<
    (HTMLInputElement | null)[]
  >([]);

  // Handle OTP Change
  const handleOtpChange = (
  value: string,
  index: number
) => {
  // Remove non-numbers
  const sanitizedValue = value.replace(/\D/g, "");

  // Handle paste
  if (sanitizedValue.length > 1) {
    const otpArray = sanitizedValue
      .slice(0, 6)
      .split("");

    const updatedOtp = [...otp];

    otpArray.forEach((digit, i) => {
      updatedOtp[i] = digit;
    });

    setOtp(updatedOtp);

    // Focus last filled box
    const nextIndex = Math.min(
      otpArray.length,
      5
    );

    inputRefs.current[nextIndex]?.focus();

    return;
  }

  // Single input
  const updatedOtp = [...otp];
  updatedOtp[index] = sanitizedValue;

  setOtp(updatedOtp);

  // Move next
  if (sanitizedValue && index < 5) {
    inputRefs.current[index + 1]?.focus();
  }
};


  // Handle Backspace
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };
const handlePaste = (
  e: React.ClipboardEvent<HTMLInputElement>
) => {
  e.preventDefault();

  const pastedData = e.clipboardData
    .getData("text")
    .replace(/\D/g, "")
    .slice(0, 6);

  if (!pastedData) return;

  const updatedOtp = [...otp];

  pastedData.split("").forEach((digit, index) => {
    updatedOtp[index] = digit;
  });

  setOtp(updatedOtp);

  // Focus last box
  const lastIndex =
    pastedData.length >= 6
      ? 5
      : pastedData.length;

  inputRefs.current[lastIndex]?.focus();
};
  const handleConfirmOtp = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      setMessage(
        "Please enter a valid 6-digit OTP"
      );
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        uid,
        otp: finalOtp,
      };

      console.log("Payload:", payload);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/verify-sub-user-otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      console.log("Response:", data);

      if (res.ok) {
        setMessage(
          data.message ||
            "OTP verified successfully."
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
      console.error(
        "Confirm OTP Error:",
        error
      );

      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleConfirmOtp}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">
          Confirm OTP
        </h2>

        {/* OTP Boxes */}
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              onChange={(e) =>
                handleOtpChange(
                  e.target.value,
                  index
                )
              }
              onKeyDown={(e) =>
                handleKeyDown(e, index)
              }
              onPaste={handlePaste}
              className="w-12 h-12 border rounded-lg text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded-lg disabled:opacity-50"
        >
          {loading
            ? "Verifying..."
            : "Confirm OTP"}
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