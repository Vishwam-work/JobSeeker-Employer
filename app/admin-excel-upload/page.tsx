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
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [uploadedRows, setUploadedRows] = useState<string[]>([]);
  useEffect(() => {
    const role = localStorage.getItem("admin_role");

    if (role === "admin") {
      setIsAdmin(true);
    }
  }, []);

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
            currency_id: Number(row.currency_id) || 1,
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
            application_deadline: row.application_deadline || "",
            description: row.description || "",
            requirements: row.requirements || "",
            benefits: row.benefits || "",
            skills: row.skills
              ? String(row.skills)
                  .split(",")
                  .map((s) => s.trim())
              : [],
            is_urgent: String(row.is_urgent).toLowerCase() === "true",
            is_remote: String(row.is_remote).toLowerCase() === "true",
            status: "active",
            questions: row.questions
              ? String(row.questions)
                  .split("|")
                  .map((q) => q.trim())
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

  if (!isAdmin) return null;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Upload Excel
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-xl p-0 overflow-hidden">
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
        <div className="p-6 space-y-5">
          {/* Upload Box */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-green-500 transition">
            <input
              type="file"
              accept=".xls,.xlsx"
              disabled={uploading}
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploadMessage("Uploading Excel file...");
                const validTypes = [
                  "application/vnd.ms-excel",
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ];

                if (!validTypes.includes(file.type)) {
                  toast.error("Only Excel files (.xls, .xlsx) are allowed");
                  e.target.value = "";
                  return;
                }
                const maxSize = 700 * 1024; // 700 KB

                if (file.size > maxSize) {
                  setUploadError("File size must be less than 700 KB");
                  e.target.value = "";
                  return;
                }

                try {
                  setUploading(true);

                  setSelectedFile(file);
                  if (onUploadSuccess) {
                    onUploadSuccess();
                  }
                } catch (error) {
                  console.error(error);
                } finally {
                  setUploading(false);
                }
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
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-h-40 overflow-y-auto">
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
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-40 overflow-y-auto">
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
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={() => setDialogOpen(false)}
            disabled={uploading}
          >
            Cancel
          </Button>

          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={uploading || !selectedFile}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
