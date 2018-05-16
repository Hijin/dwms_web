import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/auth/login', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

// 获取用户信息列表
export async function getInfoList(params) {
  return request('/api/sys/users/page', {
    method: 'POST',
    body: params,
  });
}
// 添加用户
export async function addMember(params) {
  return request('/api/sys/users', {
    method: 'POST',
    body: params,
  });
}
// 用户修改
export async function modifyMember(params) {
  return request(`/api/sys/users/${params.id}`, {
    method: 'PUT',
    body: params,
  });
}
// 用户删除
export async function deleteMember(params) {
  return request(`/api/sys/users/batch`, {
    method: 'DELETE',
    body: params,
  })
}
// 角色查询
export async function queryRole() {
  return request('/api/sys/roles');
}
// 用户角色变更
export async function roleChange(params) {
  return request('/api/sys/users/bindRole', {
    method: 'POST',
    body: params,
  })
}
// 查找用户
export async function searchUser(params) {
  return request('/api/sys/users/fuzzySearch', {
    method: 'POST',
    body: params,
  })
}
// 新增角色
export async function addRole(params) {
  return request('/api/sys/roles', {
    method: 'POST',
    body: params,
  })
}
// 删除角色
export async function removeRole(params) {
  return request('/api/sys/roles/batch', {
    method: 'DELETE',
    body: params,
  })
}
// 查找权限树
export async function getAllPermission() {
  return request('/api/sys/acls/tree')
}
// 查找角色下对应用户
export async function getRoleUsers(roleId) {
  return request(`/api/sys/users/role/${roleId}`)
}
// 查找角色下对应的权限
export async function getRolePermission(roleId) {
  return request(`/api/sys/acls/roles/${roleId}`)
}

// 角色绑定用户
export async function roleBindUsers(params) {
  return request('/api/sys/roles/bindUser', {
    method: 'PUT',
    body: params,
  })
}
// 角色绑定权限
export async function roleBindPermission(params) {
  return request('/api/sys/roles/bindAcl', {
    method: 'PUT',
    body: params,
  })
}
