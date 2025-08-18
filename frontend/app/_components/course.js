"use client";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import Assignment from "./assignment";
import { useApp } from "../_providers/AppContextProvider";

export default function Course({ course, index }) {
  const { saveCourseChanges } = useApp();
  const [courseName, setCourseName] = useState(course.className);
  const [nameChange, setNameChange] = useState(false);
  const cancelNameChange = () => {
    setCourseName(course.className);
    setNameChange(false);
  };

  return (
    <div key={index} className="mb-6">
      {!nameChange && (
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {course.className}
        </h3>
      )}
      {nameChange && (
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          autoFocus
        />
      )}
      {!nameChange && (
        <button
          className="text-sm bg-blue-500 text-white hover:underline mb-4"
          onClick={() => setNameChange(true)}
        >
          Edit Class Name
        </button>
      )}
      {nameChange && (
        <div className="flex items-center mb-4">
          <button
            className="text-sm p-2 bg-green-500 text-white hover:underline mb-4"
            onClick={() => saveCourseChanges(course.id, courseName)}
          >
            Save
          </button>
          <button
            className="text-sm p-2 bg-red-500 text-white hover:underline mb-4"
            onClick={() => cancelNameChange()}
          >
            Cancel
          </button>
        </div>
      )}
      <ul className="space-y-3">
        {course.assignments.map((assignment, i) => (
          <Assignment index={i} assignment={assignment} />
        ))}
      </ul>
    </div>
  );
}
