/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActivityTopic, getActivityForTopic } from "src/api/conversation";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

interface sessionStoreType {
  loading: boolean;
  session_id?: string;
  updateSession: (session_id: string) => void;
  activity_topics: { [key: string]: ActivityTopic };
  updateActivity: (activity: ActivityTopic) => void;
  fetchActivityForTopic: (session_id: string, topic_id: string) => void;
  setLoading: (loading: boolean) => void;
}

// randomly generate 8 digit session id string if not present (make it look like an easy to name) and store it in local storage
const getSessionId = (): string => {
  let session_id = window.localStorage.getItem("session_id");
  if (session_id) {
    return session_id;
  }
  session_id = Math.random().toString(36).substring(2, 10);
  window.localStorage.setItem("session_id", session_id);
  return session_id;
};

const initialValues = {
  activity_topics: {},
  loading: false,
  session_id: getSessionId(),
};

const useSessionStore = create<sessionStoreType>()(
  subscribeWithSelector(
    devtools(
      (set) => ({
        ...initialValues,
        updateSession: (session_id: string) => {
          window.localStorage.setItem("session_id", session_id);
          set({ session_id });
        },
        updateActivity: (activity: ActivityTopic) =>
          set((state) => {
            return {
              ...state,
              activity_topics: {
                ...state.activity_topics,
                [activity.topic_id]: activity,
              },
            };
          }),
        fetchActivityForTopic: async (session_id: string, topic_id: string) => {
          set({ loading: true });

          getActivityForTopic(session_id, topic_id)
            .then((activity) => {
              set((state) => {
                return {
                  ...state,
                  activity_topics: {
                    ...state.activity_topics,
                    [activity.topic_id]: activity,
                  },
                };
              });
            })
            .catch((error) => {
              console.error(error);
            })
            .finally(() => {
              set({ loading: false });
            });
        },
        setLoading: (loading: boolean) => set({ loading }),
      }),
      { name: "todoStore" }
    )
  )
);

export default useSessionStore;
