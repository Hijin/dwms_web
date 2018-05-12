/**
 * Created by chennanjin on 2018/5/11.
 */
import React, { Component } from 'react';
import { Table, Icon, Popconfirm, Modal, Tree, Transfer, Button } from 'antd';
import styles from './RoleTabs.less'

const TreeNode = Tree.TreeNode;

export default class RoleTabs extends Component {

  state = {
    editMemberModalShow: false,
    mockData: [],
    targetKeys: [],
    checkedKeys: ['0-0-0'],
  }

  componentDidMount() {
    this.getMock();
  }
  getMock = () => {
    const targetKeys = [];
    const mockData = [];
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `用户${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: Math.random() * 2 > 1,
      };
      if (data.chosen) {
        targetKeys.push(data.key);
      }
      mockData.push(data);
    }
    this.setState({ mockData, targetKeys });
  }

  changeEditMemberModalShow = () => {
    const preState = this.state.editMemberModalShow
    this.setState({
      editMemberModalShow: !preState,
    })
  }

  deleteMember = () => {
    console.log('删除成员')
  }

  onCheckPermission = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
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
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }

  renderAddMember = () => {

    return (
      <Modal
        className={styles.modal}
        title='成员修改'
        visible={this.state.editMemberModalShow}
        onCancel={this.changeEditMemberModalShow}
        onOk={this.handleEditMember}
      >
        <Transfer
          titles={['所有成员','已有成员']}
          dataSource={this.state.mockData}
          showSearch
          filterOption={this.filterOption}
          targetKeys={this.state.targetKeys}
          onChange={this.handleChange}
          render={item => item.title}
        />
      </Modal>
    )
  }

  render() {
    const { checkedKeys } = this.state
    const member = [
      {
        Name: '用户1',
      },
      {
        Name: '用户2',
      },
      {
        Name: '用户3',
      },
    ];

    const permission = [{
      title: '权限1',
      key: '0-0',
      children: [{
        title: '权限1-1',
        key: '0-0-0',
        children: [
          { title: '权限1-1-1', key: '0-0-0-0' },
          { title: '权限1-1-2', key: '0-0-0-1' },
          { title: '权限1-1-3', key: '0-0-0-2' },
        ],
      }, {
        title: '权限1-2',
        key: '0-0-1',
        children: [
          { title: '权限1-2-1', key: '0-0-1-0' },
          { title: '权限1-2-2', key: '0-0-1-1' },
          { title: '权限1-2-3', key: '0-0-1-2' },
        ],
      }, {
        title: '权限1-3',
        key: '0-0-2',
      }],
    }, {
      title: '权限2',
      key: '0-1',
      children: [
        { title: '权限2-1', key: '0-1-0-0' },
        { title: '权限2-2', key: '0-1-0-1' },
        { title: '权限2-3', key: '0-1-0-2' },
      ],
    }, {
      title: '权限3',
      key: '0-2',
    }];

    const Columns = [
      {
        title: '用户名',
        dataIndex: 'Name',
      },
      {
        title: '操作',
        render: () => (
          <Popconfirm title="确定删除该成员？" okText="确定" cancelText="取消" onConfirm={this.deleteMember}>
            <a><Icon type="user-delete" /></a>
          </Popconfirm>),
      },
    ]
    return (
      <div className={styles.main}>
        <div className={styles.list}>
          <div className={styles.listHeader}>
            <span>用户成员</span>
            <a style={{marginLeft: '5px'}} onClick={this.changeEditMemberModalShow}><Icon type="edit" /></a>
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
        </div>

        <div className={styles.list}>
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
              {this.renderTreeNodes(permission)}
            </Tree>
          </div>
        </div>
        {this.renderAddMember()}
      </div>
    )
  }
}
