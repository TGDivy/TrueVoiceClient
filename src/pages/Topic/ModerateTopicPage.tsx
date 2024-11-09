import { ArrowLeftOutlined, CheckSquareOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Flex,
  List,
  Row,
  Space,
  Tabs,
  TabsProps,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPendingCommentsForTopic, TopicComment } from "src/api/conversation";
import { useToken } from "src/utils/antd_components";

const PendingCommentCluster = () => {
  const topicId = useParams<{ topicId: string }>().topicId;
  const [pendingCommentsCluster, setPendingCommentsCluster] = useState<
    TopicComment[][]
  >([]);
  useEffect(() => {
    if (!topicId) {
      return;
    }
    getPendingCommentsForTopic(topicId).then((comments) => {
      setPendingCommentsCluster(comments);
    });
  }, [topicId]);

  if (!pendingCommentsCluster.length) {
    return (
      <Typography.Paragraph>No pending comments yet.</Typography.Paragraph>
    );
  }
  // These are a cluster of comments that need to moderated.
  // User can approve or reject them.
  // Each cluster is supposed to represent a list of comments that are very similar to each other.
  // The user can reject the entire cluster if they don't like the comments.
  // If they like the comments they can select the comment they find most appropriate and approve it, and automatically mark the rest as rejected.
  return (
    <List grid={{ gutter: 16, column: 2 }}>
      {pendingCommentsCluster.map((comments, index) => (
        <List.Item key={index}>
          <Card title={`Cluster ${index + 1}`}>
            <List
              dataSource={comments}
              renderItem={(comment) => (
                <List.Item>
                  <Card
                    title={comment.content}
                    extra={
                      <CheckSquareOutlined
                        style={{ fontSize: "24px", color: "green" }}
                      />
                    }
                  >
                    <Typography.Paragraph>
                      {comment.session_id}
                    </Typography.Paragraph>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </List.Item>
      ))}
    </List>
  );
};

const tabItems: TabsProps["items"] = [
  {
    key: "Unmoderated",
    label: "Unmoderated",
    children: <PendingCommentCluster />,
  },
  {
    key: "Approved",
    label: "Approved",
    disabled: true,
  },
  {
    key: "Rejected",
    label: "Rejected",
    disabled: true,
  },
];

const ModerateTopicPage = () => {
  const { token } = useToken();
  const navigate = useNavigate();

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
          maxWidth: "850px",
          width: "100%",
          height: "100%",
        }}
      >
        <Col
          xs={24}
          style={{
            position: "relative",
          }}
        >
          <Flex justify="space-between" align="baseline">
            <Typography.Title
              level={1}
              style={{
                overflow: "hidden",
              }}
            >
              <span key={"Moderate"} className="welcome-text">
                Moderate
              </span>
            </Typography.Title>
            <Button size="small" onClick={() => navigate(-1)} type="primary">
              back
            </Button>
          </Flex>
        </Col>
        <Col span={24}>
          <Tabs items={tabItems} />
        </Col>
        <Col
          span={24}
          style={{
            display: "flex",
            flexDirection: "row",
            gap: token.sizeSM,
            scrollbarWidth: "none",
            overflowX: "scroll",
            padding: "10px",
          }}
        ></Col>
      </Row>
    </div>
  );
};

export default ModerateTopicPage;
