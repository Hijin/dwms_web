/**
 * Created by chennanjin on 2018/5/12.
 */
import React, { Component } from 'react';
import { Form, Input, Tag, Icon, Modal, Tree, Transfer, Button, Spin } from 'antd';
import { connect } from 'dva';
import styles from './RoleAddTabs.less';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

@Form.create()
@connect(({userInfoManager, permissionSetting}) => ({
  userInfoManager,
  permissionSetting,
  }),
)
export default class RoleTabs extends Component {
  state = {
    addMemberModalShow: false,
    targetMember: [],
    targetKeys: [],
    checkedKeys: [],
  }

  componentDidMount() {
    // 获取权限树
    this.props.dispatch({
      type: 'permissionSetting/getPermissions',
    })
  }

  onCheckPermission = (checkedKeys) => {
    this.setState({ checkedKeys });
  }

  handlePermissionTree = (permissionTree) => {
    return permissionTree.map((item) => {
      if (item.children && item.children.length > 0) {
        return {...item, key: item.id, children:this.handlePermissionTree(item.children)}
      }
      return {...item, key: item.id}
    })
  }

  filterOption = (inputValue, option) => {
    return option.description.indexOf(inputValue) > -1;
  }

  handleChange = (targetKeys) => {
    this.setState({
      targetKeys,
      targetMember: this.props.userInfoManager.list.filter(item => {
        return targetKeys.indexOf(item.id) >= 0;
      }),
    });

  }

  handleCloseTag = (tag) => {
    console.log('===>关闭',tag);

    const index = this.state.targetMember.indexOf(tag)
    const keyIndex = this.state.targetKeys.indexOf(tag.id)
    this.state.targetMember.splice(index,1)
    this.state.targetKeys.splice(keyIndex,1)
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      this.props.dispatch({
        type: 'permissionSetting/addRole',
        payload: {
          params: {
            name: fieldsValue['name'],
            remark: fieldsValue['remark'],
            members:this.state.targetKeys,
            permissin: this.state.checkedKeys,
          },
          successCallBack: this.handleAddSuccess,
        },
      })
    })
  }

  handleAddSuccess = () => {
    this.props.dispatch({
      type: 'permissionSetting/queryRole',
    })
  }

  addMemberModalDismiss = () => {
    this.setState({
      addMemberModalShow: false,
    })
  }
  addMemberModalShow = () => {
    this.setState({
      addMemberModalShow: true,
    })
    // 获取所有用户
    this.props.dispatch({
      type: 'userInfoManager/searchUsers',
      payload: {
        params: {
          keyword: '',
        },
        errorCallBack: this.addMemberModalDismiss,
      },
    })
  }

  renderTags = (tags) => {
    return (
      tags.map((tag) => {
        return (
          <Tag
            className={styles.tag}
            key={tag.id}
            closable
            afterClose={() => this.handleCloseTag(tag)}
          >
            {tag.username}
          </Tag>
        )
      })
    )
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

  renderAddMemberModal = () => {
    const { list, pageLoading } = this.props.userInfoManager

    return (
      <Modal
        className={styles.modal}
        title='成员添加'
        visible={this.state.addMemberModalShow}
        onCancel={this.addMemberModalDismiss}
        onOk={this.addMemberModalDismiss}
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
    const { targetMember, checkedKeys } = this.state;
    const { permissionTree, permissionTreeLoading } = this.props.permissionSetting
    const { getFieldDecorator } = this.props.form;
    const treeWithKey = this.handlePermissionTree(permissionTree)

    return (
      <div className={styles.main}>
        <Form className={styles.form}>
          <FormItem
            label='角色名'
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入角色名!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            label='备 注'
          >
            {getFieldDecorator('remark', {
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
              {this.renderTags(targetMember)}
              <Tag
                className={styles.tag}
                onClick={this.addMemberModalShow}
                style={{ background: '#fff', borderStyle: 'dashed' }}
              >
                <Icon type="plus" /> 添加
              </Tag>
            </div>
          </div>
          <div className={styles.infoSetBlock}>
            <span>权限配置:</span>
            <div className={styles.infoArea}>
              <Spin spinning={permissionTreeLoading}>
                <Tree
                  className={styles.listTable}
                  checkable
                  defaultExpandAll
                  onCheck={this.onCheckPermission}
                  checkedKeys={checkedKeys}
                >
                  {this.renderTreeNodes(treeWithKey)}
                </Tree>
              </Spin>
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
