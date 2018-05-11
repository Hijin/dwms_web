import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '业务管理',
    icon: 'form',
    path: 'businessManagement',
    children: [
      {
        name: '入库管理',
        path: 'inManagement',
      },
      {
        name: '出库管理',
        path: 'outManagement',
        children: [
          {
            name: '领料申请',
            path: 'application',
          },
          {
            name: '领料审批',
            path: 'approve',
          },
          {
            name: '拣货出库',
            path: 'outbound',
          },
        ],
      },
      {
        name: '借还管理',
        path: 'circulateManagement',
        children: [
          {
            name: '借出申请',
            path: 'application',
          },
          {
            name: '借出审批',
            path: 'approve',
          },
          {
            name: '出货',
            path: 'outbound',
          },
          {
            name: '归还管理',
            path: 'return',
          },
        ],
      },
      {
        name: '缺失管理',
        path: 'missingManagement',
      },
    ],
  },

  {
    name: ' 库存管理',
    icon: '',
    path: 'stockManagement',
    children: [
      {
        name: '虚拟仓库',
        path: 'virtualStorage',
      },
      {
        name: '库存查询',
        path: 'stockInquiry',
      },
      {
        name: '明细查询',
        path: 'detailedQuery',
      },
      {
        name: '移库管理',
        path: 'moveManagement',
      },
      {
        name: '盘点管理',
        path: 'inventoryManagement',
      },
      {
        name: '统计报表',
        path: 'reports',
      },
    ],
  },
  {
    name: '基础信息管理',
    icon: '',
    path: 'infoManagement',
    children: [
      {
        name: '仓库信息',
        path: 'stockInfo',
      },
      {
        name: '物料分类信息',
        path: 'materialKindInfo',
      },
      {
        name: '物料信息',
        path: 'materialInfo',
      },
      {
        name: '计量单位',
        path: 'measureUnit',
      },
      {
        name: '班级信息',
        path: 'classInfo',
      },
      {
        name: '用途信息',
        path: 'usingInfo',
      },
      {
        name: '供应商信息',
        path: 'supplierInfo',
      },
    ],
  },
  {
    name: '用户管理',
    icon: 'user',
    path: 'userManagement',
    children: [
      {
        name: '用户基础信息管理',
        path: 'basicInfoManagement',
      },
      {
        name: '权限设置',
        path: 'permissionSet',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
