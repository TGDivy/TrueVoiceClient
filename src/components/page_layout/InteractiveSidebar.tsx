import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Col, Flex, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useParams } from "react-router-dom";
import { getCommentSummary } from "src/api/conversation";
import { Sider, useToken } from "src/utils/antd_components";
import { useLocalStorageState } from "src/utils/hooks";

const AISummary = () => {
  const topicId = useParams<{ topicId: string }>().topicId;
  const [commentSummary, setCommentSummary] = useState<string>("Hello");
  useEffect(() => {
    if (!topicId) return;
    getCommentSummary(topicId).then((summary) => {
      setCommentSummary(summary.summary);
    });
  }, [topicId]);

  return (
    <Flex
      vertical
      style={{
        padding: "0px 12px",
        width: "100%",
        height: "100%",
        overflow: "auto",
      }}
    >
      <Alert message="Summary of Discussions" type="info" showIcon />
      <Markdown className="tiptapJournal2">{commentSummary}</Markdown>
    </Flex>
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
        width={364}
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
        width={364}
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
        </Flex>
      </Sider>
    </>
  );
};

export default InteractiveSidebar;
