/* eslint-disable @typescript-eslint/no-unused-vars */
import { TodoDocument } from "@server/models/todo.model";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

interface todoStoreType {
  loading: boolean;
  todos: TodoDocument[];
  setTodos: (todos: TodoDocument[]) => void;
  setLoading: (loading: boolean) => void;
  addTodo: (todo: TodoDocument) => void;
  updateTodo: (todo: TodoDocument) => void;
  updateTodos: (todos: TodoDocument[]) => void;
  deleteTodo: (id: string) => void;
}

const initialValues = {
  todos: [],
  loading: false,
};

const useTodoStore = create<todoStoreType>()(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        ...initialValues,
        setTodos: (todos: TodoDocument[]) => set({ todos, loading: false }),
        setLoading: (loading: boolean) => set({ loading }),
        addTodo: (todo: TodoDocument) =>
          set((state) => ({ todos: [...state.todos, todo] })),
        updateTodo: (todo: TodoDocument) => {
          // if todo is present in the store, update it, else add it
          const currentTodos = get().todos;
          const currentTodo = currentTodos.find((t) => t._id === todo._id);
          if (currentTodo) {
            const updatedTodos = currentTodos.map((t) =>
              t._id === todo._id ? todo : t
            );
            set({ todos: updatedTodos });
          } else {
            set((state) => ({ todos: [...state.todos, todo] }));
          }
        },
        updateTodos: (newTodos) => {
          // if todos are present in the store, update them, else add them
          const currentTodos = get().todos;

          const todosToAdd = newTodos.filter(
            (todo) => !currentTodos.find((t) => t._id === todo._id)
          );
          const updatedTodos = currentTodos.map((currentTodo) => {
            const newTodo = newTodos.find((t) => t._id === currentTodo._id);
            return newTodo === undefined ? currentTodo : newTodo;
          });

          set({ todos: [...updatedTodos, ...todosToAdd] });
        },
        deleteTodo: (id: string) =>
          set((state) => ({
            todos: state.todos.filter((todo) => todo._id !== id),
          })),
      }),
      { name: "todoStore" }
    )
  )
);

export default useTodoStore;
