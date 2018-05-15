/**
 * Created by chennanjin on 2018/5/11.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Icon, Popconfirm, Modal, Tree, Transfer, Button, Spin } from 'antd';
import styles from './RoleTabs.less'

const TreeNode = Tree.TreeNode;

@connect(({userInfoManager, permissionSetting}) => ({
    userInfoManager,
    permissionSetting,
  }),
)
export default class RoleTabs extends Component {

  state = {
    editMemberModalShow: false,
    targetKeys: [],
    checkedKeys: [],
  }

  componentDidMount() {
    // 获取权限树
    this.props.dispatch({
      type: 'permissionSetting/getPermissions',
    })
  }

  handlePermissionTree = (permissionTree) => {
    return permissionTree.map((item) => {
      if (item.children && item.children.length > 0) {
        return {...item, key: item.id, children:this.handlePermissionTree(item.children)}
      }
      return {...item, key: item.id}
    })
  }


  editMemberModalDismiss = () => {
    this.setState({
      editMemberModalShow: false,
    })
  }
  editMemberModalShow = () => {
    this.setState({
      editMemberModalShow: true,
    })
    // 获取所有用户
    this.props.dispatch({
      type: 'userInfoManager/searchUsers',
      payload: {
        params: {
          keyword: '',
        },
        errorCallBack: this.editMemberModalDismiss,
      },
    })
  }

  deleteMember = () => {
    console.log('删除成员')
  }

  onCheckPermission = (checkedKeys) => {
    this.setState({ checkedKeys });
  }

  filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1;
  }

  handleChange = (targetKeys) => {
    this.setState({ targetKeys });
  }

  handleEditMember = () => {

  }

  savePermissionChange = () => {
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.name} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }

  renderEditMember = () => {
    const { list, pageLoading } = this.props.userInfoManager
    return (
      <Modal
        className={styles.modal}
        title='成员修改'
        visible={this.state.editMemberModalShow}
        onCancel={this.editMemberModalDismiss}
        onOk={this.handleEditMember}
      >
        <Spin spinning={pageLoading}>
          <Transfer
            titles={['所有成员','已有成员']}
            dataSource={list}
            showSearch
            filterOption={this.filterOption}
            targetKeys={this.state.targetKeys}
            onChange={this.handleChange}
            render={item => item.username}
          />
        </Spin>
      </Modal>
    )
  }

  render() {
    const { permissionTree, permissionTreeLoading } = this.props.permissionSetting
    const { checkedKeys } = this.state
    const treeWithKey = this.handlePermissionTree(permissionTree)
    const member = [
      {
        Name: '用户1',
        key: 1,
      },
      {
        Name: '用户2',
        key: 2,
      },
      {
        Name: '用户3',
        key: 3,
      },
    ];

    const Columns = [
      {
        title: '用户名',
        dataIndex: 'Name',
        key: 'name',
      },
      {
        title: '操作',
        key: 'op',
        render: () => (
          <Popconfirm title="确定删除该成员？" okText="确定" cancelText="取消" onConfirm={this.deleteMember}>
            <a><Icon type="user-delete" /></a>
          </Popconfirm>),
      },
    ]
    return (
      <div className={styles.main}>
        <div className={styles.list}>
          <Spin>
            <div className={styles.listHeader}>
              <span>用户成员</span>
              <a style={{marginLeft: '5px'}} onClick={this.editMemberModalShow}><Icon type="edit" /></a>
            </div>
            <div>
              <Table
                className={styles.listTable}
                showHeader={false}
                columns={Columns}
                dataSource={member}
                pagination={false}
              />
            </div>
          </Spin>
        </div>

        <div className={styles.list}>
          <Spin spinning={permissionTreeLoading}>
            <div className={styles.listHeader}>
              <a style={{position: 'absolute', left: '20px'}} onClick={this.savePermissionChange}>
                <Icon type="save" style={{ fontSize: 20}} />
              </a>
              <span>拥有权限</span>
              <Tree
                className={styles.listTable}
                checkable
                defaultExpandAll
                onCheck={this.onCheckPermission}
                checkedKeys={checkedKeys}
              >
                {this.renderTreeNodes(treeWithKey)}
              </Tree>
            </div>
          </Spin>
        </div>
        {this.renderEditMember()}
      </div>
    )
  }
}
