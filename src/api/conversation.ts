import axios from "axios";
import useUserStore from "src/stores/user_store";
import { API_DOMAIN } from "src/utils/constants";
import { handleAxiosError } from "./errors";
import { convertDateStringsToDates } from "src/utils/text";
import { getToken } from "firebase/app-check";
import { appCheck } from "./firebase/firebase_init";

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

  let appCheckTokenResponse;
  try {
    appCheckTokenResponse = await getToken(appCheck, /* forceRefresh= */ false);
    config.headers["X-Firebase-AppCheck"] = appCheckTokenResponse.token;
  } catch (err) {}

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

export const updateTopic = async (
  topicId: string,
  topicInput: createTopicRequest
) => {
  const response = await conversationAPI.put<Topic>(
    `/topic/${topicId}`,
    topicInput
  );
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
    "/add_comment",
    commentInput
  );
  return response.data;
};

export const getCommentsForTopic = async (topicId: string) => {
  const response = await conversationAPI.get<TopicComment[]>(
    `/topic/${topicId}/comment`
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
  commentIDsUpVoted: string[];
  commentIDsDownVoted: string[];
  commentIDsSkipped: string[];
}

export type voteType = "VOTE_UP" | "VOTE_DOWN" | "SKIPPED";

export const getActivityForTopic = async (
  session_id: string,
  topic_id: string
) => {
  const response = await conversationAPI.get<ActivityTopic>(
    `/session/${session_id}/topics/${topic_id}`
  );
  return response.data;
};

export const voteComment = async (
  comment_id: string,
  session_id: string,
  vote_type: voteType
) => {
  const response = await conversationAPI.put<ActivityTopic>(`/vote`, {
    comment_id,
    session_id,
    vote_type,
  });
  return response.data;
};

export const approveComment = async (commentId: string) => {
  const response = await conversationAPI.post<string>(
    `/comment/${commentId}/approve`
  );
  return response.data;
};

export const rejectComment = async (commentId: string) => {
  const response = await conversationAPI.post<string>(
    `/comment/${commentId}/reject`
  );
  return response.data;
};

export interface CommentSummary {
  summary: string;
}

export const getCommentSummary = async (topicId: string) => {
  const response = await conversationAPI.get<CommentSummary>(
    `/topic/${topicId}/comments_summary`
  );
  return response.data;
};
