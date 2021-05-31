<template>
  <div>
<!--    <div>-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '/service' }">党建服务</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item><a href="/service">志愿活动</a></el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{path:'/register'}">报名活动管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item >报名活动详情页面</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->
    <div class="container">
      <div>
        <p class="title">{{registerActivity.activityTitle}}</p>
      </div>
      <div>
        <span style="margin-right: 120px;float: right">{{registerActivity.activitySponsor}}|{{registerActivity.activitySponsorIdentity}} | {{registerActivity.submissionTime}}</span>
      </div>

      <div class="content">
        <p style="margin-bottom: 5px;">活动内容:</p>
        <span>{{registerActivity.activityContent}}</span>
        <p>活动地点:&nbsp&nbsp&nbsp{{registerActivity.activityLocation}}</p>
        <p>集合地点:&nbsp&nbsp&nbsp{{registerActivity.meetingPlace}}</p>
        <div style="width: 500px;height: 300px;float: right">
          <img :src="registerActivity.picture">
        </div>
        <p>组织人:&nbsp&nbsp&nbsp{{registerActivity.activityContact}}</p>
        <p>联系方式:&nbsp&nbsp&nbsp{{registerActivity.contactNumber}}</p>
        <p>集合时间:&nbsp&nbsp&nbsp{{registerActivity.activityTime}}</p>
        <p>活动截止时间:&nbsp&nbsp&nbsp{{registerActivity.registrationDeadline}}</p>
        <div style="margin-top: 50px;">
          <span>附件&nbsp&nbsp&nbsp</span><a :href="registerActivity.annex" style="color: dodgerblue">更多图片.word</a>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
    export default {
        name: "registerActivityDetail",
      data(){
          return{
            registerActivity:{}
          }
      },
      methods:{

      },
      mounted(){
          this.registerActivity = JSON.parse(sessionStorage.getItem("registerActivity"))
      }
    }
</script>

<style scoped>
  .container >>> button{
    background-color: #FF0000;
    float: right;
  }

  .container{
    display: flex;
    flex-direction: column;
    margin-left: 90px;
    width: 80%;
    height: 600px;
  }
  .title{
    font-size: 26px;
    font-weight: lighter;
    float: left;
    margin-bottom: 0;
  }
  .content{
    margin-left: 10px;
    border-top: 1px solid #E8E8E8;
    text-align: start;
    color: #8D8D8D;
  }
  .content p{
    display: block;
    margin-bottom: 25px;
  }
  .content img{
    height: auto;
    width: auto;
  }
</style>
