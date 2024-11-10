import { Button, Drawer, Flex, Typography } from "antd";

import { MenuOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Header, useBreakpoint, useToken } from "src/utils/antd_components";
import UserProfile from "./UserProfile";
import { BottomMenu, TopMenu } from "./menu_items";

const MainHeader = () => {
  const [drawer, setDrawer] = useState(false);
  const { token } = useToken();
  const breaks = useBreakpoint();

  const location = useLocation();

  const isInteract = location.pathname.includes("/interact");

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
          {!breaks.sm && (
            <Button
              shape="circle"
              type="text"
              size="large"
              onClick={() => setDrawer(!drawer)}
              icon={<MenuOutlined />}
            />
          )}
          <Link
            to="/"
            style={{
              display: "flex",
              gap: token.sizeXS,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {breaks.sm && <img src="/logos/logo.svg" height={26} alt="logo" />}
            <Typography.Title level={5}>Polis</Typography.Title>
          </Link>
        </div>

        <UserProfile />
      </Header>
      {!breaks.sm && (
        <Drawer
          open={drawer}
          onClose={() => setDrawer(false)}
          // title="Settings"
          placement="left"
          width={"100%"}
          styles={{
            body: {
              padding: "0px",
              position: "relative",
            },
            content: {
              backgroundColor: token.colorBgLayout,
            },
          }}
        >
          <Flex
            vertical
            style={{ height: "100%", padding: "12px 0px" }}
            justify="space-between"
          >
            <TopMenu
              themeCollapsed={false}
              onSelect={() => {
                setDrawer(false);
              }}
            />
            <BottomMenu
              themeCollapsed={false}
              onSelect={() => {
                setDrawer(false);
              }}
            />
          </Flex>
        </Drawer>
      )}
    </>
  );
};

export default MainHeader;
