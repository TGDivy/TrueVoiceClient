import {
  CheckOutlined,
  CloseOutlined,
  LineOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Flex,
  Input,
  message,
  Progress,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ActivityTopic,
  createComment,
  getTopic,
  Topic,
  TopicComment,
  voteComment,
} from "src/api/conversation";
import useSessionStore from "src/stores/session_store";

const mockTopicData: Topic = {
  topic_id: "123",
  title: "How could dealing with the death of a loved one be made eaiser?",
  commentCount: 4,
  description:
    "What feelings and emotions do you experience when dealing with the death of a loved one?\n\nWhat are some ways that you have found helpful in dealing with the death of a loved one?",
};

const mockTopicComments: TopicComment[] = [
  {
    comment_id: "1",
    content:
      "Life insurance as well as other similar services should include more extensive mental health support for the bereaved in addition to financial support.",
    up_votes: 0,
    down_votes: 0,
    skipped_times: 0,
    createdAt: "2021-09-14T00:00:00Z",
    topic_id: "123",
  },
  {
    comment_id: "2",
    content:
      "After the death of a loved one, it is almost impossible to get any help from the government. The process is long and tedious.",
    up_votes: 0,
    down_votes: 0,
    skipped_times: 0,
    createdAt: "2021-09-14T00:00:00Z",
    topic_id: "123",
  },
  {
    comment_id: "3",
    content:
      "There should be more support groups for the bereaved. It is important to have a support system to help you through the grieving process.",
    up_votes: 0,
    down_votes: 0,
    skipped_times: 0,
    createdAt: "2021-09-14T00:00:00Z",
    topic_id: "123",
  },
  {
    comment_id: "4",
    content:
      "There should be more support groups for the bereaved. It is important to have a support system to help you through the grieving process.",
    up_votes: 0,
    down_votes: 0,
    skipped_times: 0,
    createdAt: "2021-09-14T00:00:00Z",
    topic_id: "123",
  },
];

const mockSessionData: ActivityTopic = {
  commentIDsApproved: ["1"],
  commentIDsRejected: [],
  commentIDsSkipped: ["2"],
  session_id: "2465",
  topic_id: "123",
};

const AgreeDisagreeSkip = (params: { topicId: string }) => {
  const { topicId } = params;
  const [topicComments, setTopicComments] =
    useState<TopicComment[]>(mockTopicComments);

  const [sessionId, fetchActivityForTopic, activity_topics] = useSessionStore(
    (state) => [
      state.session_id,
      state.fetchActivityForTopic,
      state.activity_topics,
    ]
  );

  // const sessionData = activity_topics[topicId];
  const sessionData = mockSessionData;
  const commentsToDo = topicComments.filter(
    (comment) =>
      !sessionData.commentIDsApproved.includes(comment.comment_id) &&
      !sessionData.commentIDsRejected.includes(comment.comment_id) &&
      !sessionData.commentIDsSkipped.includes(comment.comment_id)
  );
  const [currentComment, setCurrentComment] = useState<TopicComment>();

  const handleVote = (vote: "VOTE_UP" | "VOTE_DOWN" | "SKIPPED") => {
    if (!currentComment) return;
    if (!sessionId) return;
    voteComment(currentComment.comment_id, sessionId, vote).then(() => {
      fetchActivityForTopic(sessionId, topicId);
    });
  };

  useEffect(() => {
    if (!topicId) return;
    if (!sessionId) return;
    fetchActivityForTopic(sessionId, topicId);
  }, [topicId, sessionId]);

  useEffect(() => {
    if (commentsToDo.length === 0) {
      setCurrentComment(undefined);
      return;
    }
    setCurrentComment(commentsToDo[0]);
  }, []);

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={24}>
      <Progress
        percent={
          (sessionData.commentIDsApproved.length /
            (sessionData.commentIDsApproved.length +
              sessionData.commentIDsRejected.length)) *
          100
        }
        format={(_percent?: number) =>
          `${sessionData.commentIDsApproved.length} / ${
            sessionData.commentIDsApproved.length +
            sessionData.commentIDsRejected.length
          }`
        }
      />
      <Typography.Paragraph>{currentComment?.content}</Typography.Paragraph>

      <Flex style={{ width: "100%" }} gap={8}>
        <Button
          block
          icon={<CloseOutlined />}
          type="primary"
          onClick={() => handleVote("VOTE_DOWN")}
        >
          Disagree
        </Button>
        <Button
          block
          icon={<LineOutlined />}
          type="primary"
          onClick={() => handleVote("SKIPPED")}
        >
          Skip
        </Button>
        <Button
          block
          icon={<CheckOutlined />}
          type="primary"
          onClick={() => handleVote("VOTE_UP")}
        >
          Agree
        </Button>
      </Flex>
    </Space>
  );
};

const AddComment = (params: { topic_id: string }) => {
  const { topic_id } = params;
  const [content, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const session_id = useSessionStore((state) => state.session_id);

  const handleAddComment = async () => {
    if (!content) return;
    setSubmitting(true);
    createComment({ content, topic_id, session_id })
      .then(() => {
        message.success("Comment submitted for review!");
        setComment("");
      })
      .catch((error) => {
        if (error instanceof Error) {
          message.error(error.message);
        }
        console.error(error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Flex>
      <Input
        placeholder="Suggest your own statement here."
        variant="filled"
        value={content}
        onChange={(e) => setComment(e.target.value)}
        onPressEnter={handleAddComment}
        styles={{
          affixWrapper: {
            padding: "16px 32px",
          },
        }}
        showCount
        maxLength={200}
        suffix={
          <Tooltip title="Submit">
            <Button
              type="text"
              size="small"
              onClick={handleAddComment}
              icon={<SendOutlined />}
              style={{
                opacity: content ? 1 : 0,
              }}
              loading={submitting}
            />
          </Tooltip>
        }
      />
    </Flex>
  );
};

const InteractTopicPage = () => {
  const topicId = useParams<{ topicId: string }>().topicId;
  const [topicData, setTopicData] = useState<Topic>();

  useEffect(() => {
    if (!topicId) return;
    getTopic(topicId).then((data) => {
      setTopicData(data);
    });
  }, [topicId]);

  if (!topicData || !topicId) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100svh - 102px)",
        alignItems: "center",
      }}
    >
      <Row
        gutter={[16, 16]}
        style={{
          maxWidth: "600px",
          width: "100%",
          height: "100%",
        }}
      >
        <Col xs={24}>
          <Typography.Title
            level={2}
            style={{
              overflow: "hidden",
            }}
          >
            <span key={topicData.topic_id} className="welcome-text">
              {topicData.title}
            </span>
          </Typography.Title>
        </Col>
        {topicData.description && (
          <Col span={24}>
            <Typography.Paragraph>{topicData.description}</Typography.Paragraph>
          </Col>
        )}
        {topicId && (
          <Col span={24}>
            <Card>
              <AgreeDisagreeSkip topicId={topicId} />
            </Card>
          </Col>
        )}
        <Col md={24}>
          <Typography.Title level={5}>
            Is the topic missing a key statement?
          </Typography.Title>
        </Col>
        <Col md={24}>
          <AddComment topic_id={topicId} />
        </Col>
      </Row>
    </div>
  );
};

export default InteractTopicPage;
