import axios from "axios";
import useUserStore from "src/stores/user_store";
import { API_DOMAIN } from "src/utils/constants";
import { handleAxiosError } from "./errors";
import { convertDateStringsToDates } from "src/utils/text";

export interface TopicDocument {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  title: string;
}

export const conversationAPI = axios.create({
  baseURL: `${API_DOMAIN}`,
  headers: {
    "Content-type": "application/json",
  },
});

conversationAPI.interceptors.request.use(async (config) => {
  const auth_token = await useUserStore.getState().user?.getIdToken(false);

  if (auth_token) {
    config.headers.Authorization = `Bearer ${auth_token}`;
  }

  return config;
});

conversationAPI.interceptors.response.use((response) => {
  response.data = convertDateStringsToDates(response.data);

  return response;
}, handleAxiosError);

export interface createTopicRequest {
  title: string;
  description: string;
}

export interface createTopicResponse {
  topic_id: string;
}

export interface Topic {
  title: string;
  description: string;
  commentCount: number;
  topic_id: string;
}

export const createTopic = async (topicInput: createTopicRequest) => {
  const response = await conversationAPI.post<Topic>("/topic", topicInput);
  return response.data;
};

export const getTopics = async () => {
  const response = await conversationAPI.get<Topic[]>("/topic");
  return response.data;
};

export const getTopic = async (topicId: string) => {
  const response = await conversationAPI.get<TopicDocument>(
    `/topic/${topicId}`
  );
  return response.data;
};
