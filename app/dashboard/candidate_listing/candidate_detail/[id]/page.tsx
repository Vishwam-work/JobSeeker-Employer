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
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const token = localStorage.getItem("employeer_token");

  if (!token) {
    setLoading(false);
    return;
  }

  fetch(`${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/profile-all/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("API Response:", data);

      const profiles = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
        ? data.results
        : [];

      setCandidates(profiles);

      const found = profiles.find(
        (item: Candidate) => item.id === Number(params.id)
      );

      setCandidate(found || null);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setLoading(false);
    });
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
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* PROFILE CARD */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-6">
                {/* TOP SECTION */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
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
                      className="w-28 h-28 rounded-2xl object-cover border shadow-md bg-white"
                    />

                    {/* INFO */}
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">
                        {candidate.full_name}
                      </h1>

                      <p className="text-gray-600 mt-2">
                        {candidate.experience} Experience
                      </p>

                      {/* TAGS */}
                      <div className="flex flex-wrap gap-3 mt-4 text-sm">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                          {formatSalary(candidate.current_salary)}
                        </span>

                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                          {candidate.city?.name}, {candidate.state?.name}
                        </span>

                        <span className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full capitalize">
                          {candidate.gender}
                        </span>

                        {candidate.notice_period && (
                          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
                            Notice: {candidate.notice_period}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT ACTION */}
                  <div className="flex flex-col gap-3 w-full sm:w-auto">
                    {candidate.resume && (
                      <button
                        onClick={() =>
                          window.open(
                            `${process.env.NEXT_PUBLIC_URL}${candidate.resume}`,
                            "_blank",
                          )
                        }
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow hover:shadow-lg hover:scale-[1.02] transition"
                      >
                        View Resume
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* PROFESSIONAL SUMMARY */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-5">
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
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-5">
                Compensation Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-2xl p-5 border">
                  <p className="text-sm text-gray-500">Current Salary</p>

                  <h3 className="text-xl font-bold text-gray-900 mt-2">
                    {formatSalary(candidate.current_salary)}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border">
                  <p className="text-sm text-gray-500">Expected Salary</p>

                  <h3 className="text-xl font-bold text-gray-900 mt-2">
                    {formatSalary(candidate.expected_salary)}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border">
                  <p className="text-sm text-gray-500">Notice Period</p>

                  <h3 className="text-xl font-bold text-gray-900 mt-2">
                    {candidate.notice_period || "-"}
                  </h3>
                </div>
              </div>
            </div>

            {/* SKILLS */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-5">
                Skills
              </h2>

              <div className="flex flex-wrap gap-3">
                {candidate.skills?.map((s, i) => (
                  <span
                    key={i}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium border border-blue-100"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            {/* EXPERIENCE */}
            {(candidate.experiences?.length ?? 0) > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-5">
                  Experience
                </h2>

                <div className="space-y-5">
                  {candidate.experiences?.map((ex, i) => (
                    <div
                      key={i}
                      className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {ex.job_title}
                          </h3>

                          <p className="text-indigo-600 font-medium mt-1">
                            {ex.company}
                          </p>

                          <p className="text-sm text-gray-500 mt-2">
                            {ex.start_date} - {ex.end_date || "Present"}
                          </p>
                        </div>

                        {ex.category && (
                          <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                            {ex.category}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 mt-4 leading-relaxed">
                        {ex.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EDUCATION */}
            {(candidate.educations?.length ?? 0) > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-5">
                  Education
                </h2>

                <div className="space-y-5">
                  {candidate.educations?.map((e, i) => (
                    <div
                      key={i}
                      className="border border-gray-100 rounded-2xl p-5"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">
                        {e.education_detail?.name}
                      </h3>

                      <p className="text-green-600 font-medium mt-1">
                        {e.course_detail?.name}
                      </p>

                      <p className="text-gray-600 mt-2">{e.institution}</p>

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
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-5">
                  Certifications
                </h2>

                <div className="space-y-4">
                  {candidate.certifications?.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border border-gray-100 rounded-2xl p-5"
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
                      </div>

                      {c.year && (
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {c.year}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONTACT */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-5">
                Contact Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Mail size={18} className="text-blue-700" />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>

                    <p className="font-medium text-gray-900 break-all">
                      {candidate.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
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

          {/* RIGHT SIDEBAR */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-5">
                Similar Profiles
              </h2>

              <div className="space-y-4">
                {candidates
                  .filter((c) => c.id !== candidate.id)
                  .slice(0, 10)
                  .map((c) => (
                    <div
                      key={c.id}
                      onClick={() =>
                        window.open(
                          `/dashboard/candidate_listing/candidate_detail/${c.id}`,
                          "_blank",
                        )
                      }
                      className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 cursor-pointer transition"
                    >
                      <img
                        src={
                          c.profile_image
                            ? `${process.env.NEXT_PUBLIC_URL}${c.profile_image}`
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                c.full_name,
                              )}`
                        }
                        alt={c.full_name}
                        className="w-14 h-14 rounded-xl object-cover border"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {c.full_name}
                        </h3>

                        <p className="text-sm text-gray-500 truncate">
                          {c.experience}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <EmployerFooter />
    </>
  );
}
