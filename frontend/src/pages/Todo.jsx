import { useEffect, useState } from "react";
import { TodoForm } from "../components/TodoForm";
import { TodoList } from "../components/TodoList";
import TodoFilter from "../components/TodoFilter";
import axios from "axios";
import Cookies from "js-cookie";

function Todo() {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8000/todos")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.log("There was an error retrieving the todo list: ", error);
      });
  }, []);
  const [filter, setFilter] = useState(() => {
    const savedFilter = Cookies.get("todoFilter");
    return savedFilter || 'all';
  });

  const setFilterAndStoreCookie = (newFilter) => {
    setFilter(newFilter);
    Cookies.set("todoFilter", newFilter);
  };

  function addTodo(title) {
    const newTodo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    };

    setTodos((currentTodos) => [...currentTodos, newTodo]);

    axios.post("http://localhost:8000/todos/new", newTodo).catch((error) => {
      console.error("There was an error adding the todo: ", error);
    });
  }

  function toggleTodo(id, completed) {
    axios
      .put(`http://localhost:8000/todos/edit/${id}`, { completed: !completed })
      .then(() => {
        setTodos((currentTodos) =>
          currentTodos.map((todo) => {
            if (todo.id === id) {
              return { ...todo, completed: !completed };
            }
            return todo;
          })
        );
      })
      .catch((error) => {
        console.error("There was an error updating the todo: ", error.response);
      });
  }
  
  function deleteTodo(id) {
    axios
      .delete(`http://localhost:8000/todos/delete/${id}`)
      .then(() => {
        setTodos((currentTodos) =>
          currentTodos.filter((todo) => todo.id !== id)
        );
      })
      .catch((error) => {
        console.error("There was an error deleting the todo: ", error);
      });
  }

  function editTodo(id, newTitle) {
    axios
      .put(`http://localhost:8000/todos/edit/${id}`, { title: newTitle })
      .then(() => {
        setTodos((prevTodos) =>
          prevTodos.map((todo) => {
            if (todo.id === id) {
              return { ...todo, title: newTitle };
            }
            return todo;
          })
        );
      })
      .catch((error) => {
        console.error("There was an error updating the todo: ", error);
      });
  }
  function getFilteredTodos() {
    switch (filter) {
      case 'completed':
        return todos.filter(todo => todo.completed);
      case 'uncompleted':
        return todos.filter(todo => !todo.completed);
      default:
        return todos;
    }
  }

  return (
    <>
      <TodoForm addTodo={addTodo} />
      <TodoFilter setFilter={setFilterAndStoreCookie} currentFilter={filter} />
      <TodoList
        todos={getFilteredTodos()}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        editTodo={editTodo}
      />
    </>
  );
}

export default Todo;
