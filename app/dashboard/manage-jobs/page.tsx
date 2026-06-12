"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter} from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  MapPin,
  Clock,
  Users,
  Briefcase,
  Plus,
  Search,
  Calendar,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  Share2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import AdminExcelUpload from "@/components/AdminExcelUpload";
import DownloadJobTemplate from "@/components/DownloadJobTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Selectt from "react-select";
import AsyncSelect from "react-select/async";
import dayjs from "dayjs";
// import ReactDatePicker from "react-datepicker";
import TiptapEditor from "@/components/TiptapEditor";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const ManageJobs = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobId = searchParams.get("id");
  const [activeTab, setActiveTab] = useState("post-job");
  const [postedJobs, setPostedJobs] = useState<PostedJob[]>([]);
  const [dateFilter, setDateFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedJob, setSelectedJob] = useState<PostedJob | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [askQuestionEnabled, setAskQuestionEnabled] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<OptionType | null>(
    null,
  );
  const [selectedJobTitle, setSelectedJobTitle] = useState<OptionType | null>(
    null,
  );
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);
  const [deadlineInput, setDeadlineInput] = useState("");
  const [deadlineError, setDeadlineError] = useState("");
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [jobForm, setJobForm] = useState<JobForm>({
    title: "",
    category: "",
    job_title: "",
    company: "",
    location: "",
    experience: "",
    max_experience:"",
    min_experience:"",
    salary: "",
    salary_max: "",
    currency_id: "",
    currencyCode: "INR",
    currencyLabel: "",
    job_type: [] as string[],
    work_mode: "",
    description: "",
    requirements: "",
    benefits: "",
    skills: [],
    application_deadline: "",
    vacancies: "",
    isUrgent: false,
    isRemote: false,
    questions: [],
    website_apply: "",
  });
  const [websiteEnabled, setWebsiteEnabled] = useState(
  !!jobForm.website_apply
  );
  interface JobForm {
    title: string;
    category: string;
    job_title: string;
    company: string;
    location: string;
    experience: string;
    max_experience: string;
    min_experience: string;
    salary: string;
    salary_max: string;
    currency_id: string;
    currencyCode?: "INR" | "USD";
    currencyLabel?: string;
    job_type: string[];
    work_mode: string;
    description: string;
    requirements: string;
    benefits: string;
    skills: string[];
    application_deadline: string;
    vacancies: string;
    isUrgent: boolean;
    isRemote: boolean;
    questions: string[];
    website_apply: string;
  }
  interface PostedJob {
    id: number;
    title: string;
    job_title: number;
    company: string;
    location_id: number;
    experience: string;
    max_experience: string;
    min_experience: string;
    salary: string;
    salary_max: string;
    currency: {
      value: string;
      label: string;
      code: string;
      symbol_native: string;
    };
    currencyCode?: "INR" | "USD";
    job_type: string | string[];
    work_mode: string;
    vacancies: number;
    application_deadline: string;
    description: string;
    requirements: string;
    benefits: string;
    skills: string[];
    is_urgent: boolean;
    is_remote: boolean;
    status: string;
    location?: string;
    created_at?: string;
    applicants?: number;
    apply_clicks?: number;
    questions?: string[];
    website_apply?: string;
  }
  interface Candidate {
    id: number;
    name: string;
    email: string;
    phone: string;
    location: string;
    experience: string;
    currentRole: string;
    currentCompany: string;
    skills: string[];
    education: string;
    appliedFor: string;
    job_title?: string;
    appliedDate: string;
    status: string;
    expectedSalary?: string;
    resumeUrl?: string;
    profileImage?: string | null;
    summary?: string;
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
      start_year?: string;
      end_year?: string;
      grade?: string;
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
  interface ApiCandidate {
    id: number;
    full_name?: string;
    email?: string;
    phone?: string;
    city?: string;
    experience?: string;
    job_title?: string;
    application_status?: string;
    applied_at?: string;

    profile?: {
      full_name?: string;
      phone?: string;
      experience?: string;
      resume?: string;
      skills?: { name: string }[];
      educations?: any[];
      experiences?: any[];
      certifications?: any[];
    };

    answers?: {
      question_index: number;
      question_text: string;
      answer: string;
    }[];
  }
  type CurrencyOption = {
  label: string;
  value: string;
  code: string;
  name: string;
  symbol: string;
};
  interface OptionType {
    label: string;
    value: string;
  }
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const experienceOptions = [
    "0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20+",
  ];
  useEffect(() => {
    const role = localStorage.getItem("admin_role");

    if (role === "admin") {
      setIsAdmin(true);
    }
  }, []);
  const fetchPostedJobs = async (page = 1, search = "", status = "all",date = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("employeer_token");
      if (!token) return;
      const query = new URLSearchParams({
      page: page.toString(),
      search: searchTerm,
      status: jobFilter,
      date_filter: dateFilter,
    });
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/job-list-view/?${query.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        console.error("Failed to fetch jobs");
        return;
      }
      const data = await response.json();
      console.log("Here is the Job-list-view-data:",data)
      setPostedJobs(data.results);
      setCurrentPage(page);
      setTotalPages(Math.ceil(data.count / 3));
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
       setLoading(false);
    }
  };

  // Fetch data from APIs
  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    fetchPostedJobs(1, searchTerm, jobFilter, dateFilter);
  }, 500);

  return () => clearTimeout(delayDebounce);
}, [searchTerm, jobFilter, dateFilter]);

// useEffect(() => {
//   const role = localStorage.getItem("admin_role");

//   if (role === "admin") {
//     setIsAdmin(true);
//   }
// }, []);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Shortlisted":
        return "bg-blue-100 text-blue-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const handleApplicationsClick = async (jobId: number) => {
    try {
      const token = localStorage.getItem("employeer_token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/employer/applications/job/${jobId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      // console.log("API RAW DATA:", data);

      if (!Array.isArray(data)) {
        console.error("API did not return list:", data);
        toast.error("Failed to load candidates! (Unauthorized?)", {
          description:
            "You might not have permission. Please log in or check your access.",
        });
        return;
      }

      const mappedCandidates: Candidate[] = data.map(mapApiCandidateToUI);

      setCandidates(mappedCandidates);
      console.log("Mapped Candidates:", mappedCandidates);
      setActiveTab("candidates");
    } catch (error) {
      console.error(error);
    }
  };
  const mapApiCandidateToUI = (item: ApiCandidate): Candidate => {
    const experiences = item.profile?.experiences ?? [];
    const educations = item.profile?.educations ?? [];

    return {
      id: item.id,
      name: item.profile?.full_name || item.full_name || "",
      email: item.email || "",
      phone: item.profile?.phone || "",
      location: item.city || "",
      experience: item.profile?.experience || item.experience || "",

      currentRole: experiences[0]?.designation || item.job_title || "",

      currentCompany: experiences[0]?.company || "",

      skills: item.profile?.skills?.map((s) => s.name) || [],

      education: educations[0]?.degree || "",

      appliedFor: item.job_title || "",

      job_title: item.job_title,

      appliedDate: item.applied_at || "",

      status: item.application_status || "Under Review",

      resumeUrl: item.profile?.resume,

      profileImage: null,
      summary: "",

      workExperience: experiences.map((ex: any) => ({
        company: ex.company || "",
        role: ex.designation || "",
        duration: `${String(ex.start_date ?? "")} - ${String(
          ex.end_date ?? "Present",
        )}`,
        description: ex.description,
      })),

      educationDetails: educations.map((e: any) => ({
        education: e.degree || "",
        courd: e.field || "",
        institution: e.institution || "",
        year: String(e.year ?? ""),
        grade: e.grade,
      })),

      certifications:
        item.profile?.certifications?.map((c: any) => ({
          name: c.name || "",
          issuer: c.issuer,
          year: c.year ? String(c.year) : undefined,
        })) || [],
    };
  };
  const handleViewJob = async (job: any) => {
    try {
      const token = localStorage.getItem("employeer_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/job-list-view/${job.id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      // console.log("Job details:", data);
      setSelectedJob(data);
      setIsEditMode(false);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching job details", err);
    }
  };
  const handleEditJob = async (job: any) => {
    try {
      const token = localStorage.getItem("employeer_token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/job-list-view/${job.id}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await response.json();
      // console.log("Data is prefill", data);
      // Prefill the form
      setJobForm({
        title: data.title || "",
        category: data.category?.name?.toString() || data.category || "",
        job_title: data.job_title?.id?.toString() || data.job_title || "",
        company: data.company || "",
        location: data.location?.toString() || data.location || "",
        experience: data.experience || "",
        max_experience:data.max_experience || "",
        min_experience:data.min_experience || "",
        salary: data.salary || "",
        salary_max: data.salary_max || "",
        currency_id: data.currency?.id?.toString() || data.currency || "",
        currencyCode: "INR",
        currencyLabel: data.currency?.code || "",
        job_type: Array.isArray(data.job_type)
        ? data.job_type.map((type: string) =>
            type.toLowerCase().replace(/\s+/g, "-")
          )
        : [],
        work_mode: data.work_mode || "",
        description: data.description || "",
        requirements: data.requirements || "",
        benefits: data.benefits || "",
        skills: data.skills || [],
        application_deadline: data.application_deadline || "",
        vacancies: data.vacancies || "",
        isUrgent: data.is_urgent || false,
        isRemote: data.is_remote || false,
        questions: data.questions || [],
        website_apply: data.website_apply || "",
      });
      setQuestions(data.questions || []);
      setAskQuestionEnabled(data.questions && data.questions.length > 0);

      setSelectedJob(data);
      setIsEditMode(true);
    } catch (err) {
      console.error("Error fetching job details for edit", err);
    }
  };
  useEffect(() => {
  if (jobForm.website_apply) {
    setWebsiteEnabled(true);
  } else {
    setWebsiteEnabled(false);
  }
}, [jobForm.website_apply]);
  const handleToggleJobStatus = async (job: any) => {
    const token = localStorage.getItem("employeer_token");

    if (!token) {
      toast.error("You are not logged in. Please log in again.", {
        description: "Your session may have expired.",
      });
      return;
    }

    const newStatus =
      job.status.toLowerCase() === "active" ? "closed" : "active";

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/employeer/job-postings/${job.id}/update/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        setPostedJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j)),
        );
        toast.success(`Job status changed to: ${newStatus}`);
      } else {
        console.error("Failed to update job status:", result);

        toast.error(result.detail || "Failed to update job status", {
          description: "Please check and try again.",
        });
      }
    } catch (err) {
      console.error("Error updating job status:", err);
      toast.error("Network error. Please try again.");
    }
  };
  const handleDeleteJob = async (job: any) => {
  const token = localStorage.getItem("employeer_token");

  if (!token) {
    toast.error("Authentication required", {
      description: "Please login again.",
    });
    return;
  }

  const confirmDelete = window.confirm(
    `Are you sure you want to delete the job: ${job.title}?`
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/employeer/job-postings/${job.id}/delete/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Response body read karo
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      // UI se remove karo
      setPostedJobs((prev) => prev.filter((j) => j.id !== job.id));

      toast.success("Job deleted", {
        description: `The job "${job.title}" has been successfully removed.`,
      });
    } else {
      console.error("Delete failed:", data);

      toast.error("Failed to delete job", {
        description:
          data.detail ||
          data.error ||
          data.message ||
          "Please try again or check your internet connection.",
      });
    }
  } catch (err) {
    console.error("Error deleting job:", err);

    toast.error("Something went wrong", {
      description: "Unable to delete the job.",
    });
  }
};
  const getWorkModeColor = (work_mode: string) => {
    switch (work_mode) {
      case "Remote":
        return "bg-green-100 text-green-800";
      case "Hybrid":
        return "bg-blue-100 text-blue-800";
      case "Office":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getTimeSincePosted = (postedDate: string) => {
    const now = new Date().getTime();
    const posted = new Date(postedDate).getTime();
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
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
  const handleUpdateJob = async () => {
     const minSalary = Number(parseNumber(String(jobForm.salary)));
        const maxSalary = Number(parseNumber(String(jobForm.salary_max)));

        if (minSalary && maxSalary && minSalary > maxSalary) {
          toast.error("Minimum salary cannot be greater than maximum salary");
          return;
        }
        if (websiteEnabled) {
            if (!jobForm.website_apply?.trim()) {
              toast.error("Website Checkbox Enabled but URL is empty.");
              return;
            }
          }
    console.log("Updating job with data:", jobForm);
    if (!selectedJob?.id) {
      toast.error("No job selected for update", {
        description: "Please select a job and try again.",
      });
      return;
    }

    try {
      const token = localStorage.getItem("employeer_token");
      if (!token) {
        toast.error("You must be logged in to update a job.", {
          description: "Please log in and try again.",
        });
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/employeer/job-postings/${selectedJob.id}/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(jobForm),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update job:", errorData);
        // toast.error(`Error: ${errorData.detail || "Unable to update job"}`, {
        //   description: "Please try again or check your network connection.",
        // });
        if (errorData?.website_apply?.length > 0) {
                  toast.error(errorData.website_apply[0]);
                  return;
                }
                else{
                  toast.error(`Error: ${errorData.detail || "Unable to update job"}`, {
          description: "Please try again or check your network connection.",
        });
                return;
                }
        // return;
      }

      const updatedJob = await response.json();

      // Update the state with the new job data
      setPostedJobs((prevJobs) =>
        prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)),
      );

      setIsEditMode(false); // Close the dialog

      toast.success("Job updated successfully!");
    } catch (err) {
      console.error("Update job error:", err);
      toast.error("An error occurred while updating the job.", {
        description: "Please try again or check your network connection.",
      });
    }
  };

  const getJobCategoryOptions = async (inputValue: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/jobs_category?q=${inputValue || ""}`,
      );

      const data = await res.json();

      return data.map((category: any) => ({
        label: category.name,
        value: category.name,
      }));
    } catch (error) {
      console.error("Error fetching job categories:", error);
      return [];
    }
  };
  const getJobTitlesOptions = async (inputValue: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/jobs_title/?q=${inputValue || ""}`,
      );

      const data = await res.json();

      return data.map((title: any) => ({
        label: title.title,
        value: title.title,
      }));
    } catch (error) {
      console.error("Error fetching job titles:", error);
      return [];
    }
  };
  const loadCountryOptions = async (inputValue: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_MASTER}/locations/search/?q=${inputValue || ""}`,
      );

      const data = await res.json();

      return data.map((country: any) => ({
        label: country.name,
        value: country.name,
      }));
    } catch (error) {
      console.error("Error fetching countries:", error);
      return [];
    }
  };
  const getSelectedLocation = () => {
    if (!jobForm.location) return null;

    return {
      label: jobForm.location,
      value: jobForm.location,
    };
  };
 const getCurrencyOptions = async (inputValue: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_MASTER}/currencies`
    );

    const data = await res.json();

    const options = data
      .filter(
        (curr: any) =>
          curr.code.toLowerCase().includes(inputValue.toLowerCase()) ||
          curr.name.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((curr: any) => ({
        label: curr.code,
        value: String(curr.id),
        code: curr.code,
        name: curr.name,
        symbol: curr.symbol,
      }));

    setCurrencyOptions(options); // ⭐ IMPORTANT
    return options;
  } catch (error) {
    console.error("Error fetching currencies:", error);
    return [];
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
      const isLeapYear = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

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
      const parsedCheck = dayjs(`${day}/${month}/${year}`, "DD/MM/YYYY", true);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleAddSkill = () => {
    if (newSkill.trim() && !jobForm.skills.includes(newSkill.trim())) {
      setJobForm((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setJobForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };
    const jobTypeOptions = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];
const handleAddQuestion = () => {
    if (newQuestion.trim() && !jobForm.questions.includes(newQuestion.trim())) {
      const updated = [...jobForm.questions, newQuestion.trim()];
      setJobForm((prev) => ({ ...prev, questions: updated }));
      setQuestions(updated); // ✅ keep them in sync
      setNewQuestion("");
    }
  };

  const handleRemoveQuestion = (indexToRemove: number) => {
    const updated = jobForm.questions.filter(
      (_, index) => index !== indexToRemove,
    );
    setJobForm((prev) => ({ ...prev, questions: updated }));
    setQuestions(updated);
  };
  const handleShare = (job: any) => {
  const shareUrl = `${window.location.origin}/job-details?id=${job.id}`;

  if (navigator.share) {
    navigator.share({
      title: job.title,
      text: `Check out this job at ${job.company}`,
      url: shareUrl,
    });
  } else {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Job link copied to clipboard");
  }
};
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>Manage Your Jobs</CardTitle>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <DownloadJobTemplate />
                <AdminExcelUpload
                  onUploadSuccess={fetchPostedJobs}
                  triggerButton={
                  <Button
                  className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-5 py-2 font-medium shadow"
                   >
                  Upload Excel
                  </Button>
                   }
                />
              {/* Date Filter */}
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Filter by Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Date</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>

              {/* Job Filter */}
              <Select value={jobFilter} onValueChange={setJobFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              {/* Search */}
              <div className="relative w-full sm:w-56 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              [...Array(2)].map((_, i) => (
                <div key={i} className="border rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                </div>
              ))
            ) : postedJobs.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600">
                  {searchTerm || jobFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Start by posting your first job."}
                </p>
              </div>
            ) : (
              postedJobs.map((job) => (
                <div
                  key={job.id}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-purple-600 font-medium mb-2">
                        {job.company}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        <span>
                          {job.min_experience === "0" && job.max_experience === "0"
                            ? "Fresher"
                            : `${job.min_experience} - ${job.max_experience} ${
                                job.min_experience === job.max_experience &&
                                job.min_experience === "1"
                                  ? "Year"
                                  : "Years"
                              }`}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span>
                          {(() => {
                            const symbol = job.currency?.symbol_native || "";

                            const minSalary = job.salary
                              ? `${symbol}${formatNumber(job.salary, job.currency?.code)}`
                              : "";

                            const maxSalary = job.salary_max
                              ? `${symbol}${formatNumber(job.salary_max, job.currency?.code)}`
                              : "";

                            if (minSalary && maxSalary) {
                              return `${minSalary} - ${maxSalary} / yr`;
                            }

                            if (minSalary) {
                              return `${minSalary} / yr`;
                            }

                            if (maxSalary) {
                              return `${maxSalary} / yr`;
                            }

                            return "Salary - Not Disclosed";
                          })()}
                        </span>
                      </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>
                            Posted:{" "}
                            {job.created_at
                              ? new Date(job.created_at).toLocaleDateString(
                                  "en-GB",
                                )
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div
                          className="flex items-center text-blue-600 cursor-pointer"
                          onClick={() => handleApplicationsClick(job.id)}
                        >
                          <Users className="w-4 h-4 mr-1" />
                          <span>{job.applicants || 0} Applications</span>
                        </div>

                        <div className="flex items-center text-green-600">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>{job.apply_clicks || 0} Views</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewJob(job)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditJob(job)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewJob(job)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditJob(job)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Job
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleJobStatus(job)}
                          >
                            {job.status?.toLowerCase() === "active" ||
                            job.status?.toLowerCase() === "open" ? (
                              <>
                                <XCircle className="w-4 h-4 mr-2 text-red-500" />
                                Close Job
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                Activate Job
                              </>
                            )}
                          </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare(job)}>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          {(job.applicants || 0) === 0 && (
                          <DropdownMenuItem
                            onClick={() => handleDeleteJob(job)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Job
                          </DropdownMenuItem>
                        )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/*  Job Details Modal  */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {selectedJob.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Company Info */}
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-purple-600 mb-1">
                      {selectedJob.company}
                    </h3>
                    {/* <p className="text-gray-600 mb-2">{selectedJob.companyInfo.about}</p> */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>Openings : {selectedJob.vacancies}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{selectedJob.location}</span>
                  </div>
                   <div className="flex items-center text-gray-600">
                        <Briefcase className="w-4 h-4 mr-2" />
                        <span>
                          {selectedJob.min_experience === "0" && selectedJob.max_experience === "0"
                            ? "Fresher"
                            : `${selectedJob.min_experience} - ${selectedJob.max_experience} ${
                                selectedJob.min_experience === selectedJob.max_experience &&
                                selectedJob.min_experience === "1"
                                  ? "Year"
                                  : "Years"
                              }`}
                        </span>
                   </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-4 h-6 ">{selectedJob.currency?.symbol_native}</span>
                    <span>
                       {(() => {
                            const minSalary = selectedJob.salary
                              ? formatNumber(selectedJob.salary, selectedJob.currency?.code)
                              : "";

                            const maxSalary = selectedJob.salary_max
                              ? formatNumber(selectedJob.salary_max, selectedJob.currency?.code)
                              : "";

                            if (minSalary && maxSalary) {
                              return `${minSalary} - ${maxSalary} / yr`;
                            }

                            if (minSalary) {
                              return `${minSalary} / yr`;
                            }

                            if (maxSalary) {
                              return `${maxSalary} / yr`;
                            }

                            return "Salary - Not Disclosed";
                          })()}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                   <span>
                          {Array.isArray(selectedJob.job_type)
                            ? selectedJob.job_type
                                .map(
                                  (type: string) =>
                                    type
                                      .split("-")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1).toLowerCase()
                                      )
                                      .join(" ")
                                )
                                .join(", ")
                            : selectedJob.job_type
                                ?.split("-")
                                .map(
                                  (word: string) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1).toLowerCase()
                                )
                                .join(" ")}
                        </span>
                </div>
                  <div className="flex items-center text-gray-600">
                    <Building2 className="w-4 h-4 mr-2" />
                    <Badge className={getWorkModeColor(selectedJob.work_mode ?? "")}>
                      {selectedJob.work_mode
                        ? selectedJob.work_mode.charAt(0).toUpperCase() +
                          selectedJob.work_mode.slice(1).toLowerCase()
                        : ""}
                    </Badge>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                            {selectedJob.created_at
                              ? new Date(selectedJob.created_at).toLocaleDateString(
                                  "en-GB",
                                )
                              : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Job Description
                </h4>
               <div
                  className="prose max-w-none text-gray-700
                            [&_ul]:list-disc [&_ul]:pl-6
                            [&_ol]:list-decimal [&_ol]:pl-6
                            [&_li]:mb-1"
                  dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                />
              </div>

              {/* Requirements */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Requirements
                </h4>
                 <div
                  className="prose max-w-none text-gray-700
                    [&_ul]:list-disc [&_ul]:pl-6
                    [&_ol]:list-decimal [&_ol]:pl-6
                    [&_li]:mb-1"
                  dangerouslySetInnerHTML={{ __html: selectedJob.requirements }}
                />
              </div>

              {/* Benefits */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Benefits
                </h4>
                <div
                  className="prose max-w-none text-gray-700
                    [&_ul]:list-disc [&_ul]:pl-6
                    [&_ol]:list-decimal [&_ol]:pl-6
                    [&_li]:mb-1"
                  dangerouslySetInnerHTML={{ __html: selectedJob.benefits }}
                />
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills?.map((skill, index) => (
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

              {/* questions */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Questions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.questions && selectedJob.questions.length > 0 ? (
                    selectedJob.questions?.map((question, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        {question}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No questions added</p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* FIX: THE Values are not showing, Preset the Value */}
      <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Edit Job Profile
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <Label>Job Title *</Label>
              <Input
                name="title"
                value={jobForm.title || ""}
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    [e.target.name]: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Job Category *</Label>
              <AsyncSelect
                cacheOptions
                defaultOptions
                placeholder="e.g., Accounting"
                loadOptions={getJobCategoryOptions}
                value={
                  selectedCategory ||
                  (jobForm.category
                    ? { label: jobForm.category, value: jobForm.category }
                    : null)
                }
                onChange={(selectedOption: OptionType | null) => {
                  setSelectedCategory(selectedOption);

                  setJobForm((prev) => ({
                    ...prev,
                    category: selectedOption?.value || "",
                    job_title: "",
                  }));
                }}
                isClearable
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                Specific Job Title *
              </Label>

              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={getJobTitlesOptions}
                placeholder="Search job title..."
                value={
                  selectedJobTitle ||
                  (jobForm.job_title
                    ? { label: jobForm.job_title, value: jobForm.job_title }
                    : null)
                }
                onChange={(selected: OptionType | null) => {
                  setSelectedJobTitle(selected);

                  setJobForm((prev) => ({
                    ...prev,
                    job_title: selected ? selected.value : "",
                  }));
                }}
                isClearable
              />
            </div>
            <div>
              <Label>Company Name *</Label>
              <Input
                name="company"
                value={jobForm.company || ""}
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    [e.target.name]: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Location *</Label>

              <AsyncSelect
                required
                cacheOptions
                defaultOptions
                loadOptions={loadCountryOptions}
                value={getSelectedLocation()}
                onChange={(selected: any) => {
                  setJobForm((prev) => ({
                    ...prev,
                    location: selected?.value || "",
                  }));
                }}
                isClearable
                placeholder="Search Location..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Min Experience */}
              <div>
                <Label className="text-sm font-medium">
                  Minimum Experience *
                </Label>

                <Select
                  value={jobForm.min_experience}
                  onValueChange={(value) =>
                    setJobForm((prev) => ({
                      ...prev,
                      min_experience: value,
                      max_experience: "",
                    }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select minimum experience" />
                  </SelectTrigger>

                  <SelectContent>
                    {experienceOptions.map((exp) => (
                      <SelectItem key={exp} value={exp}>
                        {exp === "20+"
                          ? "20+ Years"
                          : `${exp} Year${exp === "1" ? "" : "s"}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Max Experience */}
              <div>
                <Label className="text-sm font-medium">
                  Maximum Experience *
                </Label>

                <Select
                  value={jobForm.max_experience}
                  onValueChange={(value) =>
                    setJobForm((prev) => ({
                      ...prev,
                      max_experience: value,
                    }))
                  }
                  disabled={!jobForm.min_experience}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select maximum experience" />
                  </SelectTrigger>

                  <SelectContent>
                    {experienceOptions
                      .filter(
                        (exp) =>
                          experienceOptions.indexOf(exp) >=
                          experienceOptions.indexOf(
                            jobForm.min_experience || "0"
                          )
                      )
                      .map((exp) => (
                        <SelectItem key={exp} value={exp}>
                          {exp === "20+"
                            ? "20+ Years"
                            : `${exp} Year${exp === "1" ? "" : "s"}`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="salary" className="text-sm font-medium">
                Salary Range (Annual)
              </Label>
              <div className="flex gap-2 mt-1">
                <AsyncSelect
                  cacheOptions
                  defaultOptions
                  placeholder="Currency"
                  loadOptions={getCurrencyOptions}
                  value={
                    jobForm.currency_id
                      ? {
                          value: jobForm.currency_id,
                          label: jobForm.currencyLabel,
                        }
                      : null
                  }
                  onChange={(selectedOption: any) => {
                    setJobForm((prev) => ({
                      ...prev,
                      currency_id: selectedOption?.value || "",
                      currencyCode: selectedOption?.code || "INR",
                      currencyLabel: selectedOption?.label || "",
                    }));
                  }}
                  // isClearable
                />
                <Input
                  type="text"
                  id="salary"
                  value={formatNumber(jobForm.salary, jobForm.currencyCode)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    const allowedKeys = [
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ];

                    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const rawValue = parseNumber(e.target.value);

                    if (!isNaN(Number(rawValue))) {
                      setJobForm((prev) => ({
                        ...prev,
                        salary: rawValue,
                      }));
                    }
                  }}
                  placeholder="Min Salary"
                  className="flex-1"
                />
                -
                <Input
                  type="text"
                  id="salary_max"
                  value={formatNumber(jobForm.salary_max, jobForm.currencyCode)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    const allowedKeys = [
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ];

                    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const rawValue = parseNumber(e.target.value);

                    if (!isNaN(Number(rawValue))) {
                      setJobForm((prev) => ({
                        ...prev,
                        salary_max: rawValue,
                      }));
                    }
                  }}
                  placeholder="Max Salary"
                  className="flex-1"
                />
              </div>
            </div>

                        <div>
                         <Label className="text-sm font-medium">Work Mode</Label>
                         <Select
                           value={jobForm.work_mode}
                           onValueChange={(value) =>
                             setJobForm((prev) => ({ ...prev, work_mode: value }))
                           }
                         >
                           <SelectTrigger className="mt-1">
                             <SelectValue placeholder="Select work mode" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="office">Work from Office</SelectItem>
                             <SelectItem value="remote">Work from Home</SelectItem>
                             <SelectItem value="hybrid">Hybrid</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
            <div className="w-full">
              <label className="text-sm font-medium">
                Application Deadline *
              </label>

              <div className="relative mt-1">
                <input
                  required
                  type="text"
                  placeholder="DD/MM/YYYY"
                  maxLength={10}
                  value={deadlineInput || jobForm.application_deadline || ""}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (!raw) {
                      setDeadlineInput("");
                      setDeadlineError("");
                      setDeadlineDate(null);

                      setJobForm((prev) => ({
                        ...prev,
                        application_deadline: "",
                      }));
                      return;
                    }

                    const { formatted, parsed, error } = formatDeadline(raw);
                    setDeadlineInput(formatted);

                    if (error) {
                      setDeadlineError(error);
                      setDeadlineDate(null);
                      return;
                    }

                    if (formatted.length < 10) {
                      setDeadlineError("");
                      setDeadlineDate(null);
                      setJobForm((prev) => ({
                        ...prev,
                        application_deadline: "",
                      }));
                      return;
                    }

                    if (!parsed.isValid()) {
                      setDeadlineError("Invalid date");
                      setDeadlineDate(null);
                      return;
                    }

                    if (parsed.isBefore(dayjs(), "day")) {
                      setDeadlineError("Past date not allowed");
                      setDeadlineDate(null);
                      return;
                    }

                    setDeadlineError("");
                    setDeadlineDate(parsed.toDate());

                    setJobForm((prev) => ({
                      ...prev,
                      application_deadline: parsed.format("DD/MM/YYYY"),
                    }));
                  }}
                  className={`w-full h-[44px] px-3 pr-12 text-sm border rounded-md outline-none
                                ${
                                  deadlineError
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-blue-500"
                                }
                              `}
                />

                {/* CALENDAR */}
                <div ref={calendarRef} className="absolute right-2 inset-y-0 flex items-center">
                  {/* ICON */}
                  <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                     className="flex items-center justify-center h-5 w-5 text-gray-500"
                  >
                    <Calendar size={18} />
                  </button>

                  {/* Calendar (ON/OFF) */}
                  {open && (
                    <div className="absolute right-0 mt-2 z-50 bg-white shadow-lg rounded">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                          value={
                            jobForm.application_deadline
                              ? dayjs(
                                  jobForm.application_deadline,
                                  "DD/MM/YYYY",
                                )
                              : null
                          }
                          minDate={dayjs()} // ✅ only future dates allowed
                          onChange={(newValue) => {
                            if (!newValue) return;

                            const formatted = newValue.format("DD/MM/YYYY");

                            setDeadlineDate(newValue.toDate()); // optional (if using state)
                            setDeadlineInput(formatted); // optional (input sync)

                            setJobForm((prev) => ({
                              ...prev,
                              application_deadline: formatted,
                            }));

                            setOpen(false); // auto close
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                  )}
                </div>
              </div>

              {deadlineError && (
                <p className="text-red-500 text-xs mt-1">{deadlineError}</p>
              )}
            </div>
            <div>
              <Label>Vacancies</Label>
             <Input
                required
                id="vacancies"
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={jobForm.vacancies}
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^\d{0,5}$/.test(value)) {
                    setJobForm((prev) => ({
                      ...prev,
                      vacancies: value,
                    }));
                  }
                }}
                onKeyDown={(e) => {
                  const allowedKeys = [
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "Tab",
                  ];

                  if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="e.g., 5"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Job Type *</Label>

            <Selectt
            isMulti
            options={jobTypeOptions}
            value={jobTypeOptions.filter((option) =>
              jobForm.job_type?.includes(option.value)
            )}
            onChange={(selectedOptions: any) =>
              setJobForm((prev) => ({
                ...prev,
                job_type: selectedOptions.map((item: any) => item.value),
              }))
            }
          />
          </div>
             <div>
                <Label className="text-sm font-medium"> Skills</Label>
                <div className="mt-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={handleAddSkill}
                      variant="outline"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {jobForm.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {skill}
                        <button
                          type="button"
                          className="ml-2 text-blue-600 hover:text-blue-800"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
          <div>
          <Label>Description</Label>
          <TiptapEditor
            value={jobForm.description || ""}
            onChange={(value) =>
              setJobForm({
                ...jobForm,
                description: value,
              })
            }
          />
        </div>
          {/* <div>
            <Label>Requirements</Label>
            <Textarea
              name="requirements"
              value={jobForm.requirements || ""}
              onChange={(e) =>
                setJobForm({
                  ...jobForm,
                  [e.target.name]: e.target.value,
                })
              }
              rows={3}
            />
          </div>
          <div>
            <Label>Benefits</Label>
            <Textarea
              name="benefits"
              value={jobForm.benefits || ""}
              onChange={(e) =>
                setJobForm({
                  ...jobForm,
                  [e.target.name]: e.target.value,
                })
              }
              rows={3}
            />
          </div> */}

          <div>
            <Label>Requirements</Label>
            <TiptapEditor
              value={jobForm.requirements || ""}
              onChange={(value) =>
                setJobForm({ ...jobForm, requirements: value })
              }
            />
          </div>

          <div>
            <Label>Benefits</Label>
            <TiptapEditor
              value={jobForm.benefits || ""}
              onChange={(value) =>
                setJobForm({ ...jobForm, benefits: value })
              }
            />
          </div>
                  {isAdmin && (
                    <>
                   <div className="flex items-center space-x-2">
                      <Checkbox
                        id="add-website"
                        checked={websiteEnabled}
                        onCheckedChange={(checked) => {
                          setWebsiteEnabled(!!checked);

                          if (!checked) {
                            setJobForm({ ...jobForm, website_apply: "" });
                          }
                        }}
                      />
                      <Label htmlFor="add-website" className="text-sm">
                        Website URL
                      </Label>
                    </div>
                    </>
                    )}
                    {websiteEnabled && (
                      <div className="mt-4 w-full sm:w-3/5 lg:w-2/5">
                        <Input
                          value={jobForm.website_apply || ""}
                          onChange={(e) =>
                            setJobForm({ ...jobForm, website_apply: e.target.value })
                          }
                          placeholder="Enter website URL..."
                        />
                        </div>
                      )}
          {/* Checkboxes */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={jobForm.isUrgent === true}
                onCheckedChange={(checked) =>
                  setJobForm({ ...jobForm, isUrgent: !!checked })
                }
              />
              <Label>Urgent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={jobForm.isRemote === true}
                onCheckedChange={(remote) =>
                  setJobForm({ ...jobForm, isUrgent: !!remote })
                }
              />
              <Label>Remote</Label>
            </div>
            <div className="flex items-center space-x-2">
                          <Checkbox
                            id="ask-question"
                            checked={askQuestionEnabled}
                            onCheckedChange={(checked) => setAskQuestionEnabled(!!checked)}
                          />
                          <Label htmlFor="ask-question" className="text-sm">
                            Ask Question
                          </Label>
                        </div>
          </div>
          {askQuestionEnabled && (
            <div className="mt-4 space-y-2 w-full sm:w-3/5 lg:w-2/5">
              <div className="flex gap-2">
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Enter a question..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddQuestion}
                  variant="outline"
                >
                  Add Question
                </Button>
              </div>

              {/* Show added questions */}
              <div className="flex flex-wrap gap-2">
                {questions.map((q, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                  >
                    {q}
                    <button
                      type="button"
                      className="ml-2 text-red-600 hover:text-red-800"
                      onClick={() => handleRemoveQuestion(index)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Footer */}
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            {/* FIX : Put the Onclick handle update method */}
            <Button onClick={handleUpdateJob}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => fetchPostedJobs(currentPage - 1, searchTerm, jobFilter, dateFilter)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => fetchPostedJobs(currentPage + 1, searchTerm, jobFilter, dateFilter)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </>
  );
};

export default ManageJobs;
