import { Card, Typography, Avatar } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { useToken } from "src/utils/antd_components";

type Props = {
  to: string;
  title: string;
  icon: React.ReactNode;
};

const LinkCard = (props: Props) => {
  const { to, title, icon } = props;
  const { token } = useToken();
  return (
    <Link to={to}>
      <Card
        style={{
          width: "200px",
          height: "200px",
        }}
        hoverable
        bordered={false}
      >
        <Typography.Text>{title}</Typography.Text>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            padding: "14px",
          }}
        >
          <Avatar
            size="large"
            style={{
              backgroundColor: token.colorFill,
            }}
          >
            {icon}
          </Avatar>
        </div>
      </Card>
    </Link>
  );
};

export default LinkCard;
