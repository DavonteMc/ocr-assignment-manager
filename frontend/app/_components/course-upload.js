"use client";

import { useState } from "react";
import { useApp } from "../_providers/AppContextProvider";
import Assignment from "./assignment";

export default function CourseUpload({ onComplete }) {
  const { appUser, saveCourseAndAssignments } = useApp();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [courseName, setClassName] = useState("");

  const handleUpload = async () => {
    if (!courseName.trim()) {
      alert("Please enter a class name.");
      return;
    }

    if (appUser.courses.some((course) => course.courseName === courseName)) {
      alert(
        "A course with this name already exists. Please choose a different name."
      );
      return;
    }

    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    const res = await fetch("http://localhost:8000/process/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Response from server:", data);
    if (!data.assignments || data.assignments.length === 0) {
      alert("No assignments found in the uploaded file.");
      setLoading(false);
      return;
    }
    await saveCourseAndAssignments(courseName, data.assignments);
    setLoading(false);
    onComplete(false);
  };

  return (
    <div className="flex flex-col w-1/2 items-center mb-6 p-4 rounded-lg shadow-md bg-[#f5f5f5] space-y-6">
      <h3 className="text-3xl">Enter Class Name</h3>
      <input
        type="text"
        placeholder="Software Testing..."
        value={courseName}
        onChange={(e) => setClassName(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded mb-4"
      />

      <div className="flex items-center mb-4 w-full justify-between space-y-4">
        <label
          htmlFor="file-upload"
          className="inline-block cursor-pointer  bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:scale-105 transition duration-300"
        >
          {file ? "File Selected" : "Choose File"}
        </label>
        <input
          id="file-upload"
          className=""
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ marginBottom: "1rem" }}
        />
      </div>
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="bg-blue-600 text-white px-4 py-2 w-1/2 rounded hover:bg-blue-700 hover:scale-105 transition duration-300"
      >
        {loading ? "Processing..." : "Upload & Process"}
      </button>
    </div>
  );
}
