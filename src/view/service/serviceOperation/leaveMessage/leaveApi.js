import {server} from "../../../../tools/servers";

export class leaveApi{
  /**
   * 获取留言列表
   * @param data
   * @returns {Promise<any>}
   */

  static getLeaveWordsQueryList(data){
    return server.connection('POST', '/Service/DJAdminLeaveWords/getLeaveWordsQueryList', data);
  }

  static replyLeaveWords(data){
    return server.connection('POST', '/Service/DJAdminLeaveWords/replyLeaveWords', data);
  }

  /**
   * 获取组织下拉框数据
   * @param data
   * @returns {Promise<any>}
   */
  static getOrganizationNameIdList(data){
    return server.connection('GET', '/Service/DJAdminLeaveWords/getOrganizationSelectList',data);
  }

}
