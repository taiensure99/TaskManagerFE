import React, { Component } from 'react'
import "antd/dist/antd.css";
import { Table, Select, Form, Button, Tag } from "antd";
import api from '../api/axios';
import PopupTask from './PopupTask';


class Task extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            listTask:[],
            modeSelect:0
         };
         this.popup = React.createRef();
      }

      filteredOptions =  [
        {key:"Tất cả", value :0},
        {key:"Chưa làm", value :1},
        {key:"Đang làm", value :2},
        {key:"Hoàn Thành", value :3},
    ]

        userLogin = JSON.parse(localStorage.getItem("user"));
      componentDidMount=()=>{
        this.getDataSelect(this.state.modeSelect);
      }

      reloadTable = () =>{
        this.getDataSelect(this.state.modeSelect);
      }

      getDataSelect = (dataPost) =>{
        var user  = JSON.parse(localStorage.getItem("user"));
        var data = {};
        data.UserName = user.userName;
        data.Status = dataPost;
        api.post('/Task/GetListCondition',data).then((res)=>{
            this.setState({listTask:res})
        })
      }
    
      columns = [
        {
          title: "Tên Task",
          dataIndex: "name",
          align: "center",
        },
        {
          title: "Trạng Thái",
          dataIndex: "status",
          align: "center",
          render: (_, {status}) => {
            var statusName = "Chưa làm";
            if(status == 2) statusName = "Đang làm"
            if(status == 3) statusName = "Hoành thành"
            return (
              <>
                <Tag>{statusName}</Tag>
              </>
            );
          },
        },
        {
          title: "Chi Tiết",
          dataIndex: "decription",
          align: "center",
        },
        {
          title: "Tiến độ",
          dataIndex: "percent",
          align: "center",
        },
        {
          title: "Người làm",
          dataIndex: "users",
          align: "center",
        },
        {
          title: "Action",
          dataIndex: "action",
          align: "center",
          render: (_, record) => {
            return (
              <>
                <Button type="" style={{ background: "#85c1f9" }} onClick={() => this.popup.current.open(record.id)}>
                  Chi Tiết
                </Button>
              </>
            );
          },
        },
      ];

      handleChange = (selectedItems) => {
        this.setState({ modeSelect: selectedItems },()=>{
            this.getDataSelect(selectedItems);
        });
      };
    
  render() {
    return (
      <>
      <div>
                <Button onClick={() => this.props.login()}>Đăng xuất</Button>
                
       </div>
      <div style={{ width: 1000, marginLeft: 200 }}>

      <Select
                placeholder="Vui lòng chọn danh sách người xác nhận"
                value={this.state.modeSelect}
                onChange={this.handleChange}
                style={{ width: "100%" }}
              >
                {this.filteredOptions.map((item) => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.key}
                  </Select.Option>
                ))}
              </Select>
              
      </div>
      {this.userLogin.role ==="Admin"&&(<div>
                <Button onClick={() => this.popup.current.open(0)}>Thêm mới</Button>
       </div>)}
      
      
      <Table
      rowKey={(record) => record.id}
      dataSource={this.state.listTask}
      columns={this.columns}
      pagination
      // pagination={pagination}
      bordered
    />
    <PopupTask ref={this.popup} reload={this.reloadTable}></PopupTask>
    </>
    )
  }
}

export default Task
