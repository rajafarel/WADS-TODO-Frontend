import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function TodoForm({ addTodo }) {
  const [newItem, setNewItem] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (newItem === "") return;

    addTodo(newItem);
    setNewItem("");
  }

  const handleLogout = () => {

    navigate("/");
  };

  return (
    <div>
      <form className="new-item-form">
        <div className="form-row">
          <label className=" text-2xl" htmlFor="item">
            Add New Task Here
          </label>
          <input
            type="text"
            id="item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
        </div>
        <button className="btn" onClick={handleSubmit}>
          Add
        </button>
      </form>
      <div className="flex justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white px-40 py-1 mt-2 rounded cursor-pointer focus:outline-none"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default TodoForm;
