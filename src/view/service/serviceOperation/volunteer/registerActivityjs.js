import {server} from "../../../../tools/servers";
export  class RegisterActivityjs {

  static selectActivityRegistration(data){
    return server.connection("GET","/Service/VolunteerActivityController/selectActivityRegistration",data)
  }

  static selectInfoByActivityId(data){
    return server.connection("GET","/Service/ActivityRegistration/selectInfoByActivityId",data)
  }

  static updateByPrimaryKeySelective(data){
    return server.connection("POST","/Service/VolunteerActivityController/updateByPrimaryKeySelective",data)
  }
  //创建后直接发布
  static toInsert(data){
    return server.connection("POST","/Service/ActivityRegistration/insertActivity",data)
  }

  static cancel(data){
    return server.connection("POST","/Service/ActivityRegistration/deleteImage",data)
  }
  static deleteActivityById(data){
    return server.connection("GET","/Service/VolunteerActivityController/deleteActivityById",data)
  }
  static updateActivityState(data){
    return server.connection("GET","/Service/VolunteerActivityController/updateActivityState",data)
  }
  static getTotalPage(data){
    return server.connection("GET","/Service/VolunteerActivityController/getTotalPage",data)
  }
}
