import { Button, Input, Checkbox } from "antd";
import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import AddItemComponent from "../addItem/index";
interface IState {
  listToDoEdit: any[];
  defaultListToDo: any[];
}
function ToDoListComponent(props) {
  const [state, setState] = useState<IState>({
    listToDoEdit: [],
    defaultListToDo: [],
  });
  useEffect(() => {
    setState((state) => ({
      ...state,
      listToDoEdit: props.listToDo,
      defaultListToDo: props.listToDo,
    }));
  }, []);
  const { listToDoEdit, defaultListToDo } = _.cloneDeep(state);
  const onShowDetails = (id, type) => () => {
    const indexDef = defaultListToDo.findIndex((x) => x.id === id);
    const index = listToDoEdit.findIndex((x) => x.id === id);
    const list = _.cloneDeep(listToDoEdit);
    const listDef = _.cloneDeep(defaultListToDo);
    if (type === "checkbox") {
      list[index].isChecked = !listToDoEdit[index].isChecked;
      listDef[indexDef].isChecked = !defaultListToDo[indexDef].isChecked;
    } else {
      list[index].showDetails = !listToDoEdit[index].showDetails;
      listDef[indexDef].showDetails = !defaultListToDo[indexDef].showDetails;
    }
    setState((state) => ({
      ...state,
      listToDoEdit: list,
      defaultListToDo: listDef,
    }));
  };
  const transferDataToListToDo = useCallback(
    (data, index) => {
      const list = _.cloneDeep(listToDoEdit);
      list[index].title = data.title;
      list[index].date = data.date;
      list[index].description = data.description;
      list[index].priority = data.priority;
      list[index].showDetails = false;
      props.updateList(list);
      setState((state) => ({
        ...state,
        listToDoEdit: list,
      }));
    },
    [listToDoEdit]
  );

  const removeItem = (index) => () => {
    const id = listToDoEdit[index].id;
    const list = _.cloneDeep(defaultListToDo).filter((x) => x.id !== id);
    const arrEdit = _.cloneDeep(listToDoEdit).filter((x) => x.id !== id);
    props.updateList(list);
    setState((state) => ({
      ...state,
      listToDoEdit: arrEdit,
      defaultListToDo: list,
    }));
  };

  const renderListToDo = () => {
    return listToDoEdit.map((item, index) => {
      return (
        <>
          <div
            key={index}
            style={{
              border: "2px solid gray",
              marginRight: "10px",
              marginLeft: "10px",
              borderRadius: "10px",
              marginBottom: "20px",
              marginTop: "20px",
            }}
          >
            <Checkbox
              checked={item.isChecked}
              onChange={onShowDetails(item.id, "checkbox")}
              style={{ marginRight: "195px" }}
            >
              {item.title}
            </Checkbox>
            <Button
              onClick={onShowDetails(item.id, "detail")}
              type="primary"
              style={{ marginRight: "15px", height: "40px", borderRadius: "10px" }}
            >
              Detail
            </Button>
            <Button onClick={removeItem(index)} type="primary" style={{ height: "40px", borderRadius: "10px" }} danger>
              Remove
            </Button>
          </div>
          <div className="each-item">
            {item.showDetails ? (
              <AddItemComponent index={index} transferDataToListToDo={transferDataToListToDo} data={item} />
            ) : (
              ""
            )}
          </div>
        </>
      );
    });
  };
  const removeAllCheckec = () => {
    const listDef = _.cloneDeep(defaultListToDo).filter((x) => !x.isChecked);
    const list = _.cloneDeep(listToDoEdit).filter((x) => !x.isChecked);
    props.updateList(list);
    setState((state) => ({
      ...state,
      listToDoEdit: list,
      defaultListToDo: listDef,
    }));
  };
  const debounced = _.debounce((input) => {
    const list = state.defaultListToDo.filter((i) => {
      i.indexOfInputSearch = i.title.toUpperCase().indexOf(input);
      return i.indexOfInputSearch > -1;
    });
    setState((state) => ({
      ...state,
      listToDoEdit: list,
    }));
  }, 500);
  const searchMessage = (e) => {
    const input = e.target.value.trim().toUpperCase();
    debounced(input);
  };
  const checked = listToDoEdit.find((item) => item.isChecked);
  return (
    <div>
      <h2 className="new">New Task</h2>
      <div style={{ marginLeft: "10px", marginBottom: "10px", marginTop: "10px" }}>
        <Input onChange={searchMessage} className="input-new" placeholder="Search" />
      </div>
      <div>{renderListToDo()}</div>
      {checked ? (
        <div
          style={{
            border: "2px solid gray",
            marginRight: "10px",
            marginLeft: "10px",
            borderRadius: "10px",
            marginBottom: "20px",
            marginTop: "20px",
            backgroundColor: "gray",
          }}
        >
          <p style={{ color: "white", fontWeight: "bold", fontSize: "15px" }}>Bulk Action:</p>
          <Button type="primary" style={{ marginRight: "15px", height: "40px", borderRadius: "10px" }}>
            Done
          </Button>
          <Button onClick={removeAllCheckec} type="primary" style={{ height: "40px", borderRadius: "10px" }} danger>
            Remove
          </Button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
export default React.memo(ToDoListComponent);
