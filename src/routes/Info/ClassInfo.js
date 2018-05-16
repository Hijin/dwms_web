/**
 * Created by chennanjin on 2018/5/9.
 */
import React, { Component } from 'react';
import { Table, Input, Button, Select, Pagination, Radio, Form, Spin, Modal } from 'antd';
import styles from './ClassInfo.less';

const { Search } = Input;
const { Option } = Select;
const FormItem = Form.Item;

@Form.create()
export default class Application extends Component {
  state = {
    selectedValue: 'all',
    searchInput: '',
    selectedRowKeys: [],
    selectedRowItems: [],
    dataSource: [],
    pageSize: 10,
    pageIndex: 1,
    modalModifyShow: false,
    modalDeleteShow: false,
    modalModifyAdd: false,
    buttonGroup: {
      'DELETE': 'delete',
      'ADD' : 'add',
      'MODIFY': 'modify',
    }
  }

  componentDidMount() {
    this.getDataSource()
  }

  dismissModalModify = () => {
    this.setState({
      modalModifyShow: false,
    })
  }

  onConfirmModify = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const params = {
        classCode: fieldsValue['classCode'],
        className: fieldsValue['className'],
        state: fieldsValue['state'],
        remark: fieldsValue['remark'],
      }
      // TODO(修改成员)

      console.log(params)
    })
  }

  onTableSelectChange = (selectedRowKeys) => {
    this.setState({selectedRowKeys})
  }

  onPaginationChange = (page) => {
    this.setState({
      pageIndex: page,
    });
  }

  onOptionChange = (e) => {
    const { value } = e.target
    const { buttonGroup, selectedRowItems } = this.state
    if (value === buttonGroup.ADD) {
      this.setState({
        modalModifyShow: true,
        modalModifyAdd: true,
      })
      const selectedItem = selectedRowItems[0]
      this.props.form.setFieldsValue({
        classCode: selectedItem.classCode,
        className: selectedItem.className,
        state: selectedItem.state === 1 ? 'enable':'disable',
        remark: selectedItem.remark,
      })
    } else if (value === buttonGroup.MODIFY ) {
      this.setState({
        modalModifyShow: true,
        modalModifyAdd: false,
      })
      this.props.form.setFieldsValue({
        classCode: '',
        className: '',
        state: 'enable',
        remark: '',
      })
    } else if (value === buttonGroup.DELETE) {

    }
  }

  getDataSource = () => {
    const data = []
    for (let index = 0 ; index < 12; index++) {
      data.push({
        classCode: `00${index + 1}`,
        className: `班级${index + 1}`,
        state: index % 2 === 0? 0 : 1,
        remark: index % 2 === 0?'备注信息':'',
        key: index +1,
      })
    }
    this.setState({
      dataSource: data,
    })
  }

  handleSearch = (value) => {
    console.log('search:',value);
    // TODO(按编号、名称搜索)
  }

  handleSearchInput = (e) => {
    this.setState({searchInput: e.target.value})
  }

  handleSelected = (value) => {
    this.setState({selectedValue: value})
    // TODO(按状态搜索)
  }

  resetSearch = () => {
    this.setState({
      selectedValue: 'all',
      searchInput: '',
    })
    // TODO(初始化搜索所有)
  }

  renderModal = () => {
    const { modalModifyShow, modalModifyAdd } = this.state
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title={modalModifyAdd? '班级添加' : '班级修改'}
        visible={modalModifyShow}
        onOk={this.onConfirmModify}
        onCancel={this.dismissModalModify}
      >
        <Form>
          <FormItem
            label="班级编号"
          >
            {getFieldDecorator('classCode', {
              rules: [{
                required: true, message: '请输入班级编号!',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            label="班级名称"
          >
            {getFieldDecorator('className', {
              rules: [{
                required: true, message: '请输入班级名称!',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            label="状态"
          >
            {getFieldDecorator('state', {
              initialValue: 'enable',
            })(
              <Select>
                <Option value="enable" >启用</Option>
                <Option value="disable" >关闭</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            label="备注"
          >
            {getFieldDecorator('remark', {
              rules: [{
                required: false, message: '请输入班级备注信息!',
              }],
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }

  render() {
    const { selectedValue, searchInput, selectedRowKeys, dataSource, pageSize, pageIndex, buttonGroup } = this.state

    const columns = [{
      title: '班级编号',
      dataIndex: 'classCode',
      key: 'code',
    },{
      title: '班级名称',
      dataIndex: 'className',
      key: 'name',
    },{
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: (state) => <div>{state === 0? '关闭' : '启用'}</div>,
    },{
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      render: (remark) => <div>{remark && remark.length > 0 ? remark : '-'}</div>,
    }]

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onTableSelectChange,
    };

    return (
      <div className={styles.body}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Search
              className={styles.searchBar}
              placeholder="可按班级编号/名称搜索"
              onSearch={value => this.handleSearch(value)}
              onChange={this.handleSearchInput}
              value={searchInput}
              enterButton
            />
            <div className={styles.select}>
              <span>状态</span>
              <Select
                defaultValue='all'
                value={selectedValue}
                onChange={this.handleSelected}
              >
                <Option value="all">全部</Option>
                <Option value="enable">启用</Option>
                <Option value="disable">关闭</Option>
              </Select>
            </div>
            <Button className={styles.resetBtn}  type='primary' icon='retweet' onClick={this.resetSearch}>重置</Button>
          </div>
          <div>
            <Radio.Group onChange={this.onOptionChange}>
              <Radio.Button value={buttonGroup.ADD}>新增</Radio.Button>
              <Radio.Button value={buttonGroup.MODIFY}>修改</Radio.Button>
              <Radio.Button value={buttonGroup.DELETE}>删除</Radio.Button>
            </Radio.Group>
          </div>
          <Table
            className={styles.table}
            rowSelection={rowSelection}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
          <Pagination
            className={styles.pagination}
            total={dataSource.length}
            showTotal={(total)=> `当前第${pageIndex}页，总共 ${Math.ceil(total/pageSize)} 页`}
            pageSize={pageSize}
            current={pageIndex}
            onChange={this.onPaginationChange}
          />
        </div>
      </div>
    )
  }
}
