import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Flex } from "antd";
import { Sider, useToken } from "src/utils/antd_components";
import { useLocalStorageState } from "src/utils/hooks";
import { BottomMenu, TopMenu } from "./menu_items";
import { useState, useEffect } from "react";
import { getCommentSummary } from "src/api/conversation";
import { useParams } from "react-router-dom";

const AISummary = () => {
  const topicId = useParams<{ topicId: string }>().topicId;
  const [commentSummary, setCommentSummary] = useState<string>("Hello");
  useEffect(() => {
    if (!topicId) return;
    getCommentSummary(topicId).then((summary) => {
      setCommentSummary(summary.summary);
    });
  }, [topicId]);

  if (!commentSummary || !topicId) {
    return null;
  }

  return (
    <Col span={24}>
      <Alert
        message="Summary of Discussions"
        type="info"
        description={commentSummary}
        showIcon
        closable
      />
    </Col>
  );
};

const InteractiveSidebar = () => {
  const [themeCollapsed, setThemeCollapsed] = useLocalStorageState(
    "themeCollapsed",
    false
  );
  const { token } = useToken();

  return (
    <>
      <Sider
        collapsible
        width={264}
        collapsedWidth={68}
        trigger={null}
        onCollapse={setThemeCollapsed}
        collapsed={themeCollapsed}
        style={{
          opacity: 0.0,
          height: "100svh",
        }}
      ></Sider>
      <Sider
        collapsible
        width={264}
        collapsedWidth={68}
        trigger={null}
        onCollapse={setThemeCollapsed}
        collapsed={themeCollapsed}
        style={{
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.05)",
          backdropFilter: "blur(4px)",
          backgroundColor: token.colorFillQuaternary,
          height: "100svh",
          position: "fixed",
        }}
      >
        <Flex
          vertical
          style={{ height: "100%", padding: "12px 0px" }}
          justify="space-between"
        >
          <div>
            <Button
              shape="circle"
              type="text"
              size="large"
              style={{
                margin: "0 0 0 14px",
              }}
              onClick={() => setThemeCollapsed(!themeCollapsed)}
              icon={
                !themeCollapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />
              }
            />
            <AISummary />
          </div>
          <BottomMenu themeCollapsed={themeCollapsed} />
        </Flex>
      </Sider>
    </>
  );
};

export default InteractiveSidebar;
