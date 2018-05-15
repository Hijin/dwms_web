/**
 * Created by chennanjin on 2018/5/13.
 */
import { message } from 'antd';
import { getInfoList, addMember, queryRole, modifyMember, deleteMember, roleChange, searchUser} from '../services/api';

export default {
  namespace: 'userInfoManager',

  state: {
    pageLoading: false,
    modalConfirmLoading: false,
    rolesLoading: false,
    list: [],
    roles: [],
    totalData: 0,
  },

  effects: {
    *getInfoList({ payload }, { call, put }) {
      yield put({
        type: 'pageLoading',
        payload: true,
      })
      const response = yield call(getInfoList, payload);
      yield put({
        type: 'pageLoading',
        payload: false,
      })
      if (response.code === '0000') {
        yield put({
          type: 'initPageList',
          payload: response.data,
        })
      } else {
        message.error(response.msg)
      }
    },
    *modifyMember({ payload }, { call, put}) {
      yield put({
        type: 'changeModalConfirmLoadingState',
        payload: true,
      })
      let response = null;
      const isModify = (payload.params.id &&  payload.params.id> 0)
      if ( isModify) {
        response = yield call(modifyMember, payload.params)
      } else {
        response = yield call(addMember, payload.params)
      }

      yield put({
        type: 'changeModalConfirmLoadingState',
        payload: false,
      })
      if (response.code === '0000') {
        message.success(isModify?`成员${payload.params.username}修改成功！`:`成员${payload.params.username}添加成功！`)
        yield call(payload.successCallBack)
      } else {
        message.error(response.msg)
      }
    },
    *deleteMember ({ payload }, { call, put}) {
      yield put({
        type: 'changeModalConfirmLoadingState',
        payload: true,
      })

      const response = yield call(deleteMember, payload.params)
      yield put({
        type: 'changeModalConfirmLoadingState',
        payload: false,
      })
      if (response.code === '0000') {
        message.success(`成员已删除！`)
        yield call(payload.successCallBack)
      } else {
        message.error(response.msg)
      }
    },
    *changeRoles({ payload }, { call, put}) {
      yield put({
        type: 'changeModalConfirmLoadingState',
        payload: true,
      })
      const response = yield call(roleChange, payload.params)
      yield put({
        type: 'changeModalConfirmLoadingState',
        payload: false,
      })
      if (response.code === '0000') {
        message.success('权限已变更')
        yield call(payload.successCallBack)
      } else {
        message.error(response.msg)
      }
    },
    *queryRole({ payload }, { call, put }) {
      yield put({
        type: 'changeRoleLoadingState',
        payload: true,
      })
      const response = yield call(queryRole)
      yield put({
        type: 'changeRoleLoadingState',
        payload: false,
      })
      if (response.code === '0000') {
        yield put({
          type: 'initRoles',
          payload: response.data.map((item) => {
            return {...item, key: item.id}
          }),
        })
        if (!response.data || response.data.length === 0) {
          message.error('没有查询到角色信息，请先添加角色信息！')
          if (payload.errorCallBack) {
            yield call(payload.errorCallBack
            )
          }
        }
      } else {
        message.error(response.msg)
        if (payload.errorCallBack) {
          yield call(payload.errorCallBack
          )
        }
      }
    },
    *searchUsers({ payload }, { call, put }) {
      yield put({
        type: 'pageLoading',
        payload: true,
      })
      const res = yield call(searchUser, payload.params)
      yield put({
        type: 'pageLoading',
        payload: false,
      })
      if (res.code === '0000') {
        yield put({
          type: 'initPageList',
          payload: {
            content: res.data,
            isSearch: true,
          },
        })
        if (payload.successCallBack) {
          yield call(payload.successCallBack)
        }
      } else {
        message.error(res.msg)
        if (payload.errorCallBack) {
          yield call(payload.errorCallBack)
        }
      }
    },
  },

  reducers: {
    pageLoading (state, {payload}) {
      return {
        ...state,
        pageLoading: payload,
      }
    },
    changeModalConfirmLoadingState (state, { payload }) {
      return {
        ...state,
        modalConfirmLoading: payload,
      }
    },
    changeRoleLoadingState(state, { payload }) {
      return {
        ...state,
        rolesLoading: payload,
      }
    },
    initPageList(state, {payload}) {
      return {
        ...state,
        list: payload.content.map(item => {
          return {...item, key: item.id}
        }),
        totalData: payload.isSearch? payload.content.length : payload.totalElements,
      }
    },
    initRoles(state, { payload }) {
      return {
        ...state,
        roles: payload,
      }
    },
  },
};
