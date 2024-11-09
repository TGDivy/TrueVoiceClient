import { GoogleOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography } from "antd";
import { onSignInWithGoogle } from "src/api/firebase/authentication";
import useUserStore from "src/stores/user_store";

export const SignUpPage = () => {
  const user = useUserStore((state) => state.user);
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
        gutter={[16, 24]}
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
            <Button
              type="primary"
              icon={<GoogleOutlined />}
              onClick={onSignInWithGoogle}
            >
              Sign in with Google
            </Button>
          </Col>
        )}
        <Col md={24}>
          <Typography.Title level={3} disabled>
            Read
          </Typography.Title>
          <Typography.Paragraph>
            Press coverage from The New York Times, MIT Tech Review, Wired, The
            Economist, Center for Public Impact, Civicist, and a mini
            documentary from BBC
          </Typography.Paragraph>
        </Col>
      </Row>
    </div>
  );
};
