"use client";
import { useState,useEffect } from "react";
import { Search, MoreVertical, Check, X , Trash2,Eye,EyeOff} from "lucide-react";
import EmployerHeader from "@/components/Employerheader";
import EmployerFooter from "@/components/Employerfooter";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
export default function ManageUsersPage() {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [userForm, setUserForm] = useState({
  full_name: "",
  email: "",
  password: "",
  job_posting: true,
  contact_person_name: "",
  designation: "",
  phone: "",
  phone_code: "",
});

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      // Auto-fill required backend fields
      setUserForm((prev) => ({
        ...prev,
        phone_code: data.phone_code || "",
      }));
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };

  fetchCompanyDetails();
}, []);



const validateForm = () => {
  const newErrors: any = {};

  // Full Name
  if (!userForm.full_name.trim()) {
    newErrors.full_name = "Full name is required";
  }

  // Email
  if (!userForm.email.trim()) {
    newErrors.email = "Email is required";
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(userForm.email)
  ) {
    newErrors.email = "Enter a valid email address";
  }

  // Phone
  if (!userForm.phone.trim()) {
    newErrors.phone = "Phone number is required";
  } else if (!/^\d{10}$/.test(userForm.phone)) {
    newErrors.phone = "Phone number must be 10 digits";
  }

  // Designation
  if (!userForm.designation.trim()) {
    newErrors.designation = "Designation is required";
  }

  // Password
  if (!userForm.password.trim()) {
    newErrors.password = "Password is required";
  } else if (userForm.password.length < 8) {
    newErrors.password = "Password must be at least 8 characters";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

// Update handleAddUser
const handleAddUser = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    const token = localStorage.getItem("employeer_token");

    const payload = {
      email: userForm.email,
      password: userForm.password,
      job_posting: userForm.job_posting,
      contact_person_name: userForm.full_name,
      designation: userForm.designation,
      phone: userForm.phone,
      phone_code: userForm.phone_code,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/add-sub-user/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (response.ok) {
      toast.success("User added successfully");
      setShowModal(false);

      setUserForm((prev) => ({
        ...prev,
        full_name: "",
        email: "",
        phone: "",
        designation: "",
        password: "",
        job_posting: true,
      }));

      setErrors({});
      await fetchSubUsers();
    } else {
      toast.error(
        data?.error ||
          data?.message ||
          Object.values(data).flat().join(", ")
      );
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};

//Fetch sub users view API
 const fetchSubUsers = async () => {
    try {
      const token = localStorage.getItem("employeer_token");
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/sub-users/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Sub Users:", data);

      if (response.ok) {
        // If API returns array directly
        setUsers(Array.isArray(data) ? data : data.results || []);
      } else {
        toast.error(data?.error || "Failed to load users");
      }
    } catch (error) {
      console.error("Error fetching sub users:", error);
      toast.error("Something went wrong");
    } finally {
      setLoadingUsers(false);
    }
  };
useEffect(() => {
  fetchSubUsers();
}, []);

// Delete Sub User API
const handleDeleteUser = async (userId: number) => {
  try {
    const token = localStorage.getItem("employeer_token");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/sub-users/${userId}/delete/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      toast.success("User deleted successfully");

      // Remove user from UI immediately
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );

      // Optional: reload list from API
      // await fetchSubUsers();
    } else {
      toast.error(
        data?.error ||
          data?.message ||
          "Failed to delete user"
      );
    }
  } catch (error) {
    console.error("Delete user error:", error);
    toast.error("Something went wrong");
  }
};

  return (
    <>
    <EmployerHeader />
    {/* Main Container */}
<div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
  <div className="max-w-7xl mx-auto">
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      
      {/* Header */}
      <div className="bg-white px-8 py-8 border-b border-gray-200">
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
    {/* Left Content */}
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Manage Users & Permissions
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Add, remove and manage access for your team members.
      </p>
    </div>

    {/* Add User Button */}
    <button
      onClick={() => {
        setErrors({});
        setShowPassword(false);

        setUserForm((prev) => ({
          ...prev,
          full_name: "",
          email: "",
          phone: "",
          designation: "",
          password: "",
          job_posting: true,
        }));

        setShowModal(true);
      }}
      className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-6 py-3 rounded-xl font-semibold shadow-sm transition-all duration-200 hover:scale-[1.02]"
    >
      + Add User
    </button>

{/* Add User Modal */}
{showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between px-8 py-6 border-b border-slate-200 bg-white">
  <div>
    <h2 className="text-2xl font-bold text-slate-900">Add User</h2>
    <p className="mt-1 text-sm text-slate-500">
      Invite a team member and assign permissions.
    </p>
  </div>

  <button
    onClick={() => {
      setShowModal(false);
      setErrors({});
      setUserForm((prev) => ({
        ...prev,
        full_name: "",
        email: "",
        phone: "",
        designation: "",
        password: "",
        job_posting: true,
      }));
    }}
    className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
  >
    ✕
  </button>
</div>
<div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
  {/* Full Name */}
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      Full Name
    </label>
    <input
      type="text"
      placeholder="Enter full name"
      value={userForm.full_name}
      onChange={(e) => {
        setUserForm({ ...userForm, full_name: e.target.value });
        setErrors({ ...errors, full_name: "" });
      }}
      className={`w-full rounded-xl border px-4 py-3 text-sm shadow-sm outline-none transition ${
        errors.full_name
          ? "border-red-500 focus:ring-red-100"
          : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
      }`}
    />
    {errors.full_name && (
      <p className="mt-1 text-sm text-red-500">{errors.full_name}</p>
    )}
  </div>

  {/* Work Email */}
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      Work Email ID
    </label>
    <input
      type="email"
      placeholder="name@company.com"
      value={userForm.email}
      onChange={(e) => {
        setUserForm({ ...userForm, email: e.target.value });
        setErrors({ ...errors, email: "" });
      }}
      className={`w-full rounded-xl border px-4 py-3 text-sm shadow-sm outline-none transition ${
        errors.email
          ? "border-red-500 focus:ring-red-100"
          : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
      }`}
    />
    {errors.email && (
      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
    )}
  </div>

  {/* Phone Number */}
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      Phone Number
    </label>
    <input
      type="text"
      placeholder="Enter phone number"
      value={userForm.phone}
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 10);

        setUserForm({
          ...userForm,
          phone: value,
        });

        setErrors({
          ...errors,
          phone: "",
        });
      }}
      maxLength={10}
      inputMode="numeric"
      pattern="[0-9]*"
      className={`w-full rounded-xl border px-4 py-3 text-sm shadow-sm outline-none transition ${
        errors.phone
          ? "border-red-500 focus:ring-red-100"
          : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
      }`}
    />
    {errors.phone && (
      <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
    )}
  </div>

  {/* Designation */}
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      Designation
    </label>
    <input
      type="text"
      placeholder="Enter designation"
      value={userForm.designation}
      onChange={(e) => {
        setUserForm({ ...userForm, designation: e.target.value });
        setErrors({ ...errors, designation: "" });
      }}
      className={`w-full rounded-xl border px-4 py-3 text-sm shadow-sm outline-none transition ${
        errors.designation
          ? "border-red-500 focus:ring-red-100"
          : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
      }`}
    />
    {errors.designation && (
      <p className="mt-1 text-sm text-red-500">{errors.designation}</p>
    )}
  </div>

  {/* Password */}
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-2">
      Password
    </label>

    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Enter a secure password"
        value={userForm.password}
        onChange={(e) => {
          setUserForm({ ...userForm, password: e.target.value });
          setErrors({ ...errors, password: "" });
        }}
        className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm shadow-sm outline-none transition ${
          errors.password
            ? "border-red-500 focus:ring-red-100"
            : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
        }`}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>

    {errors.password && (
      <p className="mt-1 text-sm text-red-500">{errors.password}</p>
    )}
  </div>

  {/* Permissions */}
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <h3 className="text-sm font-semibold text-slate-900 mb-1">
      Permissions
    </h3>
    <p className="text-xs text-slate-500 mb-4">
      Choose what this user can access.
    </p>

    <label className="flex items-start gap-3 rounded-xl bg-white border border-slate-200 p-4 hover:border-blue-300 transition cursor-pointer">
      <input
        type="checkbox"
        checked={userForm.job_posting}
        onChange={(e) =>
          setUserForm({
            ...userForm,
            job_posting: e.target.checked,
          })
        }
        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />

      <div>
        <p className="text-sm font-medium text-slate-800">
          Job Posting
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Allow the user to create, edit, and manage job postings.
        </p>
      </div>
    </label>

    <p className="mt-4 text-xs leading-5 text-slate-500">
      Response Manager access is automatically available to recruiters
      who post a job, send an invite, or are added as collaborators.
    </p>
  </div>
</div>

      {/* Footer */}
      <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-end gap-3">
        <button
          onClick={() => {
            setShowModal(false);
            setErrors({});
            setShowPassword(false);
          }}
          className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleAddUser}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition"
        >
          Save User
        </button>
      </div>
    </div>
  </div>
)}
        </div>
      </div>

      {/* Top Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-slate-50 border-b border-slate-200">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">Total Users</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {users.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">Verified Users</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {users.filter((u) => u.is_verified).length}
          </p>
        </div>

        {/* <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">Pending Verification</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">
            {users.filter((u) => !u.is_verified).length}
          </p>
        </div> */}
      </div>

      {/* Search Bar */}
      {/* <div className="p-6 border-b border-slate-200 bg-white">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
          />
        </div>
      </div> */}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4 text-center">Company</th>
              <th className="px-6 py-4 text-center">Phone</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Role</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loadingUsers ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-500">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user: any, index: number) => (
                <tr
                  key={user.id || index}
                  className="hover:bg-slate-50 transition"
                >
                  {/* User Info */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
                        {(user.contact_person_name || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900">
                            {user.contact_person_name}
                          </h3>
                        </div>

                        <p className="text-sm text-slate-500">
                          {user.email}
                        </p>

                        <p className="text-xs text-slate-400">
                          {user.designation}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="px-6 py-5 text-center text-sm text-slate-700 font-medium">
                    {user.company_name || "-"}
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-5 text-center text-sm text-slate-700">
                    {user.phone_code ? `+${user.phone_code} ` : ""}
                    {user.phone || "-"}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        user.is_verified
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {user.is_verified ? "Verified" : "Pending"}
                    </span>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-5 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        user.role === "employer"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-5 text-center">
                    {user.role !== "employer" && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="inline-flex items-center justify-center h-10 w-10 rounded-xl text-red-600 hover:bg-red-50 transition"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
    <EmployerFooter />
    </>
  );
}