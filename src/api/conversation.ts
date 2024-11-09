import axios from "axios";
import useUserStore from "src/stores/user_store";
import { API_DOMAIN } from "src/utils/constants";
import { handleAxiosError } from "./errors";
import { convertDateStringsToDates } from "src/utils/text";

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
  const response = await conversationAPI.get<Topic>(`/topic/${topicId}`);
  return response.data;
};

export interface TopicComment {
  session_id?: string;
  down_votes: number;
  up_votes: number;
  skipped_times: number;
  content: string;
  topic_id: string;
  comment_id: string;
  createdAt: string;
}

export interface createCommentInput {
  content: string;
  topic_id: string;
  session_id?: string;
}

export const createComment = async (commentInput: createCommentInput) => {
  const response = await conversationAPI.post<TopicComment>(
    "/comment",
    commentInput
  );
  return response.data;
};

export const getCommentsForTopic = async (topicId: string) => {
  const response = await conversationAPI.get<TopicComment[]>(
    `/topic/${topicId}/comments`
  );
  return response.data;
};

export const getPendingCommentsForTopic = async (topicId: string) => {
  const response = await conversationAPI.get<TopicComment[][]>(
    `/topic/${topicId}/pending_comments`
  );
  return response.data;
};

export interface ActivityTopic {
  session_id: string;
  topic_id: string;
  commentIDsApproved: string[];
  commentIDsRejected: string[];
  commentIDsSkipped: string[];
}

export const getActivityForTopic = async (
  session_id: string,
  topic_id: string
) => {
  const response = await conversationAPI.get<ActivityTopic>(
    `/activity/${session_id}/${topic_id}`
  );
  return response.data;
};

export const agreeComment = async (commentId: string, session_id: string) => {
  const response = await conversationAPI.post<ActivityTopic>(
    `/comment/${commentId}/agree`,
    { session_id }
  );
  return response.data;
};

export const disagreeComment = async (
  commentId: string,
  session_id: string
) => {
  const response = await conversationAPI.post<ActivityTopic>(
    `/comment/${commentId}/disagree`,
    { session_id }
  );
  return response.data;
};

export const skipComment = async (commentId: string, session_id: string) => {
  const response = await conversationAPI.post<ActivityTopic>(
    `/comment/${commentId}/skip`,
    { session_id }
  );
  return response.data;
};
