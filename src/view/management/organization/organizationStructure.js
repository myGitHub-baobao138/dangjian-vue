import {server} from "../../../tools/servers";

export class organizationStructure {

  //页面加载时得到组织架构列表的数据
  static  getOrganizationFrameworkList(data){
    return server.connection('get','/System/OrganizationalStructureController/searchStructure',data);
  }

  //根据职务/组织名称来查询组织架构
  static  getOrganizationDataBySearch(data){
    return  server.connection('post','/System/OrganizationalStructureController/searchByRankAndPostId',data);
  }

  //创建组织架构
  static createOrganizationStructure(data){
    return server.connection('post','/System/OrganizationalStructureController/addStructure',data);
  }

  //创建组织弹窗内选择所创建该组织的上级组织名称
  static  getHigherOrganizationName(data){
    return  server.connection('post','/System/OrganizationalStructureController/selectHigherOrgAndRank',data);
  }




}
