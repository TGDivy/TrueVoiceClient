import { Button, Layout, Result } from "antd";
import { Outlet } from "react-router-dom";
import { useBreakpoint } from "src/utils/antd_components";
import ErrorBoundary from "../ErrorBoundary";
import InteractHeader from "./InteractHeader";

const InteractLayout = () => {
  const breaks = useBreakpoint();

  return (
    <>
      <Layout>
        <Layout>
          <InteractHeader />
          <Layout.Content
            style={{
              padding: breaks.sm ? "20px 40px" : "20px 20px",
              height: "100%",
            }}
          >
            <ErrorBoundary
              fallback={
                <Result
                  status="500"
                  title="500"
                  subTitle="Sorry, something went wrong."
                  extra={<Button type="primary">Back Home</Button>}
                />
              }
            >
              <Outlet />
            </ErrorBoundary>
          </Layout.Content>
        </Layout>
      </Layout>
      {/* <MainFooter /> */}
    </>
  );
};

export default InteractLayout;
