import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { saveTodos, loadTodos, saveDeletedTodos, loadDeletedTodos } from '../utils/todoStorage';

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface DeletedTodo extends Todo {
  deletedAt: number;
}

interface TodoContextType {
  // Active todos
  activeTodos: Todo[];
  addTodo: (title: string, description: string) => void;
  updateTodo: (id: number, title: string, description: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;

  // Deleted todos
  deletedTodos: DeletedTodo[];
  restoreTodo: (id: number) => void;
  permanentDelete: (id: number) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [activeTodos, setActiveTodos] = useState<Todo[]>([]);
  const [deletedTodos, setDeletedTodos] = useState<DeletedTodo[]>([]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedActiveTodos = await loadTodos();
        const loadedDeletedTodos = await loadDeletedTodos();

        if (loadedActiveTodos) {
          setActiveTodos(loadedActiveTodos);
        }

        if (loadedDeletedTodos) {
          setDeletedTodos(loadedDeletedTodos);
        }
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    };

    loadData();
  }, []);

  // Save active todos whenever they change
  useEffect(() => {
    if (activeTodos.length > 0) {
      saveTodos(activeTodos).catch(error =>
        console.error('Error saving active todos:', error)
      );
    }
  }, [activeTodos]);

  // Save deleted todos whenever they change
  useEffect(() => {
    if (deletedTodos.length > 0) {
      saveDeletedTodos(deletedTodos).catch(error =>
        console.error('Error saving deleted todos:', error)
      );
    }
  }, [deletedTodos]);

  const addTodo = (title: string, description: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      description,
      completed: false,
    };
    setActiveTodos(prev => [...prev, newTodo]);
  };

  const updateTodo = (id: number, title: string, description: string) => {
    setActiveTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, title, description }
          : todo
      )
    );
  };

  const toggleTodo = (id: number) => {
    setActiveTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    const todoToDelete = activeTodos.find(todo => todo.id === id);
    if (todoToDelete) {
      // Move to deleted todos
      const deletedTodo: DeletedTodo = {
        ...todoToDelete,
        deletedAt: Date.now(),
      };

      setDeletedTodos(prev => [...prev, deletedTodo]);
      setActiveTodos(prev => prev.filter(todo => todo.id !== id));
    }
  };

  const restoreTodo = (id: number) => {
    const todoToRestore = deletedTodos.find(todo => todo.id === id);
    if (todoToRestore) {
      // Remove deletedAt property and move back to active todos
      const restoredTodo: Todo = {
        id: todoToRestore.id,
        title: todoToRestore.title,
        description: todoToRestore.description,
        completed: todoToRestore.completed,
      };

      setActiveTodos(prev => [...prev, restoredTodo]);
      setDeletedTodos(prev => prev.filter(todo => todo.id !== id));
    }
  };

  const permanentDelete = (id: number) => {
    setDeletedTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const value: TodoContextType = {
    activeTodos,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    deletedTodos,
    restoreTodo,
    permanentDelete,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};