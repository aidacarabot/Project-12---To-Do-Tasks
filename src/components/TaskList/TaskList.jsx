import React, { useState } from 'react';
import './TaskList.css';
import useListNameEdit from '../../hooks/useListNameEdit';
import useHandleEnter from '../../hooks/useHandleEnter';

const TaskList = ({ list, dispatch, showCompleted }) => {
  const [newTask, setNewTask] = useState("");
  const [showInput, setShowInput] = useState(false);

  const { newListName, setNewListName, editingListName, setEditingListName, editListName } = useListNameEdit(list.name, list.id, dispatch);

  const handleAddTask = () => {
    if (newTask) {
      dispatch({ type: 'ADD_TASK', listId: list.id, name: newTask });
      setNewTask('');
      setShowInput(false);
    }
  };

  const { handleKeyPress } = useHandleEnter(editingListName ? editListName : handleAddTask);

  const handleToggleTask = (taskId, taskCompleted) => {
    if (!taskCompleted && !showCompleted) {
      setTimeout(() => {
        dispatch({ type: 'TOGGLE_TASK', listId: list.id, taskId });
      }, 3000); // Retraso de 3 segundos para mover a completed
    } else {
      dispatch({ type: 'TOGGLE_TASK', listId: list.id, taskId });
    }
  };

  const handleDeleteTask = (taskId) => {
    dispatch({ type: 'DELETE_TASK', listId: list.id, taskId });
  };

  const handleDeleteList = () => {
    dispatch({ type: 'DELETE_LIST', id: list.id });
  };

  return (
    <div className="task-list">
      <button onClick={handleDeleteList} className="delete-list-button">X</button>
      <header>
        {editingListName ? (
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onBlur={editListName}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        ) : (
          <h2 title="Double Click to change title" onDoubleClick={() => setEditingListName(true)}>{list.name}</h2>
        )}
      </header>
      <ul>
        {list.tasks.map((task) => (
          // Filtrar tareas según si estamos en "Completed" o "Home"
          (showCompleted ? task.completed : !task.completed) && (
            <li key={task.id}>
              <label className="container">
                <input 
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id, task.completed)}
                />
                <div className="checkmark"></div>
              </label>
              {task.completed ? (
                <s>{task.name}</s>
              ) : (
                <span>{task.name}</span>
              )}
              <button className="delete-task" onClick={() => handleDeleteTask(task.id)}>-</button>
            </li>
          )
        ))}
      </ul>
      {!showInput ? (
        <button className="addTask-button" onClick={() => setShowInput(true)}>+ Add Task</button>
      ) : (
        <div className="task-input">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Write new task"
            autoFocus
          />
        </div>
      )}
    </div>
  );
};

export default TaskList;