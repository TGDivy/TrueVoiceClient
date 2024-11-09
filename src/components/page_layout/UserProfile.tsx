import { LogoutOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Empty,
  Flex,
  Popover,
  Tooltip,
  Typography,
  message,
} from "antd";
import { signOut } from "firebase/auth";
import { auth } from "src/api/firebase/firebase_init";
import useUserStore from "src/stores/user_store";
import { useBreakpoint } from "src/utils/antd_components";

const UserProfile = () => {
  const [user, userInfo] = useUserStore((state) => [
    state.user,
    state.userInfo,
  ]);
  const breaks = useBreakpoint();

  const signUserOut = async () => {
    try {
      await signOut(auth);
      message.success("Signed out successfully");
    } catch (error) {
      message.error("Error signing out");
    }
  };

  return user ? (
    <Popover
      placement="bottomLeft"
      title={
        <Flex justify="space-between" align="center">
          <Typography.Text strong>Stats</Typography.Text>
          <Tooltip title="Sign out">
            <Button
              type="primary"
              shape="circle"
              size="small"
              onClick={signUserOut}
              icon={<LogoutOutlined />}
            />
          </Tooltip>
        </Flex>
      }
      content={
        <>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Feature coming soon!"
          />
        </>
      }
    >
      <Button
        type="text"
        icon={<Avatar size="small" src={userInfo.profilePicture} />}
      >
        {!breaks.sm ? "" : userInfo.name}
      </Button>
    </Popover>
  ) : null;
};

export default UserProfile;
