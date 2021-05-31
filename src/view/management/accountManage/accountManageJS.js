import {server} from "../../../tools/servers";

export class accountManage{
  static findPartyMemberInformation(data){
    return server.connection('GET', '/System/UserController/findPartyMemberInformation',data);
  }

  static createUserAccount(data){  //创建用户账号
    return server.connection('POST','/System/UserController/createUserAccount',data)
  }

  static modifyUserAccountState(data){  //修改用户状态
    return server.connection('POST','/System/UserController/modifyUserAccountState',data)
  }

  static selectPartyNameLike(){
    return server.connection('POST','/System/PartyMemberInformationController/selectPartyNameLike')
  }

  static deleteUserInfoByUserId(data){  //删除用户信息
    return server.connection('GET','/System/UserController/deleteUserInfoByUserId',data)
  }

  static modifyUserInformationByUserId(data){  //修改用户信息
    return server.connection('POST','/System/UserController/modifyUserInformationByUserId',data)
  }

  static isAccountExist(data){  //修改用户信息
    return server.connection('POST','/System/UserController/isAccountExist',data)
  }

}
