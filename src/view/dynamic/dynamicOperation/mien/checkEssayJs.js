import {server} from "../../../../tools/servers";

export class checkEssayJs {
  // static getAllCheckEssay(data){
  //   return server.connection('POST', '/Dynamic/DyCheckEssayController/getAllCheckEssay',data);
  // }
  //
  // static getCheckEssayDetails(data){
  //   return server.connection('GET','/Dynamic/DyCheckEssayController/getEssayDetailsById',data);
  // }

  static getAllCheckEssay(data){
    return server.connection('POST', '/Dynamic/DyCheckEssayController/getAllCheckEssay',data);
  }

  static getCheckEssayDetails(data){
    return server.connection('GET','/Dynamic/DyCheckEssayController/getEssayDetailsById',data);
  }

  static getQueryCheckEssayListByCheckStatus(data){
    return server.connection('POST','/Dynamic/DyCheckEssayController/queryCheckEssayListByCheckStatus' ,data);
  }

  static  getQueryCheckEssayListByInputContent(data){
    return server.connection('POST','/Dynamic/DyCheckEssayController/queryCheckEssayListByInputContent',data);
  }

  static getQueryCheckEssayListByCheckAndInput(data){
    return server.connection('POST','/Dynamic/DyCheckEssayController/queryCheckEssayListByCheckAndInput', data);
  }

  static updateStatusEssayBySingleEssayId(data){
    return server.connection('POST','/Dynamic/DyCheckEssayController/updateEssayBySingleEssayId', data);
  }

  static updateStatusEssayByEssayIdList(data){
    return server.connection('POST','/Dynamic/DyCheckEssayController/updateManyEssayByEssayIdList', data);
  }


}
