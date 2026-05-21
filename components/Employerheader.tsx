"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Settings,
  HelpCircle,
  LogOut,
  User,
  Activity,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Users,
  GaugeCircle,
  BadgeCheck,
} from "lucide-react";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";

export default function EmployerHeader() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    company_name: "",
    company_type: "",
    industry: "",
    company_size: "",
    website: "",
    description: "",
    contact_person_name: "",
    designation: "",
    phone_code: "",
    phone: "",
    address: "",
    country: "",
    countryLabel: "",
    state: "",
    city: "",
    pincode: "",
    company_logo: "",
  });

  type FormData = {
    company_name: string;
    company_type: string;
    industry: string;
    company_size: string;
    website: string;
    description: string;
    contact_person_name: string;
    designation: string;
    phone: string;
    address: string;
    country: string;
    countryLabel: string;
    state: string;
    city: string;
    phone_code: string;
    pincode: string;
    company_logo: string;
  };
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("employeer_token");
    // console.log("LOG TOKEN:", token);
    setIsAuthenticated(!!token);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("employeer_token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  // Check if user is admin
  useEffect(() => {
    const role = localStorage.getItem("admin_role");
    if (role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const token = localStorage.getItem("employeer_token");
        if (!token) return;

        const decoded: any = jwtDecode(token);
        const userId = decoded?.user_id;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/company/${userId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const data = await response.json();
        //  console.log("Company Details:", data);
        setFormData({
         company_name: data.company?.company_name || "",
          company_type: data.company?.company_type || "",
          industry: data.company?.industry || "",
          company_size: data.company?.company_size || "",
          website: data.company?.website || "",
          description: data.company?.description || "",
          address: data.company?.address || "",
          pincode: data.company?.pincode || "",
          contact_person_name: data.contact_person_name || "",
          designation: data.designation || "",
          phone: data.phone || "",
          phone_code: data.phone_code || "",
          country: data.company?.country?.toString() || "",
          state: data.company?.state?.toString() || "",
          city: data.company?.city?.toString() || "",
          countryLabel: "",
          company_logo: data.company?.company_logo
            ? process.env.NEXT_PUBLIC_URL + data.company.company_logo
            : "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, []);

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              jobseeker
            </span>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
              For Employer
            </span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notification */}
            {/* <div className="relative">
              <div
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="cursor-pointer relative select-none"
              >
                <Bell className="w-5 h-5 text-gray-700 hover:text-purple-600" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
              </div>

              {isNotificationOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsNotificationOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white border shadow-lg rounded-lg z-50">
                    <div className="p-3 border-b font-semibold text-gray-700">
                      Notifications
                    </div>
                    <div className="p-3 text-sm text-gray-600">
                      No new notifications
                    </div>
                  </div>
                </>
              )}
            </div> */}
            {/* <div className="relative">
              <Image
                src={companyLogo}
                alt="Company Logo"
                width={40}
                height={40}
                onClick={() => setOpenAccountMenu((prev) => !prev)}
                className="rounded-full border-2 border-purple-600 cursor-pointer"
              />
            </div> */}

            {isAuthenticated && (
              <div className="flex items-center gap-3 text-sm">
                <h1 className="text-lg font-semibold">
                  {formData.company_name}
                </h1>

                <div className="relative">
                  <div
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="cursor-pointer"
                  >
                    {formData.company_logo ? (
                      <Image
                        src={formData.company_logo}
                        alt="Company Logo"
                        width={32}
                        height={25}
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-700 hover:text-purple-600" />
                    )}
                  </div>
                  {isUserMenuOpen && (
                    <>
                      {/* Overlay */}
                      <div
                        className="fixed inset-0 bg-black/40 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                      />

                      {/* Side Panel */}
                      <div className="fixed right-0 top-0 h-screen w-[30%] min-w-[320px] bg-white shadow-2xl z-50 flex flex-col">
                        {/* Header */}
                        <div className="p-6 border-b flex justify-between items-center">
                          <div>
                            <h2 className="text-lg font-semibold">
                              {formData.company_name || "User"}
                            </h2>
                            {!isAdmin && (
                            <Link
                              href="/account"
                              className="text-blue-600 text-sm font-medium"
                            >
                              View & Update Account
                            </Link>
                            )}
                          </div>

                          <button
                            onClick={() => setIsUserMenuOpen(false)}
                            className="text-gray-400 hover:text-gray-600 text-xl"
                          >
                            ✕
                          </button>
                        </div>
                        {/* Menu */}
                        <div className="flex-1">
                          <Link href="/dashboard">
                            <div className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3">
                              <Activity size={18} />
                              Dashboard
                            </div>
                          </Link>
                          {!isAdmin && (
                            <>
                          <Link href="/pricing">
                            <div className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3">
                              <CreditCard size={18} />
                              Pricing
                            </div>
                          </Link>

                          <Link href="/saved_profiles">
                            <div className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3">
                              <CreditCard size={18} />
                              Saved Profiles
                            </div>
                          </Link>

                          <div
                            onClick={() => setOpen(!open)}
                            className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <Settings size={18} />
                              <span>Settings</span>
                            </div>

                            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>

                          {/* Dropdown */}
                          {open && (
                            <div className="ml-8 mt-1 bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                              <Link href="/manage-users">
                                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3">
                                  <Users size={18} className="text-gray-600" />
                                  <span>Manage Users</span>
                                </div>
                              </Link>

                              <Link href="/manage-quota">
                                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3">
                                  <GaugeCircle size={18} className="text-gray-600" />
                                  <span>Manage Quota</span>
                                </div>
                              </Link>

                              <Link href="/subscription-status">
                                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3">
                                  <BadgeCheck size={18} className="text-gray-600" />
                                  <span>Subscription Status</span>
                                </div>
                              </Link>
                            </div>
                          )}

                          <Link href="/faq-support">
                            <div className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3">
                              <HelpCircle size={18} />
                              FAQs
                            </div>
                          </Link>
                            </>
                          )}

                          <div
                            onClick={handleLogout}
                            className="px-6 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                          >
                            <LogOut size={18} />
                            Logout
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            {!isAuthenticated && (
              <div className="flex items-center gap-3 text-sm">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
