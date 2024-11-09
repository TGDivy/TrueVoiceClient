import { SendOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Flex,
  Input,
  List,
  Tooltip,
  Typography,
  message,
} from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { createTopic } from "src/api/conversation";
import useTopicStore from "src/stores/topics_store";
import { useToken } from "src/utils/antd_components";
import { formatText } from "src/utils/text";

const CreateTopic = () => {
  const [title, setTitle] = useState("");
  const addTopic = useTopicStore((state) => state.addTopic);

  const handleCreateTopic = async () => {
    try {
      const topic = await createTopic({ title, description: "" });
      setTitle("");
      message.success("Topic created");
      addTopic(topic);
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
      console.error(error);
    }
  };

  return (
    <Flex>
      <Input
        placeholder="Create a new conversation topic"
        variant="filled"
        size="large"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onPressEnter={handleCreateTopic}
        styles={{
          affixWrapper: {
            padding: "16px 32px",
          },
        }}
        suffix={
          <Tooltip title="Submit">
            <Button
              type="text"
              size="small"
              onClick={handleCreateTopic}
              icon={<SendOutlined />}
              style={{
                opacity: title ? 1 : 0,
              }}
            />
          </Tooltip>
        }
      />
    </Flex>
  );
};

const TopicsPage = () => {
  const [topics, loading] = useTopicStore((state) => [
    state.topics,
    state.loading,
  ]);

  const { token } = useToken();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100svh - 102px)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <List
          style={{
            height: "100%",
            padding: "16px 16px",
            maxWidth: "850px",
            width: "100%",
          }}
          loading={loading}
          dataSource={topics || []}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          renderItem={(item) => (
            <List.Item>
              <Link to={`/topics/${item.topic_id}`}>
                <Card
                  style={{
                    height: "200px",
                    position: "relative",
                  }}
                  hoverable
                  bordered={false}
                >
                  <Typography.Text strong>
                    {formatText(item.title)}
                  </Typography.Text>
                </Card>
              </Link>
            </List.Item>
          )}
        />
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          alignSelf: "center",
          // box shadow above to fade out the list
          boxShadow: `0px 0px 20px 10px ${token.colorBgLayout}`,
          zIndex: 100,
        }}
      >
        <CreateTopic />
      </div>
    </div>
  );
};

export default TopicsPage;
