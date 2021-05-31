import {server} from "../../../tools/servers";

export class officeManage{


  static addPostInfo(data){  //创建职务
    return server.connection('POST','/System/PostController/addPostInfo',data)
  }
  static findPostInfoByName(data){    //查找职务
    return server.connection('GET','/System/PostController/findPostInfoByName',data)
  }

  static modifyPostInfo(data){  //编辑更新职务
    return server.connection('POST','/System/PostController/modifyPostInfo',data)
  }

  static deletePostInfoById(data){     //删除职务
    return server.connection('GET','/System/PostController/deletePostInfoById',data)
  }
}
