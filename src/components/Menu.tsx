import  { CSSProperties, useState } from "react";
import {
  AppstoreFilled,
  AppstoreTwoTone,
  BorderOutlined,
  Html5Outlined,
  InboxOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Menu } from "antd";
import { useDrag } from "react-dnd";
import { v4 as uuidv4 } from "uuid";

const SidebarItem = ({ name }: { name: string }) => {
  const [, drag] = useDrag({
    type: "COMPONENT",
    item: () => ({ id: uuidv4(), name }),
  });

  const sidebarItemStyle: CSSProperties = {
    width: "160px",
    cursor: "grab",
    fontSize: "16px",
    color: "#333",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.3s ease",
    textAlign: "left",
  };

  return (
    <div ref={drag} style={sidebarItemStyle}>
      {name}
    </div>
  );
};

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "1",
    icon: <InboxOutlined style={{ fontSize: "15px" }} />,
    label: <SidebarItem name="Box" />,
  },
  {
    key: "2",
    icon: <BorderOutlined style={{ fontSize: "15px" }} />,
    label: <SidebarItem name="Button" />,
  },
  {
    key: "3",
    icon: <PictureOutlined style={{ fontSize: "15px" }} />,
    label: <SidebarItem name="Image" />,
  },
  {
    key: "4",
    icon: <Html5Outlined style={{ fontSize: "15px" }} />,
    label: <SidebarItem name="Custom Html" />,
  },
];

export default function SideBar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const style: CSSProperties = {
    width: 300,
    backgroundColor: "white",
    border: "1px solid gray",
    padding: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
    borderRadius: "8px",
  };

  return (
    <div style={style}>
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{ marginBottom: 16 }}
      >
        {collapsed ? <AppstoreTwoTone /> : <div style={{display:"flex", flexDirection:'row' ,gap:'20px'}}><AppstoreFilled /> <h1 style={{fontSize:'15px'}}>Elements</h1> </div>}
      </Button>
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="light"
        inlineCollapsed={collapsed}
        items={items}
        style={{ padding: "4px" }}
      />
    </div>
  );
}
