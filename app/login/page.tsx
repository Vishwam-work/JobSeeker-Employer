"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Snackbar, Alert } from "@mui/material";
import {
  Eye,
  EyeOff,
  Search,
  Building2,
  Users,
  Briefcase,
  CheckCircle,
  Star,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import CookieConsent from "@/components/Cookie";
// import { useSession, signIn, signOut } from "next-auth/react";
// import { Chrome } from "lucide-react";

export default function EmployerLogin() {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/employeer_login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: loginForm.email,
            password: loginForm.password,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("employeer_token", data.access || data.token);
        localStorage.setItem("admin_role", data.user_role || "employer");
        setAlertType("success");
        setAlertMessage("Login Successful!");
        setAlertOpen(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setAlertType("error");
        setAlertMessage(
          data.error === "User not found"
          ? " kindly register first to access"
          : data.error || "Login Failed"
           );
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertType("error");
      setAlertMessage("Network Error!");
      setAlertOpen(true);
    }
  };

  const benefits = [
    {
      icon: Users,
      title: "Access to 10 Crore+ candidates",
      description: "Reach the largest talent pool in India",
    },
    {
      icon: TrendingUp,
      title: "Faster hiring with AI",
      description: "Get relevant candidate matches instantly",
    },
    {
      icon: Briefcase,
      title: "End-to-end recruitment",
      description: "From job posting to candidate onboarding",
    },
    {
      icon: Star,
      title: "Trusted by 1 Lakh+ companies",
      description: "Join India's leading recruitment platform",
    },
  ];
  // GoogleLogin
  // const handleGoogleLogin = () => {
  //   signIn("google", { callbackUrl: "/dashboard" });
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                jobseeker
              </span>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                For Employers
              </span>
            </Link>
            <div className="text-sm text-gray-600 text-center sm:text-right">
              New to JobSeeker?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:underline font-medium"
              >
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alertType} onClose={() => setAlertOpen(false)}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Side - Benefits */}
          <div className="order-2 lg:order-1">
            <div className="text-center lg:text-left mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Find the right talent for your company
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Join 1 Lakh+ companies hiring on JobSeeker
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-white rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">10Cr+</div>
                <div className="text-sm text-gray-600">Candidates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">1L+</div>
                <div className="text-sm text-gray-600">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">50L+</div>
                <div className="text-sm text-gray-600">Jobs Posted</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="order-1 lg:order-2">
            <Card className="bg-white shadow-2xl border-0">
              <CardContent className="p-8 md:p-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Employer Login
                  </h2>
                  <p className="text-gray-600">
                    Access your recruitment dashboard
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email ID *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Enter your email address"
                      className="mt-1 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password *
                    </Label>
                    <div className="mt-1 relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        placeholder="Enter your password"
                        className="pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <div className="text-right mt-2">
                      <Link
                        href="#"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Login to Dashboard
                  </Button>

                  {/* <Button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full h-12 bg-white border border-gray-300 rounded-lg flex items-center justify-center shadow-sm hover:bg-gray-50 transition-all duration-200"
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google Logo"
                      className="w-5 h-5 mr-3"
                    />
                    <span className="text-gray-700 font-medium">
                      Sign in with Google
                    </span>
                  </Button> */}

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        New to JobSeeker?
                      </span>
                    </div>
                  </div>

                  <Link href="/register">
                    <Button
                      variant="outline"
                      className="w-full h-12 border-blue-200 text-blue-600 hover:bg-blue-50"
                      type="button"
                    >
                      Register Your Company
                    </Button>
                  </Link>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Trusted by 1 Lakh+ companies</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <CookieConsent />
    </div>
  );
}
