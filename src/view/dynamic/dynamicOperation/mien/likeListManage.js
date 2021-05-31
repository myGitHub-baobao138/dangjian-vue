import {server} from "../../../../tools/servers";

export class likeListManage {
  //得到点赞列表的数据
  static getLikeListManage(data){
    return server.connection('POST','/Dynamic/viewClickLikeDetails/ByArticleId',data);
  }
  //通过查询点赞时间得到点赞列表的数据
  static getLikeListManageByClickTime(data){
    return server.connection('post','/Dynamic/viewClickLikeDetails/ByTime',data);
  }


}
