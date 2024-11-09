import { Button, Card, Result } from "antd";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <Card bordered={false}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link to="/">
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    </Card>
  );
};

export default PageNotFound;
