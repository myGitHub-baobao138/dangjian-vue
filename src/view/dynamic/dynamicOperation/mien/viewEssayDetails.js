import {server} from "../../../../tools/servers";

export class viewEssayDetails {
  //点击查看跳转到查看文章详情
  static  selectArticlesById(data){
    return server.connection('get','/Dynamic/EssayDetails/ById',data);
  }
}
