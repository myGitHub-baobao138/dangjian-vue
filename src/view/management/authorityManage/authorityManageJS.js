import {server} from "../../../tools/servers";

export class authorityManage{

  static findRightBaseInfo(data){    //查找权限信息
    return server.connection('POST','/System/RightController/findRightBaseInfo',data)
  }

  static createRightInfo(data){    // 创建权限
    return server.connection('POST','/System/RightController/createRightInfo',data)
  }

  static deleteRightRoleAndResource(data){  //删除职务
    return server.connection('POST','/System/RightController/deleteRightRoleAndResource',data);
  }

  static findRightList(data){    //查找权限
    return server.connection('POST','/System/RightController/findRightList',data)
  }

  static organizationAndPost(data){
    return server.connection('POST','/System/RightController/organizationAndPost',data)
  }

  static allocateRoleRight(data){   //分配
    return server.connection('POST','/System/RightController/allocateRoleRight',data)
  }

  static getAllPermissions(){
    return server.connection('GET', '/System/SysPermission/getAllPermissions')
  }

  static getRolePermission(data){
    return server.connection('GET', '/System/SysPermission/getPermissionList',data)
  }

  static changePermission(data){
    return server.connection('POST', '/System/SysPermission/updatePermissionList', data);
  }
}
