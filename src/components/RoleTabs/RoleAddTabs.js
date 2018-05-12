/**
 * Created by chennanjin on 2018/5/12.
 */
import React, { Component } from 'react';
import { Form, Input, Tag, Icon, Modal, Tree, Transfer, Button } from 'antd';
import styles from './RoleAddTabs.less';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

@Form.create()

export default class RoleTabs extends Component {
  state = {
    members: ['用户1'],
    addMemberModalShow: false,
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

  filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1;
  }

  handleChange = (targetKeys) => {
    this.setState({ targetKeys });
  }

  handleCloseTag = (tag) => {
    console.log('===>关闭',tag);
  }

  handleAddMember = () => {

  }

  handleSubmit = () => {

  }

  onCheckPermission = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }

  changeAddMemberModalShow = () => {
    const preState = this.state.addMemberModalShow
    this.setState({
      addMemberModalShow: !preState,
    })
  }

  renderTags = (tags) => {
    return (
      tags.map((tag) => {
        return (
          <Tag
            className={styles.tag}
            key={tag}
            closable
            afterClose={() => this.handleCloseTag(tag)}
          >
            {tag}
          </Tag>
        )
      })
    )
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

  renderAddMemberModal = () => {
    return (
      <Modal
        className={styles.modal}
        title='成员添加'
        visible={this.state.addMemberModalShow}
        onCancel={this.changeAddMemberModalShow}
        onOk={this.handleAddMember}
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
    const { members, checkedKeys } = this.state;
    const { getFieldDecorator } = this.props.form;
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

    return (
      <div className={styles.main}>
        <Form className={styles.form}>
          <FormItem
            label='角色名'
          >
            {getFieldDecorator('角色名', {
              rules: [{ required: true, message: '请输入角色名!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            label='备 注'
          >
            {getFieldDecorator('备 注', {
              rules: [{ required: false, message: '请输入角色名!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
        </Form>
        <div className={styles.infoSet}>
          <div className={styles.infoSetBlock}>
            <span>成员配置：</span>
            <div className={styles.infoArea}>
              {this.renderTags(members)}
              <Tag
                className={styles.tag}
                onClick={this.changeAddMemberModalShow}
                style={{ background: '#fff', borderStyle: 'dashed' }}
              >
                <Icon type="plus" /> 添加
              </Tag>
            </div>
          </div>
          <div className={styles.infoSetBlock}>
            <span>权限配置:</span>
            <div className={styles.infoArea}>
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
        </div>
        <div className={styles.bottomArea}>
          <Button
            type="primary"
            onClick={this.handleSubmit}
          >
            确定
          </Button>
        </div>
        {this.renderAddMemberModal()}
      </div>
    )
  }
}
