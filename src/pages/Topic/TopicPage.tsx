import { CheckSquareOutlined, FolderFilled } from "@ant-design/icons";
import { Col, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTopic, Topic } from "src/api/conversation";
import LinkCard from "src/components/basics/LinkCard";
import { useToken } from "src/utils/antd_components";

const TopicPage = () => {
  //   const [topics, loading] = useTopicStore((state) => [
  //     state.topics,
  //     state.loading,
  //   ]);
  const topicId = useParams<{ topicId: string }>().topicId;

  const [topicData, setTopicData] = useState<Topic>({
    title: "",
    description: "",
    commentCount: 0,
    topic_id: "",
  });

  const { token } = useToken();

  useEffect(() => {
    if (!topicId) {
      return;
    }
    getTopic(topicId)
      .then((data) => {
        setTopicData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [topicId]);

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
        gutter={[16, 32]}
        style={{
          maxWidth: "850px",
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
        <Col span={24}>
          <Typography.Paragraph>{topicData.description}</Typography.Paragraph>
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
        >
          <LinkCard
            to={`/topics/${topicId}/moderate`}
            title="Moderate"
            icon={<FolderFilled />}
          />

          <LinkCard
            to={`/topics/${topicId}/preview`}
            title="Preview"
            icon={<CheckSquareOutlined />}
          />
        </Col>
        <Col md={24}>
          <Typography.Title level={5} disabled>
            New Features Coming Soon
          </Typography.Title>
          <Typography.Paragraph disabled>
            We are working on new features to help you manage your time, track
            your progress, and stay focused on your goals. You will also be able
            to reflect on your day and plan.
          </Typography.Paragraph>
        </Col>
      </Row>
    </div>
  );
};

export default TopicPage;
