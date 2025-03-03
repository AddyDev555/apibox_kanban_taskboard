import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./css/KanbanBoard.css";

// Initial tasks with unique IDs and statuses
const initialTasks = [
  { id: "1", title: "Design UI", status: "To Do" },
  { id: "2", title: "Develop API", status: "In Progress" },
  { id: "3", title: "Test Components", status: "Done" },
];

// Column definitions with associated images
const columns = [
  { name: "To Do", image: "to-do.png" },
  { name: "In Progress", image: "wip.png" },
  { name: "Done", image: "done.png" },
];
export default function KanbanBoard() {
  // State to manage tasks
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");

  /**
   * Handles drag-and-drop events to update task status
   * @param {Object} result - The result of the drag event
   */
  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    // Update task status based on the drop destination
    const updatedTasks = tasks.map((task) => {
      if (task.id === result.draggableId) {
        return { ...task, status: result.destination.droppableId };
      }
      return task;
    });
    setTasks(updatedTasks);
  };
  
  /**
   * Adds a new task to the "To Do" column
   */
  const addTask = () => {
    if (newTask.trim() === "") return;
    const newTaskObj = {
      id: (tasks.length + 1).toString(),
      title: newTask,
      status: "To Do",
    };
    setTasks([...tasks, newTaskObj]);
    setNewTask("");
  };

  return (
    <div className="kanban-container">
      
      {/* Header with logo and title */}
      <div className="title">
        <img src="./logo.png" alt="logo" />
        <h1>Kanban TaskBoard</h1>
      </div>
      
      {/* Input field for adding new tasks */}
      <div className="task-input-container">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="task-input"
          placeholder="Enter task title..."
        />
        <button onClick={addTask} className="add-task-button">Add Task</button>
      </div>

      {/* Kanban board with drag-and-drop functionality */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {columns.map((col) => (
            <Droppable key={col.name} droppableId={col.name}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="kanban-column"
                >
                  {/* Column title with associated image */}
                  <div className="colTitle">
                    <img src={col.image} alt={col.name} className="column-image" />
                    <h2 className="column-title">{col.name}</h2>
                  </div>
                  {/* Render tasks that belong to this column */}
                  {tasks
                    .filter((task) => task.status === col.name)
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="task-card"
                          >
                            {task.title}
                            <p className="task-status">Status: {task.status}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
