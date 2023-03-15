import React, { Component } from 'react'
import {Select, Form, Input, Modal,InputNumber,Popconfirm, Button, message, Row, Col } from "antd";
import api from '../api/axios';
import { InfoCircleOutlined, MinusSquareOutlined, SaveOutlined } from "@ant-design/icons";


export default class PopupTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
          mode: "add",
          visible: false,
          data:{},
          listUser:[]
        };
        this.formConfig = React.createRef();
      }
      
      filteredOptions =  [
        {key:"Chưa làm", value :1},
        {key:"Đang làm", value :2},
        {key:"Hoàn Thành", value :3},
    ]

    open = (id) => {
        if(id>0){
            this.setState({mode:"update"})
            this.getTaskByID(id);
        }
        this.setState({visible:true})
        this.getAllUser();
    }

    getAllUser = () =>{
        api.get('/User/GetAll').then(res=>{
            this.setState({listUser:res})
        })
    }

    getTaskByID = (id)=>{
        api.get('/Task/GetById?id='+id).then(res=>{
            debugger
            this.setState({data:res},()=>{
                this.formConfig.current.resetFields();
                this.formConfig.current.setFieldsValue({
                Name: this.state.data.name,
                Percent: this.state.data.percent,
                Status: this.state.data.status,
                Users: this.state.data.users.split(','),
                Note: this.state.data.note,
                Decription: this.state.data.decription,
          });
            })
        })
    }

    close = () =>{
        this.setState({mode: "add",
        visible: false,
        data:{},
        listUser:[]})
    }

    renderListOption = (data, displayCol, valCol) => {
        if (data && data.length > 0) {
          var listOption = data.map((item) => {
            return { label: item[displayCol], value: item[valCol] };
          });
    
          return listOption;
        }
        return [];
      };

      onFinish = (data) => {
        var dataPost = {}
        if(this.state.mode === "add"){
            dataPost.ID = 0
        }else{
            dataPost.ID=this.state.data.id
        }
        dataPost={...dataPost,...data}
        dataPost.Users = dataPost.Users?.join(',')
        this.saveTask(dataPost)
      };

      saveTask=(data)=>{
        if(this.state.mode === "add"){
            api.post('/Task/AddNew', data).then(res=>{
                message.success("Lưu thành công")
                this.props.reload();
            }).catch(err=>{
                message.error("Lưu thất bại")
            })
        }
        else{
            api.put('/Task/Update', data).then(res=>{
                message.success("Lưu thành công")
                this.props.reload();
            }).catch(err=>{
                message.error("Lưu thất bại")
            })
        }
        this.close();
        
        
    }

    userLogin = JSON.parse(localStorage.getItem("user"));


  render() {
    return (
      <>
      <Modal
      visible={this.state.visible}
      title={"Chi tiết công viêc"}
      //onOk={this.handleOk}
      okText={"Lưu"}
      onCancel={this.close}
      cancelText={"Đóng"}          
      footer={[
        [
          <Button key="configLinking" type="danger" icon={<MinusSquareOutlined />} onClick={() => this.close()}>
            Hủy
          </Button>
        ],
        [
          <Button key="saveConfig" type="primary" onClick={() => this.formConfig.current.submit()} icon={<SaveOutlined />}>
            Lưu cấu hình
          </Button>,
        ],
      ]} >
        <Form
            name="basic"
            ref={this.formConfig}
            initialValues={{
                Status:1,
                Percent:0
            }}
            size="middle"
            onFinish={this.onFinish}
            layout="vertical"
          >
            <Form.Item
              style={{ marginBottom: "8px" }}
              name="Name"
              label={"Tên Task"}
              rules={[
                {
                  required: true,
                  message: 'vui lòng nhập tên task',
                },
              ]}
            >
              <Input
                style={{
                  width: "100%",
                }}
                disabled={this.userLogin.role!=="Admin"?true:false}
              />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "8px" }}
              name="Decription"
              label={"Chi Tiết"}
            >
              <Input
                style={{
                  width: "100%",
                }}
                disabled={this.userLogin.role!=="Admin"?true:false}
              />
            </Form.Item>
            <Form.Item name="Status" label="Trạng thái công việc" style={{ marginBottom: "8px" }}>
              <Select  options={this.renderListOption(this.filteredOptions, "key", "value")} />
            </Form.Item>
            <Form.Item name="Users" label="Người thực hiện" style={{ marginBottom: "8px" }} rules={[
                {
                  required: true,
                  message: 'vui lòng thêm người thực hiện',
                },
              ]}>
              <Select mode='multiple' options={this.renderListOption(this.state.listUser, "name", "userName")} disabled={this.userLogin.role!=="Admin"?true:false} />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: "8px" }}
              name="Note"
              label={"Ghi chú"
              }
            >
              <Input
                style={{
                  width: "100%",
                }}
                
              />
            </Form.Item>
            

            <Form.Item
              style={{ marginBottom: "8px" }}
              name="Percent"
              label={"Tiến độ"
              }
            >
              <InputNumber
                style={{
                  width: "100%",
                }}
                max={100}
              />
            </Form.Item>
         
          </Form>
    </Modal>
    </>
    )
  }
}
