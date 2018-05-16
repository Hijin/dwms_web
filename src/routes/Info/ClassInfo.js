/**
 * Created by chennanjin on 2018/5/9.
 */
import React, { Component } from 'react';
import { Table, Input, Button, Select, Pagination, Form, Spin, Modal } from 'antd';
import styles from './ClassInfo.less';
import _ from 'lodash';

const { Search } = Input;
const { Option } = Select;
const FormItem = Form.Item;
const ButtonGroup = Button.Group;

@Form.create()
export default class ClassInfo extends Component {
  state = {
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
    },
    modifyBtnDisabled: true,
    delegateBtnDisabled: true,
  }

  componentDidMount() {
    this.getDataSource()
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

  onDeleteClass = () => {
    // TODO (删除成员)
  }

  onTableSelectChange = (selectedRowKeys, selectedItems) => {
    const allItems = selectedItems.concat(this.state.selectedRowItems)
    // 数组去重
    const uniqItems = []
    for (let i = 0 ; i < allItems.length ; i++) {
      let has = false;
      for (let j = 0 ; j < uniqItems.length ; j++) {
        if (allItems[i].key === uniqItems[j].key) {
          has = true
          break
        }
      }
      if (!has) {
        uniqItems.push(allItems[i])
      }
    }
    const newSelectedItems = _.filter(uniqItems, item => {
      return selectedRowKeys.indexOf(item.key) >= 0
    })

    this.setState({
      selectedRowKeys,
      selectedRowItems: newSelectedItems,
      modifyBtnDisabled: selectedRowKeys.length !== 1,
      delegateBtnDisabled: selectedRowKeys.length === 0,
    })
  }

  onPaginationChange = (page) => {
    this.setState({
      pageIndex: page,
    });
  }

  onButtonGroup = (e) => {
    const { value } = e.target
    const { buttonGroup, selectedRowItems } = this.state
    if (value === buttonGroup.ADD) {
      this.setState({
        modalModifyShow: true,
        modalModifyAdd: true,
      })
      this.props.form.setFieldsValue({
        classCode: '',
        className: '',
        state: 'enable',
        remark: '',
      })
    } else if (value === buttonGroup.MODIFY ) {
      this.setState({
        modalModifyShow: true,
        modalModifyAdd: false,
      })
      const selectedItem = selectedRowItems[0]
      this.props.form.setFieldsValue({
        classCode: selectedItem.classCode,
        className: selectedItem.className,
        state: selectedItem.state === 1 ? 'enable':'disable',
        remark: selectedItem.remark,
      })
    } else if (value === buttonGroup.DELETE) {
      this.setState({
        modalDeleteShow: true,
      })
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

  dismissModal = () => {
    this.setState({
      modalModifyShow: false,
      modalDeleteShow: false,
    })
  }

  handleSearch = (value) => {
    console.log('search:',value);
    // TODO(按编号、名称搜索)
  }

  handleSearchInput = (e) => {
    this.setState({searchInput: e.target.value})
  }

  export = () => {
    // TODO(导出报表)
  }

  renderModalModify = () => {
    const { modalModifyShow, modalModifyAdd } = this.state
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        width='70%'
        title={modalModifyAdd? '班级添加' : '班级修改'}
        visible={modalModifyShow}
        onOk={this.onConfirmModify}
        onCancel={this.dismissModal}
      >
        <Form className={styles.form}>
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

  renderModalDelete = () => {
    const { modalDeleteShow, selectedRowItems } = this.state
    return (
      <Modal
        title='班级删除'
        visible={modalDeleteShow}
        onOk={this.onDeleteClass}
        onCancel={this.dismissModal}
      >
        {selectedRowItems.map(item => {
          return (
            <div key={item.key}>
              {item.className}
            </div>
          )
        })}
      </Modal>
    )
  }

  render() {
    const { searchInput, selectedRowKeys, dataSource, pageSize, pageIndex, buttonGroup, modifyBtnDisabled,
      delegateBtnDisabled } = this.state

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
            <div className={styles.buttonGroup}>
              <ButtonGroup onClick={this.onButtonGroup}>
                <Button value={buttonGroup.ADD}>新增</Button>
                <Button value={buttonGroup.MODIFY} disabled={modifyBtnDisabled}>修改</Button>
                <Button value={buttonGroup.DELETE} disabled={delegateBtnDisabled}>删除</Button>
              </ButtonGroup>
            </div>
            <Button className={styles.exportBtn}  type='primary' icon='download' onClick={this.export}>导出</Button>
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
          {this.renderModalModify()}
          {this.renderModalDelete()}
        </div>
      </div>
    )
  }
}
