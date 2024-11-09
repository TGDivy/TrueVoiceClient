import { SendOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Flex,
  Input,
  List,
  Tooltip,
  Typography,
  message,
} from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
// import { createProject } from "src/api/project";
import useProjectStore from "src/stores/projects_store";
import { useToken } from "src/utils/antd_components";
import { formatText } from "src/utils/text";

const CreateProject = () => {
  const [title, setTitle] = useState("");
  // const addProject = useProjectStore((state) => state.addProject);

  const handleCreateProject = async () => {
    try {
      // const project = await createProject({ title, completed: false });
      setTitle("");
      message.success("Project created");
      // addProject(project);
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
      console.error(error);
    }
  };

  return (
    <Flex>
      <Input
        placeholder="Create a new project"
        variant="filled"
        size="large"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onPressEnter={handleCreateProject}
        styles={{
          affixWrapper: {
            borderRadius: "80px",
            padding: "16px 32px",
          },
        }}
        suffix={
          <Tooltip title="Submit">
            <Button
              type="text"
              size="small"
              onClick={handleCreateProject}
              icon={<SendOutlined />}
              style={{
                opacity: title ? 1 : 0,
              }}
            />
          </Tooltip>
        }
      />
    </Flex>
  );
};

const ProjectsPage = () => {
  const [projects, loading] = useProjectStore((state) => [
    state.projects,
    state.loading,
  ]);

  const { token } = useToken();
  const [hover, setHover] = useState<string>();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100svh - 102px)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <List
          style={{
            height: "100%",
            padding: "16px 16px",
            maxWidth: "850px",
            width: "100%",
          }}
          loading={loading}
          dataSource={projects || []}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          renderItem={(item) => (
            <List.Item>
              <Link to={`/projects/${item._id}`}>
                <Card
                  style={{
                    height: "200px",
                    position: "relative",
                  }}
                  hoverable
                  // onHover
                  onMouseEnter={() => setHover(item._id as unknown as string)}
                  onMouseLeave={() => setHover(undefined)}
                  bordered={false}
                >
                  <Typography.Text strong>
                    {formatText(item.title)}
                  </Typography.Text>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      padding: "14px",
                    }}
                  >
                    {item.emoji && (
                      <Avatar
                        size="large"
                        style={{
                          backgroundColor: token.colorBgLayout,
                          border:
                            hover === item._id
                              ? `2px solid ${token.colorBorder}`
                              : "none",
                        }}
                      >
                        {item.emoji.skins[0].native}
                      </Avatar>
                    )}
                  </div>
                </Card>
              </Link>
            </List.Item>
          )}
        />
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          alignSelf: "center",
          // box shadow above to fade out the list
          boxShadow: `0px 0px 20px 10px ${token.colorBgLayout}`,
          zIndex: 100,
        }}
      >
        <CreateProject />
      </div>
    </div>
  );
};

export default ProjectsPage;
