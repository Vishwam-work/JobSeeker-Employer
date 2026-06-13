"use client";

import { Button } from "@/components/ui/button";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function DownloadJobTemplate() {
  const handleDownload = async () => {
    try {
      const [locationsRes, categoriesRes, titlesRes, currenciesRes] =
        await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL_MASTER}/locations/search/?q=`,
          ),
          fetch(`${process.env.NEXT_PUBLIC_API_URL_MASTER}/jobs_category?q=`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL_MASTER}/jobs_title/?q=`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL_MASTER}/currencies`),
        ]);

      const locationsData = await locationsRes.json();
      const categoriesData = await categoriesRes.json();
      const titlesData = await titlesRes.json();
      const currenciesData = await currenciesRes.json();

      const locations =
        locationsData.results?.map((item: any) => item.name) ||
        locationsData.map?.((item: any) => item.name) ||
        [];

      const categories =
        categoriesData.results?.map(
          (item: any) => item.name || item.category_name,
        ) ||
        categoriesData.map?.((item: any) => item.name || item.category_name) ||
        [];

      const jobTitles =
        titlesData.results?.map((item: any) => item.name || item.title) ||
        titlesData.map?.((item: any) => item.name || item.title) ||
        [];

      const currencies =
        currenciesData.results?.map((item: any) => item.code) ||
        currenciesData.map?.((item: any) => item.code) ||
        [];

      const workbook = new ExcelJS.Workbook();

      const worksheet = workbook.addWorksheet("Jobs");

      const headers = [
        "title",
        "job_title",
        "company",
        "category",
        "location",
        "currency_id",
        "max_experience",
        "min_experience",
        "salary",
        "salary_max",
        "job_type",
        "work_mode",
        "vacancies",
        "application_deadline",
        "description",
        "requirements",
        "benefits",
        "skills",
        "is_urgent",
        "is_remote",
        "questions",
        "website_apply",
      ];

      worksheet.addRow(headers);
      worksheet.addRow([
        "Senior Python Developer", // title
        "Python Developer",        // job_title
        "ABC Technologies",        // company
        "Information Technology",  // category
        "Ahmedabad",               // location
        "INR",                     // currency_id
        5,                         // max_experience
        3,                         // min_experience
        600000,                    // salary
        900000,                    // salary_max
        "Full Time",               // job_type
        "Hybrid",                  // work_mode
        2,                         // vacancies
        "27/10/2030",              // application_deadline
        "Develop and maintain Python applications", // description
        "3+ years Python experience",              // requirements
        "Health Insurance, PF",                    // benefits
        "Python,Django,REST API",                  // skills
        "true",                                     // is_urgent
        "false",                                      // is_remote
        "Do you have Django experience?",          // questions
        "https://company.com/careers",             // website_apply
      ]);

      headers.forEach((_, index) => {
        worksheet.getColumn(index + 1).width = 25;
      });

      // Hidden Sheets
      const locationSheet = workbook.addWorksheet("Locations");
      const categorySheet = workbook.addWorksheet("Categories");
      const titleSheet = workbook.addWorksheet("JobTitles");
      const currencySheet = workbook.addWorksheet("Currencies");
      const jobTypeSheet = workbook.addWorksheet("JobTypes");
      const workModeSheet = workbook.addWorksheet("WorkModes");

      const jobTypes = ["Full Time", "Part Time", "Contract", "Internship"];

      const workModes = ["Remote", "Office", "Hybrid"];

      locations.forEach((item: string, index: number) => {
        locationSheet.getCell(`A${index + 1}`).value = item;
      });

      categories.forEach((item: string, index: number) => {
        categorySheet.getCell(`A${index + 1}`).value = item;
      });

      jobTitles.forEach((item: string, index: number) => {
        titleSheet.getCell(`A${index + 1}`).value = item;
      });

      currencies.forEach((item: string, index: number) => {
        currencySheet.getCell(`A${index + 1}`).value = item;
      });

      jobTypes.forEach((item: string, index: number) => {
        jobTypeSheet.getCell(`A${index + 1}`).value = item;
      });

      workModes.forEach((item: string, index: number) => {
        workModeSheet.getCell(`A${index + 1}`).value = item;
      });

      locationSheet.state = "hidden";
      categorySheet.state = "hidden";
      titleSheet.state = "hidden";
      currencySheet.state = "hidden";
      jobTypeSheet.state = "hidden";
      workModeSheet.state = "hidden";

      // Dropdowns
      for (let row = 2; row <= 1000; row++) {
        // Job Title (B)
        worksheet.getCell(`B${row}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`JobTitles!$A$1:$A$${jobTitles.length}`],
        };

        // Category (D)
        worksheet.getCell(`D${row}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`Categories!$A$1:$A$${categories.length}`],
        };

        // Location (E)
        worksheet.getCell(`E${row}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`Locations!$A$1:$A$${locations.length}`],
        };

        // Currency (F)
        worksheet.getCell(`F${row}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`Currencies!$A$1:$A$${currencies.length}`],
        };

        // Job Type (K)
        worksheet.getCell(`K${row}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`JobTypes!$A$1:$A$${jobTypes.length}`],
        };

        // Work Mode (L)
        worksheet.getCell(`L${row}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`WorkModes!$A$1:$A$${workModes.length}`],
        };
      }

      const buffer = await workbook.xlsx.writeBuffer();

      saveAs(new Blob([buffer]), "Job_Excel_Template.xlsx");
    } catch (error) {
      console.error("Template Download Error:", error);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      //   variant="outline"
      className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-5 py-2 font-medium shadow"
    >
      Excel Template
    </Button>
  );
}
