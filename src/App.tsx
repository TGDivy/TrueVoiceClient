import {
  App as AntdApp,
  ConfigProvider,
  Empty,
  FloatButton,
  Layout,
} from "antd";
import "antd/dist/reset.css";
import { Outlet, Route, Routes } from "react-router-dom";
import PageTitle from "./components/PageTitle";
import DefaultLayout from "./components/page_layout/DefaultLayout";
import "./global.css";
import { HomePage } from "./pages/HomePage";
import PageNotFound from "./pages/Misc/PageNotFound";
import TopicsPage from "./pages/Topic/TopicsPage";
import SettingsPage from "./pages/SettingsPage";
import { SignUpPage } from "./pages/Misc/SignUpPage";
import useUserStore from "./stores/user_store";
import { useBreakpoint } from "./utils/antd_components";
import { themes } from "./utils/themes";
import HandleServiceWorker from "./utils/HandleSW";
import InteractLayout from "./components/page_layout/InteractLayout";
import InteractTopicPage from "./pages/InteractTopicPage";
import TopicPage from "./pages/Topic/TopicPage";
import ModerateTopicPage from "./pages/Topic/ModerateTopicPage";

const CustomizeRenderEmpty = () => {
  return (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={`You have no data yet.`}
    ></Empty>
  );
};

function App() {
  const user = useUserStore((state) => state.user);
  const usertheme = useUserStore((state) => state.theme);
  const breaks = useBreakpoint();

  if (user === undefined) {
    return null;
  }

  return (
    <AntdApp>
      <ConfigProvider
        theme={{
          algorithm: themes[usertheme].algorithm,
          cssVar: true,
          hashed: false,
          token: {
            colorPrimary: themes[usertheme].colorPrimary,
            fontFamily: "Open Sans, Helvetica Neue,sans-serif",
            colorBgBase: themes[usertheme].colorBgBase,
            fontSize: !breaks.sm ? 16 : 16,
          },
          components: {
            Typography: {
              titleMarginBottom: "0",
              titleMarginTop: "0",
            },
            Collapse: {
              contentPadding: "0px",
              headerPadding: "0px",
              padding: 0,
            },
          },
        }}
        renderEmpty={CustomizeRenderEmpty}
      >
        <HandleServiceWorker />
        <Layout
          className="layout"
          style={{
            minHeight: "100svh",
            height: "100%",
          }}
        >
          <Routes>
            <Route
              path=""
              element={
                <>
                  <Outlet />
                </>
              }
            >
              <Route path="" element={<DefaultLayout />} key={"home_page"}>
                <Route path="" element={<HomePage />} />
                <Route path="signup" element={<SignUpPage />} />
                <Route path="topics" element={<TopicsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="topics/:topicId" element={<TopicPage />} />
                <Route
                  path="topics/:topicId/moderate"
                  element={<ModerateTopicPage />}
                />
                <Route
                  path="topics/:topicId/preview"
                  element={<InteractTopicPage />}
                />
              </Route>
              <Route
                path="interact"
                element={<InteractLayout />}
                key={"interact"}
              >
                <Route
                  path="topic/:topicId/*"
                  element={<InteractTopicPage />}
                />
                <Route path="*" element={<PageNotFound />} />
              </Route>
            </Route>
          </Routes>
          <FloatButton.BackTop />
        </Layout>
      </ConfigProvider>
      <PageTitle />
    </AntdApp>
  );
}

export default App;
