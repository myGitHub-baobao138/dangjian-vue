import {server} from "../../../../tools/servers";
export class ThemeDayMethods {
  //得到党主题日列表
  static getThemeDayTableList(data) {
    return server.connection('POST', '/Service/ServiceThemeDayController/getThemeDayTableDto', data);
  }
  //得到所有的组织名称--》仅当登陆人是一级用户
  static getAllOrganizationList(data){
    return server.connection('POST','/Service/SysOrganizationalStructureController/SearchOrgNameAndId',data)
  }
  //得到党主题日详情
  static getThemeDayDetails(data){
    return server.connection('GET','/Service/ServiceThemeDayController/getThemeDayDetails',data)
  }
  //删除党主题日-->status=-1
  static deleteThemeDay(data){
    return server.connection('GET','/Service/ServiceThemeDayController/deleteThemeDay',data)
  }
  //发布 status=1
  static  postThemeDay(data){
    return server.connection('POST','/Service/ServiceThemeDayController/postThemeDay',data)
  }
  //修改信息
  static updateThemeDay(data){
    return server.connection('POST','/Service/ServiceThemeDayController/updateThemeDay',data)
  }
//  置顶
  static updateTop(data){
    return server.connection('GET','/Service/ServiceThemeDayController/updateTop',data)
  }
  //  取消置顶
  static updateNotTop(data){
    return server.connection('GET','/Service/ServiceThemeDayController/updateNotTop',data)
  }
//  新增一条党主题日记录
  static insertThemeDay(data){
    return server.connection('POST','/Service/ServiceThemeDayController/insertThemeDay',data)
  }
//  添加时默认的数据
  static getInsertThemeDayDefaultThree(data){
    return server.connection('GET','/Service/ServiceThemeDayController/getInsertThemeDayDefaultThree',data)
  }
//  当前登陆者所在组织、下级组织
  static selectStructureParty(data){
      return server.connection('GET','/System/OrganizationalStructureController/selectStructureParty',data)
  }
//  当前登陆者所在的支部党员数
  static getPartyMemberNumber(data){
    return server.connection('POST','/Service/ServiceThemeDayController/getPartyMemberNumber',data)
  }

  //得到参与人员姓名与id
  static getAttendThemeDayPartyList(data){
    return server.connection('GET','/Service/ServiceThemeDayController/getAttendThemeDayPartyList',data)
  }
  //得到参与人员id
  static getAttendThemeDayPartyIdList(data){
    return server.connection('GET','/Service/ServiceThemeDayController/getAttendThemeDayPartyIdList',data)
  }
  //日期转换辅助函数
  static p(s) {
    return s < 10 ? '0' + s : s
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
//  得到当前年月
  static  getCurrentYearAndMonth(){
    const d = new Date();
    const resDate = d.getFullYear()+"年"+this.p(d.getMonth()+1)+"月"
    return resDate;
  }


  // static getTextByJquery() {
  //   var str = "";
  //   //遍历name为txt的所有input元素
  //   $("input[name='txt']").each(function () {
  //     str += $(this).val() + ",";
  //   });
  //   //去掉最后一个逗号(如果不需要去掉，就不用写)
  //   if (str.length > 0) {
  //     str = str.substr(0,str.length - 1);
  //   }
  //   return str;
  // }

}
