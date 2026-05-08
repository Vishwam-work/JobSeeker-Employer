"use client";

import { useEffect, useState } from "react";

import {
  Mail,
  FileText,
  MapPin,
  Bookmark,
  Briefcase,
} from "lucide-react";

import EmployerHeader from "@/components/Employerheader";
import EmployerFooter from "@/components/Employerfooter";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Candidate {
  id: number;
  saved_id?: number;
  full_name: string;
  email: string;
  phone?: string;
  experience?: string;
  current_salary?: string;
  expected_salary?: string;
  notice_period?: string;
  profile_image?: string;
  resume?: string;
  city?: string;
  state?: string;
  country?: string;
  professional_summary?: string;
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

        console.log("Saved Profiles API:", data);

        const extractedProfiles = Array.isArray(data)
          ? data.map((item: any) => ({
              ...item.profile,
              saved_id: item.id,
            }))
          : [];

        setProfiles(extractedProfiles);
      } catch (error) {
        console.error("Saved profiles fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProfiles();
  }, []);

  const removeSavedProfile = async (savedId: number) => {
    const token = localStorage.getItem("employeer_token");

    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/saved-profiles/${savedId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok && res.status !== 204) {
        throw new Error("Failed to remove profile");
      }

      setProfiles((prev) =>
        prev.filter((item) => item.saved_id !== savedId)
      );

      console.log("Profile removed");
    } catch (err) {
      console.error(err);
    }
  };

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
    <div className="bg-gray-100 min-h-screen">
      <EmployerHeader />

      <div className="max-w-4xl py-10 px-4 mx-auto">
        {/* TOP */}
        <div className="rounded-xl mb-6">
          <p className="text-3xl font-bold text-black">
            Profiles saved by you
          </p>
        </div>

        {/* COUNT CARD */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-3xl font-bold">
            {profiles.length.toString().padStart(2, "0")}
          </h2>

          <p className="text-gray-500">
            Saved Profile(s)
          </p>
        </div>

        {/* MAIN CARD */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Profiles</CardTitle>
          </CardHeader>

          <CardContent>
            {profiles.length > 0 ? (
              profiles.map((c) => (
                <div
                  key={c.id}
                  className="border rounded-xl p-5 mb-5 bg-white hover:shadow-md transition"
                >
                  {/* TOP SECTION */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4 flex-1">
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

                        {c.professional_summary && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {c.professional_summary}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* SAVE BUTTON */}
                    <button
                      onClick={() => removeSavedProfile(c.saved_id!)}
                      className="text-gray-500 hover:scale-110 transition"
                    >
                      <Bookmark className="w-5 h-5 fill-blue-500 text-blue-500 " />
                    </button>
                  </div>

                  {/* INFO ROW */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
                    {c.experience && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {c.experience}
                      </span>
                    )}

                    {c.current_salary && (
                      <span>
                        {formatSalary(c.current_salary)}
                      </span>
                    )}

                    {(c.city || c.state) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {c.city} {c.state}
                      </span>
                    )}

                    {c.notice_period && (
                      <span>
                        {c.notice_period}
                      </span>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div className="mt-4 text-sm text-gray-600 flex items-center gap-2 break-all">
                    <Mail size={16} />
                    {c.email}
                  </div>

                  {/* RESUME */}
                  {c.resume && (
                    <a
                      href={`${process.env.NEXT_PUBLIC_URL}${c.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition mt-4"
                    >
                      <FileText size={16} />
                      View Resume
                    </a>
                  )}

                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-10">
                No saved profiles yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <EmployerFooter />
    </div>
  );
}