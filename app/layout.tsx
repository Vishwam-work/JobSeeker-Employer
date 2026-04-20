import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SavedJobsProvider } from "@/context/SavedJobsContext";
import { Toaster } from "sonner";


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JobSeeker - Find Your Dream Job',
  description: 'India\'s leading job portal with 5 lakh+ jobs. Find your perfect career opportunity.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>

         <SavedJobsProvider>
          {children}
          <Toaster richColors position="top-center" />
         </SavedJobsProvider>
        </body>
    </html>
  );
}