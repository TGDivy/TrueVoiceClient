import { Button, Layout, Result } from "antd";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useUserStore from "src/stores/user_store";
import { useBreakpoint } from "src/utils/antd_components";
import ErrorBoundary from "../ErrorBoundary";
import MainHeader from "./MainHeader";
import MainSideBar from "./MainSideBar";

const DefaultLayout = () => {
  const breaks = useBreakpoint();
  const user = useUserStore((state) => state.user);
  const location = useLocation();

  if (!user && location.pathname !== "/signup") {
    // message.error("You must be logged in to view this page.");
    return <Navigate to="/signup" />;
  }

  if (user && location.pathname === "/signup") {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Layout>
        {breaks.sm && <MainSideBar />}
        <Layout>
          <MainHeader />
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

export default DefaultLayout;
