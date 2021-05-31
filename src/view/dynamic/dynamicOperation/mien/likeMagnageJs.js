import {server} from "../../../../tools/servers";

//点赞管理得js
export class likeManageJs {

  //得到点赞列表的数据
  static getClickLikeList(data){
    return server.connection('post','/Dynamic/ClickLikeController/getClickLikeList',data);
  }

  //通过搜索得到点赞记录的数据
   static getClickLikeListBySearch(data){
    return server.connection('post','/Dynamic/ClickLikeController/getClickLikeListBySearch',data)
   }


}
