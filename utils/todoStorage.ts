import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo, DeletedTodo } from '../contexts/TodoContext';

const ACTIVE_TODOS_KEY = 'active_todos';
const DELETED_TODOS_KEY = 'deleted_todos';

// Active todos storage
export const saveTodos = async (todos: Todo[]): Promise<void> => {
  try {
    const todosJson = JSON.stringify(todos);
    await AsyncStorage.setItem(ACTIVE_TODOS_KEY, todosJson);
  } catch (error) {
    console.error('Error saving active todos:', error);
    throw error;
  }
};

export const loadTodos = async (): Promise<Todo[] | null> => {
  try {
    const todosJson = await AsyncStorage.getItem(ACTIVE_TODOS_KEY);
    if (todosJson) {
      return JSON.parse(todosJson) as Todo[];
    }
    return null;
  } catch (error) {
    console.error('Error loading active todos:', error);
    return null;
  }
};

export const clearTodos = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ACTIVE_TODOS_KEY);
  } catch (error) {
    console.error('Error clearing active todos:', error);
    throw error;
  }
};

// Deleted todos storage
export const saveDeletedTodos = async (deletedTodos: DeletedTodo[]): Promise<void> => {
  try {
    const deletedTodosJson = JSON.stringify(deletedTodos);
    await AsyncStorage.setItem(DELETED_TODOS_KEY, deletedTodosJson);
  } catch (error) {
    console.error('Error saving deleted todos:', error);
    throw error;
  }
};

export const loadDeletedTodos = async (): Promise<DeletedTodo[] | null> => {
  try {
    const deletedTodosJson = await AsyncStorage.getItem(DELETED_TODOS_KEY);
    if (deletedTodosJson) {
      return JSON.parse(deletedTodosJson) as DeletedTodo[];
    }
    return null;
  } catch (error) {
    console.error('Error loading deleted todos:', error);
    return null;
  }
};

export const clearDeletedTodos = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(DELETED_TODOS_KEY);
  } catch (error) {
    console.error('Error clearing deleted todos:', error);
    throw error;
  }
};

// Utility function to clear all todo data
export const clearAllTodoData = async (): Promise<void> => {
  try {
    await Promise.all([
      clearTodos(),
      clearDeletedTodos()
    ]);
  } catch (error) {
    console.error('Error clearing all todo data:', error);
    throw error;
  }
};