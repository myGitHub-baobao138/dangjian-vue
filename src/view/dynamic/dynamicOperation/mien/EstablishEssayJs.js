import {server} from "../../../../tools/servers";

export class  EstablishEssayJs {
  static getUpdateEssayInf(data){
    return server.connection('GET','/Dynamic/DyPublishEssayController/getUpdateEssayInf', data);
  }

  static insertNewRssay(data){
    return server.connection('POST','/Dynamic/DyPublishEssayController/insertNewEssay',data);
  }

  static updateById(data){
    return server.connection('POST','/Dynamic/DyPublishEssayController/updateEssayById', data);
  }

}
