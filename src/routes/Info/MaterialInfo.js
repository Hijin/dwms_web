/**
 * Created by chennanjin on 2018/5/9.
 */
import React, { Component } from 'react';
import { Button, Input, Table, Pagination, Modal, Popover, Radio, Form, Select, Spin} from 'antd';
import { connect } from 'dva';
import _ from 'lodash';
import styles from './MaterialInfo.less'

const InputSearch = Input.Search;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

@connect(({userInfoManager}) => ({
    userInfoManager,
  }),
)
@Form.create()
export default class Application extends Component {

  render() {
    return <div> 基础信息管理-物料信息wufdsafsd</div>
  }
}
