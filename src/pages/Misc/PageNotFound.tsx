import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (
      document.referrer &&
      new URL(document.referrer).origin === window.location.origin
    ) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={handleBack}>
          Back
        </Button>
      }
    />
  );
};

export default PageNotFound;
