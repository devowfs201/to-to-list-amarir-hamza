import React, { useReducer, useEffect } from 'react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import './style.css';

const initialState = {
  todos: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TODOS':
      return { ...state, todos: action.payload };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: Date.now(), title: action.payload, color: getRandomColor() },
        ],
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    case 'EDIT_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo
        ),
      };
    default:
      return state;
  }
}

function getRandomColor() {
  const colors = ['#FFD700', '#ADFF2F', '#FF69B4', '#87CEFA', '#FF4500'];
  return colors[Math.floor(Math.random() * colors.length)];
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('http://localhost:3000/todos');
        if (response.ok) {
          const todos = await response.json();
          const todosWithColors = todos.map(todo => ({
            ...todo,
            color: getRandomColor(),
          }));
          dispatch({ type: 'SET_TODOS', payload: todosWithColors });
        } else {
          console.error('Failed to fetch todos');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = text => {
    dispatch({ type: 'ADD_TODO', payload: text });
  };

  const deleteTodo = async id => {
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        dispatch({ type: 'DELETE_TODO', payload: id });
      } else {
        console.error('Failed to delete todo');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const editTodo = async (id, newText) => {
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newText }),
      });
      if (response.ok) {
        dispatch({ type: 'EDIT_TODO', payload: { id, title: newText } });
      } else {
        console.error('Failed to update todo');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="app">
      <h1>To-Do List</h1>
      <TodoForm addTodo={addTodo} />
      <TodoList todos={state.todos} deleteTodo={deleteTodo} editTodo={editTodo} />
    </div>
  );
};

export default App;
