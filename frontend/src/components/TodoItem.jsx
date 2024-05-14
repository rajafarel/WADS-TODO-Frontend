

import React, { useState } from "react";

export function TodoItem({
  completed,
  id,
  title,
  toggleTodo,
  deleteTodo,
  editTodo,
}) {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleEdit = () => {
    if (newTitle.trim() !== "") {
      editTodo(id, newTitle);
      setEditing(false);
    }
  };

  return (
    <li>
      {editing ? (
        <input
        className="input-edit"
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        onBlur={handleEdit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleEdit();
          }
        }}
        autoFocus
      />
      ) : (
        <label>
          <input
            className="todo-checkbox"
            type="checkbox"
            checked={completed}
            onChange={(e) => toggleTodo(id, completed)}
          />
          {title}
          <button className="btn btn-danger" onClick={() => deleteTodo(id)}>
            Delete
          </button>
          <button
            className="bg-sky-500/50 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded text-sm md:text-base"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        </label>
      )}
    </li>
  );
}