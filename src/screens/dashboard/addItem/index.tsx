import { Button, Input, DatePicker } from "antd";
import React, { useState, useEffect } from "react";
import _ from "lodash";
const { TextArea } = Input;
import { Select } from "antd";
import moment from "moment";
const { Option } = Select;
interface IState {
  title: string;
  date: any;
  description: string;
  priority: string;
}
function AddItemComponent(props) {
  const [state, setState] = useState<IState>({
    title: "",
    date: moment(new Date()),
    description: "",
    priority: "Normal",
  });
  useEffect(() => {
    if (props.data) {
      const newState = props.data;
      newState.date = moment(props.data.date);
      setState((state) => ({
        ...state,
        ...newState,
      }));
    }
  }, [props.data]);
  const onChange = (value) => {
    setState((state) => ({
      ...state,
      date: moment(value),
    }));
  };
  const onChangeText = (type) => (event) => {
    const value = event.target.value;
    setState((state) => ({
      ...state,
      [type]: value,
    }));
  };
  const onChangeSelect = (value) => {
    setState((state) => ({
      ...state,
      priority: value,
    }));
  };
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current <= moment().endOf("month");
  };
  const transferDataAdd = () => {
    const data = _.cloneDeep(state);
    data.date = moment(state.date).format("YYYY-MM-DD");
    if (props.data) {
      props.transferDataToListToDo(data, props.index);
    } else {
      props.transferDataAdd(data);
    }
  };
  const { title, date, description, priority } = state;
  const text = props.data ? "Update" : "Add";
  return (
    <div>
      <h2 className="new">New Task</h2>
      <div style={{ marginLeft: "10px", marginBottom: "10px", marginTop: "10px" }}>
        <Input value={title} onChange={onChangeText("title")} className="input-new" placeholder="Add new task" />
      </div>
      <div style={{ marginLeft: "10px" }}>
        <p className="decription">Description</p>
        <TextArea
          value={description}
          onChange={onChangeText("description")}
          style={{ borderRadius: "10px" }}
          autoSize={{ minRows: 4, maxRows: 10 }}
        />
      </div>
      <div style={{ marginLeft: "10px", display: "inline-flex" }}>
        <div style={{ marginRight: "161px" }}>
          <p className="decription">Due Date</p>
          <DatePicker
            mode="month"
            picker="month"
            value={date}
            format={"MMM - YYYY"}
            onChange={onChange}
            style={{ width: "202px" }}
            disabledDate={disabledDate}
          />
        </div>
        <div>
          <p className="decription">Priority</p>
          <Select onChange={onChangeSelect} value={priority.toString()} style={{ width: 120 }}>
            <Option value="Low">Low</Option>
            <Option value="Normal">Normal</Option>
            <Option value="High">High</Option>
          </Select>
        </div>
      </div>
      <div style={{ marginLeft: "10px", marginTop: "50px" }}>
        <Button onClick={transferDataAdd} className="btn-add" disabled={title ? false : true}>
          {text}
        </Button>
      </div>
    </div>
  );
}
export default React.memo(AddItemComponent);
