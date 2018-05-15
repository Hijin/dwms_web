/**
 * Created by chennanjin on 2018/5/11.
 */
import React, { Component } from 'react';
import { Tabs, Spin } from 'antd';
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

  componentDidMount() {
    this.props.dispatch({
      type: 'permissionSetting/queryRole',
    })
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
            type="card"
          >
            {roles.map((item) => {
              return (
                <TabPane tab={item.name} key={item.id}>
                  <RoleTabs />
                </TabPane>)
            })}
            <TabPane tab="+ 新建角色" key="-1">
              <RoleAddTabs />
            </TabPane>
          </Tabs>
        </Spin>
      </div>
    )
  }
}
