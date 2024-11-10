import { CheckSquareOutlined, FolderFilled } from "@ant-design/icons";
import { Col, Row, Typography } from "antd";
import LinkCard from "src/components/basics/LinkCard";
import useUserStore from "src/stores/user_store";
import { useToken } from "src/utils/antd_components";

export const HomePage = () => {
  const user = useUserStore((state) => state.user);
  const { token } = useToken();

  let welcomeText = "Hello, ";
  if (user?.displayName) {
    welcomeText += user.displayName.split(" ")[0];
  } else {
    welcomeText += "there";
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
        gutter={[16, 32]}
        style={{
          maxWidth: "850px",
          width: "100%",
          height: "100%",
        }}
      >
        <Col xs={24}>
          <Typography.Title
            level={1}
            style={{
              overflow: "hidden",
            }}
          >
            <span key={welcomeText} className="welcome-text">
              {welcomeText}.
            </span>
            <br />
            <span
              style={{
                color: token.colorTextDisabled,
              }}
            >
              Welcome to Polis!
            </span>
            <br />
          </Typography.Title>
        </Col>
        <Col span={24}>
          <Typography.Title level={4}>
            To help you get started, please choose from the services below.
          </Typography.Title>
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
            to="/topics"
            title="Manage Conversations"
            icon={<FolderFilled />}
          />

          <LinkCard title="Integrate" icon={<CheckSquareOutlined />} />
        </Col>
      </Row>
    </div>
  );
};
