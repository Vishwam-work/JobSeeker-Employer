"use client";

import { useEffect, useState } from "react";
import { Mail, FileText, MapPin } from "lucide-react";

interface Candidate {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  current_role?: string;
  current_company?: string;
  experience?: string;
  current_salary?: string;
  expected_salary?: string;
  notice_period?: string;
  profile_image?: string;
  resume?: string;
  city?: { name: string };
  state?: { name: string };
  country?: { name: string };
  skills?: { name: string }[];
}

export default function SavedProfilesPage() {
  const [profiles, setProfiles] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("employeer_token");

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchSavedProfiles = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/saved-profiles-all/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();

        console.log("Saved Profiles:", data);

        setProfiles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Saved profiles fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProfiles();
  }, []);

  const formatSalary = (value?: string | number) => {
    if (!value) return "-";

    return `₹ ${new Intl.NumberFormat("en-IN").format(Number(value))}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading saved profiles...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Saved Profiles
          </h1>
          <p className="text-gray-500 mt-1">
            Total Saved Candidates: {profiles.length}
          </p>
        </div>

        {profiles.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-10 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              No Saved Profiles Found
            </h2>
            <p className="text-gray-500 mt-2">
              Saved candidates will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {profiles.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl shadow-sm border p-4 md:p-5 flex flex-col md:flex-row gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        c.profile_image
                          ? `${process.env.NEXT_PUBLIC_URL}${c.profile_image}`
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              c.full_name
                            )}`
                      }
                      alt={c.full_name}
                      className="w-16 h-16 rounded-full object-cover border"
                    />

                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {c.full_name}
                      </h2>

                      {(c.current_role || c.current_company) && (
                        <p className="text-sm text-gray-600 mt-1">
                          {c.current_role}
                          {c.current_role && c.current_company && " at "}
                          {c.current_company}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600">
                        {c.experience && (
                          <span>{c.experience} Years</span>
                        )}

                        {c.current_salary && (
                          <span>
                            {formatSalary(c.current_salary)}
                          </span>
                        )}

                        {(c.city?.name || c.state?.name) && (
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {c.city?.name}, {c.state?.name}
                          </span>
                        )}
                      </div>

                      {c.skills && c.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {c.skills.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="md:w-60 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 flex flex-col justify-center gap-3">
                  <div className="text-sm text-gray-600 flex items-center gap-2 break-all">
                    <Mail size={16} />
                    {c.email}
                  </div>

                  {c.notice_period && (
                    <div className="text-sm text-gray-600">
                      Notice: {c.notice_period}
                    </div>
                  )}

                  {c.resume && (
                    <a
                      href={`${process.env.NEXT_PUBLIC_URL}${c.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                    >
                      <FileText size={16} />
                      View Resume
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}