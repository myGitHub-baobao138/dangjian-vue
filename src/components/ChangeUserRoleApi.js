import {server} from "../tools/servers";

export class ChangeUserRoleApi{
  static changeUserRole(data){
    return server.connection('POST', '/System/RightController/changeUserRole',data);
  }
}
