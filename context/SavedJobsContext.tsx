"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface SavedJob {
  id: number;
  title?: string;
}

interface SavedJobsContextType {
  savedJobs: SavedJob[];
  addJob: (job: SavedJob) => void;
  removeJob: (id: number) => void;
}

const SavedJobsContext = createContext<SavedJobsContextType | null>(null);
export const SavedJobsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("saved_jobs");
    if (stored) {
      try {
        setSavedJobs(JSON.parse(stored));
      } catch {
        console.error("Invalid saved_jobs data");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("saved_jobs", JSON.stringify(savedJobs));
  }, [savedJobs]);

  const addJob = (job: SavedJob) => {
    setSavedJobs((prev) => {
      if (prev.some((j) => j.id === job.id)) return prev;
      return [...prev, job];
    });
  };

  const removeJob = (id: number) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== id));
  };

  return (
    <SavedJobsContext.Provider value={{ savedJobs, addJob, removeJob }}>
      {children}
    </SavedJobsContext.Provider>
  );
};

export const useSavedJobs = () => {
  const context = useContext(SavedJobsContext);
  if (!context) {
    throw new Error(
      "useSavedJobs must be used within a SavedJobsProvider"
    );
  }
  return context;
};
