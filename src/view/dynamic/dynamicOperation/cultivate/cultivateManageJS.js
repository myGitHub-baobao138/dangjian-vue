import {server} from "../../../../tools/servers";

export class cultivateManage {

  /*创建文章*/
  static createUserAccount(data){
    return server.connection('POST','/Dynamic/DyCultivateController/createCultivateEssay',data);
  }
  /*查询所有的文章*/
  static findEssayInformation(data){
    return server.connection('GET','/Dynamic/DyCultivateController/findEssayInformation',data);
  }
  /*修改文章*/
  static modifyEssayById(data){
    return server.connection('POST','/Dynamic/DyCultivateController/modifyEssayById',data);
  }
  /*删除文章*/
  static deleteCultivateEssayById(data){
    return server.connection('GET','/Dynamic/DyCultivateController/deleteCultivateEssayById',data);
  }
  /*发布文章*/
  static publishEssayById(data){
    return server.connection('POST','/Dynamic/DyCultivateController/publishEssayById',data);
  }
}
