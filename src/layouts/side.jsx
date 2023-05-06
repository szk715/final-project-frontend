import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MenuFoldOutlined,
  MailOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Menu } from "antd";
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const MenuSide = () => {
  // const items =
  const [collapsed, setCollapsed] = useState(false);
  const [type, setType] = useState(0);
  const items = useMemo(() => {
    if (+type === 0) {
      return [
        getItem(
          <Link to={"/mirror"}>镜像管理</Link>,
          "1",
          <PieChartOutlined />
        ),
        getItem(
          <Link to={"/scene"}>场景管理</Link>,
          "2",
          <ContainerOutlined />
        ),
        getItem(
          <Link to={"/weapon"}>武器管理</Link>,
          "3",
          <ContainerOutlined />
        ),
        getItem(<Link to={"/range"}>靶机管理</Link>, "4", <DesktopOutlined />),
        getItem(<Link to={"/game"}>比赛管理</Link>, "5", <MailOutlined />),
        getItem(
          <Link to={"/manage-user"}>个人信息管理</Link>,
          "6",
          <AppstoreOutlined />
        ),
      ];
    } else if (+type === 1) {
      return [
        getItem(<Link to={"/"}>评分</Link>, "1", <PieChartOutlined />),
        getItem(<Link to={"/judge"}>判罚</Link>, "2", <ContainerOutlined />),
      ];
    } else if (+type === 2 || +type === 3) {
      return [
        getItem(
          <Link to={"/weapon"}>武器管理</Link>,
          "1",
          <PieChartOutlined />
        ),
        getItem(
          <Link to={"/person"}>参赛信息</Link>,
          "2",
          <PieChartOutlined />
        ),
        getItem(
          <Link to={"/applygame"}>申请比赛</Link>,
          "3",
          <ContainerOutlined />
        ),
        getItem(<Link to={"/join"}>正式比赛</Link>, "4", <ContainerOutlined />),
      ];
    } else {
      return [];
    }
  }, [type]);

  useState(() => {
    const local = localStorage.getItem("type");
    setType(local);
  }, []);
  return (
    <div className="menu-side">
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};
export default MenuSide;
