<template>
  <div class="body">
<!--    &lt;!&ndash;-面包屑&ndash;&gt;-->
<!--    <div class="bread" >-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '/checkEssay' }">党建动态</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{ path: '/checkEssay' }">风采管理</el-breadcrumb-item>-->
<!--        <template>-->
<!--          <template v-if="showType === 'like'">-->
<!--            <el-breadcrumb-item :to="{ path: '/like' }">点赞管理</el-breadcrumb-item>-->
<!--          </template>-->
<!--          <template v-else>-->
<!--            <el-breadcrumb-item :to="{ path: '/publish' }">文章发布管理</el-breadcrumb-item>-->
<!--          </template>-->

<!--        </template>-->
<!--        <el-breadcrumb-item >查看文章详情</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->

    <!--文章详情分区-->
    <div class="main-essay">
      <!--标题-->
      <div class="title">
        <div class="title-left">
          <div class="essay-origin" style="font-size: 26px;">
            {{this.showEssay.source}}<!--文章来源-->
          </div>
          <div style="font-size: 26px;">|</div>
          <div class="essay-title" style="font-size: 20px;">
            {{this.showEssay.title}}<!--文章题目-->
          </div>

        </div>
        <div class="title-right">
          <div class="writer" style="margin-right: 3px;">
            {{this.showEssay.contributorName}}|<!--文章投稿人/作者-->
          </div>
          <div class="position" style="margin-right: 3px;">
            {{this.showEssay.position}}|<!--文章投稿人职务-->
          </div>
          <div class="subTime">
            {{this.showEssay.contributeTime}}<!--文章发布时间-->
          </div>
        </div>
      </div>
      <!--内容-->
      <div class="main-content">
        <!--文章内容-->
        <div v-if="this.showEssay.source==='志愿活动'" class="words">活动内容：</div>
        <div class="essay-content words" v-html="this.showEssay.content" >{{this.showEssay.content}}</div>
        <div v-if="this.showEssay.source==='志愿活动'" style="text-align: left">
          <div class="words">活动地点：{{this.showEssay.activityLocation}}</div>
          <div class="words">集合地点：{{this.showEssay.meetingPlace}}</div>
          <div class="words">组织人：{{this.showEssay.activitySponsor}}</div>
          <div class="words">联系方式:{{this.showEssay.contactNumber}}</div>
          <div class="words">集合时间:{{this.showEssay.contributeTime}}</div>
          <div class="words">活动截止时间：{{this.showEssay.registrationEndTime}}</div>
        </div>
        <!--图片显示-->
        <img  class="essay-picture" :src="this.showEssay.picPath" style="width: 712.5px;margin:15px 0 14px 0" />
        <!--附件链接-->
        <template>
          <div class="other-link"
               v-if="this.showEssay.picPath===undefined || this.showEssay.picPath ===null">
            <div>无附件</div>
          </div>
          <div v-else>
            <div>附件</div>
            <a style="margin-left: 15px;" @click="getDownloadPics()">更多图片.word</a>
          </div>
        </template>

        <!--操作记录-->
        <div class="operate-record">
          <div style="color: #ff3360">操作记录</div>
          <div class="records"  style="margin-top: 15px;">
            {{this.showEssay.operationRecord}}
          </div>
        </div>
      </div>
      </div>
  </div>
</template>

<script>
  import {viewEssayDetails} from "./viewEssayDetails";

  export default {
        name: "essayDetails",
      data(){
          return{
            showType:"",//来源（点赞管理like/文章发布管理publish）
            showEssay:{
              operationRecord:[]  //操作记录
            },
          }
      },
      methods:{
        getEssayById(id,originTable){//根据传来的文章id 去获取文章详细内容
          viewEssayDetails.selectArticlesById({titleId:id,type:originTable}).then(res=>{
             this.showEssay = res.data.data;
             if(this.showEssay.source === 1){
               this.showEssay.source = '党员先锋';
             }else if(this.showEssay.source === 2){
               this.showEssay.source = '基层风采'
             }else if(this.showEssay.source === 3){
               this.showEssay.source = '党主题日';
             }else if(this.showEssay.source === 5){
               this.showEssay.source = '党校培训';
             }else{
               this.showEssay.source = '志愿活动';
             }

             if(this.showEssay.reviewerName === undefined){
               this.showEssay.reviewerName="";
             }

             if(this.showEssay.state === 1){   //说明文章已经审核通过，即被发布
               var  operationStr = this.showEssay.publishTime  + this.showEssay.reviewerName +'审核通过发布';
               this.showEssay.operationRecord = operationStr;
               console.log(this.showEssay.operationRecord)
             }
             if(this.showEssay.state === 3){    //说明文章已经被下架
               var  operationStr1 = this.reviewerTime  + this.showEssay.reviewerName +'审核通过发布';
               var operationStr2 = this.showEssay.cancelTime + this.showEssay.cancelName +'下架该文章';
               this.showEssay.operationRecord = operationStr1 +"/n"+ operationStr2
             }
          })
        }
      },
      mounted(){
        this.getEssayById(this.$route.query.id,this.$route.query.originTable);//获取查看文章的id
        this.showType = this.$route.query.type;
      }
    }
</script>

<style scoped>
  .body{
    text-align: left;
  }
  .main-essay{
    width: 750px;
    margin: 30px 0 0 100px;
  }
  .title{
    display: flex;
    width: 750px;
    justify-content: space-between;
    padding-bottom: 3px;
    border-bottom:1px solid darkgrey;
  }

  .title-left,.other-link{
    display: flex;
    align-items: center;
  }
  .title-right{
    display: flex;
    align-items: flex-end;
    justify-content: center;
    margin-right:40px;
    margin-bottom: 2px;
  }
  .main-content{
    display: flex;
    flex-direction: column;
    align-items: flex-start;

  }
  .essay-content{
    width: 95%;
    margin:10px 0 0 0;
    line-height: 25px;
  }
  .operate-record{
    display: flex;
    margin-top: 10px;
    flex-direction: column;
    align-items: flex-start;
  }
  .words{
    display: block;
    margin-bottom: 25px;
    text-align: start;
    color: #8D8D8D;
  }


</style>
