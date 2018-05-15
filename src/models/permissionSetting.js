/**
 * Created by chennanjin on 2018/5/15.
 */
/**
 * Created by chennanjin on 2018/5/13.
 */
import { message } from 'antd';
import { queryRole, addRole, getAllPermission } from '../services/api';

export default {
  namespace: 'permissionSetting',

  state: {
    allUsersLoading: false,
    permissionTreeLoading: false,
    rolesLoading: false,
    roles: [],
    permissionTree: [],
  },

  effects: {
    *queryRole(_, { call, put }) {
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
      } else {
        message.error(response.msg)
      }
    },
    *addRole({payload}, { call, put}) {
      yield put({
        type: 'changeRoleLoadingState',
        payload: true,
      })
      const response = yield call(addRole, payload.params)
      yield put({
        type: 'changeRoleLoadingState',
        payload: true,
      })
      if (response.code === '0000') {
        message.success('角色新增成功')
        if(payload.successCallBack) {
          yield call(payload.successCallBack)
        }
      } else {
        message.error(response.msg)
        if(payload.errorCallBack) {
          yield call(payload.errorCallBack)
        }
      }
    },
    *getPermissions({ payload }, {call, put }) {
      yield put({
        type: 'changePermissionTreeLoading',
        payload: true,
      })
      const res = yield call(getAllPermission)
      yield put({
        type: 'changePermissionTreeLoading',
        payload: false,
      })
      if (res.code === '0000') {
        yield put({
          type: 'initPermissionTree',
          payload: res.data,
        })
        if (payload && payload.successCallBack) {
          yield call(payload.successCallBack)
        }
      } else {
        message.error(res.msg)
        if (payload && payload.errorCallBack) {
          yield call(payload.errorCallBack)
        }
      }
    },
  },

  reducers: {
    changeRoleLoadingState(state, { payload }) {
      return {
        ...state,
        rolesLoading: payload,
      }
    },
    changePermissionTreeLoading(state, { payload }) {
      return {
        ...state,
        permissionTreeLoading: payload,
      }
    },
    initPermissionTree(state, { payload }) {
      return {
        ...state,
        permissionTree: payload,
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
