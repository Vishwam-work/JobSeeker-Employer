"use client";

import { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Calendar,
  User ,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { DigitalClock } from "@mui/x-date-pickers/DigitalClock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Briefcase,
  Mail,
  Phone,
  Award,
  ExternalLink,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
// import { set } from "lodash";

dayjs.extend(customParseFormat);
export default function Candidates() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [salaryFilter, setSalaryFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [jobTitleFilter, setJobTitleFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [openSchedule, setOpenSchedule] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewMode, setInterviewMode] = useState("");
  const [interviewLink, setInterviewLink] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmPm] = useState("AM");
  const [interviewTime, setInterviewTime] = useState(`${hour}:${minute} ${ampm}`);
  const [timeZone, setTimeZone] = useState("IST");
  const [showResume, setShowResume] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  //date validation
  const [interviewInput, setInterviewInput] = useState("");
  const [interviewError, setInterviewError] = useState("");
  const [open, setOpen] = useState(false);
  const [timeopen, setTimeopen] = useState(false);
  const [time, setTime] = useState<Dayjs | null>(dayjs());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [totalCandidates, setTotalCandidates] = useState<number>(0);
  const [locations, setLocations] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  interface Candidate {
    id: number;
    name: string;
    email: string;
    phone: string;
    location: string;
    current_salary: string;
    expected_salary: string;
    current_currency:{
      name: string;
      symbol: string;
      code: string;
      symbol_native: string;
    }
    experience: string;
    gender: string;
    skills: string[];
    education: string;
    appliedFor: string;
    job_title?: string;
    appliedDate: string;
    status: string;
    expectedSalary?: string;
    resumeUrl?: string;
    profile_image?: string | null;
    professional_summary?: string;
    workExperience: {
      company: string;
      role: string;
      duration: string;
      description?: string;
      category?: string;
      start_date?: string;
      end_date?: string;
    }[];

    educationDetails: {
      education: string;
      courd: string;
      institution: string;
      year: string;
      course: string;
      start_year?: string;
      end_year?: string;
      grade?: string;
      score_type?: string;
    }[];

    certifications: {
      name: string;
      issuer?: string;
      year?: string;
    }[];
    phoneCode?: string;
    qa?: CandidateQA[];
  }
  interface CandidateQA {
    question_index?: number;
    question_text?: string;
    answer_text?: string;
  }
  interface ApplicationUpdateResponse {
    id: number;
    application_status: string;
    detail?: string;
  }
  type Application = {
  job_title?: string;
};

const formatNumber = (
  value: string | number,
  currency: string = "INR"
): string => {
  if (!value) return "";

  return new Intl.NumberFormat(
    currency === "INR" ? "en-IN" : "en-US"
  ).format(Number(String(value).replace(/,/g, "")));
};

const parseNumber = (value: string): string => {
  return value.replace(/,/g, "");
};
  const fetchApplications = async ( page=1,search = "", status = "All", gender = "All", title = "All", location = "All", exp = "All", salary = "All" ) => {
      try {
        setLoading(true);
        const token = localStorage.getItem("employeer_token");
        if (!token) return;
            const query = new URLSearchParams({
      page: page.toString(),
      search: searchTerm,
      status: statusFilter,
      gender: genderFilter,
      job_title: jobTitleFilter,
      location: locationFilter,
      experience: experienceFilter,
      salary_range: salaryFilter,
    });
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/employer/applications/?${query.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (!res.ok) {
          console.error("Failed to fetch employer applications");
          return;
        }
        const data = await res.json();
        console.log("Employer applications:", data.results);
        // Map API to UI candidate shape
        const mapped = (Array.isArray(data.results) ? data.results : []).map((app: any) => ({
          id: app.id,
          name: app.profile?.full_name || app.user_email || "Unknown",
          email: app.profile?.email || app.user_email,
          phone: app.profile?.phone || "Not provided",
          phoneCode: app.profile?.phone_code || "",
          current_salary: app.profile?.current_salary || "",
          expected_salary: app.profile?.expected_salary || "",
          current_currency: app.profile?.current_currency || "",
          location: [
            app.profile?.city,
            app.profile?.state,
            app.profile?.country,
          ]
            .filter(Boolean)
            .join(", "),
          experience: app.profile?.experience || "",
          gender: app.profile?.gender || "",
          skills: app.profile?.skills || [],
          education: "",
          appliedFor: app.job_title,
          appliedDate: app.applied_at,
          status:
            app.application_status &&
            app.application_status !== "application_status"
              ? app.application_status
              : "Under Review",
          resumeUrl: app.profile?.resume
            ? `${process.env.NEXT_PUBLIC_URL}${app.profile.resume}`
            : "#",
          profile_image: app.profile?.profile_image ? process.env.NEXT_PUBLIC_URL + app.profile.profile_image : "",
          professional_summary: app.profile?.professional_summary || "",
          workExperience: app.profile?.experiences || [],
          educationDetails: app.profile?.educations || [],
          certifications: app.profile?.certifications || [],
          qa: app.answers || [],
        }));
        setCandidates(mapped);
        setCurrentPage(page);
        setTotalPages(Math.ceil(data.count / 5));
        console.log("MAPPED:", candidates);
      } catch (e) {
        console.error("Failed to fetch employer applications", e);
      } finally {
        setLoading(false);
      }
    };

 useEffect(() => {
  const delay = setTimeout(() => {
    fetchApplications();
  }, 400);

  return () => clearTimeout(delay);
}, [

  searchTerm,
  statusFilter,
  genderFilter,
  jobTitleFilter,
  locationFilter,
  experienceFilter,
  salaryFilter,
]);

 const fetchAllTitles = async () => {
  const token = localStorage.getItem("employeer_token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/employer/applications/?page=1`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const data = await res.json();

  if (!data || !Array.isArray(data.results)) {
    console.error("Invalid API response:", data);
    return;
  }

  // total count
  setTotalCandidates(data.count || 0);

  // Sets (unique values ke liye)
  const titleSet = new Set<string>();
 
  (data.results || []).forEach((item: any) => {
    //  Job Title
    if (item.job_title) {
      titleSet.add(item.job_title);
    }



const locationSet = new Set<string>();

(data.results || []).forEach((item: any) => {
  const state = item?.profile?.state;

  if (state) {
    locationSet.add(state);
  }
   setLocations(Array.from(locationSet));
});
  });

  // ✅ set states
  setJobTitles(Array.from(titleSet));

};

useEffect(() => {
  fetchAllTitles();
}, []);
  useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768);
  checkMobile();
  window.addEventListener("resize", checkMobile);
  return () => window.removeEventListener("resize", checkMobile);
}, []);
const formatDate = (date?: any) => {
  if (!date) return "";

  const parsed = dayjs(date);

  // ❗ future date check
  if (!parsed.isValid() || parsed.year() > dayjs().year()) {
    return "Invalid Date";
  }

  return parsed.format("DD/MM/YYYY");
};
  const getStatusColor = (status?: string) => {
  const normalized = status?.toLowerCase();

  switch (normalized) {
    case "under review":
      return "bg-yellow-100 text-yellow-800";

    case "shortlisted":
      return "bg-blue-100 text-blue-800";

    case "rejected":
      return "bg-red-100 text-red-800";

    case "interview scheduled":
      return "bg-blue-100 text-blue-800";

    default:
      return "bg-gray-100 text-gray-800";
  }
};
  const formatStatus = (status?: string) => {
    if (!status) return "";
    return status
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  // SHORTLIST
  const handleShortlistCandidate = async (candidate: any) => {
    try {
      const token = localStorage.getItem("employeer_token");
      if (!token) {
        toast.error("Token missing", {
          description: "Please log in again to continue.",
        });
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/employer/applications/${candidate.id}/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            application_status: "shortlisted",
          }),
        },
      );

      const updated = await response.json();
      // console.log("Updated Response:", updated);

      if (!response.ok) {
        toast.error(updated.error || "Update failed", {
          description: "Please check and try again.",
        });
        return;
      }

      setCandidates((prev) =>
        prev.map((c) =>
          c.id === updated.id
            ? { ...c, status: updated.application_status }
            : c,
        ),
      );

      setSelectedCandidate((prev) =>
        prev && prev.id === updated.id
          ? { ...prev, status: updated.application_status }
          : prev,
      );
      //console.log("Now>>>>>>>", selectedCandidate);
      toast.success("Candidate Shortlisted!");
    } catch (err) {
      console.log("Shortlist error:", err);
      toast.error("Network error. Please try again.");
    }
  };

  /* REJECT */
  const handleRejectCandidate = async (candidate: Pick<Candidate, "id">) => {
    try {
      // console.log("Rejecting candidate: ", candidate);

      if (!candidate?.id) {
        toast.error("Candidate ID missing", {
          description: "Please select a candidate and try again.",
        });
        return;
      }

      const token = localStorage.getItem("employeer_token");
      if (!token) {
        toast.error("Token missing", {
          description: "Please log in again to continue.",
        });
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/employer/applications/${candidate.id}/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            application_status: "rejected",
          }),
        },
      );

      const text = await response.text();
      console.log("Raw Response → ", text);

      let data: ApplicationUpdateResponse | null = null;
      try {
        data = JSON.parse(text) as ApplicationUpdateResponse;
      } catch {
        console.log("HTML Error Response Received");
      }

      if (!response.ok) {
        toast.error(data?.detail || "Update failed", {
          description: "Please check and try again.",
        });
        return;
      }

      if (!data) {
        toast.error("Invalid server response", {
          description: "Please try again later.",
        });
        return;
      }
      const { id, application_status } = data;
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: application_status } : c,
        ),
      );

      setSelectedCandidate((prev) =>
        prev && prev.id === id ? { ...prev, status: application_status } : prev,
      );

      toast.error("Candidate Rejected!");
    } catch (err) {
      console.log("Reject error: ", err);
      toast.error("Network error. Please try again.");
    }
  };

  // INTERVIEW SCHEDULE
  const handleScheduleInterview = (candidate: any) => {
    setSelectedCandidate(candidate);
    setOpenSchedule(true);
  };

  const handleScheduleSubmit = async () => {
    if (!selectedCandidate) {
      toast.error("No candidate selected", {
        description: "Please select a candidate and try again.",
      });
      return;
    }
    if (!interviewDate) {
      toast.warning("Please select interview date");
      return;
    }

    try {
      const token = localStorage.getItem("employeer_token");
      if (!token)
        return toast.error("Token missing", {
          description: "Please log in again to continue.",
        });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/employer/applications/${selectedCandidate.id}/schedule-interview/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            interview_date: interviewDate,
            interview_time: time ? time.format("HH:mm") : "",
            interview_mode: interviewMode,
            meet_link: interviewLink,
            timezone : timeZone,
            notes: interviewNotes,
            application_status: "Interview Scheduled",
          }),
        },
      );
      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        return toast.error("Failed to schedule interview", {
          description: "Please try again or check your network connection.",
        });
      }

      const data = await res.json();

      setCandidates((prev) =>
        prev.map((c) =>
          c.id === data.id ? { ...c, status: data.application_status } : c,
        ),
      );

      setSelectedCandidate((prev) =>
        prev && prev.id === data.id
          ? { ...prev, status: data.application_status }
          : prev,
      );

      toast.success("Interview Scheduled!");
      setOpenSchedule(false);
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    }
  };
  const formatDeadline = (value: string) => {
     let input = value.replace(/\D/g, "");
      if (input.length > 8) input = input.slice(0, 8);
      let day = input.slice(0, 2);
      let month = input.slice(2, 4);
      let year = input.slice(4, 8);
      let error = "";
  
      // DAY FIX
      if (day.length === 1) {
        if (!["0", "1", "2", "3"].includes(day)) {
          day = "0" + day;
        }
      }
  
      if (day.length === 2) {
        let d = parseInt(day);
        if (d > 31) day = "31";
        if (d === 0) day = "01";
      }
  
      // MONTH FIX
      if (month.length === 1) {
        if (month !== "0" && month !== "1") {
          month = "0" + month;
        }
      }
  
      if (month.length === 2) {
        let m = parseInt(month);
        if (m > 12) month = "12";
        if (m === 0) month = "01";
      }
  
      const currentYear = dayjs().year();
  
      if (year.length === 4) {
        let y = parseInt(year);
  
        if (y < 1900) {
          error = "Year must be after 1900";
        }
      }
  
      // ✅ FULL DATE VALIDATION
      if (day.length === 2 && month.length === 2 && year.length === 4) {
        const d = parseInt(day);
        const m = parseInt(month);
        const y = parseInt(year);
  
        // Leap year check
        const isLeapYear =
          (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  
        const daysInMonth = [
          31,
          isLeapYear ? 29 : 28, // Feb
          31,
          30,
          31,
          30,
          31,
          31,
          30,
          31,
          30,
          31,
        ];
        if (m >= 1 && m <= 12) {
          if (d > daysInMonth[m - 1]) {
            error = `Invalid day for month`;
          }
        }
        // Extra safety with dayjs
        const parsedCheck = dayjs(
          `${day}/${month}/${year}`,
          "DD/MM/YYYY",
          true
        );
  
        if (!parsedCheck.isValid()) {
          error = "Invalid date";
        }
  
        if (parsedCheck.isBefore(dayjs())) {
          error = "Past date not allowed";
        }
      }
  
      // ✅ FORMAT OUTPUT
      let formatted = day;
      if (month) formatted += "/" + month;
      if (year) formatted += "/" + year;
  
      const parsed = dayjs(formatted, "DD/MM/YYYY", true);
      return { formatted, parsed, error };
  };
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const timeRef =useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
     const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;

    const isInsideAnyCalendar =
      (calendarRef.current && calendarRef.current.contains(target)) ||
      (timeRef.current && timeRef.current.contains(target)) ;

    if (!isInsideAnyCalendar) {
      setOpen(false);
      setTimeopen(false);
    }
  };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
          <div>
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Applications</CardTitle>

                <Badge variant="secondary">{candidates.length}</Badge>
              </div>

              <button
                onClick={() => {
                  setStatusFilter("All");
                  setLocationFilter("All");
                  setSalaryFilter("All");
                  setExperienceFilter("All");
                  setJobTitleFilter("All");
                  setGenderFilter("All");
                }}
                className="text-sm px-3 py-1 border rounded-md hover:bg-gray-100"
              >
                Clear Filters
              </button>
            </div> */}

            {/*  Search Bar  */}
            <div className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by name, role or applied job..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-11 pl-10"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                  />
                </svg>
              </div>
            </div>
            

            {/*  Filters */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-5 gap-3 mb-4">
              {/*  Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Interview Scheduled">Interview Scheduled </SelectItem>
                </SelectContent>
              </Select>

              {/* Location Filter */}
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Locations</SelectItem>
                  {locations.map((loc, i) => (
                    <SelectItem key={i} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Experience Filter */}
              <Select
                value={experienceFilter}
                onValueChange={setExperienceFilter}
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Experience</SelectItem>
                  <SelectItem value="Fresher">Fresher</SelectItem>
                  <SelectItem value="1 Years">1 Years</SelectItem>
                  <SelectItem value="2 Years">2 Years</SelectItem>
                  <SelectItem value="3 Years">3 Years</SelectItem>
                  <SelectItem value="4 Years">4 Years</SelectItem>
                  <SelectItem value="5 Years">5 Years</SelectItem>
                  <SelectItem value="6 Years">6 Years</SelectItem>
                  <SelectItem value="7 Years">7 Years</SelectItem>
                  <SelectItem value="8 Years">8 Years</SelectItem>
                  <SelectItem value="9 Years">9 Years</SelectItem>
                  <SelectItem value="10 Years">10 Years</SelectItem>
                  <SelectItem value="11 Years">11 Years</SelectItem>
                  <SelectItem value="12 Years">12 Years</SelectItem>
                  <SelectItem value="13 Years">13 Years</SelectItem>
                  <SelectItem value="14 Years">14 Years</SelectItem>
                  <SelectItem value="15 Years">15 Years</SelectItem>
                  <SelectItem value="16 Years">16 Years</SelectItem>
                  <SelectItem value="17 Years">17 Years</SelectItem>
                  <SelectItem value="18 Years">18 Years</SelectItem>
                  <SelectItem value="19 Years">19 Years</SelectItem>
                  <SelectItem value="20+ Years">20+ Years</SelectItem>
                </SelectContent>
              </Select>

              {/* Job Title Filter */}
              <Select value={jobTitleFilter} onValueChange={setJobTitleFilter}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Job Title" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="All">All Job Titles</SelectItem>
                    {jobTitles.map((title, i) => (
                      <SelectItem key={i} value={title}>
                        {title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* Gender Filter */}
              <Select
                value={genderFilter}
                onValueChange={setGenderFilter}
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div
              className={`fixed inset-0 z-50 transition ${
                isOpen ? "visible" : "invisible"
              }`}
            >
              {/* Overlay */}
              <div
                className={`absolute inset-0 bg-black/40 transition-opacity ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
                onClick={() => setIsOpen(false)}
              />

              {/* Drawer */}
              <div
                className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-white shadow-lg transform transition-transform ${
                  isOpen ? "translate-x-0" : "translate-x-full"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="font-semibold text-lg">Filters</h2>
                  <button onClick={() => setIsOpen(false)}>✕</button>
                </div>

                {/* Filters Content */}
                <div className="p-4 space-y-4 overflow-y-auto h-full pb-20">

                  {/* Status */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Location */}
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Locations</SelectItem>
                      {locations.map((loc, i) => (
                        <SelectItem key={i} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Experience */}
                  <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Experience</SelectItem>
                      <SelectItem value="Fresher">Fresher</SelectItem>
                      <SelectItem value="1 Years">1 Years</SelectItem>
                      <SelectItem value="2 Years">2 Years</SelectItem>
                      {/* continue... */}
                    </SelectContent>
                  </Select>

                  {/* Job Title */}
                  <Select value={jobTitleFilter} onValueChange={setJobTitleFilter}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Job Title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Job Titles</SelectItem>
                      {jobTitles.map((title, i) => (
                        <SelectItem key={i} value={title}>{title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Gender */}
                  <Select value={genderFilter} onValueChange={setGenderFilter}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Genders</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                </div>

                {/* Footer Buttons */}
                <div className="absolute bottom-0 w-full p-4 border-t bg-white flex gap-2">
                  <button
                    onClick={() => {
                      setStatusFilter("All");
                      setLocationFilter("All");
                      setExperienceFilter("All");
                      setJobTitleFilter("All");
                      setGenderFilter("All");
                    }}
                    className="w-1/2 border rounded-lg py-2"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="w-full mb-3 bg-black text-white py-2 rounded-lg sm:hidden"
            >
              Filters
            </button>
      </div>
    <div className="h-[calc(100vh-25px)] overflow-y-hidden p-4">

  <div className="grid lg:grid-cols-3 gap-6 h-full">
      {/* Candidates List */}
       <div className="lg:col-span-1 h-full overflow-auto">
        <Card className="h-full flex flex-col overflow-auto">
         <CardHeader  className=" sticky top-0 bg-white" >
              <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Applications</CardTitle>

                <Badge variant="secondary">{totalCandidates}</Badge>
              </div>

              <button
                onClick={() => {
                  setStatusFilter("All");
                  setLocationFilter("All");
                  setSalaryFilter("All");
                  setExperienceFilter("All");
                  setJobTitleFilter("All");
                  setGenderFilter("All");
                }}
                className="hidden sm:grid text-sm px-3 py-1 border rounded-md hover:bg-gray-100"
              >
                Clear Filters
              </button>
            </div>
         </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              [...Array(2)].map((_, i) => (
                <div key={i} className="border rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                </div>
              ))
            ) : candidates.length > 0 ? (
              candidates.map((candidate:any) => (
                <div
                  key={candidate.id}
                  onClick={() => {
                    setSelectedCandidate(candidate);
                    setIsCandidateModalOpen(true);
                  }}
                  className={`p-4 cursor-pointer hover:bg-gray-50 border-l-4 transition-colors ${
                    selectedCandidate?.id === candidate.id
                      ? "border-l-blue-500 bg-blue-50"
                      : "border-l-transparent"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {candidate.profile_image ? (
                         <Image
                           src={candidate.profile_image}
                           alt="profile image"
                          width={32}
                           height={25}
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                      ) : (
                         <User className="w-6 h-6 text-gray-700 hover:text-purple-600" />
                       )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {candidate.name}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {candidate.appliedFor}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge
                          className={`text-xs ${getStatusColor(
                            candidate.status,
                          )}`}
                        >
                          {formatStatus(candidate.status)}
                        </Badge>
                        <span className="text-xs text-gray-500">
                           {formatDate(candidate.appliedDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="bg-gray-100 p-4 rounded-full mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-6a2 2 0 012-2h4M7 7h10M5 21h14"
                    />
                  </svg>
                </div>

                <p className="text-gray-700 font-medium">
                  No candidates found
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Try adjusting your filters
                </p>
              </div>
            )}
            <div className="flex items-center justify-between mt-8 px-4 py-3">

              {/* Left Info */}
              <p className="text-sm text-gray-500">
                Page <span className="font-medium text-gray-900">{currentPage}</span> of{" "}
                <span className="font-medium text-gray-900">{totalPages}</span>
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    fetchApplications(
                      currentPage - 1,
                      searchTerm,
                      statusFilter,
                      genderFilter,
                      jobTitleFilter,
                      locationFilter,
                      experienceFilter,
                      salaryFilter
                    )
                  }
                  className="px-4 py-2 text-sm border rounded-lg bg-white hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                 <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="px-3 py-1 text-sm font-medium bg-gray-100 rounded-lg">
                  {currentPage}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    fetchApplications(
                      currentPage + 1,
                      searchTerm,
                      statusFilter,
                      genderFilter,
                      jobTitleFilter,
                      locationFilter,
                      experienceFilter,
                      salaryFilter
                    )
                  }
                  className="px-4 py-2 text-sm border rounded-lg bg-white hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                 <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mb-4 items-center"></div>
          </CardContent>
        </Card>
      </div>

      {/* Candidate Profile */}
      <div className="hidden sm:grid lg:col-span-2 h-full overflow-auto">
        {selectedCandidate ? (
          <Card className="h-full flex flex-col overflow-auto">
            <CardHeader className=" sticky top-0 bg-white ">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                     {selectedCandidate.profile_image ? (
                      <Image
                        src={selectedCandidate.profile_image}
                         alt="profile image"
                         width={32}
                         height={32}
                        className="w-16 h-16 rounded-full object-cover border"
                       />
                     ) : (
                      <User className="w-6 h-6 text-gray-700 hover:text-purple-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedCandidate.name}
                    </h2>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{selectedCandidate.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        <span>{selectedCandidate.experience}</span>
                      </div>
                       <div className="flex items-center">
                        <p className="text-gray-600">
                       Gender: {
                                selectedCandidate.gender
                                  ? selectedCandidate.gender.charAt(0).toUpperCase() +
                                     selectedCandidate.gender.slice(1)
                                  : ""
                                }
                       </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button variant="outline" size="sm">
                    {selectedCandidate.resumeUrl ? (
                      <a
                        href={selectedCandidate.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800 underline inline-flex items-center gap-1"
                      >
                        View Resume
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">
                        No resume uploaded
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{selectedCandidate.email}</span>
                  </div>
                   <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">
                        +{selectedCandidate.phoneCode} {selectedCandidate.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      Current Salary:
                      <span className="font-medium">
                        {selectedCandidate.current_currency?.symbol_native}
                        {formatNumber(
                          selectedCandidate.current_salary,
                          selectedCandidate.current_currency?.code
                        )}{" "}
                        / yr
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      Expected Salary:
                      <span className="font-medium">
                        {selectedCandidate.current_currency?.symbol_native}
                        {formatNumber(
                          selectedCandidate.expected_salary,
                          selectedCandidate.current_currency?.code
                        )}{" "}
                        / yr
                      </span>
                    </div>
                </div>
              </div>

              {/* Application Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Application Details
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Applied for:</span>
                      <p className="font-medium">
                        {selectedCandidate.appliedFor}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Application Date:</span>
                      <p className="font-medium">
                        {formatDate(selectedCandidate.appliedDate)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <Badge
                        className={`ml-2 ${getStatusColor(
                          selectedCandidate.status,
                        )}`}
                      >
                        {formatStatus(selectedCandidate.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Professional Summary
                </h3>
                <div
                  className="text-gray-700 leading-relaxed prose max-w-none
                   [&_ul]:list-disc [&_ul]:pl-6
                    [&_ol]:list-decimal [&_ol]:pl-6
                    [&_li]:mb-1"
                  dangerouslySetInnerHTML={{ __html: selectedCandidate.professional_summary
                  || "" }}
                />
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-purple-100 text-purple-800"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Work Experience
                </h3>
                <div className="space-y-4">
                  {selectedCandidate.workExperience.map((exp, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-purple-200 pl-4"
                    >
                      <h4 className="font-medium text-gray-900">{exp.role}</h4>
                      <p className="text-purple-600 font-medium">
                        {exp.category}
                      </p>
                      <p className="text-purple-600 font-medium">
                        {exp.company}
                      </p>
                     <p className="text-sm text-gray-600 mb-2">
                        Year: {formatDate(exp.start_date)} -{" "}
                        {exp.end_date ? formatDate(exp.end_date) : "Present"}
                      </p>
                      <div
                        className="text-gray-700 leading-relaxed prose max-w-none
                        [&_ul]:list-disc [&_ul]:pl-6
                        [&_ol]:list-decimal [&_ol]:pl-6
                        [&_li]:mb-1"
                        dangerouslySetInnerHTML={{ __html: exp.description || "" }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Education</h3>
                <div className="space-y-4">
                  {selectedCandidate.educationDetails.map((edu, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-green-200 pl-4"
                    >
                      <h4 className="font-medium text-gray-900">
                        {edu.education}
                      </h4>
                      <p className="text-green-600 font-medium">{edu.course || "Course Details Not Available"}</p>
                      <p className="text-gray-600">{edu.institution}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>
                          Year: {edu.start_year} - {edu.end_year}
                        </span>
                        <span>
                          Score
                          : {edu.grade}({edu.score_type
                            ? edu.score_type.charAt(0).toUpperCase() + edu.score_type.slice(1)
                            : ""})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Certifications */}
              {Array.isArray(selectedCandidate.qa) &&
                selectedCandidate.qa.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Application Q&A
                    </h4>
                    <div className="space-y-3">
                      {selectedCandidate.qa.map((item, index) => (
                        <div key={index} className="bg-gray-50 rounded p-3">
                          <p className="text-sm font-medium text-gray-800">
                            Q{(item.question_index ?? index) + 1}.{" "}
                            {item.question_text || "Question"}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            {item.answer_text || "-"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {selectedCandidate.certifications.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Certifications
                  </h3>
                  <div className="space-y-3">
                    {selectedCandidate.certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg"
                      >
                        <Award className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {cert.name}
                          </h4>
                          <p className="text-yellow-600 font-medium">
                            {cert.issuer}
                          </p>
                          <p className="text-sm text-gray-600">
                            Issued: {cert.year}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResume((prev) => !prev)}
              >
                View Resume
              </Button> */}

              {showResume && selectedCandidate?.resumeUrl && (
                <div className="mt-4 h-[500px] border rounded">
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(
                      selectedCandidate.resumeUrl,
                    )}&embedded=true&timestamp=${Date.now()}`}
                    className="w-full h-full"
                    title="Resume Preview"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  {/* UNDER REVIEW */}
                  {selectedCandidate?.status === "Under Review" && (
                    <>
                      <Button
                        className="bg-green-600 hover:bg-green-700 flex-1"
                        onClick={() =>
                          handleShortlistCandidate(selectedCandidate)
                        }
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Shortlist Candidate
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-50 flex-1"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject Application
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Reject this application?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. The candidate will
                              be marked as rejected.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() =>
                                handleRejectCandidate(selectedCandidate)
                              }
                            >
                              Yes, Reject
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}

                  {/* SHORTLISTED */}
                  {selectedCandidate?.status === "shortlisted" && (
                    <Button
                      variant="outline"
                      className="flex-1 border-blue-600 text-blue-600"
                      onClick={() => handleScheduleInterview(selectedCandidate)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Schedule Interview
                    </Button>
                  )}

                  {/* REJECTED */}
                  {selectedCandidate?.status === "rejected" && (
                    <Button
                      disabled
                      variant="outline"
                      className="border-red-600 text-red-600 flex-1 opacity-50 cursor-not-allowed"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Application Rejected
                    </Button>
                  )}
                </div>

                {openSchedule && (
                  <Dialog
                    open={openSchedule}
                    onOpenChange={() => setOpenSchedule(false)}
                  >
                    <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto rounded-xl">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                          Schedule Interview
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4 mt-3">
                        {/* Candidate Name */}
                        <div className="bg-gray-50 p-3 rounded-lg border">
                          <p className="text-xs text-gray-500">Candidate</p>
                          <p className="font-semibold text-gray-800">
                            {selectedCandidate?.name}
                          </p>
                        </div>

                        {/* Candidate Email */}
                        <div className="bg-gray-50 p-3 rounded-lg border">
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="font-semibold text-gray-800">
                            {selectedCandidate?.email}
                          </p>
                        </div>

                        {/* Interview Date */}
                        <div>
                          <label className="text-sm font-medium">
                            Interview Date
                          </label>
                          {/* <input
                            required
                            type="date"
                            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                            value={interviewDate}
                            onChange={(e) => setInterviewDate(e.target.value)}
                          /> */}
                            <div className="relative mt-1">
                            <input
                              required
                              type="text"
                              placeholder="DD/MM/YYYY"
                              maxLength={10}
                              value={interviewInput}
                              onChange={(e) => {
                                const raw = e.target.value;

                                if (!raw) {
                                  setInterviewInput("");
                                  setInterviewError("");
                                  setInterviewDate("");
                                  return;
                                }

                                const { formatted, parsed, error } = formatDeadline(raw);

                                setInterviewInput(formatted);

                                if (error) {
                                  setInterviewError(error);
                                  setInterviewDate("");
                                  return;
                                }

                                if (formatted.length < 10) {
                                  setInterviewError("");
                                  setInterviewDate("");
                                  return;
                                }

                                if (!parsed.isValid()) {
                                  setInterviewError("Invalid date");
                                  setInterviewDate("");
                                  return;
                                }

                                if (parsed.isBefore(dayjs(), "day")) {
                                  setInterviewError("Past date not allowed");
                                  setInterviewDate("");
                                  return;
                                }

                                setInterviewError("");
                                setInterviewDate(parsed.format("DD/MM/YYYY")); // ✅ final value
                              }}
                              className={`w-full h-[44px] px-3 pr-10 text-sm border rounded-md outline-none
                                ${
                                  interviewError
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-blue-500"
                                }
                              `}
                            />

                            {/* CALENDAR */}
                            <div ref={calendarRef} className="absolute right-2 top-1/2">
                              <button
                                type="button"
                                onClick={() => setOpen((prev) => !prev)}
                              >
                                <Calendar size={18} />
                              </button>

                              {open && (
                                <div className="absolute right-0 mt-2 z-50 bg-white shadow-lg rounded">
                                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateCalendar
                                      value={
                                        interviewDate
                                          ? dayjs(interviewDate, "DD/MM/YYYY")
                                          : null
                                      }
                                      minDate={dayjs()}
                                      onChange={(newValue) => {
                                        if (!newValue) return;

                                        const formatted = newValue.format("DD/MM/YYYY");

                                        setInterviewInput(formatted);
                                        setInterviewDate(formatted);

                                        setOpen(false);
                                      }}
                                    />
                                  </LocalizationProvider>
                                </div>
                              )}
                            </div>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-3 relative">
                          <label className="text-sm font-medium">Time</label>

                          {/* ✅ Input + Timezone */}
                          <div className="flex gap-2">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <TimeField
                                label="Interview Time"
                                value={time}
                                onChange={(newValue) => setTime(newValue)}
                                format="hh:mm A"
                                fullWidth
                                slotProps={{
                                  textField: {
                                    size: "small",
                                  },
                                }}
                              />
                            </LocalizationProvider>

                            {/* Timezone */}
                            <select
                              className="border rounded-lg p-2"
                              value={timeZone}
                              onChange={(e) => setTimeZone(e.target.value)}
                            >
                              <option value="IST">IST</option>
                              <option value="UTC">UTC</option>
                              <option value="EST">EST</option>
                              <option value="PST">PST</option>
                              <option value="CST">CST</option>
                            </select>
                          </div>

                          {timeopen && (
                            <div ref={timeRef} className="absolute top-20 z-50 bg-white border rounded-xl shadow-lg p-3">
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DigitalClock
                                  value={time}
                                  onChange={(newValue) => {
                                    setTime(newValue);
                                      if (newValue) {
                                            setInterviewTime(newValue.format("hh:mm A"));
                                          }
                                    setTimeopen(false);
                                  }}
                                  ampm
                                />
                              </LocalizationProvider>
                            </div>
                          )}
                          </div>
                        </div>

                        {/* Interview Mode */}
                        <div>
                          <label className="text-sm font-medium">
                             Mode
                          </label>
                          <select
                            className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                            value={interviewMode}
                            onChange={(e) => setInterviewMode(e.target.value)}
                          >
                            <option value="">Select Mode</option>
                            <option>Office</option>
                             <option>Online</option>
                            <option>Phone Call</option>
                          </select>
                        </div>
                          {/* Show only when Online selected */}
                          {interviewMode === "Online" && (
                            <div className="mt-4">
                              <label className="text-sm font-medium">Meet Link</label>
                              <input
                                type="text"
                                placeholder="Enter Google Meet / Zoom link"
                                className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                                value={interviewLink}
                                onChange={(e) => setInterviewLink(e.target.value)}
                              />
                            </div>
                          )}
                        {/* Notes */}
                        <div>
                          <label className="text-sm text-gray-700">Notes</label>
                          <textarea
                            className="w-full border rounded-md p-2 mt-1 text-sm focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Enter instructions or notes..."
                            value={interviewNotes}
                            onChange={(e) => setInterviewNotes(e.target.value)}
                          />
                        </div>

                      <DialogFooter className="mt-3">
                        <Button
                          variant="outline"
                          onClick={() => setOpenSchedule(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={handleScheduleSubmit}
                        >
                          Schedule
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
        <Card className="h-full flex items-center justify-center border-dashed border-2 bg-gray-50">
          <CardContent className="text-center max-w-sm">

            {/* Icon Circle */}
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-white shadow-sm">
              <Users className="w-10 h-10 text-gray-400" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Candidate Selected
            </h3>

            {/* Description */}
            <p className="text-gray-500 text-sm mb-4">
              Select a candidate from the list to view their profile details,
              experience, and application status.
            </p>

            {/* Optional Hint */}
            <span className="text-xs text-gray-400">
              Tip: Use filters to quickly find the right candidate
            </span>

          </CardContent>
        </Card>
        )}
      </div>

      {/* moblie view */}
      {isMobile && (
        <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
          <DialogContent className="w-full h-full overflow-y-auto">

            {selectedCandidate && (
              <>

                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                             {selectedCandidate.profile_image ? (
                      <Image
                        src={selectedCandidate.profile_image}
                         alt="profile image"
                         width={32}
                         height={32}
                        className="w-16 h-16 rounded-full object-cover border"
                       />
                     ) : (
                      <User className="w-6 h-6 text-gray-700 hover:text-purple-600" />
                    )}
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                              {selectedCandidate.name}
                            </h2>
                            <p className="text-gray-600">
                              Gender: {
                                        selectedCandidate.gender
                                          ? selectedCandidate.gender.charAt(0).toUpperCase() +
                                            selectedCandidate.gender.slice(1)
                                          : ""
                                      }
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{selectedCandidate.location}</span>
                              </div>
                            </div>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Briefcase className="w-4 h-4 mr-1" />
                                <span>{selectedCandidate.experience}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          <Button variant="outline" size="sm">
                            {selectedCandidate.resumeUrl ? (
                              <a
                                href={selectedCandidate.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800 underline inline-flex items-center gap-1"
                              >
                                View Resume
                              </a>
                            ) : (
                              <span className="text-gray-400 italic">
                                No resume uploaded
                              </span>
                            )}
                          </Button>
                        </div>
                      </div>
                      {/* Contact Information */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{selectedCandidate.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">
                                +{selectedCandidate.phoneCode} {selectedCandidate.phone}
                              </span>
                            </div>
                        </div>
                      </div>

                      {/* Application Details */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Application Details
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Applied for:</span>
                              <p className="font-medium">
                                {selectedCandidate.appliedFor}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Application Date:</span>
                              <p className="font-medium">
                                {formatDate(selectedCandidate.appliedDate)}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-600">Status:</span>
                              <Badge
                                className={`ml-2 ${getStatusColor(
                                  selectedCandidate.status,
                                )}`}
                              >
                                {formatStatus(selectedCandidate.status)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Summary */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Professional Summary
                        </h3>
                        <div
                          className="text-gray-700 leading-relaxed prose max-w-none
                            [&_ul]:list-disc [&_ul]:pl-6
                            [&_ol]:list-decimal [&_ol]:pl-6
                            [&_li]:mb-1"
                          dangerouslySetInnerHTML={{ __html: selectedCandidate.professional_summary
                         || "" }}
                        />
                      </div>

                      {/* Skills */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCandidate.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-purple-100 text-purple-800"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Work Experience */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          Work Experience
                        </h3>
                        <div className="space-y-4">
                          {selectedCandidate.workExperience.map((exp, index) => (
                            <div
                              key={index}
                              className="border-l-2 border-purple-200 pl-4"
                            >
                              <h4 className="font-medium text-gray-900">{exp.role}</h4>
                              <p className="text-purple-600 font-medium">
                                {exp.category}
                              </p>
                              <p className="text-purple-600 font-medium">
                                {exp.company}
                              </p>
                            <p className="text-sm text-gray-600 mb-2">
                                Year: {formatDate(exp.start_date)} -{" "}
                                {exp.end_date ? formatDate(exp.end_date) : "Present"}
                              </p>
                              <div
                                className="text-gray-700 leading-relaxed prose max-w-none
                                  [&_ul]:list-disc [&_ul]:pl-6
                                  [&_ol]:list-decimal [&_ol]:pl-6
                                  [&_li]:mb-1"
                                dangerouslySetInnerHTML={{ __html: exp.description || "" }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Education */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Education</h3>
                        <div className="space-y-4">
                          {selectedCandidate.educationDetails.map((edu, index) => (
                            <div
                              key={index}
                              className="border-l-2 border-green-200 pl-4"
                            >
                              <h4 className="font-medium text-gray-900">
                                {edu.education}
                              </h4>
                              <p className="text-green-600 font-medium">{edu.course || "Course Details Not Available"}</p>
                              <p className="text-gray-600">{edu.institution}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span>
                                  Year: {edu.start_year} - {edu.end_year}
                                </span>
                                <span>
                                  Score
                                  : {edu.grade}({edu.score_type
                                    ? edu.score_type.charAt(0).toUpperCase() + edu.score_type.slice(1)
                                    : ""})
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Certifications */}
                      {Array.isArray(selectedCandidate.qa) &&
                        selectedCandidate.qa.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              Application Q&A
                            </h4>
                            <div className="space-y-3">
                              {selectedCandidate.qa.map((item, index) => (
                                <div key={index} className="bg-gray-50 rounded p-3">
                                  <p className="text-sm font-medium text-gray-800">
                                    Q{(item.question_index ?? index) + 1}.{" "}
                                    {item.question_text || "Question"}
                                  </p>
                                  <p className="text-sm text-gray-700 mt-1">
                                    {item.answer_text || "-"}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {selectedCandidate.certifications.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">
                            Certifications
                          </h3>
                          <div className="space-y-3">
                            {selectedCandidate.certifications.map((cert, index) => (
                              <div
                                key={index}
                                className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg"
                              >
                                <Award className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div>
                                  <h4 className="font-medium text-gray-900">
                                    {cert.name}
                                  </h4>
                                  <p className="text-yellow-600 font-medium">
                                    {cert.issuer}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Issued: {cert.year}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowResume((prev) => !prev)}
                      >
                        View Resume
                      </Button>

                      {showResume && selectedCandidate?.resumeUrl && (
                        <div className="mt-4 h-[500px] border rounded">
                          <iframe
                            src={`https://docs.google.com/gview?url=${encodeURIComponent(
                              selectedCandidate.resumeUrl,
                            )}&embedded=true&timestamp=${Date.now()}`}
                            className="w-full h-full"
                            title="Resume Preview"
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                          {/* UNDER REVIEW */}
                          {selectedCandidate?.status === "Under Review" && (
                            <>
                              <Button
                                className="bg-green-600 hover:bg-green-700 flex-1"
                                onClick={() =>
                                  handleShortlistCandidate(selectedCandidate)
                                }
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Shortlist Candidate
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="border-red-600 text-red-600 hover:bg-red-50 flex-1"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject Application
                                  </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Reject this application?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. The candidate will
                                      be marked as rejected.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>

                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={() =>
                                        handleRejectCandidate(selectedCandidate)
                                      }
                                    >
                                      Yes, Reject
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}

                          {/* SHORTLISTED */}
                          {selectedCandidate?.status === "shortlisted" && (
                            <Button
                              variant="outline"
                              className="flex-1 border-blue-600 text-blue-600"
                              onClick={() => handleScheduleInterview(selectedCandidate)}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Schedule Interview
                            </Button>
                          )}

                          {/* REJECTED */}
                          {selectedCandidate?.status === "rejected" && (
                            <Button
                              disabled
                              variant="outline"
                              className="border-red-600 text-red-600 flex-1 opacity-50 cursor-not-allowed"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Application Rejected
                            </Button>
                          )}
                        </div>

                        {openSchedule && (
                          <Dialog
                            open={openSchedule}
                            onOpenChange={() => setOpenSchedule(false)}
                          >
                            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto rounded-xl">
                              <DialogHeader>
                                <DialogTitle className="text-lg font-semibold">
                                  Schedule Interview
                                </DialogTitle>
                              </DialogHeader>

                              <div className="space-y-4 mt-3">
                                {/* Candidate Name */}
                                <div className="bg-gray-50 p-3 rounded-lg border">
                                  <p className="text-xs text-gray-500">Candidate</p>
                                  <p className="font-semibold text-gray-800">
                                    {selectedCandidate?.name}
                                  </p>
                                </div>

                                {/* Candidate Email */}
                                <div className="bg-gray-50 p-3 rounded-lg border">
                                  <p className="text-xs text-gray-500">Email</p>
                                  <p className="font-semibold text-gray-800">
                                    {selectedCandidate?.email}
                                  </p>
                                </div>

                                {/* Interview Date */}
                                <div>
                                  <label className="text-sm font-medium">
                                    Interview Date
                                  </label>
                                  {/* <input
                                    required
                                    type="date"
                                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                                    value={interviewDate}
                                    onChange={(e) => setInterviewDate(e.target.value)}
                                  /> */}
                                    <div className="relative mt-1">
                                    <input
                                      required
                                      type="text"
                                      placeholder="DD/MM/YYYY"
                                      maxLength={10}
                                      value={interviewInput}
                                      onChange={(e) => {
                                        const raw = e.target.value;

                                        if (!raw) {
                                          setInterviewInput("");
                                          setInterviewError("");
                                          setInterviewDate("");
                                          return;
                                        }

                                        const { formatted, parsed, error } = formatDeadline(raw);

                                        setInterviewInput(formatted);

                                        if (error) {
                                          setInterviewError(error);
                                          setInterviewDate("");
                                          return;
                                        }

                                        if (formatted.length < 10) {
                                          setInterviewError("");
                                          setInterviewDate("");
                                          return;
                                        }

                                        if (!parsed.isValid()) {
                                          setInterviewError("Invalid date");
                                          setInterviewDate("");
                                          return;
                                        }

                                        if (parsed.isBefore(dayjs(), "day")) {
                                          setInterviewError("Past date not allowed");
                                          setInterviewDate("");
                                          return;
                                        }

                                        setInterviewError("");
                                        setInterviewDate(parsed.format("DD/MM/YYYY")); // ✅ final value
                                      }}
                                      className={`w-full h-[44px] px-3 pr-10 text-sm border rounded-md outline-none
                                        ${
                                          interviewError
                                            ? "border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:ring-blue-500"
                                        }
                                      `}
                                    />

                                    {/* CALENDAR */}
                                    <div ref={calendarRef} className="absolute right-2 top-1/2">
                                      <button
                                        type="button"
                                        onClick={() => setOpen((prev) => !prev)}
                                      >
                                        <Calendar size={18} />
                                      </button>

                                      {open && (
                                        <div className="absolute right-0 mt-2 z-50 bg-white shadow-lg rounded">
                                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DateCalendar
                                              value={
                                                interviewDate
                                                  ? dayjs(interviewDate, "DD/MM/YYYY")
                                                  : null
                                              }
                                              minDate={dayjs()}
                                              onChange={(newValue) => {
                                                if (!newValue) return;

                                                const formatted = newValue.format("DD/MM/YYYY");

                                                setInterviewInput(formatted);
                                                setInterviewDate(formatted);

                                                setOpen(false);
                                              }}
                                            />
                                          </LocalizationProvider>
                                        </div>
                                      )}
                                    </div>
                                    </div>
                                </div>

                                <div className="flex flex-col space-y-3 relative">
                                  <label className="text-sm font-medium">Time</label>

                                  {/* ✅ Input + Timezone */}
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      readOnly
                                      value={time ? time.format("hh:mm A") : ""}
                                      onClick={() => setTimeopen(!timeopen)}
                                      className="border rounded-lg p-2 w-40 bg-gray-100 cursor-pointer"
                                      placeholder="Select time"
                                    />

                                    {/* Timezone */}
                                    <select
                                      className="border rounded-lg p-2"
                                      value={timeZone}
                                      onChange={(e) => setTimeZone(e.target.value)}
                                    >
                                      <option value="IST">IST</option>
                                      <option value="UTC">UTC</option>
                                      <option value="EST">EST</option>
                                      <option value="PST">PST</option>
                                      <option value="CST">CST</option>
                                    </select>
                                  </div>

                                  {timeopen && (
                                    <div ref={timeRef} className="absolute top-20 z-50 bg-white border rounded-xl shadow-lg p-3">
                                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DigitalClock
                                          value={time}
                                          onChange={(newValue) => {
                                            setTime(newValue);
                                              if (newValue) {
                                                    setInterviewTime(newValue.format("hh:mm A"));
                                                  }
                                            setTimeopen(false);
                                          }}
                                          ampm
                                        />
                                      </LocalizationProvider>
                                    </div>
                                  )}
                                  </div>
                                </div>

                                {/* Interview Mode */}
                                <div>
                                  <label className="text-sm font-medium">
                                    Mode
                                  </label>
                                  <select
                                    className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                                    value={interviewMode}
                                    onChange={(e) => setInterviewMode(e.target.value)}
                                  >
                                    <option value="">Select Mode</option>
                                    <option>Office</option>
                                    <option>Online</option>
                                    <option>Phone Call</option>
                                  </select>
                                </div>
                                  {/* Show only when Online selected */}
                                  {interviewMode === "Online" && (
                                    <div className="mt-4">
                                      <label className="text-sm font-medium">Meet Link</label>
                                      <input
                                        type="text"
                                        placeholder="Enter Google Meet / Zoom link"
                                        className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                                        value={interviewLink}
                                        onChange={(e) => setInterviewLink(e.target.value)}
                                      />
                                    </div>
                                  )}
                                {/* Notes */}
                                <div>
                                  <label className="text-sm text-gray-700">Notes</label>
                                  <textarea
                                    className="w-full border rounded-md p-2 mt-1 text-sm focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    placeholder="Enter instructions or notes..."
                                    value={interviewNotes}
                                    onChange={(e) => setInterviewNotes(e.target.value)}
                                  />
                                </div>

                              <DialogFooter className="mt-3">
                                <Button
                                  variant="outline"
                                  onClick={() => setOpenSchedule(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={handleScheduleSubmit}
                                >
                                  Schedule
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
              </>
            )}
          <button
              onClick={() => setSelectedCandidate(null)}
              className="text-xl"
            >
              ← Back to Candidates
            </button>
          </DialogContent>
        </Dialog>
      )}
      </div>
    </div>
    </>

  );
}
