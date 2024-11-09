import {
  HourglassOutlined,
  InfoOutlined,
  MoonOutlined,
  OrderedListOutlined,
  ProjectOutlined,
  ReadOutlined,
  SettingOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { Flex, Menu, Switch } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/hooks/useItems";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useProjectStore from "src/stores/projects_store";
import useUserStore from "src/stores/user_store";

const settingsItems: ItemType<MenuItemType>[] = [
  {
    key: "philosophy",
    label: <Link to="/philosophy">Principles</Link>,
    icon: <InfoOutlined />,
  },
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
  const projects = useProjectStore((state) => state.projects);
  const navigate = useNavigate();
  const mainItems: ItemType<MenuItemType>[] = [
    {
      key: "focus",
      label: <Link to="/focus">Focus</Link>,
      icon: <HourglassOutlined />,
    },
    {
      key: "projects",
      label: "Projects",
      icon: <ProjectOutlined />,
      onTitleClick: () => {
        navigate("/projects");
      },
      children: projects.map((project) => ({
        key: project._id,
        label: <Link to={`/projects/${project._id}`}>{project.title}</Link>,
        icon: project?.emoji?.skins[0].native,
        style: {
          lineHeight: "28px",
          height: "28px",
          gap: "8px",
          marginTop: "8px",
        },
      })),
    },
    {
      key: "tasks",
      label: <Link to="/tasks">Tasks</Link>,
      icon: <OrderedListOutlined />,
    },
    {
      key: "journals",
      label: <Link to="/journals">Journal</Link>,
      icon: <ReadOutlined />,
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
