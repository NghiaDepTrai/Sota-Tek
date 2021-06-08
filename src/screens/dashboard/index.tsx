import _ from "lodash";
import "./styles.scss";
import React, { useState, useCallback } from "react";
import HeaderComponent from "./layout/header";
import AddItemComponent from "./addItem/index";
import ToDoListComponent from "./todoList/index";
interface IState {
  typeSelected: string;
  listToDo: object[];
}
export default function DashboardComponent() {
  const list = localStorage.getItem("listToDo");
  const [state, setState] = useState<IState>({ typeSelected: "add", listToDo: JSON.parse(list) || [] });
  const { typeSelected, listToDo } = state;
  const changeTypeSelected = useCallback(
    (typeSelected) => {
      setState((state) => ({
        ...state,
        typeSelected,
      }));
    },
    [typeSelected]
  );
  const transferDataAdd = useCallback(
    (data) => {
      listToDo.push(data);
      localStorage.setItem("listToDo", JSON.stringify(listToDo));
      setState((state) => ({
        ...state,
        listToDo,
        typeSelected: "list",
      }));
    },
    [listToDo]
  );
  const updateList = useCallback(
    (listToDo) => {
      localStorage.setItem("listToDo", JSON.stringify(listToDo));
      setState((state) => ({
        ...state,
        listToDo,
        typeSelected: "list",
      }));
    },
    [listToDo]
  );
  return (
    <div>
      <HeaderComponent changeTypeSelected={changeTypeSelected} typeSelected={typeSelected} />
      <div className="page-container">
        <div className="main">
          {typeSelected === "add" ? (
            <AddItemComponent transferDataAdd={transferDataAdd} />
          ) : (
            <ToDoListComponent updateList={updateList} listToDo={listToDo} />
          )}
        </div>
      </div>
    </div>
  );
}
