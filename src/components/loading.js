import React, { Component } from 'react'
import 'antd/dist/antd.css';
import { Spin,Alert } from 'antd';

export default class loading extends Component {
  render() {
    return (
      <div>
            <Spin tip="Loading...">
    <Alert
      message="Đang xử lý"
      description="Dữ liệu bạn nhập vào đang được xử lý vui lòng đợi trong giây lát"
      type="info"
    />
  </Spin>,
      </div>
    )
  }
}
