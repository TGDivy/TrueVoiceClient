import { Flex, Space, Tooltip, Typography } from "antd";

import { Header, useBreakpoint, useToken } from "src/utils/antd_components";
import UserProfile from "./UserProfile";
import useSessionStore from "src/stores/session_store";

const InteractHeader = () => {
  const { token } = useToken();
  const breaks = useBreakpoint();

  const sessionId = useSessionStore((state) => state.session_id);

  return (
    <>
      <Header
        about="header"
        style={{
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
          alignItems: breaks.sm ? "end" : "center",
          width: "100%",
          backgroundColor: "transparent",
          padding: breaks.sm ? "0px 40px" : "0px 15px 0px 5px",
          height: "52px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: token.sizeXS,
            flexDirection: "row",
            alignItems: breaks.sm ? "end" : "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: token.sizeXS,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {breaks.sm && <img src="/logos/logo.svg" height={26} alt="logo" />}
            <Typography.Title level={5}>Polis</Typography.Title>
          </div>
        </div>

        <UserProfile />
        <Tooltip
          title={
            <>
              If you want to save your progress, please copy this session ID and
              save it.
            </>
          }
        >
          <Flex align="end" gap={8}>
            <Typography.Text>Session ID:</Typography.Text>
            <Typography.Text copyable={{ text: sessionId }}>
              {sessionId}
            </Typography.Text>
          </Flex>
        </Tooltip>
      </Header>
    </>
  );
};

export default InteractHeader;
