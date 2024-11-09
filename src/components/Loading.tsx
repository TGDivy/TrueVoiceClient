import { Flex, Spin } from "antd";

const LoadingCustom = () => {
  return (
    <Flex justify="center" align="middle" style={{ height: "100%" }}>
      <Spin size="large" />
    </Flex>
  );
};

export default LoadingCustom;
