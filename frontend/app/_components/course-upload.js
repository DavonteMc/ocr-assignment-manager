"use client";

import { useState } from "react";

export default function CourseUpload({ courses, setCourses }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState("");

  const handleUpload = async () => {
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
    setCourses((prev) => [
      ...prev,
      {
        className: className,
        assignments: data.assignments || [],
      },
    ]);
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
    </div>
  );
}
