"use client";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { useApp } from "../_providers/AppContextProvider";

export default function Assignment({ assignment, index }) {
  const { saveAssignmentChanges, removeAssignment } = useApp();
  const [title, setTitle] = useState(assignment.title || "");
  const [dueDate, setDueDate] = useState(assignment.dueDate || null);
  const [completionStatus, setCompletionStatus] = useState(
    assignment.completed ?? false
  );

  const [editAssignment, setEditAssignment] = useState(false);

  const cancelAssignmentChanges = () => {
    setTitle(assignment.title);
    setDueDate(assignment.dueDate);
    setCompletionStatus(assignment.completed);
    setEditAssignment(false);
  };

  const handleSaveAssignmentChanges = async () => {
    const dueDateToSend = dueDate === "" ? null : dueDate;

    await saveAssignmentChanges(
      assignment.id,
      title,
      dueDateToSend,
      completionStatus
    );

    setTitle(assignment.title);
    setDueDate(assignment.dueDate);
    setCompletionStatus(assignment.completed);
    setEditAssignment(false);
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

  console.log("Assignment component rendered with:", assignment);
  return (
    <li
      key={index}
      className="bg-white p-4 rounded shadow border-l-4 border-green-500"
    >
      <div className="flex flex-col items-start">
        {/* Title Section */}
        {!editAssignment && (
          <p className="font-bold text-lg text-gray-800">{assignment.title}</p>
        )}
        {editAssignment && (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            autoFocus
          />
        )}
        {/* Due Date Section */}
        {!editAssignment && (
          <p className="text-sm text-gray-600 mt-1">
            {formatDueDate(assignment.due)}
          </p>
        )}
        {editAssignment && (
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            autoFocus
          />
        )}
        {/* Completion Status Section */}
        {!editAssignment && (
          <p
            className={`text-sm mt-2 ${
              assignment.completed ? "text-green-600" : "text-red-600"
            }`}
          >
            {assignment.completed ? "Completed" : "Pending Completion"}
          </p>
        )}
        {editAssignment && (
          <button
            type="button"
            className={`text-sm mt-2 ${
              assignment.completed ? "text-green-600" : "text-red-600"
            }`}
          >
            {assignment.completed ? "Completed" : "Pending Completion"}
          </button>
        )}
      </div>
      {!editAssignment && (
        <button type="button" onClick={() => setEditAssignment(true)}>
          Edit Assignment
        </button>
      )}
      {editAssignment && (
        <div>
          <button type="button" onClick={() => handleSaveAssignmentChanges()}>
            Save
          </button>
          <button type="button" onClick={() => cancelAssignmentChanges()}>
            Cancel
          </button>
        </div>
      )}
      <button type="button" onClick={() => removeAssignment(assignment.id)}>
        Remove Assignment
      </button>
    </li>
  );
}
