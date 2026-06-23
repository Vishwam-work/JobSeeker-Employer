"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import EmployerHeader from "@/components/Employerheader";
import EmployerFooter from "@/components/Employerfooter";
interface Candidate {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  phone_code?: string;
  experience: string;
  current_salary: string;
  expected_salary?: string;
  notice_period?: string;
  gender: string;
  professional_summary: string;

  city?: { name: string };
  state?: { name: string };

  profile_image?: string;
  resume?: string;

  skills?: { name: string }[];

  experiences?: {
    job_title?: string;
    company?: string;
    category?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
  }[];

  educations?: {
    institution?: string;
    education_detail?: { name: string };
    course_detail?: { name: string };
    start_year?: string;
    end_year?: string;
    percentage?: string;
    score_type?: string;
  }[];

  certifications?: {
    name: string;
    issuer?: string;
    year?: string;
  }[];
}

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("employeer_token");

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchCandidate = async () => {
      try {
        const currentId = Number(
          Array.isArray(params.id) ? params.id[0] : params.id,
        );

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/profiles/${currentId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error("Candidate not found");
        }

        const result = await res.json();

        console.log("Candidate Response:", result);

        setCandidate(result.data);
      } catch (error) {
        console.error(error);
        setCandidate(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [params.id]);

  const formatSalary = (value?: string | number) => {
    if (!value) return "-";

    return `₹ ${new Intl.NumberFormat("en-IN").format(Number(value))}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Candidate not found
      </div>
    );
  }

  return (
    <>
      <EmployerHeader />

      <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 px-4 lg:px-8 py-8">
          {/* LEFT SECTION */}
          <div className="col-span-12 space-y-6 px-2 sm:px-4 lg:px-6">
            {/* PROFILE CARD */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-6">
                {/* TOP SECTION */}
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                  {/* LEFT */}
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    {/* PROFILE IMAGE */}
                    <img
                      src={
                        candidate.profile_image
                          ? `${process.env.NEXT_PUBLIC_URL}${candidate.profile_image}`
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              candidate.full_name,
                            )}`
                      }
                      alt={candidate.full_name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border shadow-md bg-white"
                    />

                    {/* INFO */}
                    <div className="w-full">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                        {candidate.full_name}
                      </h1>

                      <p className="text-gray-600 mt-2 capitalize">
                        {candidate.experience} Experience
                      </p>

                      {/* TAGS */}
                      <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 text-xs sm:text-sm">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                          {formatSalary(candidate.current_salary)} / yr
                        </span>

                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          {candidate.city?.name}, {candidate.state?.name}
                        </span>

                        <span className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full capitalize">
                          {candidate.gender}
                        </span>

                        {candidate.notice_period && (
                          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full capitalize">
                            Notice: {candidate.notice_period}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT ACTION */}
                  <div className="flex flex-col gap-3 w-full xl:w-auto">
                    {candidate.resume && (
                      <button
                        onClick={() =>
                          window.open(
                            `${process.env.NEXT_PUBLIC_URL}${candidate.resume}`,
                            "_blank",
                          )
                        }
                        className="inline-flex items-center justify-center w-full xl:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow hover:shadow-md transition"
                      >
                        View Resume
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* PROFESSIONAL SUMMARY */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5">
                Professional Summary
              </h2>

              <div
                className="prose max-w-none text-gray-700
                [&_ul]:list-disc [&_ul]:pl-6
                [&_ol]:list-decimal [&_ol]:pl-6"
                dangerouslySetInnerHTML={{
                  __html: candidate.professional_summary || "",
                }}
              />
            </div>

            {/* COMPENSATION */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5">
                Compensation Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-2xl p-5 border">
                  <p className="text-sm text-gray-500">Current Salary</p>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-2">
                    {formatSalary(candidate.current_salary)} / yr
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border">
                  <p className="text-sm text-gray-500">Expected Salary</p>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-2">
                    {formatSalary(candidate.expected_salary)} / yr
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border">
                  <p className="text-sm text-gray-500">Notice Period</p>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-2 capitalize">
                    {candidate.notice_period || "-"}
                  </h3>
                </div>
              </div>
            </div>

            {/* SKILLS */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5">
                Skills
              </h2>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                {candidate.skills?.map((s, i) => (
                  <span
                    key={i}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium border border-blue-100"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            {/* EXPERIENCE */}
            {(candidate.experiences?.length ?? 0) > 0 && (
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5">
                  Experience
                </h2>

                <div className="space-y-5">
                  {candidate.experiences?.map((ex, i) => (
                    <div
                      key={i}
                      className="border border-gray-100 rounded-2xl p-4 sm:p-5 hover:shadow-md transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            {ex.company}
                          </h3>

                          <p className="text-indigo-600 font-medium mt-1">
                            {ex.job_title}
                          </p>

                          <p className="text-sm text-gray-500 mt-2">
                            {ex.start_date} - {ex.end_date || "Present"}
                          </p>
                        </div>

                        {ex.category && (
                          <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm w-fit">
                            {ex.category}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 mt-4 leading-relaxed break-words">
                        {ex.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EDUCATION */}
            {(candidate.educations?.length ?? 0) > 0 && (
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5">
                  Education
                </h2>

                <div className="space-y-5">
                  {candidate.educations?.map((e, i) => (
                    <div
                      key={i}
                      className="border border-gray-100 rounded-2xl p-4 sm:p-5"
                    >
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        {e.education_detail?.name}
                      </h3>

                      <p className="text-green-600 font-medium mt-1">
                        {e.course_detail?.name}
                      </p>

                      <p className="text-gray-600 mt-2 break-words">
                        {e.institution}
                      </p>

                      <p className="text-sm text-gray-500 mt-2">
                        {e.start_year} - {e.end_year}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CERTIFICATIONS */}
            {(candidate.certifications?.length ?? 0) > 0 && (
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5">
                  Certifications
                </h2>

                <div className="space-y-4">
                  {candidate.certifications?.map((c, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-gray-100 rounded-2xl p-4 sm:p-5"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {c.name}
                        </h3>

                        {c.issuer && (
                          <p className="text-sm text-gray-500 mt-1">
                            {c.issuer}
                          </p>
                        )}

                        {c.year && (
                          <span className="text-sm text-gray-500 mt-1 block">
                            {c.year}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONTACT */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5">
                Contact Information
              </h2>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Mail size={18} className="text-blue-700" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-gray-500">Email Address</p>

                    <p className="font-medium text-gray-900 break-all">
                      {candidate.email}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Phone size={18} className="text-green-700" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>

                    <p className="font-medium text-gray-900">
                      +{candidate.phone_code} {candidate.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EmployerFooter />
    </>
  );
}
