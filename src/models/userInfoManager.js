/**
 * Created by chennanjin on 2018/5/13.
 */
import { message } from 'antd';
import { getInfoList, addMember, queryRole, modifyMember, deleteMember} from '../services/api';

export default {
  namespace: 'userInfoManager',

  state: {
    pageLoading: false,
    modifyMemberLoading: false,
    deleteMemberLoading: false,
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
        type: 'changeModifyLoadingState',
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
        type: 'changeModifyLoadingState',
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
        type: 'changeDeleteLoadingState',
        payload: true,
      })

      const response = yield call(deleteMember, payload.params)
      yield put({
        type: 'changeDeleteLoadingState',
        payload: false,
      })

      if (response.code === '0000') {
        message.success(`成员${payload.params.username}已删除！`)
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
          payload: response.data,
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
  },

  reducers: {
    pageLoading (state, {payload}) {
      return {
        ...state,
        pageLoading: payload,
      }
    },
    changeModifyLoadingState (state, { payload }) {
      return {
        ...state,
        modifyMemberLoading: payload,
      }
    },
    changeDeleteLoadingState (state, { payload }) {
      return {
        ...state,
        deleteMemberLoading: payload,
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
        list: payload.content,
        totalData: payload.totalElements,
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
