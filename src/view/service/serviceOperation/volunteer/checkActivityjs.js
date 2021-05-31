import {server} from "../../../../tools/servers";
export class CheckActivityjs {
  static selectVolunteer(){
    return server.connection("GET","/Service/VolunteerActivityController/selectVolunteerActivity")
  }

  static getActivityByPage(data){
    return server.connection("GET","/Service/VolunteerActivityController/getActivityByPage",data)
  }

  static getTotalPage(){
    return server.connection("GET","/Service/VolunteerActivityController/getTotalPage")
  }

  static keywordSearchVolunteer(data){
    return server.connection("GET","/Service/VolunteerActivityController/keywordSearchVolunteer",data)
  }

  static examine(data){
    return server.connection("POST","/Service/VolunteerActivityController/examine",data)
  }
}
