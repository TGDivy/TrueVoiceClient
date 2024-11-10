import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { formatText } from "src/utils/text";

// set title based on url
const PageTitle = () => {
  const location = useLocation();
  // topicId
  const params = useParams<{ topicId: string }>();

  useEffect(() => {
    if (params.topicId) {
      // set title by formating url and getting the last part of the url
      const title = formatText(
        location.pathname.split("/")?.pop() || "TrueVoice"
      );
      document.title = title;
      return;
    } else {
      // set title by formating url and getting the last part of the url
      const title = formatText(
        location.pathname.split("/")?.pop() || "TrueVoice"
      );
      document.title = title;
    }
  }, [location]);

  return null;
};

export default PageTitle;
