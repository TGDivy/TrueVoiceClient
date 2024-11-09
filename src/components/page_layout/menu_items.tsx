import {
  MoonOutlined,
  ProjectOutlined,
  SettingOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { Flex, Menu, Switch } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useTopicStore from "src/stores/topics_store";
import useUserStore from "src/stores/user_store";

const settingsItems: ItemType<MenuItemType>[] = [
  {
    key: "settings",
    label: <Link to="/settings">Settings</Link>,
    icon: <SettingOutlined />,
  },
];

interface BottomMenuProps {
  themeCollapsed?: boolean;
  onSelect?: () => void;
}

export const TopMenu = ({ onSelect, themeCollapsed }: BottomMenuProps) => {
  const location = useLocation();
  const theme = useUserStore((state) => state.theme);
  const topics = useTopicStore((state) => state.topics);
  const navigate = useNavigate();
  const mainItems: ItemType<MenuItemType>[] = [
    {
      key: "topics",
      label: "Conversations",
      icon: <ProjectOutlined />,
      onTitleClick: () => {
        navigate("/topics");
      },
      children: topics.map((topic) => ({
        key: topic.topic_id,
        label: <Link to={`/topics/${topic.topic_id}`}>{topic.title}</Link>,
        style: {
          lineHeight: "28px",
          height: "28px",
          gap: "8px",
          marginTop: "8px",
        },
      })),
    },
  ];
  const selectedKeys = location.pathname.split("/");
  return (
    <Flex
      vertical
      align="start"
      style={{
        padding: !themeCollapsed ? "0 12px" : "0",
      }}
    >
      <Menu
        mode="inline"
        title="Main Menu"
        selectedKeys={[...selectedKeys]}
        items={mainItems}
        style={{
          width: "100%",
          backgroundColor: "transparent",
          border: "none",
        }}
        subMenuCloseDelay={0.1}
        theme={theme}
        onSelect={onSelect}
      />
    </Flex>
  );
};

export const BottomMenu = ({ themeCollapsed, onSelect }: BottomMenuProps) => {
  const [theme, setTheme] = useUserStore((state) => [
    state.theme,
    state.setTheme,
  ]);
  const location = useLocation();

  return (
    <Flex
      vertical
      align="start"
      style={{
        padding: !themeCollapsed ? "0 12px" : "0",
      }}
    >
      <Menu
        mode="inline"
        title="User Area"
        selectedKeys={[location.pathname.split("/")[1]]}
        items={settingsItems}
        style={{
          width: "100%",
          backgroundColor: "transparent",
          border: "none",
        }}
        theme={theme}
        onSelect={onSelect}
      />
      <Flex
        // vertical
        justify="center"
        align="center"
        style={{
          alignSelf: !themeCollapsed ? "flex-end" : "center",
          padding: "12px",
        }}
      >
        <Switch
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          checked={theme === "dark"}
          onChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
      </Flex>
    </Flex>
  );
};
