<template>
  <div>
<!--  &lt;!&ndash;顶部页面导航&ndash;&gt;-->
<!--    <div class="bread" >-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '' }">基础管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{ path: 'authenticationManage' }">认证管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{path:''}">查看详情</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->
  <!--查看人员基本信息-->
    <!--基本信息-->
    <div class="basic-info">
      <span style="margin-left:-93%;">基本信息</span>
      <div><hr></div>
      <el-form ref="form" :model="identifierInfoForm" >
        <div class="one-ROW">
          <div class="one-row-part"><span>姓名：{{identifierInfoForm.name}}</span></div>
          <div class="one-row-part"><span>性别：{{identifierInfoForm.sex}}</span></div>
          <div class="one-row-part"><span>联系方式：{{identifierInfoForm.telNumber}}</span></div>
        </div>
        <div class="second-row">
          <div class="second-row-part"><span>类别：{{identifierInfoForm.type}}</span></div>
          <div class="second-row-part" >
            所属组织：<span v-for=" name in identifierInfoForm.organizationName">{{name}}&nbsp;</span>
          </div>

          <div class="second-row-part"><span>工号/学号：{{identifierInfoForm.studentJobNumber}}</span></div>
        </div>
        <div class="third-row">

          <div class="third-row-part"><span>昵称：{{identifierInfoForm.nickname}}</span></div>

          <div class="third-row-part">
            职务：<span v-for="pos in identifierInfoForm.position">{{pos}}&nbsp;</span>
          </div>
        </div>
      </el-form>
    </div>

    <div  style="margin-top:4%">
      <div><span>审核历史</span></div>
      <div><hr></div>
      <!--表格数据-->
      <div>
        <el-table
          :data="identifierInfoForm.auditRecords"
          style="width: 100%">
          <el-table-column
            prop="auditTime"
            label="审核时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="auditResult"
            label="审核结果"
            :formatter="auditResult"
            width="180">
          </el-table-column>
          <el-table-column
            prop="auditUser"
            label="审核人员">
          </el-table-column>
          <el-table-column
            prop="remarks"
            label="备注"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
</div>
</template>

<script>
  import {getVerificationInfo} from  './viewIdentifyDetails'
    export default {
        name: "viewIdentifyDetails",
      data(){
          return{
            id:'',
            identifierInfoForm:{
              name:'',
              sex:'',
              telNumber: '',
              type:'',
              organizationName:[],
              // major:'物联网专业',
              studentJobNumber:'',
              nickname:'',
              position:[],
              auditRecords:[
                // {auditTime:'2019/07/23',auditResult:'认证失败',AuditUser:'张大大',remarks:'学号错误'}
              ]
            },
          }
      },
      methods:{
        getVerificationInfoDetails(){
          getVerificationInfo({id:this.id}).then(res=>{
            this.identifierInfoForm=res.data.data;
            if(this.identifierInfoForm.type===0){
              this.identifierInfoForm.type='学生';
            }else{
              this.identifierInfoForm.type='教师';
            }

            if(this.identifierInfoForm.sex===0){
              this.identifierInfoForm.sex='男';
            }else{
              this.identifierInfoForm.sex='女';
            }

          })
        },
        auditResult(row,column,cellvalue){
          var value='';
          if(cellvalue===1){
            value='认证成功';
          }else{
            value='认证失败';
          }
          return value;
        }
      },
      created(){
          this.id=this.$route.query.id;
          this.getVerificationInfoDetails();
      }
    }
</script>

<style scoped>

  .basic-info{
    margin-top: 19px;
    margin-left: 16px;
  }
  .one-ROW{
    display: flex;
  }
  .one-row-part{
    margin-left:2%;
  }
  .second-row{
    display: flex;
    margin-top:10px;
  }
  .second-row-part{
    margin-left:2%;
  }

  .third-row{
    display: flex;
    margin-top:10px;
  }
  .third-row-part{
    margin-left:2%;
  }

</style>
