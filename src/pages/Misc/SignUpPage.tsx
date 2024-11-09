import { GoogleOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Typography } from "antd";
import { onSignInWithGoogle } from "src/api/firebase/authentication";
import useUserStore from "src/stores/user_store";
import { useToken } from "src/utils/antd_components";

export const SignUpPage = () => {
  const user = useUserStore((state) => state.user);
  const { token } = useToken();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100svh - 102px)",
        alignItems: "center",
      }}
    >
      <Row
        gutter={[16, 16]}
        style={{
          maxWidth: "850px",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Col xs={24}>
          <Typography.Title level={1}>Input Crowd,</Typography.Title>
          <Typography.Title level={1}>Output Meaning</Typography.Title>
        </Col>
        <Col xs={24}>
          <Typography.Paragraph>
            <pre>
              Polis is a real-time system for gathering, analyzing and
              understanding what large groups of people think in their own
              words, enabled by advanced statistics and machine learning.
              <br />
              <br />
              Polis has been used all over the world by governments, academics,
              independent media and citizens, and is completely open source.
            </pre>
          </Typography.Paragraph>
          <Typography.Paragraph></Typography.Paragraph>
        </Col>

        {!user && (
          <Col md={24}>
            <Typography.Title level={3} disabled>
              Get Started
            </Typography.Title>
            <Typography.Paragraph>
              Polis is a real-time system for gathering, analyzing and
              understanding what large groups of people think in their own
              words, enabled by advanced statistics and machine learning.
            </Typography.Paragraph>
            <Space direction="vertical">
              <Button
                type="primary"
                size="large"
                icon={<GoogleOutlined />}
                onClick={onSignInWithGoogle}
              >
                Sign in with Google
              </Button>
            </Space>
          </Col>
        )}
      </Row>
    </div>
  );
};
