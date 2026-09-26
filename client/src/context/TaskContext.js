import { createContext, useEffect, useReducer } from "react";
import { taskFetchPath } from "../api/fetchpaths";
import { useAuthContext } from "../hooks/useAuthContext";

export const TasksContext = createContext();

export const tasksReducer = (state, action) => {
  switch (action.type) {
    case "SET_Tasks":
      return {
        tasks: action.payload,
      };
    case "CREATE_Tasks":
      return {
        tasks: [...state.tasks, action.payload],
      };
    case "DELETE_Tasks":
      return {
        tasks: state.tasks.filter((w) => w._id !== action.payload),
      };
    case "EDIT_Tasks":
      const editTasks = () => {
        let taskList = state.tasks;
        return taskList.map(task => {
          if (task._id === action.payload._id) {
            return action.payload
          } else {
            return task
          }
        })
      };
      return {
        tasks: editTasks()
      }
    default:
      return state;
  }
};

export const TaskContextProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [state, dispatch] = useReducer(tasksReducer, {
    tasks: null,
  });
  
  // Load the right task list whenever the logged-in user changes (admins: whole org, users: own tasks)
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) {
        dispatch({ type: "SET_Tasks", payload: null });
        return;
      }

      const path = user.isAdmin
        ? `${taskFetchPath}organization/${user.organization}`
        : `${taskFetchPath}user/${user._id}`;

      const res = await fetch(path, {
        method: "GET",
        mode: "cors",
      });
      if (!res.ok) return;

      const data = await res.json();
      dispatch({ type: "SET_Tasks", payload: data });
    };
    fetchTasks();
  }, [user]);

  return (
    <TasksContext.Provider value={{ ...state, dispatch }}>
      {children}
    </TasksContext.Provider>
  );
};
