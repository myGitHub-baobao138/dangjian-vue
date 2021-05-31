import {server} from "../../../../tools/servers";

export class  QuestionsRecordApi{
  static getQuestionRecordList(data){
    return server.connection('POST', '/Service/answerRecordController/getAnswerRecordList',data);
  }

  static getQuestionCategoryNameIdList(){ // 获取分类下拉框数据
    return server.connection('GET', '/Service/questionCategoryController/getCategoryIdNameList');
  }
}
