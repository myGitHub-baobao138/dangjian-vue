import {server} from "../../../tools/servers";

export class getAcademy {

  //得到学院列表数据
   static  getAcademyList(data){
    return server.connection('post','/DJAdminAcademy/getAcademyList',data);
  }

  //删除学院列表数据
  static deleteAcademyInfo(data){
     return server.connection('get','/DJAdminAcademy/deleteAcademyById',data);
  }

  //查询学院列表数据
  static  getAcademyQueryList(data){
     return server.connection('post','/DJAdminAcademy/getAcademyQueryList',data);
  }

}
