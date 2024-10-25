import React, { useState } from 'react';
import { TiDelete, TiEdit} from "react-icons/ti";

const TodoItem = ({ todo, deleteTodo, editTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    editTodo(todo.id, newText);
    setIsEditing(false);
  };

  const handleDelete = () => deleteTodo(todo.id);

  return (
    <div className="todo-item" style={{ backgroundColor: todo.color }}>
      {isEditing ? (
        <input
          type="text"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onBlur={handleSave}
        />
      ) : (
        <span>{todo.title}</span>
      )}
      <div className="todo-buttons">
        <span className="edit" onClick={handleEdit}><TiEdit />
        </span>
        <span className="delete" onClick={handleDelete}><TiDelete />
        </span>
      </div>
    </div>
  );
};

export default TodoItem;
