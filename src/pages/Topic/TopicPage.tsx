import { CheckSquareOutlined, FolderFilled } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  message,
  Row,
  Space,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useParams } from "react-router-dom";
import { getTopic, Topic, updateTopic } from "src/api/conversation";
import LinkCard from "src/components/basics/LinkCard";
import JournalEditor from "src/components/journal/JournalEditor";
import { useToken } from "src/utils/antd_components";

const TopicPage = () => {
  //   const [topics, loading] = useTopicStore((state) => [
  //     state.topics,
  //     state.loading,
  //   ]);
  const topicId = useParams<{ topicId: string }>().topicId;
  const [description, setDescription] = useState<string>("");
  const [editing, setEditing] = useState<boolean>(false);

  const [topicData, setTopicData] = useState<Topic>({
    title: "",
    description: "",
    commentCount: 0,
    topic_id: "",
  });

  const { token } = useToken();

  const onEditTitle = (newTitle: string) => {
    if (!topicId) {
      return;
    }
    updateTopic(topicId, {
      title: newTitle,
      description: topicData.description,
    })
      .then(() => {
        setTopicData((prev) => ({ ...prev, title: newTitle }));
        setDescription(newTitle);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onEditDescription = (newDescription: string) => {
    if (!topicId) {
      return;
    }
    updateTopic(topicId, {
      title: topicData.title,
      description: newDescription,
    })
      .then(() => {
        setTopicData((prev) => ({ ...prev, description: newDescription }));
        message.success("Description updated successfully");
      })
      .catch((error) => {
        console.error(error);
        message.error("Failed to update description");
      });
  };

  useEffect(() => {
    if (!topicId) {
      return;
    }
    getTopic(topicId)
      .then((data) => {
        setTopicData(data);
        setDescription(data.description);
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
            editable={{
              onChange: onEditTitle,
              text: topicData.title,
              tooltip: "Click to edit title",
            }}
          >
            <span key={topicData.topic_id} className="welcome-text">
              {topicData.title}
            </span>
          </Typography.Title>
        </Col>
        <Col span={16}>
          {editing ? (
            <Input.TextArea
              rows={4}
              placeholder="Description"
              allowClear
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              showCount
              maxLength={800}
            >
              {description}
            </Input.TextArea>
          ) : (
            <Markdown className="tiptapJournal userResponse">
              {description}
            </Markdown>
          )}
        </Col>
        <Col
          span={8}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: token.sizeSM,
          }}
        >
          <Button
            type="primary"
            block
            onClick={() => {
              setEditing(!editing);
              onEditDescription(description);
            }}
          >
            {editing ? "Save" : "Edit"}
          </Button>
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
          <Space direction="vertical">
            <Typography.Title level={5} disabled>
              Share this topic link with others:
            </Typography.Title>
            <Typography.Text
              copyable={{
                text: `${window.location.origin}/interact/topic/${topicId}`,
                tooltips: ["Copy", "Copied!"],
              }}
            >
              <span key={topicData.topic_id} className="copy-text">
                {`${window.location.origin}/interact/topic/${topicId}`}
              </span>
            </Typography.Text>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default TopicPage;
