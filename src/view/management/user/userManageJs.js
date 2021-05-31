import {server} from "../../../tools/servers";

// export const getWxUserList=(data)=>server.connection('POST','/DJAdminWxUser/getWxUserList',data);

export class WxUser {
  static  getWxUserQueryList(data){
    return server.connection('POST','/System/DJAdminWxUser/getWxUserQueryList',data);
  }

}


