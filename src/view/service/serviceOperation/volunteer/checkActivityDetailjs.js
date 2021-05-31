import {server} from "../../../../tools/servers";
export  class CheckActivityDetailjs {
  static examine(data){
    return server.connection("POST","/Service/VolunteerActivityController/examine",data)
  }
}
