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
import { Link } from "react-router-dom";
import useTopicStore from "src/stores/topics_store";
import { useToken } from "src/utils/antd_components";
import { formatText } from "src/utils/text";

const TopicPage = () => {
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
    </div>
  );
};

export default TopicPage;
