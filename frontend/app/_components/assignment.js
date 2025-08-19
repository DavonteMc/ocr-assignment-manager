"use client";
import { useState, useEffect } from "react";
import { useApp } from "../_providers/AppContextProvider";
import { FaPencilAlt } from "react-icons/fa";

export default function Assignment({
  assignment,
  isActive,
  setActiveEditingId,
}) {
  const { saveAssignmentChanges, removeAssignment } = useApp();

  // Local state for form fields
  const [title, setTitle] = useState(assignment.title || "");
  const [dueDate, setDueDate] = useState("");
  const [completionStatus, setCompletionStatus] = useState(
    assignment.completed ?? false
  );

  // Update local state when assignment prop changes or active state changes
  useEffect(() => {
    setTitle(assignment.title);
    setCompletionStatus(assignment.completed ?? false);
    setDueDate(assignment.dueDate ? toDateTimeLocal(assignment.dueDate) : "");
  }, [assignment, isActive]);

  const toDateTimeLocal = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const pad = (num) => num.toString().padStart(2, "0");
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  };

  const formatDueDate = (dueDateISO) => {
    if (!dueDateISO) return "No due date";
    const date = new Date(dueDateISO);
    return `Due on ${date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} ${date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const handleEditClick = () => {
    if (isActive) {
      setActiveEditingId(null); // Close editing
    } else {
      setActiveEditingId(assignment.id); // Open editing for this assignment
    }
  };

  const cancelAssignmentChanges = () => {
    setTitle(assignment.title);
    setDueDate(assignment.dueDate ? toDateTimeLocal(assignment.dueDate) : "");
    setCompletionStatus(assignment.completed ?? false);
    setActiveEditingId(null); // Close editing
  };

  const handleSaveAssignmentChanges = async () => {
    const dueDateToSend = dueDate === "" ? null : dueDate;
    await saveAssignmentChanges(
      assignment.id,
      title,
      dueDateToSend,
      completionStatus
    );
    setActiveEditingId(null); // Close editing
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-4">
      {!isActive && (
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl">{assignment.title}</h3>
          <button
            className="flex items-center justify-center hover:scale-125 transition duration-300"
            onClick={handleEditClick}
          >
            <FaPencilAlt />
          </button>
        </div>
      )}

      {isActive ? (
        <div className="flex flex-col">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            autoFocus
          />
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <label className="text-lg ml-1">
            Mark Completed
            <input
              type="checkbox"
              checked={completionStatus}
              onChange={(e) => setCompletionStatus(e.target.checked)}
              className="ml-2"
            />
          </label>
          <div className="flex items-center justify-between mt-4 ">
            <div className="flex items-center space-x-4">
              <button
                className="bg-green-600/90 text-white font-semibold py-1 w-[5vw] rounded shadow hover:bg-green-700 hover:scale-105 transition duration-300"
                onClick={handleSaveAssignmentChanges}
              >
                Save
              </button>
              <button
                className="bg-red-500/90 text-white font-semibold py-1 w-[5vw] rounded shadow hover:bg-red-700 hover:scale-105 transition duration-300"
                onClick={handleEditClick}
              >
                Cancel
              </button>
            </div>
            <button
                className="text-red-500/90 font-semibold  hover:text-red-700 hover:scale-110 transition duration-300"
                onClick={() => removeAssignment(assignment.id)}
              >
                Delete Assignment
              </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center ">
          <p>{formatDueDate(assignment.dueDate)}</p>
          <p
            className={`mt-1 ${
              assignment.completed ? "text-green-600" : "text-red-600"
            }`}
          >
            {assignment.completed ? "Completed" : "Pending Completion"}
          </p>
        </div>
      )}
    </div>
  );
}
