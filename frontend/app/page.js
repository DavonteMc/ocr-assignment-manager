"use client";

import { useState } from "react";

export default function HomePage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [className, setClassName] = useState("");
  const [courses, setCourses] = useState([
    {
      className: "",
      assignments: [{}],
    },
  ]);

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
    <main className="min-h-screen bg-gray-100 p-8 text-gray-900 font-sans">
      <section className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-6 text-blue-800">
          OCR Assignment Processor
        </h1>
        <label className="block text-lg mb-2">Class Name:</label>
        <input
          type="text"
          placeholder="Enter Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4"
        />

        <label
          htmlFor="file-upload"
          className="inline-block cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
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
        {file && <p className="text-sm mt-1 text-gray-600">{file.name}</p>}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-blue-600 w-1/2 mx-auto text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Processing..." : "Upload & Process"}
        </button>
      </section>

      {courses.length > 0 && courses[0].assignments.length > 0 && (
        <section className="mt-8">

          {courses.map((course, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {course.className}
              </h3>
              <ul className="space-y-3">
                {course.assignments.map((assignment, i) => (
                  <li
                    key={i}
                    className="bg-white p-4 rounded shadow border-l-4 border-green-500"
                  >
                    <p className="font-bold text-lg text-gray-800">
                      {assignment.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {assignment.due}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
