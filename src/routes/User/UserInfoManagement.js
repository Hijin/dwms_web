/**
 * Created by chennanjin on 2018/5/9.
 */
import React, { Component } from 'react';
import { Button, Input, Table, Pagination, Modal, Popover, Radio, Form, Select, Spin} from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import styles from './UserInfoManagement.less'

const InputSearch = Input.Search;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

@connect(({userInfoManager}) => ({
  userInfoManager,
  }),
)
@Form.create()
export default class UserInfoManagement extends Component {
  state = {
    selectedRowKeys: [],
    modifyBtnDisabled: true,
    delegateBtnDisabled: true,
    roleModalShow: false,
    modifyMemberModalShow: false,
    selectedItems: [],
    isAddMember: false,
    pageIndex: 1,
    pageSize: 10,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'userInfoManager/getInfoList',
      payload: {
        pageSize: this.state.pageSize,
        pageNo: this.state.pageIndex,
      },
    });
  }

  onSelectChange = (selectedRowKeys, selectedItems) => {
    const allItems = selectedItems.concat(this.state.selectedItems)
    // 数组去重
    const uniqItems = []
    for (let i = 0 ; i < allItems.length ; i++) {
      let has = false;
      for (let j = 0 ; j < uniqItems.length ; j++) {
        if (allItems[i].id === uniqItems[j].id) {
          has = true
          break
        }
      }
      if (!has) {
        uniqItems.push(allItems[i])
      }
    }
    const newSelectedItems = _.filter(uniqItems, item => {
      return selectedRowKeys.indexOf(item.id) >= 0
    })

    this.setState({
      selectedRowKeys,
      selectedItems: newSelectedItems,
      modifyBtnDisabled: selectedRowKeys.length !== 1,
      delegateBtnDisabled: selectedRowKeys.length === 0,
    });
  }

  onPaginationChange = (page) => {
    this.setState({
      pageIndex: page,
    });
    this.props.dispatch({
      type: 'userInfoManager/getInfoList',
      payload: {
        pageSize: this.state.pageSize,
        pageNo: page,
      },
    });
  }

  confirmInfo = () => {

  }

  changePermission = (item) => {
    console.log(item)
  }

  changeDeleteModalShow = () => {
    const preStatue = this.state.deleteModalShow
    this.setState({
      deleteModalShow: !preStatue,
    })
  }

  changeRoleModalShow = () => {
    const preStatue = this.state.roleModalShow
    this.setState({
      roleModalShow: !preStatue,
    })
  }

  dismissModifyMemberModal = () => {
    this.setState({
      modifyMemberModalShow: false,
    })
  }
  showModifyMemberModal = (isAdd) => {
    this.setState({
      modifyMemberModalShow: true,
      isAddMember: isAdd,
    })

    this.props.dispatch({
      type: 'userInfoManager/queryRole',
      payload: {
        errorCallBack: this.dismissModifyMemberModal,
      },
    })

    if (!isAdd) {
      const selectedItem = this.state.selectedItems[0];

      this.props.form.setFieldsValue({
        username: selectedItem.username,
        realName: selectedItem.realName,
        sex: selectedItem.sex === 1? 'male':'female',
        status: selectedItem.status === 1? 'enable':'disable',
        tel: selectedItem.tel,
        email: selectedItem.email,
        role: selectedItem.sysRole.id,
      })
    }
  }

  handleDeleteMember = () => {
    const params = [];
    params.push(
      this.state.selectedItems.map(item => {
       return {id: item.id}
      })
    )

    this.props.dispatch({
      type: 'userInfoManager/deleteMember',
      payload: {
        params: params,
        successCallBack: this.changeDeleteModalShow,
      },
    })
  }

  handleRoleModify = () => {
  }
  handleRoleChange = (e) => {
  }

  // 添加或修改成员
  handleModifyMember = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const param = {
        username: fieldsValue['username'],
        realName: fieldsValue['realName'],
        sex: fieldsValue['sex'] === 'male'?'1':'0',
        status: fieldsValue['status'] === 'enable'?'1':'0',
        tel: fieldsValue['tel'],
        email: fieldsValue['email'],
        roleId: fieldsValue['role'],
      }
      if (!this.state.isAddMember) {
        const selectedItem = this.state.selectedItems[0]
        param.id = selectedItem.id
      }
      this.props.dispatch({
        type: 'userInfoManager/modifyMember',
        payload: {
          params: param,
          successCallBack: this.modifyMemberSuccess,
        },
      })
    })
  }

  modifyMemberSuccess = () => {
    this.dismissModifyMemberModal();
    this.setState({
      pageIndex: 1,
    })
    this.props.dispatch({
      type: 'userInfoManager/getInfoList',
      payload: {
        pageSize: this.state.pageSize,
        pageNo: 1,
      },
    });
  }

  renderRoleSelected = (roles) => {
    return (
      <RadioGroup className={styles.radio}>
        {roles.map(item => {
          return <Radio value={item.id} key={item.id}>{item.name}</Radio>
        })}
      </RadioGroup>
    )
  }


  render() {
    const { selectedRowKeys, selectedItems, pageIndex, modifyBtnDisabled, delegateBtnDisabled, pageSize  } = this.state;
    const {modifyMemberModalShow, isAddMember, deleteModalShow, roleModalShow} = this.state
    const { getFieldDecorator } = this.props.form;
    const { list, roles, totalData } = this.props.userInfoManager;
    const { pageLoading, modifyMemberLoading, rolesLoading } = this.props.userInfoManager;

    const Columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '姓名',
        dataIndex: 'realName',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render: sex => <div>{sex === 1 ? '男':'女'}</div>,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        render: email => <div>{email ? email:'-'}</div>,
      },
      {
        title: '电话号码',
        dataIndex: 'tel',
        render: tel => <div>{tel ? tel:'-'}</div>,
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: status => <div>{status === 1 ? '可用':'不可用'}</div>,
      },
      {
        title: '角色类型',
        render: item => <div><Popover content={item.sysRole.name} trigger="hover"><a style={{marginRight: '10px'}}>查看</a></Popover><a onClick={this.changeRoleModalShow}>分配</a></div>,
      }]

    const plainOptions = ['角色A','角色B','角色C','角色D','角色E','角色F','角色H','角色J']

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const ModifyModal = (
      <Modal
        width='70%'
        title={isAddMember?'成员添加':'成员修改'}
        visible={modifyMemberModalShow}
        confirmLoading={modifyMemberLoading}
        onOk={() => this.handleModifyMember()}
        onCancel={() => this.dismissModifyMemberModal()}
      >
        <Spin spinning={rolesLoading}>
          <Form className={styles.addMemberForm}>
            <FormItem
              {...formItemLayout}
              label='用 户 名'
            >
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名!', whitespace: true }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='真实姓名'
            >
              {getFieldDecorator('realName', {
                rules: [{ required: true, message: '请输入真实姓名!', whitespace: true }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="手机号码"
            >
              {getFieldDecorator('tel', {
                rules: [{ required: false, message: '请输入你的手机号!' }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="邮 箱"
            >
              {getFieldDecorator('email', {
                rules: [{
                  type: 'email', message: '请输入正确的邮箱!',
                }, {
                  required: false, message: '请输入你的邮箱!',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="状 态"
            >
              {getFieldDecorator('status', {
                initialValue: 'enable',
                rules: [{ required: false, message: '请分配角色!' }],
              })(
                <Select initialValue="enable">
                  <Option value="enable" >可用</Option>
                  <Option value="disable" >不可用</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="性 别"
            >
              {getFieldDecorator('sex', {
                initialValue: 'male',
                rules: [{ required: false, message: '请分配角色!' }],
              })(
                <Select>
                  <Option value="male">男</Option>
                  <Option value="female">女</Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="角色分配"
            >
              {getFieldDecorator('role', {
                rules: [{ required: true, message: '请分配角色!' }],
              })(
                this.renderRoleSelected(roles)
              )}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    )

    const DeleteModal = (
      <Modal
        title="成员删除"
        visible={deleteModalShow}
        onOk={() => this.handleDeleteMember()}
        onCancel={() => this.changeDeleteModalShow()}
      >
        {selectedItems.map(item => {
          return (
            <div>
              {item.username}
            </div>
          )
        })}
      </Modal>
    )

    const RoleModal = (
      <Modal
        title="角色分配"
        visible={roleModalShow}
        onOk={() => this.handleRoleModify()}
        onCancel={() => this.changeRoleModalShow()}
      >
        <RadioGroup className={styles.radio} options={plainOptions} defaultValue={['角色B']} onChange={this.handleRoleChange} />
      </Modal>
    )

    return (
      <div className={styles.main}>
        <div>
          <InputSearch
            placeholder="请输入搜索字段"
            onSearch={value => console.log(value)}
            style={{ width: 200 }}
          />
          <Button className={styles.button} icon='plus' onClick={() => this.showModifyMemberModal(true)}>添加</Button>
          <Button className={styles.button} icon='edit' disabled={modifyBtnDisabled} onClick={() => this.showModifyMemberModal(false)}>修改</Button>
          <Button className={styles.button} icon='delete' disabled={delegateBtnDisabled} onClick={this.changeDeleteModalShow}>删除</Button>
        </div>

        <div className={styles.tableContainer}>
          <Table
            className={styles.table}
            columns={Columns}
            dataSource={list}
            loading={pageLoading}
            pagination={false}
            rowSelection={rowSelection}
            rowKey='id'
            scroll={{y: 300}}
          />
        </div>

        <Pagination
          className={styles.pagination}
          total={totalData}
          showTotal={(total)=> `当前第${pageIndex}页，总共 ${Math.ceil(total/pageSize)} 页`}
          pageSize={pageSize}
          current={pageIndex}
          onChange={this.onPaginationChange}
        />
        {ModifyModal}
        {DeleteModal}
        {RoleModal}
      </div>
    )
  }
}
