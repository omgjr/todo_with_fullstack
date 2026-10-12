import React, { useState, useEffect } from "react";
import axios from "axios";

function Todos() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // Fetch tasks from Django backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/todos/");

      setTasks(response.data);
    } catch (error) {
      console.log(
        "Error fetching tasks:",
        error.response?.data || error.message,
      );
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8000/api/todos/${taskId}/delete/`);
      const updatedTask = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTask);
    } catch (error) {
      console.log("error", error);
    }
  };

  // Add new task
  const addTask = async () => {
    if (inputValue.trim() === "") {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/todos/add/",
        {
          title: inputValue.trim(),
          completed: false,
        },
      );

      setTasks((previousTasks) => [...previousTasks, response.data]);

      setInputValue("");
    } catch (error) {
      console.log("Error adding task:", error.response?.data || error.message);
    }
  };

  // Mark only the clicked task as completed

  const toggleCompleted = (taskId) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  // Add task when Enter is pressed
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  };

  return (
    <div className="container">
      <div className="todo-app">
        <div className="app-title">
          <h2>To-do app</h2>
          <i className="fa-solid fa-book-bookmark"></i>
        </div>

        <div className="row">
          <input
            type="text"
            id="input-box"
            placeholder="Add your tasks"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button onClick={addTask}>Add</button>
        </div>

        <ul id="list-container">
          {tasks.map((task) => (
            <li key={task.id} className={task.completed ? "checked" : ""}>
              <span onClick={() => toggleCompleted(task.id)}>
                {task.completed ? <del>{task.title}</del> : task.title}
              </span>

              <span
                onClick={(event) => {
                  event.stopPropagation();
                  deleteTask(task.id);
                }}
                style={{ cursor: "pointer", float: "right" }}
              >
                X
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Todos;
