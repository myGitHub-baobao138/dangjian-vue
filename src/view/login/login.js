import {server} from "../../tools/servers";

export class LoginApi{
  static login(params){
    return server.connection('POST','/SysLogin/accountLogin', params);
  }
}
