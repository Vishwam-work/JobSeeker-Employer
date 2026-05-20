"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface AdminExcelUploadProps {
  triggerButton?: React.ReactNode;
  onUploadSuccess?: () => void;
}

export default function AdminExcelUpload({
  triggerButton,
  onUploadSuccess,
}: AdminExcelUploadProps) {
  // const [isAdmin, setIsAdmin] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [uploadedRows, setUploadedRows] = useState<string[]>([]);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  // useEffect(() => {
  //   const role = localStorage.getItem("admin_role");

  //   if (role === "admin") {
  //     setIsAdmin(true);
  //   }
  // }, []);

  const resetDialog = () => {
    setDialogOpen(false);
    setSelectedFile(null);
    setUploadErrors([]);
    setUploadedRows([]);
    setUploadError("");
    setUploadMessage("");
    setUploadStatus("");
    setUploading(false);
    setUploadCompleted(false);
  };

  const formatExcelDate = (excelDate: any) => {
    if (!excelDate) return "";

    // Excel serial number
    if (typeof excelDate === "number") {
      const date = XLSX.SSF.parse_date_code(excelDate);

      return `${String(date.d).padStart(2, "0")}/${String(date.m).padStart(2, "0")}/${date.y}`;
    }

    // Already string date
    const parsedDate = new Date(excelDate);

    if (!isNaN(parsedDate.getTime())) {
      const day = String(parsedDate.getDate()).padStart(2, "0");
      const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
      const year = parsedDate.getFullYear();

      return `${day}/${month}/${year}`;
    }

    return String(excelDate);
  };

  const handleExcelUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an Excel file");
      return;
    }
    setUploadErrors([]);
    setUploadedRows([]);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = event.target?.result;

      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      const errors: string[] = [];
      const seen = new Set();
      jsonData.forEach((row, index) => {
        const rowNumber = index + 1;

        // Check for duplicates based on title, company and job_title
        const key = `${row.title}-${row.company}-${row.job_title}`;

        if (seen.has(key)) {
          errors.push(`Row ${rowNumber}: Duplicate entry in file`);
        } else {
          seen.add(key);
        }

        // Required fields
        if (!row.title) errors.push(`Row ${rowNumber}: Title is required`);
        if (!row.job_title)
          errors.push(`Row ${rowNumber}: Job Title is required`);
        if (!row.company) errors.push(`Row ${rowNumber}: Company is required`);
        if (!row.category)
          errors.push(`Row ${rowNumber}: Category is required`);
        if (!row.location)
          errors.push(`Row ${rowNumber}: Location is required`);
        if (!row.salary) errors.push(`Row ${rowNumber}: Salary is required`);

        // Salary number check
        if (row.salary && isNaN(Number(row.salary))) {
          errors.push(`Row ${rowNumber}: Salary must be a number`);
        }

        if (row.salary_max && isNaN(Number(row.salary_max))) {
          errors.push(`Row ${rowNumber}: Salary Max must be a number`);
        }

        // Vacancies
        if (row.vacancies && isNaN(Number(row.vacancies))) {
          errors.push(`Row ${rowNumber}: Vacancies must be a number`);
        }

        // Boolean fields
        if (
          row.is_urgent &&
          !["true", "false"].includes(String(row.is_urgent).toLowerCase())
        ) {
          errors.push(`Row ${rowNumber}: is_urgent must be true/false`);
        }

        if (
          row.is_remote &&
          !["true", "false"].includes(String(row.is_remote).toLowerCase())
        ) {
          errors.push(`Row ${rowNumber}: is_remote must be true/false`);
        }

        // Work mode validation
        if (row.work_mode) {
          const validModes = ["remote", "onsite", "hybrid"];
          if (!validModes.includes(String(row.work_mode).toLowerCase())) {
            errors.push(`Row ${rowNumber}: Invalid work_mode`);
          }
        }

        // Website URL check
        if (row.website_apply) {
          try {
            new URL(row.website_apply);
          } catch {
            errors.push(`Row ${rowNumber}: Invalid website URL`);
          }
        }
      });

      if (errors.length > 0) {
        setUploadErrors(errors);
        toast.error("Fix all errors before uploading");
        return;
      }

      const token = localStorage.getItem("employeer_token");

      if (!token) {
        toast.error("Login required");
        return;
      }

      try {
        for (const [index, row] of jsonData.entries()) {
          const payload = {
            title: row.title || "",
            job_title: row.job_title || "",
            company: row.company || "",
            category: row.category || "",
            location: row.location || "",
            currency_id: Number(row.currency_id) || 293,
            experience: row.experience || "",
            salary: String(row.salary || ""),
            salary_max: String(row.salary_max || ""),
            job_type: row.job_type
              ? String(row.job_type)
                  .split(",")
                  .map((item) => item.trim().toLowerCase())
              : [],
            work_mode: row.work_mode || "",
            vacancies: Number(row.vacancies) || 1,
            application_deadline: row.application_deadline
              ? formatExcelDate(row.application_deadline)
              : "",
            description: row.description || "",
            requirements: row.requirements || "",
            benefits: row.benefits || "",
            skills: row.skills
              ? String(row.skills)
                  .split(",")
                  .map((item) => item.trim())
              : [],
            is_urgent: String(row.is_urgent).toLowerCase() === "true",
            is_remote: String(row.is_remote).toLowerCase() === "true",
            status: "active",
            questions: row.questions
              ? String(row.questions)
                  .split("|")
                  .map((item) => item.trim())
              : [],
            website_apply: row.website_apply || "",
          };

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_EMPLOYER}/job-postings/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(payload),
            },
          );

          if (response.ok) {
            setUploadedRows((prev) => [
              ...prev,
              `Row ${index + 1}: ${payload.title} uploaded successfully`,
            ]);
          }
          if (onUploadSuccess) {
            await onUploadSuccess();
          }
          setUploadCompleted(true);
          if (!response.ok) {
            let errorMessage = `Row ${index + 1}: Upload failed`;

            try {
              const errorData = await response.json();

              errorMessage = `Row ${index + 1}: ${JSON.stringify(errorData)}`;
            } catch {
              errorMessage = `Row ${index + 1}: Server error`;
            }

            setUploadErrors((prev) => [...prev, errorMessage]);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    reader.readAsBinaryString(selectedFile);
  };

  // if (!isAdmin) return null;

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);

        // Dialog close hone par reset
        if (!open) {
          resetDialog();
        }
      }}
    >
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Upload Excel
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-lg md:max-w-2xl rounded-xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-gray-50">
          <DialogTitle className="text-lg font-semibold">
            Upload Excel File
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Post jobs in bulk using an Excel sheet
          </p>
        </DialogHeader>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Upload Box */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 cursor-pointer hover:border-green-500 transition text-center">
            <input
              type="file"
              accept=".xls,.xlsx"
              disabled={uploading}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setUploadErrors([]);
                setUploadedRows([]);
                setUploadError("");
                setSelectedFile(file);
                setUploadCompleted(false);
                const validTypes = [
                  "application/vnd.ms-excel",
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ];

                if (!validTypes.includes(file.type)) {
                  setUploadErrors([
                    "Only Excel files (.xls, .xlsx) are allowed",
                  ]);
                  e.target.value = "";
                  return;
                }

                const maxSize = 700 * 1024;

                if (file.size > maxSize) {
                  setUploadErrors(["File size must be less than 700 KB"]);
                  e.target.value = "";
                  return;
                }

                const reader = new FileReader();

                reader.onload = (event) => {
                  try {
                    const data = event.target?.result;

                    const workbook = XLSX.read(data, { type: "binary" });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];

                    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

                    const errors: string[] = [];

                    jsonData.forEach((row, index) => {
                      const rowNumber = index + 1;

                      if (!row.title) {
                        errors.push(`Row ${rowNumber}: Title is required`);
                      }

                      if (!row.job_title) {
                        errors.push(`Row ${rowNumber}: Job Title is required`);
                      }

                      if (!row.company) {
                        errors.push(`Row ${rowNumber}: Company is required`);
                      }

                      if (!row.category) {
                        errors.push(`Row ${rowNumber}: Category is required`);
                      }

                      if (!row.salary) {
                        errors.push(`Row ${rowNumber}: Salary is required`);
                      }
                    });
                    setUploadErrors(errors);
                  } catch (error) {
                    console.error(error);
                    setUploadErrors(["Excel validation failed"]);
                  }
                };

                reader.readAsBinaryString(file);
              }}
            />

            {/* Icon */}
            <div className="text-4xl mb-2">📄</div>

            <p className="text-sm font-medium">
              {selectedFile
                ? `Selected File: ${selectedFile.name}`
                : "Click to upload or drag & drop"}
            </p>
            {selectedFile && (
              <p className="text-xs text-green-600 mt-1">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">XLS, XLSX up to 700KB</p>
          </label>

          {/* Uploading State */}
          {uploading && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-blue-700 font-medium">
                Uploading Excel file...
              </p>
            </div>
          )}
          {uploadedRows.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-h-32 sm:max-h-40 overflow-y-auto">
              <p className="text-sm font-semibold text-green-600 mb-2">
                Uploaded Rows
              </p>

              <ul className="text-xs text-green-700 space-y-1">
                {uploadedRows.map((row, index) => (
                  <li key={index}>• {row}</li>
                ))}
              </ul>
            </div>
          )}

          {uploadErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-32 sm:max-h-40 overflow-y-auto">
              <p className="text-sm font-semibold text-red-600 mb-2">
                Upload Errors
              </p>

              <ul className="text-xs text-red-700 space-y-1">
                {uploadErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Info */}
          <div className="bg-gray-50 border rounded-lg p-3 text-xs text-gray-600">
            Make sure your Excel file follows the required format.
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-4 sm:px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={resetDialog} disabled={uploading}>
            Cancel
          </Button>

          {!uploadCompleted && (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={uploading || !selectedFile || uploadErrors.length > 0}
              onClick={async () => {
                try {
                  setUploading(true);
                  await handleExcelUpload();
                } finally {
                  setUploading(false);
                }
              }}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
