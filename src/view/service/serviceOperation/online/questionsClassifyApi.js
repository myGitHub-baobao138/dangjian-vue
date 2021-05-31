import {server} from "../../../../tools/servers";

export class QuestionsClassifyApi{
  static getQuestionClassifyList(data) { // 返回全部列表
    return server.connection('GET', '/Service/questionCategoryController/getQuestionRegistrationList', data);
  }

  static getQuestionClassifyListByQuery(data) { // 获取查询列表
    return server.connection('POST', '/Service/questionCategoryController/getListByRegistration', data);
  }

  static addQuestionClassify(data) { // 新增问题分类
    return server.connection('POST', '/Service/questionCategoryController/addQuestionCategory', data);
  }

  static editQuestionCategory(data) { // 编辑问题分类
    return server.connection('POST', '/Service/questionCategoryController/editQuestionCategory', data);
  }

  static deleteQuestionCategory(data){
    return server.connection('GET', '/Service/questionCategoryController/deleteCategoryById', data);
  }
}
