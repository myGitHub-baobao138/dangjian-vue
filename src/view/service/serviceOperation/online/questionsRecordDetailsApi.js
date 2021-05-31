import {server} from "../../../../tools/servers";

export class QuestionsRecordDetailsApi{
  static getQuestionRecord(data){
    return server.connection('POST', '/Service/answerRecordController/getAnswerRecordDetailsById', data);
  }

}
