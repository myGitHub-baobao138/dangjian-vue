<template>
    <div>
<!--      <div>-->
<!--        <el-breadcrumb separator="/">-->
<!--          <el-breadcrumb-item :to="{ path: '/service' }">党建服务</el-breadcrumb-item>-->
<!--          <el-breadcrumb-item><a href="/service">活动管理</a></el-breadcrumb-item>-->
<!--          <el-breadcrumb-item :to="{path:'/service'}">志愿活动审核管理</el-breadcrumb-item>-->
<!--          <el-breadcrumb-item>查看详情页面</el-breadcrumb-item>-->
<!--        </el-breadcrumb>-->
<!--      </div>-->
      <div class="container">
        <div>
          <el-button  v-if="activityVolunteer.approvalState==0" @click="examine">
            <span style="color: white">审核</span>
          </el-button>
          <p class="title">垃圾分类主题活动</p>
        </div>
        <div>
          <span style="margin-right: 120px;float: right">{{activityVolunteer.activitySponsor}}|{{activityVolunteer.activitySponsorIdentity}} | {{activityVolunteer.submissionTime}}</span>
        </div>

        <div class="content">
          <p style="margin-bottom: 5px;">活动内容:</p>
          <span>{{activityVolunteer.activityContent}}</span>
          <p>活动地点:&nbsp&nbsp&nbsp{{activityVolunteer.activityLocation}}</p>
          <p>集合地点:&nbsp&nbsp&nbsp{{activityVolunteer.meetingPlace}}</p>
          <div style="width: 500px;height: 300px;float: right">
            <img :src="activityVolunteer.picture">
          </div>
          <p>组织人:&nbsp&nbsp&nbsp{{activityVolunteer.activityContact}}</p>
          <p>联系方式:&nbsp&nbsp&nbsp{{activityVolunteer.contactNumber}}</p>
          <p>集合时间:&nbsp&nbsp&nbsp{{activityVolunteer.activityTime}}</p>
          <p>活动截止时间:&nbsp&nbsp&nbsp{{activityVolunteer.registrationDeadline}}</p>
          <div style="margin-top: 50px;">
            <span>附件&nbsp&nbsp&nbsp</span><a :href="activityVolunteer.annex" style="color: dodgerblue">更多图片.word</a>
          </div>
        </div>

      </div>
    </div>
</template>

<script>
  import {CheckActivityDetailjs} from "./checkActivityDetailjs";

  export default {
        name: "checkActivityDetail",
      data(){
          return{
            activityVolunteer:{},
            selectedActivityId:[]
          }
      },
      methods:{
          examine(){
            this.selectedActivityId=[]
            this.selectedActivityId.push(this.activityVolunteer.id);
            let that = this;
            this.$confirm("请您进行审核","审核",{
              confirmButtonText:"通过",
              cancelButtonText:"不通过",
              type:'warning',
              center:true
            }).then(()=>{
              CheckActivityDetailjs.examine({
                id:that.selectedActivityId,
                approvalState:1
              }).then(res=>{

              });
              this.$message({
                type:'success',
                message:'审核通过'
              });
              this.$router.push({path:'/service/'})
            }).catch(()=>{
              CheckActivityDetailjs.examine({
                id:that.selectedActivityId,
                approvalState:-1
              }).then(res=>{

              });
              this.$message({
                type: 'info',
                message: '审核未通过'
              });
              this.$router.push({path:'/service/'})
            })
          }
      },
      mounted(){
          this.activityVolunteer = JSON.parse(sessionStorage.getItem("volunteer"));

      },
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
