import {server} from "../../../tools/servers";

export class  Audit{
  //得到列表数据
  static getVerificationInfoList(data){
    return server.connection('post','/System/DJAdminVerificationManagement/getVerificationInfoQueryList',data);
  }
  //查询数据
  static getVerificationInfoQueryList(data){
    return server.connection('post','/DJAdminVerificationManagement/getVerificationInfoQueryList',data);
  }
  //得到学院列表
  static getOrganizationList(data={}){
    return server.connection('get','/System/DJAdminVerificationManagement/getOrganizationSelectList',data);
  }
  //单个提交审核结果
  static commitAudit(data){
    return server.connection('POST','/System/DJAdminVerificationManagement/verifyWxUser',data)
  }
  //批量审核认证结果
  static  commitAllInfo(data){
    return server.connection('post','/System/DJAdminVerificationManagement/verifyWxUserList',data);
  }


}
