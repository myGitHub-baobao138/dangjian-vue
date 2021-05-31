import {server} from "../../../tools/servers";

export class systemNotice {
  static addAnnouncement(data){  //添加公告
    return server.connection('POST','/System/AnnouncementController/addAnnouncement',data)
  }

  static selectByTimeAndContent(data){  //查询公告
    return server.connection('POST','/System/AnnouncementController/selectByTimeAndContent',data)
  }
}
