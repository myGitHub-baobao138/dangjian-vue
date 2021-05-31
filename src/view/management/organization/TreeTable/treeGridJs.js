import {server} from "../../../../tools/servers";

export class organizationS {
  static updateInfo(data){
    return  server.connection('post','/System/OrganizationalStructureController/updateInfo',data);
  }

  static deleteInfo(data){
    return  server.connection('get','/System/OrganizationalStructureController/deleteInfo',data);
  }
}
