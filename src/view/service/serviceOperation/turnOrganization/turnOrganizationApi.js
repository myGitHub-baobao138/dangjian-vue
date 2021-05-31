import {server} from "../../../../tools/servers";

export class TurnOrganization{
  static getTurnOrganizationList(data){
    return server.connection('POST','/Service/ChangeOrganization/findApplicationInfo',data);
  }
  static addTurnOrganization(data){
    return server.connection('POST','/Service/ChangeOrganization/createApplication',data);
  }
  static findApprovalHistory(data){
    return server.connection('GET','/Service/ChangeOrganization/findApprovalHistory',data);
  }
  static addApprovalRecord(data){
    return server.connection('POST','/Service/ChangeOrganization/addApprovalRecord',data);
  }
  static getOrganization(data){
    return server.connection('GET','/Service/ChangeOrganization/searchOrganizationByNum',data);
  }
  static findApplicationState(data){
    return server.connection('GET','/Service/ChangeOrganization/findApplicationState',data);
  }
}
