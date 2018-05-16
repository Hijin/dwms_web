import {message} from 'antd';
import {getDataList, addData, modifyData, deleteData} from '../services/api';

export default {
  namespace: 'materialKindManager',

  state: {
    pageLoading: false,
    modalConfirmLoading: false,
    // rolesLoading: false,
    data: [],
    // roles: [],
    totalData: 0,
  },

  effects: {
    * getDataList({payload}, {call, put}) {
      yield put({
        type: 'pageLoading',
        payload: true,
      });
      const response = yield call(getDataList, {params: {...payload}, url: '/api/basic/categories/page'});
      yield put({
        type: 'pageLoading',
        payload: false,
      });
      if (response.code === '0000') {
        yield put({
          type: 'initPageList',
          payload: response.data,
        })
      } else {
        message.error(response.msg)
      }
    },
    * modifyData({payload}, {call, put}) {
      yield put({
        type: 'changeModalConfirmLoadingState',
        payload: true,
      });
      let response = null;
      const isModify = (payload.params.id && payload.params.id > 0);
      if (isModify) {
        response = yield call(modifyData('/api/basic/categories'), {params: {...payload}, url: '/api/basic/categories'})
      } else {
        response = yield call(addData('api/basic/categories'), {params: {...payload}, url: '/api/basic/categories'})
      }

      yield put({
        type: 'changeModalConfirmLoadingState',
        payload: false,
      });
      if (response.code === '0000') {
        message.success(isModify ? `成员${payload.params.categoryName}修改成功！` : `成员${payload.params.categoryName}添加成功！`);
        yield call(payload.successCallBack)
      } else {
        message.error(response.msg)
      }
    },
    * deleteData({payload}, {call, put}) {
      yield put({
        type: 'changeModalConfirmLoadingState',
        payload: true,
      });

      const response = yield call(deleteData('/api/basic/categories/batch'), {params: {...payload}, url: '/api/basic/categories/batch'});
      yield put({
        type: 'changeModalConfirmLoadingState',
        payload: false,
      });
      if (response.code === '0000') {
        message.success(`成员已删除！`);
        yield call(payload.successCallBack)
      } else {
        message.error(response.msg)
      }
    },
    // *changeRoles({ payload }, { call, put}) {
    //   yield put({
    //     type: 'changeModalConfirmLoadingState',
    //     payload: true,
    //   });
    //   const response = yield call(roleChange, payload.params);
    //   yield put({
    //     type: 'changeModalConfirmLoadingState',
    //     payload: false,
    //   });
    //   if (response.code === '0000') {
    //     message.success('权限已变更');
    //     yield call(payload.successCallBack)
    //   } else {
    //     message.error(response.msg)
    //   }
    // },
    // *queryRole({ payload }, { call, put }) {
    //   yield put({
    //     type: 'changeRoleLoadingState',
    //     payload: true,
    //   })
    //   const response = yield call(queryRole)
    //   yield put({
    //     type: 'changeRoleLoadingState',
    //     payload: false,
    //   })
    //   if (response.code === '0000') {
    //     yield put({
    //       type: 'initRoles',
    //       payload: response.data,
    //     })
    //     if (!response.data || response.data.length === 0) {
    //       message.error('没有查询到角色信息，请先添加角色信息！')
    //       if (payload.errorCallBack) {
    //         yield call(payload.errorCallBack
    //         )
    //       }
    //     }
    //   } else {
    //     message.error(response.msg)
    //     if (payload.errorCallBack) {
    //       yield call(payload.errorCallBack
    //       )
    //     }
    //   }
    // },
    // *searchUsers({ payload }, { call, put }) {
    //   yield put({
    //     type: 'pageLoading',
    //     payload: true,
    //   });
    //   const res = yield call(searchUser, payload);
    //   yield put({
    //     type: 'pageLoading',
    //     payload: false,
    //   });
    //   if (res.code === '0000') {
    //     yield put({
    //       type: 'initPageList',
    //       payload: res.data,
    //     })
    //   } else {
    //     message.error(res.msg)
    //   }
    // },
  },

  reducers: {
    pageLoading(state, {payload}) {
      return {
        ...state,
        pageLoading: payload,
      }
    },
    changeModalConfirmLoadingState(state, {payload}) {
      return {
        ...state,
        modalConfirmLoading: payload,
      }
    },
    changeRoleLoadingState(state, {payload}) {
      return {
        ...state,
        rolesLoading: payload,
      }
    },
    initPageList(state, {payload}) {
      return {
        ...state,
        data: payload.content,
        totalData: payload.totalElements,
      }
    },
    // initRoles(state, { payload }) {
    //   return {
    //     ...state,
    //     roles: payload,
    //   }
    // },
  },
};
