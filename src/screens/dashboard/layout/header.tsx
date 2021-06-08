import { Button } from "antd";
import React from "react";
import "./styles.scss";
function HeaderComponent(props) {
  const changeTypeSelected = (type) => () => {
    props.changeTypeSelected(type);
  };
  return (
    <header className={`header`}>
      <div className="header-content flex-middle">
        <div className="logo">
          <Button onClick={changeTypeSelected("add")} type={props.typeSelected === "add" ? "primary" : "default"}>
            Add new
          </Button>
          <Button
            onClick={changeTypeSelected("list")}
            type={props.typeSelected === "list" ? "primary" : "default"}
            style={{ marginLeft: "20px" }}
          >
            To Do list
          </Button>
        </div>
      </div>
    </header>
  );
}
export default React.memo(HeaderComponent);
