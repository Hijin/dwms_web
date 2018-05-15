/**
 * Created by chennanjin on 2018/5/11.
 */
import React, { Component } from 'react';
import { Tabs, Spin, Modal } from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import RoleTabs from '../../components/RoleTabs/RoleTabs';
import RoleAddTabs from '../../components/RoleTabs/RoleAddTabs';
import styles from './PermissionSetting.less'

const TabPane = Tabs.TabPane;

@connect(({permissionSetting}) => ({
  permissionSetting,
  }),
)
export default class PermissionSetting extends Component {

  state = {
    deleteModalShow: false,
    deleteRole: {},
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'permissionSetting/queryRole',
    })
  }

  changeTabs = (activeKey) => {
    console.log(this.refs)
    // if (this.refs[`RoleTabs${activeKey}`]) {
    //   this.refs[`RoleTabs${activeKey}`].testFun()
    // }
  }

  deleteRole = () => {
    this.props.dispatch({
      type: 'permissionSetting/removeRole',
      payload: {
        params:[{id: this.state.deleteRole.id}],
        successCallBack: this.handleDeleteRoleSuccess,
      },
    })
  }

  deleteModalDismiss = () => {
    this.setState({
      deleteModalShow: false,
    })
  }

  editTabs = (targetKey, action) => {
    if (action === 'remove') {
      this.setState({
        deleteModalShow: true,
        deleteRole: this.props.permissionSetting.roles.filter(item => {
          return item.id.toString() === targetKey.toString()
        })[0],
      })
    }
  }

  handleDeleteRoleSuccess = () => {
    this.deleteModalDismiss()
    this.props.dispatch({
      type: 'permissionSetting/queryRole',
    })
  }

  setRefs = (id) => {
    return `RoleTabs${id}`
  }

  renderDeleteModal = () => {
    return (
      <Modal
        title='角色删除'
        visible={this.state.deleteModalShow}
        onCancel={this.deleteModalDismiss}
        onOk={this.deleteRole}
      >
        <div>确认删除角色   {this.state.deleteRole.name}</div>
      </Modal>
    )
  }

  render() {
    const { rolesLoading } = this.props.permissionSetting
    const { roles } = this.props.permissionSetting

    return (
      <div className={styles.main}>
        <Spin spinning={rolesLoading}>
          <Tabs
            className={styles.tabs}
            animated
            onChange={this.changeTabs}
            type="editable-card"
            onEdit={this.editTabs}
          >
            {roles.map((item) => {
              return (
                <TabPane tab={item.name} key={item.id}>
                  <RoleTabs roleId={item.id} ref={this.setRefs(item.id)} />
                </TabPane>)
            })}
            <TabPane tab="+ 新建角色" key="-1" closable={false}>
              <RoleAddTabs />
            </TabPane>
          </Tabs>
        </Spin>
        {this.renderDeleteModal()}
      </div>
    )
  }
}
