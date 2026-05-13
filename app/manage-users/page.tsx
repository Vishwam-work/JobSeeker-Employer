"use client";
import { useState } from "react";
import { Search, MoreVertical, Check, X } from "lucide-react";
import EmployerHeader from "@/components/Employerheader";
import EmployerFooter from "@/components/Employerfooter";
export default function ManageUsersPage() {
  const [showModal, setShowModal] = useState(false);
  const users = [
    {
      name: "Atversion",
      email: "info@atversion.com",
      role: "Super-user",
      resdex: false,
      jobPosting: true,
      jobPromotion: false,
    },
  ];

  return (
    <>
    <EmployerHeader />
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-800">
            Manage users & permissions
          </h1>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium"
            >
              Add user
            </button>
            <MoreVertical className="text-gray-500 cursor-pointer" />
          </div>
        </div>
        {/* Modal for add users */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
            <div className="relative flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200">
              {/* Header */}
              <div className="flex items-start justify-between px-8 py-6 border-b border-slate-100 flex-shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Add User</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Invite a team member and assign permissions.
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Enter the team member's full name.
                  </p>
                </div>
                {/* Work Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Work Email ID
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    The invitation will be sent to this email address.
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter a secure password"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Use at least 8 characters.
                  </p>
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
                      defaultChecked
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

              {/* Footer - Always Visible */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-8 py-5 border-t border-slate-100 bg-slate-50 flex-shrink-0">

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>

                  <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition">
                    Save User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="border-b border-gray-200 px-6 py-4 flex flex-wrap items-center gap-6 text-sm text-gray-600">
          <span className="font-semibold text-blue-600 border-b-2 border-blue-600 pb-2">
            Approved (1)
          </span>

          <div className="ml-auto flex flex-wrap items-center gap-6">
            <button>Allowed Domains</button>
            <button>Account Security</button>
            <button>Time Restrictions are ON</button>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-5 border-b border-gray-200 text-sm text-gray-700 leading-7">
          <p>
            As a security measure, add allowed domains for your company users.
          </p>
          <p>
            Only accounts with matching domains will be able to join your team.
          </p>
        </div>

        <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200">
          <button className="border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 w-fit">
            Change Restrictions
          </button>

          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full lg:w-[320px]">
            <input
              type="text"
              placeholder="Search approved users"
              className="flex-1 px-4 py-2 outline-none"
            />
            <button className="bg-blue-600 text-white px-4 py-3">
              <Search size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-600 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 font-medium">All users</th>
                <th className="text-center py-4 font-medium">Resdex</th>
                <th className="text-center py-4 font-medium">Job Posting</th>
                <th className="text-center py-4 font-medium">Job Promotion</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700 font-semibold">
                        {user.name.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-800">
                            {user.name}
                          </h3>
                          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="text-center">
                    {user.resdex ? (
                      <Check className="text-green-600 mx-auto" size={18} />
                    ) : (
                      <X className="text-red-500 mx-auto" size={18} />
                    )}
                  </td>

                  <td className="text-center">
                    {user.jobPosting ? (
                      <Check className="text-green-600 mx-auto" size={18} />
                    ) : (
                      <X className="text-red-500 mx-auto" size={18} />
                    )}
                  </td>

                  <td className="text-center">
                    {user.jobPromotion ? (
                      <Check className="text-green-600 mx-auto" size={18} />
                    ) : (
                      <X className="text-red-500 mx-auto" size={18} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <EmployerFooter />
    </>
  );
}