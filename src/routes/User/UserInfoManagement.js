/**
 * Created by chennanjin on 2018/5/9.
 */
import React, { Component } from 'react';
import { Button, Input, Table, Pagination, Modal, Popover, Radio, Form, Select } from 'antd';
import styles from './UserInfoManagement.less'

const InputSearch = Input.Search;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
export default class Application extends Component {
  state = {
    selectedRowKeys: [],
    loading: false,
    currentPagination: 1,
    modifyBtnDisabled: true,
    delegateBtnDisabled: true,
    modifyModalShow: false,
    deleteModalShow: false,
    roleModalShow: false,
    addModalShow: false,
    addMemberLoading: false,
  };

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({
      selectedRowKeys,
      modifyBtnDisabled: selectedRowKeys.length !== 1,
      delegateBtnDisabled: selectedRowKeys.length === 0,
    });
  }

  onPaginationChange = (page) => {
    this.setState({
      currentPagination: page,
    });
  }

  confirmInfo = () => {

  }

  changePermission = (item) => {
    console.log(item)
  }

  changeModifyModalShow = () => {
    const preStatue = this.state.modifyModalShow
    this.setState({
      modifyModalShow: !preStatue,
    })
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

  changeAddModalShow = () => {
    const preStatue = this.state.addModalShow
    this.setState({
      addModalShow: !preStatue,
    })
  }


  handleDeleteMember = () => {

  }

  handleRoleModify = () => {
  }
  handleRoleChange = () => {
  }

  handleAddMember = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = fieldsValue['邮箱']
      console.log(values)
    })
  }



  render() {
    const { loading, selectedRowKeys, currentPagination, modifyBtnDisabled, delegateBtnDisabled  } = this.state;
    const {modifyModalShow, addModalShow, deleteModalShow, roleModalShow} = this.state
    const {addMemberLoading} = this.state
    const { getFieldDecorator } = this.props.form;

    const Columns = [
      {
        title: '用户名',
        dataIndex: 'Name',
      },
      {
        title: '姓名',
        dataIndex: 'RealName',
      },
      {
        title: '性别',
        dataIndex: 'Sex',
      },
      {
        title: '邮箱',
        dataIndex: 'Email',
      },
      {
        title: '电话号码',
        dataIndex: 'Tel',
      },
      {
        title: '状态',
        dataIndex: 'Statue',
      },
      {
        title: '角色类型',
        render: item => <div><Popover content={item.Type} trigger="hover"><a style={{marginRight: '10px'}}>查看</a></Popover><a onClick={this.changeRoleModalShow}>分配</a></div>,
      }]

    const data = [
      {
        Name: 'J',
        RealName: '陈南进',
        Sex: '男',
        Email: '1553877174@qq.com',
        Tel: '18321436547',
        Statue: '可用',
        Type: '超级管理',
      },
      {
        ID: '002',
        Name: 'K',
        RealName: '城市文',
        Sex: '女',
        Email: 'jleechen90@gmail.com',
        Tel: '18321436547',
        Statue: '不可用',
        Type: ['普通成员','成员A'],
      }]
    const plainOptions = ['角色A','角色B','角色C','角色D','角色E','角色F','角色H','角色J']

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const ModifyModal = (
      <Modal
        title="修改信息"
        visible={modifyModalShow}
        onOk={() => this.confirmInfo()}
        onCancel={() => this.changeModifyModalShow()}
      >
        <div>
          <span>邮箱</span>
          <Input />
        </div>
        <div>
          <span>电话</span>
          <Input />
        </div>
      </Modal>
    )

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

    const AddModal = (
      <Modal
        width='70%'
        title="成员添加"
        visible={addModalShow}
        confirmLoading={addMemberLoading}
        onOk={() => this.handleAddMember()}
        onCancel={() => this.changeAddModalShow()}
      >
        <Form className={styles.addMemberForm}>
          <FormItem
            {...formItemLayout}
            label="邮 箱"
          >
            {getFieldDecorator('邮 箱', {
              rules: [{
                type: 'email', message: '请输入正确的邮箱!',
              }, {
                required: true, message: '请输入你的邮箱!',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='用 户 名'
          >
            {getFieldDecorator('用 户 名', {
            rules: [{ required: true, message: '请输入用户名!', whitespace: true }],
          })(
            <Input />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='真实姓名'
          >
            {getFieldDecorator('真实姓名', {
              rules: [{ required: true, message: '请输入真实姓名!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机号码"
          >
            {getFieldDecorator('手机号码', {
              rules: [{ required: true, message: '请输入你的手机号!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="状 态"
          >
            <Select defaultValue="enable">
              <Option value="enable">可用</Option>
              <Option value="disable">不可用</Option>
            </Select>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="性 别"
          >
            <Select defaultValue="male">
              <Option value="male">男</Option>
              <Option value="female">女</Option>
            </Select>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="角色分配"
          >
            {getFieldDecorator('角色分配', {
              rules: [{ required: true, message: '请分配角色!' }],
            })(
              <RadioGroup className={styles.radio} options={plainOptions} defaultValue={['角色B']} />
            )}
          </FormItem>
        </Form>
      </Modal>
    )

    const DeleteModal = (
      <Modal
        title="成员删除"
        visible={deleteModalShow}
        onOk={() => this.handleDeleteMember()}
        onCancel={() => this.changeDeleteModalShow()}
      >
        {selectedRowKeys.map(index => {
          return <div>{data[index].Name}</div>
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
          <Button className={styles.button} icon='plus' onClick={this.changeAddModalShow}>添加</Button>
          <Button className={styles.button} icon='edit' disabled={modifyBtnDisabled} onClick={this.changeModifyModalShow}>修改</Button>
          <Button className={styles.button} icon='delete' disabled={delegateBtnDisabled} onClick={this.changeDeleteModalShow}>删除</Button>
        </div>

        <div className={styles.tableContainer}>
          <Table
            className={styles.table}
            columns={Columns}
            dataSource={data}
            loading={loading}
            pagination={false}
            rowSelection={rowSelection}
            scroll={{y: 300}}
          />
        </div>

        <Pagination
          className={styles.pagination}
          total={data.length}
          showTotal={(total)=> `当前第${currentPagination}页，总共 ${Math.ceil(total/5)} 页`}
          pageSize={5}
          current={currentPagination}
          onChange={this.onPaginationChange}
        />
        {ModifyModal}
        {DeleteModal}
        {RoleModal}
        {AddModal}
      </div>
    )
  }
}
