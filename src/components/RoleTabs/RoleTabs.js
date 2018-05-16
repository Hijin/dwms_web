/**
 * Created by chennanjin on 2018/5/11.
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Icon, Popconfirm, Modal, Tree, Transfer, Button, Spin } from 'antd';
import _ from 'lodash';
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
    refresh: true,
  }

  componentDidMount() {
    this.refreshPage()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.activeKey === nextProps.roleId.toString() && !this.state.refresh) {
      this.refreshPage()
    }
  }

  refreshPage = () => {
    console.log('刷新')
    this.setState({
      refresh: true,
    })
    let finishRolePermission = false
    let finishRoleUsers = false
    this.props.dispatch({
      type: 'permissionSetting/getRolePermission',
      payload: {
        params: this.props.roleId,
        successCallBack: () => {
          finishRolePermission = true
          this.setState({
            refresh: !finishRoleUsers,
          })
          this.handleRolePermission()
        },
        errorCallBack: () => {
          finishRolePermission = true
          this.setState({
            refresh: !finishRoleUsers,
          })
        },
      },
    })
    this.props.dispatch({
      type: 'permissionSetting/getRoleUsers',
      payload: {
        params: this.props.roleId,
        successCallBack: () => {
          finishRoleUsers = true
          this.setState({
            refresh: !finishRolePermission,
          })
          this.handleRoleUsers()
        },
        errorCallBack: () => {
          finishRoleUsers = true
          this.setState({
            refresh: !finishRolePermission,
          })
        },
      },
    })
  }

  handleRolePermission = () => {
    this.setState({
      checkedKeys : this.props.permissionSetting.rolePermission.map(item => {
        return item.toString()
      }),
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

  handleRoleUsers = () => {
    this.setState({
      targetKeys: this.props.permissionSetting.roleUsers.map(item => {
        return item.id
      }),
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

  deleteMember = (item) => {
    this.state.targetKeys.splice(this.state.targetKeys.indexOf(item.id),1)
    this.handleEditMember();
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
    this.props.dispatch({
      type: 'permissionSetting/bindUsers',
      payload: {
        params: {
          id: this.props.roleId,
          userIds: this.state.targetKeys,
        },
        isBindUser: true,
        successCallBack: this.editMemberModalDismiss,
      },
    })
  }

  savePermissionChange = () => {
    this.props.dispatch({
      type: 'permissionSetting/bindUsers',
      payload: {
        params: {
          id: this.props.roleId,
          aclIds: this.state.checkedKeys.map(item => {
            return parseInt(item)
          }),
        },
        isBindUser: false,
        successCallBack: this.handleRolePermission,
      },
    })
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
    const { permissionTree, roleUsers, permissionTreeLoading, roleUserLoading } = this.props.permissionSetting
    const { checkedKeys } = this.state
    const treeWithKey = this.handlePermissionTree(permissionTree)

    const Columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'name',
      },
      {
        title: '操作',
        key: 'op',
        render: (item) => (
          <Popconfirm title="确定删除该成员？" okText="确定" cancelText="取消" onConfirm={() => this.deleteMember(item)}>
            <a><Icon type="user-delete" /></a>
          </Popconfirm>),
      },
    ]
    return (
      <div className={styles.main}>
        <div className={styles.list}>
          <Spin spinning={roleUserLoading}>
            <div className={styles.listHeader}>
              <span>用户成员</span>
              <a style={{marginLeft: '5px'}} onClick={this.editMemberModalShow}><Icon type="edit" /></a>
            </div>
            <div>
              <Table
                className={styles.listTable}
                showHeader={false}
                columns={Columns}
                dataSource={roleUsers}
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
