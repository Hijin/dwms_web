/**
 * Created by chennanjin on 2018/5/11.
 */
import React, { Component } from 'react';
import { Tabs } from 'antd';
import RoleTabs from '../../components/RoleTabs/RoleTabs';
import styles from './PermissionSetting.less'

const TabPane = Tabs.TabPane;

export default class PermissionSetting extends Component {

  changeTabs = () => {

  }

  render() {
    const tabsData = ['角色A','角色B','角色C']

    return (
      <div className={styles.main}>
        <Tabs className={styles.tabs} onChange={this.changeTabs} type="card">
          {tabsData.map((item, index) => {
            return (
              <TabPane tab={item} key={index}>
                <RoleTabs title={item} />
              </TabPane>)
          })}
        </Tabs>
      </div>
    )
  }
}
