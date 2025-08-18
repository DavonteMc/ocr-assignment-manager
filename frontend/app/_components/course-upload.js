"use client";

import { useState } from "react";
import { useApp } from "../_providers/AppContextProvider";
import Assignment from "./assignment";

export default function CourseUpload({ courses, setCourses }) {
  const { appUser, saveCourseAndAssignments } = useApp();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState("");
  const [tempAssignments, setTempAssignments] = useState([]);
  const [displayAssignments, setDisplayAssignments] = useState(false);

  const handleUpload = async () => {
    displayAssignments(false);
    setTempAssignments([]);
    if (!className.trim()) {
      alert("Please enter a class name.");
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
    setTempAssignments(data.assignments || []);
    setDisplayAssignments(true);
    setLoading(false);
  };

  return (
    <div className="flex flex-col">
      <label className="block text-lg mb-2">Class Name:</label>
      <input
        type="text"
        placeholder="Enter Class Name"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded mb-4"
      />

      <div className="flex items-center mb-4 justify-center">
        <label
          htmlFor="file-upload"
          className="inline-block cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:scale-105 transition duration-300"
        >
          {file ? "File Selected" : "Choose File"}
        </label>
        <input
          id="file-upload"
          className="hidden"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ marginBottom: "1rem" }}
        />
        {file && <p className="text-sm mt-1 ml-2 text-gray-600">{file.name}</p>}
      </div>
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="bg-blue-600 w-3/4 mx-auto text-white px-4 py-2 rounded hover:bg-blue-700 hover:scale-105 transition duration-300"
      >
        {loading ? "Processing..." : "Upload & Process"}
      </button>

      {displayAssignments && tempAssignments.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mt-6 mb-4">
            Assignments for {className}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Click on an assignment to edit its title or due date. When your done,
            click the "Save" button to save the assignments to your course.
          </p>
          <button type="button" onClick={() => saveCourseAndAssignments(className, tempAssignments)}>
            Save Assignments
          </button>
          <ul className="space-y-3">
            {tempAssignments.map((assignment, i) => (
              <Assignment index={i} assignment={assignment} type={temp} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
