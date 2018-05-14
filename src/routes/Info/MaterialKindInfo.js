/**
 * Created by chennanjin on 2018/5/9.
 */
import React, {Component} from 'react';
import {Button, Input, Table, Pagination, Modal, Popover, Radio, Form, Select, Spin} from 'antd';
import {connect} from 'dva';
import _ from 'lodash';
import styles from './MaterialKindInfo.less'

const InputSearch = Input.Search;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

@connect(({materialKindManager}) => ({
  materialKindManager,
  }),
)

@Form.create()
export default class MaterialKindInfo extends Component {

  state = {
    selectedRowKeys: [],
    selectedItems: [],
    modifyBtnDisabled: true,
    delegateBtnDisabled: true,
    roleModalShow: false,
    modifyMemberModalShow: false,
    deleteModalShow: false,
    roleChangeItem: null,
    isAddMember: false,
    pageIndex: 1,
    pageSize: 10,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'materialKindManager/getDataList',
      payload: {
        pageSize: this.state.pageSize,
        pageNo: this.state.pageIndex,
      },
    });
  }

  onSelectChange = (selectedRowKeys, selectedItems) => {
    const allItems = selectedItems.concat(this.state.selectedItems);
    // 数组去重
    const uniqItems = [];
    for (let i = 0; i < allItems.length; i++) {
      let has = false;
      for (let j = 0; j < uniqItems.length; j++) {
        if (allItems[i].id === uniqItems[j].id) {
          has = true;
          break
        }
      }
      if (!has) {
        uniqItems.push(allItems[i])
      }
    }
    const newSelectedItems = _.filter(uniqItems, item => {
      return selectedRowKeys.indexOf(item.id) >= 0
    });

    this.setState({
      selectedRowKeys,
      selectedItems: newSelectedItems,
      modifyBtnDisabled: selectedRowKeys.length !== 1,
      delegateBtnDisabled: selectedRowKeys.length === 0,
    });
  };

  onPaginationChange = (page) => {
    this.setState({
      pageIndex: page,
    });
    this.props.dispatch({
      type: 'materialKindManager/getDataList',
      payload: {
        pageSize: this.state.pageSize,
        pageNo: page,
      },
    });
  };

  deleteModalShow = () => {
    this.setState({
      deleteModalShow: true,
    })
  };

  dismissModal = () => {
    if (this.props.materialKindManager.modalConfirmLoading) {
      return;
    }
    this.setState({
      modifyMemberModalShow: false,
      roleModalShow: false,
      deleteModalShow: false,
    })
  };

  showModifyMemberModal = (isAdd) => {
    this.setState({
      modifyMemberModalShow: true,
      isAddMember: isAdd,
    });

    if (!isAdd) {
      const selectedItem = this.state.selectedItems[0];

      this.props.form.setFieldsValue({
        categoryName: selectedItem.categoryName,
        remark: selectedItem.remark,
      })
    }
  };

  handleDeleteMember = () => {
    const params = this.state.selectedItems.map(item => {
      return {id: item.id}
    });

    this.props.dispatch({
      type: 'materialKindManager/deleteData',
      payload: {
        params: params,
        successCallBack: this.handleSuccess,
      },
    })
  };

  // 添加或修改成员
  handleModifyMember = () => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      const param = {
        categoryName: fieldsValue['categoryName'],
        remark: fieldsValue['remark'],
      };
      if (!this.state.isAddMember) {
        const selectedItem = this.state.selectedItems[0];
        param.id = selectedItem.id
      }
      this.props.dispatch({
        type: 'materialKindManager/modifyData',
        payload: {
          params: param,
          successCallBack: this.handleSuccess,
        },
      })
    })
  };

  handleSuccess = (refreshCurrentPage) => {
    this.dismissModal();
    const newPageIndex = refreshCurrentPage ? this.state.pageIndex : 1;
    this.setState({
      pageIndex: newPageIndex,
    });
    this.props.dispatch({
      type: 'materialKindManager/getDataList',
      payload: {
        pageSize: this.state.pageSize,
        pageNo: newPageIndex,
      },
    });
  };

  handleSearch = (value) => {

  };


  render() {
    const {selectedRowKeys, selectedItems, pageIndex, modifyBtnDisabled, delegateBtnDisabled, pageSize} = this.state;
    const {modifyMemberModalShow, isAddMember, deleteModalShow} = this.state;
    const {getFieldDecorator} = this.props.form;
    const {data, totalData} = this.props.materialKindManager;
    const {pageLoading, modalConfirmLoading} = this.props.materialKindManager;

    const Columns = [
      {
        title: '物料分类名称',
        dataIndex: 'categoryName',
      },
      {
        title: '备注',
        dataIndex: 'remark',
      }];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };

    const ModifyModal = (
      <Modal
        width='50%'
        destroyOnClose
        title={isAddMember ? '成员添加' : '成员修改'}
        visible={modifyMemberModalShow}
        confirmLoading={modalConfirmLoading}
        onOk={() => this.handleModifyMember()}
        onCancel={() => this.dismissModal()}
      >
        <Form className={styles.addMemberForm}>
          <FormItem
            {...formItemLayout}
            label='物料分类名称'
          >
            {getFieldDecorator('categoryName', {
              rules: [{required: true, message: '请输入物料分类名称!', whitespace: true}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='备注'
          >
            {getFieldDecorator('remark', {
              rules: [{required: false, message: '请输入备注!', whitespace: true}],
            })(
              <Input/>
            )}
          </FormItem>
        </Form>
      </Modal>
    );

    const DeleteModal = (
      <Modal
        title="成员删除"
        confirmLoading={modalConfirmLoading}
        visible={deleteModalShow}
        onOk={() => this.handleDeleteMember()}
        onCancel={() => this.dismissModal()}
      >
        {selectedItems.map(item => {
          return (
            <div>
              {item.categoryName}
            </div>
          )
        })}
      </Modal>
    );

    return (
      <div className={styles.main}>
        <div>
          <InputSearch
            placeholder="请输入搜索字段"
            onSearch={value => this.handleSearch(value)}
            style={{width: 300}}
          />
          <Button className={styles.button} icon='plus' onClick={() => this.showModifyMemberModal(true)}>添加</Button>
          <Button className={styles.button} icon='edit' disabled={modifyBtnDisabled}
                  onClick={() => this.showModifyMemberModal(false)}>修改</Button>
          <Button className={styles.button} icon='delete' disabled={delegateBtnDisabled}
                  onClick={this.deleteModalShow}>删除</Button>
        </div>

        <div className={styles.tableContainer}>
          <Table
            className={styles.table}
            columns={Columns}
            dataSource={data}
            loading={pageLoading}
            pagination={false}
            rowSelection={rowSelection}
            rowKey='id'
            scroll={{y: 300}}
          />
        </div>

        <Pagination
          className={styles.pagination}
          total={totalData}
          showTotal={(total) => `当前第${pageIndex}页，总共 ${Math.ceil(total / pageSize)} 页`}
          pageSize={pageSize}
          current={pageIndex}
          onChange={this.onPaginationChange}
        />
        {ModifyModal}
        {DeleteModal}
      </div>
    )
  }
}
