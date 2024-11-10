import { Flex, Tooltip, Typography } from "antd";

import { InfoCircleFilled } from "@ant-design/icons";
import useSessionStore from "src/stores/session_store";
import { Header, useBreakpoint, useToken } from "src/utils/antd_components";
import UserProfile from "./UserProfile";

const InteractHeader = () => {
  const { token } = useToken();
  const breaks = useBreakpoint();

  const sessionId = useSessionStore((state) => state.session_id);
  const updateSessionID = useSessionStore((state) => state.updateSessionID);

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

        <Flex align="center" gap={8}>
          <Tooltip
            title={
              <>
                If you want to save your progress, please copy this session ID
                and save it.
              </>
            }
          >
            <Typography.Text>
              <InfoCircleFilled />
              {"  "} Session ID:
            </Typography.Text>
          </Tooltip>
          <Typography.Text
            copyable={{ text: sessionId }}
            editable={{
              tooltip: "To resume a session, paste the session ID here",
              onChange(value) {
                updateSessionID(value);
              },
            }}
          >
            {sessionId}
          </Typography.Text>
        </Flex>
      </Header>
    </>
  );
};

export default InteractHeader;
