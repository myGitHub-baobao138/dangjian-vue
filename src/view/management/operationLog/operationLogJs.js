import {server} from "../../../tools/servers";

export class operationLogJs {

  //查询系统操作日志
   static getOperationLogData(data){
     return server.connection('post','/System/OperationController/findOperationLog',data);
   }

   //查询操作人员姓名
  static findOperatorName(data){
     return server.connection('get','/System/OperationController/findOperatorName',data);
  }
}
