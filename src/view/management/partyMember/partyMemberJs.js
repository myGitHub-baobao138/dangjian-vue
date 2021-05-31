import {server} from "../../../tools/servers";

export class partyMemberJs {

  //获得全部党员信息列表//查看单个党员信息
  static getPartyMemberInf(data){
    return server.connection('POST','/System/PartyMemberInformationController/findPartyBaseInfo',data)
  }
  //文件预览
  static uploadExcel(data){
    return server.connection('GET','/System/PartyMemberInformationController/uploadExcel',data);
  }


  //设置会议提醒
  static setRemindByIdList(data){
    return server.connection('POST','/System/PartyMemberInformationController/insertReminder',data);
  }


  //删除党员信息
  static deletePartyMemberById(data){
    return server.connection('GET','/SysPartyMemberInformationController/deleteById',data);
  }
///得到组织的名称与id
  static getOrganization(data){
    return server.connection('GET','/System/OrganizationalStructureController/SearchOrgNameAndId',data);
  }
  //得到职务的名称与id
  static getPost(data){
    return server.connection('GET','/System/PartyMemberInformationController/findPostNameAndPostId',data);
  }
  static addPartyMember(data){
    return server.connection('POST','/System/PartyMemberInformationController/addSingleInfo',data)
  }
  static updatePartyInfo(data){
    return server.connection('POST','/System/PartyMemberInformationController/editInformation',data)
  }

}

