import {server} from "../../../../tools/servers";

export class QuestionBankApi{

  static getQuestionList(data){ // 获取全部列表
    return server.connection('POST','/Service/questionController/getQuestionList',data);
  }

  static getQuestionListByType(data){ // 按类型获取问题列表
    return server.connection('POST', '/Service/questionController/searchQuestionByType', data);
  }

  static deleteQuestionById(data){ // 删除题目
    return server.connection('GET', '/Service/questionController/deleteQuestion', data);
  }

  static addQuestion(data) { // 新增题目
    return server.connection('POST', '/Service/questionController/addQuestion', data);
  }

  static editQuestion(data){
    return server.connection('POST', '/Service/questionController/editQuestion', data);
  }

}
