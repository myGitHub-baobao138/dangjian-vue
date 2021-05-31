import {server} from "../../../../tools/servers";

export class threeLessonsMethods {
  //得到三会一课列表
  static getThreeOneList(data){
    return server.connection('POST', '/Service/DJAdminThreeSessionOneClass/getThreeSessionOneClassList',data);
  }
  //得到当前会议的详细信息
  static getThreeOneDetails(data){
    return server.connection('GET', '/Service/DJAdminThreeSessionOneClass/getThreeOneDetails',data)
  }
  //删除三会一课
  static deleteThreeOne(data){
    return server.connection('GET', '/Service/DJAdminThreeSessionOneClass/deleteThreeOne',data)
  }
  //发布三会一课
  static postThreeOne(data){
    return server.connection('POST', '/Service/DJAdminThreeSessionOneClass/postThreeOne',data)
  }
  //得到当前会议的未参会人员
  static getNotAttendIdList(data){
    return server.connection('POST', '/Service/DJAdminThreeSessionOneClass/getNotAttendIdList',data)
  }
  //得到当前会议参会人员id
  static getAttendIdList(data){
    // return server.connection('GET', '/Service/DJAdminThreeSessionOneClass/getParticipateList',data)
    return server.connection('GET', '/Service/DJAdminThreeSessionOneClass/getAttendIdList',data)
  }
  static getParticipateList(data){
    return server.connection('GET','/Service/DJAdminThreeSessionOneClass/getParticipateList',data)
  }
  //得到当前会议参会人员姓名
  static getParticipateName(data){
    return server.connection('GET','/Service/DJAdminThreeSessionOneClass/getParticipateName',data);
  }

  //得到当前组织下的会议纪要
  static getSummaryList(data){
    return server.connection('POST', '/Service/DJAdminThreeSessionOneClass/getMinuteMeetingList',data)
  }

  // 根据会议id得到会议纪要详情
  static getMinuteMeetingByTheeOneId(data){
    return server.connection('GET', '/Service/DJAdminThreeSessionOneClass/getMinuteMeetingByTheeOneId',data)

  }
  //  得到当前组织和所有下级
  static getOrganizationAndLowerList(data){
    return server.connection('GET', '/Service/DJAdminThreeSessionOneClass/getOrganizationAndLowerList',data)
  }
  //  修改三会一课
  static updateThreeOne(data){
    return server.connection('POST', '/Service/DJAdminThreeSessionOneClass/updateThreeOne',data)
  }
  // 新增三会一课
  static insertThreeOne(data){
    return server.connection('POST', '/Service/DJAdminThreeSessionOneClass/insertThreeOne',data)
  }
  //修改会议纪要
  static updateSummary(data){
    return server.connection('POST', '/Service/DJAdminThreeSessionOneClass/updateSummary',data)
  }
  //新增会议纪要
  static insertSummary(data){
    return server.connection('POST', '/Service/DJAdminThreeSessionOneClass/insertSummary',data)
  }
  //  得到当前组织的党员数
  static getPartyMemberListByOrganization(data){
    return server.connection('GET', '/Service/DJAdminThreeSessionOneClass/getPartyMemberListByOrganizationId',data)
  }
  //添加中间表信息
  static insertAttendThreeOne(data){
    return server.connection('GET','/Service/DJAdminThreeSessionOneClass/insertAttendThreeOne',data)
  }
  //删除中间表信息
  static deleteParticipatesThreeOne(data){
    return server.connection('GET','/Service/DJAdminThreeSessionOneClass/deleteParticipatesThreeOne',data)
  }
  //日期转换辅助函数
   static p(s) {
    return s < 10 ? '0' + s : s
  }

  //日期格式转为 yyyy-MM-dd
  static changeDateYMD(data){
    const d = new Date(data);
    const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate());
    // const resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
    // this.select_checkTime = resDate+' '+resTime;
    return resDate;
  }

  //日期格式转为 yyyy-MM-dd HH:mm:SS
  static changeDateYMDHMS(data){
    const d = new Date(data);
    const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate());
    const resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
    var time = resDate+' '+resTime;
    return time;
  }
//  得到当前时间
  static getCurrentTime(){
    const d = new Date();
    const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate());
    const resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
    var time = resDate+' '+resTime;
    return time;
  }
}
