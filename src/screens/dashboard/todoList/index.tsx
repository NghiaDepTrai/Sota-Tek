import { Button, Input, Checkbox } from "antd";
import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import AddItemComponent from "../addItem/index";
interface IState {
  listToDoEdit: any[];
}
function ToDoListComponent(props) {
  const [state, setState] = useState<IState>({
    listToDoEdit: [],
  });
  useEffect(() => {
    setState((state) => ({
      ...state,
      listToDoEdit: props.listToDo,
    }));
  }, []);
  const { listToDoEdit } = state;
  const onShowDetails = (index, type) => () => {
    if (type === "checkbox") {
      listToDoEdit[index].isChecked = !listToDoEdit[index].isChecked;
    } else {
      listToDoEdit[index].showDetails = !listToDoEdit[index].showDetails;
    }
    setState((state) => ({
      ...state,
      listToDoEdit,
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
    const list = _.cloneDeep(listToDoEdit).filter((x, pindex) => x && index !== pindex);
    props.updateList(list);
    setState((state) => ({
      ...state,
      listToDoEdit: list,
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
              onChange={onShowDetails(index, "checkbox")}
              style={{ marginRight: "195px" }}
            >
              {item.title}
            </Checkbox>
            <Button
              onClick={onShowDetails(index, "detail")}
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
    const list = _.cloneDeep(listToDoEdit).filter((x) => !x.isChecked);
    props.updateList(list);
    setState((state) => ({
      ...state,
      listToDoEdit: list,
    }));
  };
  const checked = listToDoEdit.find((item) => item.isChecked);
  return (
    <div>
      <h2 className="new">New Task</h2>
      <div style={{ marginLeft: "10px", marginBottom: "10px", marginTop: "10px" }}>
        <Input className="input-new" placeholder="Add new task" />
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
