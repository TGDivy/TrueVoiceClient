import {
  CheckOutlined,
  CloseOutlined,
  LineOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  Alert,
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
  getCommentsForTopic,
  getCommentSummary,
  getTopic,
  Topic,
  TopicComment,
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
  commentIDsUpVoted: ["1", "a"],
  commentIDsDownVoted: [],
  commentIDsSkipped: ["2"],
  session_id: "2465",
  topic_id: "123",
};

const AgreeDisagreeSkip = (params: {
  topicId: string;
  topicComments: TopicComment[];
}) => {
  const { topicId, topicComments } = params;

  const [activity_topics, handleVote] = useSessionStore((state) => [
    state.activity_topics,
    state.handleVote,
  ]);

  const sessionData = activity_topics[topicId];
  console.log("activity_topics", activity_topics);
  // const sessionData = mockSessionData;
  const commentsToDo = sessionData
    ? topicComments.filter(
        (comment) =>
          !sessionData.commentIDsUpVoted.includes(comment.comment_id) &&
          !sessionData.commentIDsDownVoted.includes(comment.comment_id) &&
          !sessionData.commentIDsSkipped.includes(comment.comment_id)
      )
    : undefined;

  // current comment is the first comment that hasn't been voted on yet
  const currentComment = commentsToDo && commentsToDo[0];

  if (!currentComment) {
    return (
      <Typography.Paragraph>
        Thank you for your input! You have reviewed all the different comments
        on this topic. Feel free to add your own statement below.
      </Typography.Paragraph>
    );
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={24}>
      <Progress
        percent={
          ((sessionData.commentIDsUpVoted.length +
            sessionData.commentIDsDownVoted.length +
            sessionData.commentIDsSkipped.length) /
            topicComments.length) *
          100
        }
        format={(_percent?: number) =>
          `${
            sessionData.commentIDsUpVoted.length +
            sessionData.commentIDsDownVoted.length +
            sessionData.commentIDsSkipped.length
          } / ${topicComments.length}`
        }
      />
      <Typography.Paragraph>{currentComment?.content}</Typography.Paragraph>

      <Flex style={{ width: "100%" }} gap={8}>
        <Button
          block
          icon={<CloseOutlined />}
          type="primary"
          onClick={() => handleVote(currentComment, "VOTE_DOWN")}
        >
          Disagree
        </Button>
        <Button
          block
          icon={<LineOutlined />}
          type="primary"
          onClick={() => handleVote(currentComment, "SKIPPED")}
        >
          Skip
        </Button>
        <Button
          block
          icon={<CheckOutlined />}
          type="primary"
          onClick={() => handleVote(currentComment, "VOTE_UP")}
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

const AISummary = (params: { topic_id: string }) => {
  const { topic_id } = params;
  const [commentSummary, setCommentSummary] = useState<string>("Hello");
  useEffect(() => {
    getCommentSummary(topic_id).then((summary) => {
      setCommentSummary(summary.summary);
    });
  }, []);

  if (!commentSummary) {
    return null;
  }

  return (
    <Col span={24}>
      <Alert
        message="Summary of Discussions"
        type="info"
        description={commentSummary}
        showIcon
        closable
      />
    </Col>
  );
};

const InteractTopicPage = () => {
  const topicId = useParams<{ topicId: string }>().topicId;
  const [topicData, setTopicData] = useState<Topic>();
  const [topicComments, setTopicComments] = useState<TopicComment[]>([]);
  const [sessionId, fetchActivityForTopic] = useSessionStore((state) => [
    state.session_id,
    state.fetchActivityForTopic,
  ]);

  useEffect(() => {
    if (!topicId) return;
    if (!sessionId) return;
    console.log("fetching comments for topic", topicId);
    getCommentsForTopic(topicId).then((comments) => {
      setTopicComments(comments);
    });
    getTopic(topicId).then((data) => {
      setTopicData(data);
    });
    fetchActivityForTopic(sessionId, topicId);
  }, [topicId, sessionId]);

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
              <AgreeDisagreeSkip
                topicId={topicId}
                topicComments={topicComments}
              />
            </Card>
          </Col>
        )}
        <AISummary topic_id={topicId} />
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
