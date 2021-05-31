import {server} from "../../../../tools/servers";

export class publishEssayJs {

  //获取全部文章列表信息
  static getAllPublishEssayList(data){
    return server.connection('POST','/Dynamic/DyPublishEssayController/getPublishEssayList', data);
  }

  //获取制定文章总数量
  static getTotalTopSize(data){
    return server.connection('GET','/Dynamic/DyPublishEssayController/getTotalTopSize', data);
  }

  //置顶
  static setEssayTop(data){
    return server.connection('POST','/Dynamic/DyPublishEssayController/setEssayTop',data);
  }

  //取消置顶
  static  setEssayOutTop(data){
    return server.connection('POST','/Dynamic/DyPublishEssayController/setEssayOutTop', data);
  }

  //下架单篇文章
  static setSingleEssayLeave(data){
    return server.connection('POST','/Dynamic/DyPublishEssayController/makeSingleEssayLeave', data);
  }

  //下架批量文章
  static  setManyEssayLeave(data){
    return server.connection('POST','/Dynamic/DyPublishEssayController/makeManyEssaysLeave',data);
  }

  //发布草稿
  static publishSingleEssayFromList(data){
    return server.connection('POST','/Dynamic/DyPublishEssayController/publishSingleEssayFromList',data);
  }

  //批量发布草稿
  static publishManyEssayFromList(data){
    return server.connection('POST','/Dynamic/DyPublishEssayController/publishManyEssayFromList',data);
  }

  //根据条件（输入内容/时间段） 获得文章列表信息
  static queryPublishEssayList(data){
    return server.connection('POST','/Dynamic/DyPublishEssayController/queryPublishEssayList',data);
  }

  //根据文章id删除草稿
  static deleteByEssayIdFromList(data){
    return server.connection('GET','/Dynamic/DyPublishEssayController/deleteByEssayIdFromList', data);
  }

}
