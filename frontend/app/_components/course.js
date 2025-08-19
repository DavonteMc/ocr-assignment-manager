"use client";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import Assignment from "./assignment";
import { useApp } from "../_providers/AppContextProvider";
import { FaPencilAlt } from "react-icons/fa";

export default function Course({ course, index }) {
  const { saveCourseChanges, removeCourse } = useApp();
  const [courseName, setCourseName] = useState(course.courseName || "");
  const [nameChange, setNameChange] = useState(false);
  const cancelNameChange = () => {
    setCourseName(course.courseName);
    setNameChange(false);
  };
  const [activeEditingId, setActiveEditingId] = useState(null);

  return (
    <div key={index} className="mb-6 p-4 rounded-lg shadow-md bg-[#f5f5f5]">
      <div className="flex flex-col justify-between items-center mb-4">
        <div className="flex justify-between items-center w-full mb-2">
          {/* Title section */}
          <div className="flex items-center space-x-3">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              {course.courseName}
            </h3>
            {!nameChange && (
              <button
                className="flex font-semibold items-center justify-center hover:scale-125 transition duration-300"
                onClick={() => setNameChange(true)}
              >
                <FaPencilAlt />
              </button>
            )}
          </div>

          <button
            className="bg-red-500/90 font-semibold py-1 w-[7vw] shadow ml-auto rounded hover:bg-red-700 hover:scale-105 transition duration-300"
            onClick={() => removeCourse(course.id)}
          >
            <span className="text-sm text-white">Delete Course</span>
          </button>
        </div>
        {nameChange && (
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            autoFocus
          />
        )}

        {nameChange && (
          <div className="flex items-center mb-4 space-x-4 mr-auto">
            <button
              className="bg-green-600/90 text-white font-semibold py-1 w-[5vw] rounded shadow hover:bg-green-700 hover:scale-105 transition duration-300"
              onClick={() => saveCourseChanges(course.id, courseName)}
            >
              Save
            </button>
            <button
              className="bg-red-500/90 text-white font-semibold py-1 w-[5vw] rounded shadow hover:bg-red-700 hover:scale-105 transition duration-300"
              onClick={() => cancelNameChange()}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      <ul className="space-y-3">
        {course.assignments.map((assignment, i) => (
          <Assignment
            key={i}
            assignment={assignment}
            isActive={activeEditingId === assignment.id}
            setActiveEditingId={setActiveEditingId}
          />
        ))}
      </ul>
    </div>
  );
}
