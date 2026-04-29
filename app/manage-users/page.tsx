"use client";

import { Search, MoreVertical, Check, X } from "lucide-react";
import EmployerHeader from "@/components/Employerheader";
import EmployerFooter from "@/components/Employerfooter";
export default function ManageUsersPage() {
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
    <div className="min-h-screen bg-[#f3f3f3] p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-800">
            Manage users & permissions
          </h1>

          <div className="flex items-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium">
              Add user
            </button>
            <MoreVertical className="text-gray-500 cursor-pointer" />
          </div>
        </div>

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