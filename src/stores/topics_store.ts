/* eslint-disable @typescript-eslint/no-unused-vars */
import { Topic } from "src/api/conversation";
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

interface topicStoreType {
  loading: boolean;
  topics: Topic[];
  setTopics: (topics: Topic[]) => void;
  setLoading: (loading: boolean) => void;
  addTopic: (topic: Topic) => void;
  updateTopic: (topic: Topic) => void;
}

const initialValues = {
  topics: [],
  loading: false,
};

const useTopicStore = create<topicStoreType>()(
  subscribeWithSelector(
    devtools(
      (set, _get) => ({
        ...initialValues,
        setTopics: (topics: Topic[]) => set({ topics, loading: false }),
        setLoading: (loading: boolean) => set({ loading }),
        addTopic: (topic: Topic) =>
          set((state) => ({ topics: [...state.topics, topic] })),
        updateTopic: (topic: Topic) =>
          set((state) => ({
            topics: state.topics.map((p) =>
              p.topic_id === topic.topic_id ? topic : p
            ),
          })),
      }),
      { name: "topicStore" }
    )
  )
);

export default useTopicStore;
