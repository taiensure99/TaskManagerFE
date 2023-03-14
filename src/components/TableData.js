import "antd/dist/antd.css";
import { Table, Select, DatePicker, Form, Button, Modal } from "antd";
import React, { Component } from "react";
import axios from "axios";
import Loading from "./loading";
import "./TableData.css";

let OPTIONS = [];
const filterSearch = {
  start: "2019-01-01",
  end: "2022-05-01",
  user: null,
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

export default class TableData extends Component {
  formRef = React.createRef();
  state = {
    dataSource: [],
    selectedItems: [],
    loading: false,
    visible: false,
    dataSourceOfMonth: [],
    monthOfYear: "",
    tongThanhCong: 0,
    tongChuyenHang: 0,
    tongChuyenHoan: 0,
    tongThanhCongThang: 0,
    tongChuyenHangThang: 0,
    tongChuyenHoanThang: 0,
    pagination: {
      current: 1,
      pageSize: 10,
    },
  };

  columns = [
    {
      title: "Tháng",
      dataIndex: "thang",
      align: "center",
    },
    {
      title: "Năm",
      dataIndex: "nam",
      align: "center",
    },
    {
      title: "Thành công",
      dataIndex: "thanhcong",
      sorter: {
        compare: (a, b) => a.thanhcong - b.thanhcong,
        multiple: 1,
      },
      align: "center",
    },
    {
      title: "Chuyển hàng",
      dataIndex: "chuyenhang",
      sorter: {
        compare: (a, b) => a.chuyenhang - b.chuyenhang,
        multiple: 2,
      },
      align: "center",
    },
    {
      title: "Chuyển hoàn",
      dataIndex: "chuyenhoan",
      sorter: {
        compare: (a, b) => a.chuyenhoan - b.chuyenhoan,
        multiple: 3,
      },
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => {
        var str = record.nam + "-" + record.thang + "-01";
        return (
          <>
            <Button type="" style={{ background: "#85c1f9" }} onClick={() => this.getStatisticalMonth(str)}>
              Chi Tiết
            </Button>
          </>
        );
      },
    },
  ];

  //Show bang du lieu cua tung thang
  columnsOfMonth = [
    {
      title: "Ngày",
      dataIndex: "ngay",
    },
    {
      title: "Thành công",
      dataIndex: "thanhcong",
      sorter: {
        compare: (a, b) => a.thanhcong - b.thanhcong,
        multiple: 1,
      },
    },
    {
      title: "Chuyển hàng",
      dataIndex: "chuyenhang",
      sorter: {
        compare: (a, b) => a.chuyenhang - b.chuyenhang,
        multiple: 2,
      },
    },
    {
      title: "Chuyển hoàn",
      dataIndex: "chuyenhoan",
      sorter: {
        compare: (a, b) => a.chuyenhoan - b.chuyenhoan,
        multiple: 3,
      },
    },
  ];

  componentDidMount() {
    this.getDatastatictical(filterSearch);

    // axios.get(`https://localhost:44362/ChartOrder/GetListUserSales`).then((res) => {
    //   OPTIONS = res.data.data.map((item) => {
    //     return item.UserName;
    //   });
    // });
    axios.get(`https://localhost:44336/api/User/GetAll`).then((res) => {
      debugger;
      console.log(res);
    });
  }

  handleChange = (selectedItems) => {
    this.setState({ selectedItems });
  };

  onFinish = (e) => {
    debugger;
    filterSearch.start = e.start ? e.start.format("YYYY-MM-DD") : "2021-05-01";
    filterSearch.end = e.end ? e.end.format("YYYY-MM-DD") : "2022-04-01";
    filterSearch.user = e.user ? e.user : null;
    this.getDatastatictical(filterSearch);
  };

  onReset = () => {
    this.formRef.current.resetFields();
  };

  getDatastatictical(filter) {
    this.setState({ loading: true });
    axios.post(`https://localhost:44362/ChartOrder/GetData`, filter).then((res) => {
      var tc = 0,
        ch = 0,
        choan = 0;
      for (var i = 0; i < res.data.data.length; i++) {
        tc = tc + res.data.data[i].thanhcong;
        ch = ch + res.data.data[i].chuyenhang;
        choan = choan + res.data.data[i].chuyenhoan;
      }
      this.setState({ dataSource: res.data.data, tongThanhCong: tc, tongChuyenHang: ch, tongChuyenHoan: choan });
      this.setState({ loading: false });
    });
  }

  getStatisticalMonth = (str) => {
    var strTemp = str.split("-");
    var strMonth = strTemp[1] + " năm " + strTemp[0];
    this.setState({ loading: true });
    this.setState({ monthOfYear: strMonth });
    const filtermonth = { monthOfYear: str };
    axios.post(`https://localhost:44362/ChartOrder/GetDataConfirmBy`, filtermonth).then((res) => {
      var tc = 0,
        ch = 0,
        choan = 0;
      for (var i = 0; i < res.data.data.length; i++) {
        tc = tc + res.data.data[i].thanhcong;
        ch = ch + res.data.data[i].chuyenhang;
        choan = choan + res.data.data[i].chuyenhoan;
      }
      this.setState({ dataSourceOfMonth: res.data.data, tongThanhCongThang: tc, tongChuyenHangThang: ch, tongChuyenHoanThang: choan });
      this.setState({ loading: false });
      this.showModal();
    });
  };

  onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination);
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { selectedItems, monthOfYear, pagination } = this.state;
    const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));

    return (
      <div>
        <div style={{ width: 1000, marginLeft: 200 }}>
          <h2>Điền thông tin tìm kiếm</h2>
          <Form
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 20,
            }}
            ref={this.formRef}
            onFinish={this.onFinish}
          >
            <Form.Item name="start" label="Tháng bắt đầu">
              <DatePicker picker="date" placeholder="Nhập tháng bắt đầu" format="YYYY-MM-DD" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="end" label="Tháng kết thúc">
              <DatePicker picker="date" placeholder="nhập tháng kết thúc" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="user" label="Lựa chọn người xác nhận">
              <Select
                mode="multiple"
                placeholder="Vui lòng chọn danh sách người xác nhận"
                value={selectedItems}
                onChange={this.handleChange}
                style={{ width: "100%" }}
              >
                {filteredOptions.map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button htmlType="button" onClick={this.onReset}>
                Xoá form
              </Button>
              <Button type="primary" htmlType="submit" className="login-form-button" style={{ marginLeft: 30 }}>
                Tìm kiếm
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div
          style={{
            display: "block",
            width: 1800,
            paddingLeft: 130,
          }}
        >
          <h4>BẢNG THỐNG KÊ DOANH THU THEO THÁNG</h4>
          {this.state.loading ? (
            <Loading />
          ) : (
            <Table
              rowKey={(record) => record.thang + record.nam}
              dataSource={this.state.dataSource}
              columns={this.columns}
              onChange={this.onChange}
              pagination
              // pagination={pagination}
              rowClassName={() => "rowClassName1"}
              bordered
              summary={(pageData) => {
                return (
                  <>
                    <Table.Summary.Row style={{ border: 1, fontSize: 18, textAlign: "center", borderBlockColor: "#83d9ee" }}>
                      <Table.Summary.Cell colSpan={2}>Tổng doanh thu</Table.Summary.Cell>
                      <Table.Summary.Cell>{this.state.tongThanhCong}</Table.Summary.Cell>
                      <Table.Summary.Cell>{this.state.tongChuyenHang}</Table.Summary.Cell>
                      <Table.Summary.Cell>{this.state.tongChuyenHoan}</Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                );
              }}
            />
          )}

          {/* hiển thị dữ liệu   */}
          <Modal
            visible={this.state.visible}
            title={"Bảng dữ lệu thống kê theo tháng " + monthOfYear}
            onOk={this.handleOk}
            onCancel={this.handleCancel}          
          ></Modal>
        </div>
      </div>
    );
  }
}
