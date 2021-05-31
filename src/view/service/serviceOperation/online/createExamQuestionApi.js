import {server} from "../../../../tools/servers";

export class CreateExamQuestionApi{
  static addExamQuestion(data){
    return server.connection('POST', '/Service/examineManagementController/addExamine', data);
  }

  static getExamineQuestion(data){ // 进入页面获取值
    return server.connection('GET', '/Service/examineManagementController/getExamineQuestionById',data);
  }

  static updateExamQuestion(data) { // 修改
    return server.connection('POST', '/Service/examineManagementController/updateExamineQuestion', data);
  }
}
