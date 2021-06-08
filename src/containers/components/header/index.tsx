import { Button } from "antd";
import React from "react";
import "./styles.scss";
export function HeaderComponent(props) {
  return (
    <header className={`header`}>
      <div className="header-content flex-middle">
        <Button className="btn-expand" onClick={() => props.setStatusSidebarAction(!props.isOpenSidebar)}>
          <i className="fa fa-bars" aria-hidden="true" />
        </Button>
        <div className="logo"></div>
        <div className="head-component flex-middle"></div>
      </div>
    </header>
  );
}
