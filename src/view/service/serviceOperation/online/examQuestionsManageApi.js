import {server} from "../../../../tools/servers";

export class ExamQuestionsManageApi{
  static getQuestionCategoryNameIdList(){ // 获取分类下拉框数据
    return server.connection('GET', '/Service/questionCategoryController/getCategoryIdNameList');
  }



  static getExamineQuestionQueryList(data){ // 按条件获取考题列表(分页)
    return server.connection('POST', '/Service/examineManagementController/getExamineQuestionQueryList',data);
  }

  static deleteExamineQuestion(data) { // 删除
    return server.connection('GET', '/Service/examineManagementController/deleteExamineQuestionById', data);
  }

  static earlyTerminationExamine(data){ // 提前结束
    return server.connection('GET', '/Service/examineManagementController/earlyTermination', data);
  }

  static releaseExamineQuestion(data){
    return server.connection('POST', '/Service/examineManagementController/releaseExamine', data);
  }



}
