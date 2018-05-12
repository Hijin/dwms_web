/**
 * Created by chennanjin on 2018/5/11.
 */
import React, { Component } from 'react';
import { Table } from 'antd';
import styles from './RoleTabs.less'

export default class RoleTabs extends Component {

  render() {
    const member = ['用户1', '用户2', '用户3'];
    const permission = ['收货单', '领料申请', '借还管理'];

    return (
      <div className={styles.main}>
        <div>
          <div className={styles.listHeader}>用户成员</div>
          <div>
            <Table>

            </Table>
          </div>
        </div>

      </div>
    )
  }
}
