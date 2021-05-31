<template >
  <div >
    <!--面包屑面包屑-->
<!--    <div class="bread" >-->
<!--      <el-breadcrumb separator="/">-->
<!--        <el-breadcrumb-item :to="{ path: '' }">基础管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item :to="{ path: '' }">认证管理</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->
    <!--输入框-->
    <div>
      <div class="box" style="margin-top: 2%">
        <div class="name-input">
          <div class="name" style="width: 44px">姓名：</div>
          <div class="input"><el-input style="width: 264px;height: 32px" v-model="personName" placeholder="请输入" clearable></el-input></div>
        </div>

        <div class="identityCase">
          <span class="case" style="width: 92px;margin-left: 2%;">认证状态：</span>
          <el-select  placeholder="请选择" v-model="checkCase" style="width: 264px;height: 32px" clearable>
            <el-option
              v-for="item in checkCaseOptions"
              :key="item.checkCase"
              :label="item.label"
              :value="item.checkCase">
            </el-option>
          </el-select>
        </div>

        <div class="academy">
          <span class="case" style="width: 83px;margin-left: 2%;">所属组织：</span>
          <el-select placeholder="请选择" v-model="organizationId" style="width: 264px;height: 32px" clearable>
            <el-option
              v-for="item in OrganizationOptions"
              :key="item.organizationId"
              :label="item.organizationName"
              :value="item.organizationId">
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="line-two" style="margin-top:2%">
        <div class="type">
          <span class="typeKind" style="width: 44px">类别：</span>
          <el-select placeholder="请选择" v-model="identityType" style="width: 264px;height: 32px" clearable>
            <el-option
              v-for="item in typeOptions"
              :key="item.identityType"
              :label="item.label"
              :value="item.identityType">
            </el-option>
          </el-select>
        </div>

        <div class="whether">
          <span class="case" style="width: 92px;margin-left: 2%">是否书记：</span>
          <el-select placeholder="请选择" v-model="PartyMembers" style="width: 264px;height: 32px" clearable>
            <el-option
              v-for="item in dangYuanChoices"
              :key="item.PartyMembers"
              :label="item.label"
              :value="item.PartyMembers">
            </el-option>
          </el-select>
        </div>
        <div class="button">
          <el-button type="danger" @click="checkAuditInfo">查询</el-button>
          <el-button type="danger" @click="openWindow('AuthenticationForm')"  style="margin-left:30%">审核</el-button>
        </div>
      </div>
    </div>

    <!--表格-->
    <div class="table">
      <el-table   @selection-change="handleSelectionChange"
                  :data="tableData"
                  :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}" >
        <el-table-column type="selection" :selectable="selectTable" ></el-table-column>
<!--        <el-table-column prop="id" label="微信号" :show-overflow-tooltip="true"/>-->
        <el-table-column prop="nickname" label="昵称" :show-overflow-tooltip="true"/>
        <el-table-column prop="name" label="姓名"/>
        <el-table-column prop="studentJobNumber" label="学号/工号" />
        <el-table-column prop="organizationName" label="组织名称"  :show-overflow-tooltip="true" />
        <el-table-column prop="telNumber" label="联系方式" align="center" :show-overflow-tooltip="true" />
        <el-table-column prop="type" label="类别" align="center" :formatter="fomattBoolean" />
        <el-table-column prop="isSecretary" label="是否书记" align="center" :formatter="isSecretary" />
        <el-table-column prop="isAudited" label="认证是否通过" align="center"  :formatter="isAudited"  width="105" />
        <el-table-column label="操作" align="center" width="130">
          <!--操作行-->
          <template slot-scope="scope" >
            <el-button type="text" v-if="scope.row.isAudited===0" @click="auditInfo(scope.row)" class="table_button">审核 &nbsp;&nbsp;</el-button>
            <el-button type="text"  @click="viewIdentifyDetails(scope.row)" class="table_button">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--页码-->
    <div class="pages">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!--表格行内认证弹窗-->
    <el-dialog title="认证" :visible.sync="dialogFormVisible">
      <div>
        <el-form :model="AuthenticationForm"  :rules="ruleForm" ref="AuthenticationForm">
          <el-form-item label="认证结果：" prop="auditResult">
            <el-radio-group v-model="AuthenticationForm.auditResult">
              <el-radio label="成功" ></el-radio>
              <el-radio label="失败"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="认证说明：" prop="remarks">
            <el-input v-model="AuthenticationForm.remarks" placeholder="请输入至少五个字符"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitAuditInfo('AuthenticationForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--按钮审核弹窗-->
    <el-dialog title="认证" :visible.sync="buttonDialogFormVisible">
        <el-form :model="AuthenticationForms" :rules="ruleForms" ref="AuthenticationForms">
          <el-form-item label="认证结果：" prop="auditResult">
            <el-radio-group v-model="AuthenticationForms.auditResult">
              <el-radio label="成功" value="成功"></el-radio>
              <el-radio label="失败" value="失败"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="认证说明：" prop="remarks" >
            <el-input v-model="AuthenticationForms.remarks" placeholder="请输入至少5个字符"></el-input>
          </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="buttonDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkInfo('AuthenticationForms')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {Auth} from "../../../store/modules/auth";
  import {Audit} from "./authenticationManage";
  import {Msg} from "../../../tools/message";
  export default {
        name: "authenticationManage",
      data(){
          return{
            userInfo:Auth.getUserInfo(),
            tempId:[],
            tempOrganId:[],
            tempRemark:[],
            tableData:[],
            personName: '',   //姓名
            checkCaseOptions:[
              {checkCase:1,label:'认证通过'},
              {checkCase:0,label:'未认证'},
              {checkCase:2,label:'认证失败'}
            ],               //是否认证通过
            checkCase:'',
            OrganizationOptions:[
              {
                organizationId: '',
                organizationName:''
              }
            ],          //所属组织
            organizationId:'',
            typeOptions:[
              {identityType:0,label:'学生'},
              {identityType:1,label:'教师'}
            ],        //类别
            identityType:'',
            dangYuanChoices:[
              {PartyMembers:0,label:'否'},
              {PartyMembers:1,label:'是'}
              ],      //是否书记
            PartyMembers:'',
            checkObj:[],   //多选框选择内容
            currentPage:1,
            total:0,
            pageSize:5,
            dialogFormVisible:false,        //表格操作行审核
            buttonDialogFormVisible:false,  //按钮审核单条或多条
            AuthenticationForm:{},          //表格行内审核
            AuthenticationForms:{},         //按钮审核表单
            ruleForm:{
              auditResult:[{ required: true, message: '请选择审核结果', trigger: 'change' }],
              remarks:[ { required: true, message: '请填写审核说明', trigger: 'blur' },
                {min:5,message:'长度不小于5个字符',trigger:'blur'}]
            },                              //表格行内表单验证
            ruleForms:{
              auditResult:[{ required: true, message: '请选择审核结果', trigger: 'change' }],
              remarks:[{ required: true, message: '请填写审核说明', trigger: 'blur' },
                {min:5,message:'长度不小于5个字符',trigger:'blur'}
              ]
            },                              //按钮审核表单验证
            choiceAll:[],
            index:false,
          }
      },
      methods: {
        selectTable(row) {
          if (row.isAudited === 0) {
            return true;
          }
          else {
            return false;
          }
        },
        // 监视表格中勾选部分
        handleSelectionChange(val) {
          this.checkObj = val;
          console.log(val)
        },
        handleSizeChange(val) {
          this.pageSize = val;
          this.getTableData();
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          this.currentPage = val;
          this.getTableData();
          console.log(`当前页: ${val}`);
        },

        //跳转到认证详情页面
        viewIdentifyDetails(row){
          this.$router.push({
            path:'/viewIdentifyDetails',
            query:{
              id:row.id,
            }
          })
        },

        //得到表格数据
        getTableData:function () {
          var params = {currentPage:this.currentPage,pageSize:this.pageSize,
            adminOrganizationId:Auth.getUser().organizationId,
            wxOrganizationId:this.organizationId,
            isAudited:this.checkCase, isSecretary:this.PartyMembers,
            type:this.identityType,name:this.personName
          };
          console.log(params);
          Audit.getVerificationInfoList(params)
            .then(res=>{
                if(res.data.code === 200){
                    this.tableData=res.data.data.list;
                    this.total=res.data.data.total;
                } else if(res.data.code === 403){
                    Msg.error('权限不足');
                } else {
                    Msg.error('网络繁忙');
                }

          }).catch(err =>{
              Msg.error('网络繁忙');
          })
        },
        //转换表格中的数据展示（类别）
        fomattBoolean(row,column,cellvalue){
          var  dis='';
          if(cellvalue){
            dis='教师'
          }else{
            dis='学生'
          }
          return dis;
        },
        //转换表格的数据展示（是否是书记）
        isSecretary(row,column,cellvalue){
          var value='';
          if(cellvalue){
            value='是';
          }else{
            value='否';
          }
          return value;
        },
      //  转换表格的数据展示（是否认证通过）
        isAudited(row,column,cellvalue){
          var value='';
          if(row.isAudited===1){
            value='认证成功';
          }
          else if(row.isAudited===2){
            value='认证失败';
          }else{
            value='未认证';
          }
          return value;
        },
      //  表格操作行审核信息弹窗
        auditInfo(row){
          this.dialogFormVisible = true;
          this.AuthenticationForm.wxUserId = row.id;
          this.AuthenticationForm.organPostId = row.organPostId;
          this.AuthenticationForm.userId = this.userInfo.id;
          if (this.$refs['AuthenticationForm']!==undefined)
            this.$refs['AuthenticationForm'].resetFields();

        },
        //表格操作行确定审核
        commitAuditInfo(formName) {
          var time2 = new Date();
          this.AuthenticationForm.verifyTime = this.formatDateTime(time2);
          if (this.AuthenticationForm.auditResult === "成功") {
            this.AuthenticationForm.auditResult = 1;
          } else {
            this.AuthenticationForm.auditResult = 2;
          }
          var params = {
            auditResult: this.AuthenticationForm.auditResult,
            organPostId: this.AuthenticationForm.organPostId,
            partyId: Auth.getUser().partyId, remarks: this.AuthenticationForm.remarks,
            verifyTime: this.AuthenticationForm.verifyTime, wxUserId: this.AuthenticationForm.wxUserId
          };
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$confirm('此操作将确认审核该条信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                Audit.commitAudit(params).then(res=>{
                  if( res.data.code===200 ){
                      this.$message({
                        message:res.data.message,
                        type:'success'
                      });
                  }else{
                    this.$message.error(res.data.message);
                  }
                  this.getTableData();
                  this.dialogFormVisible=false;
                  this.AuthenticationForm = {};
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消审核'
                });
              });
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },

        //打开按钮审核弹窗
        openWindow(){
          this.buttonDialogFormVisible = true;
          this.choiceAll = this.checkObj;
          console.log(this.choiceAll);
          if (this.$refs['AuthenticationForms']!==undefined)
            this.$refs['AuthenticationForms'].resetFields();
        },
        checkInfo(formName) {
          this.commitAllInfo(formName);
        },

        commitAllInfo(formName){
          if (this.AuthenticationForms.auditResult==="成功"){
            this.AuthenticationForms.auditResult =1;
          } else {
            this.AuthenticationForms.auditResult =2;
          }
          for(var i=0;i<this.choiceAll.length;i++){
            this.tempId.push(this.choiceAll[i].id);
            this.tempOrganId.push(this.choiceAll[i].organPostId);
          }
          var time2 = new Date();
          this.AuthenticationForms.verifyTime =  this.formatDateTime(time2);

          var  params = {
            auditResult:this.AuthenticationForms.auditResult,
            organPostIds: this.tempOrganId,
            partyId:Auth.getUser().partyId,
            remarks:this.AuthenticationForms.remarks,
            verifyTime:this.AuthenticationForms.verifyTime,
            wxUserIds:this.tempId
          };
          //通过选择框来审核信息
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$confirm('此操作将确认审核该条信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                Audit.commitAllInfo(params).then(res=>{
                  if(res.data.message === '认证成功'){
                    this.$message({
                      message:'操作成功',
                      type:'success'
                    });
                    this.buttonDialogFormVisible=false;
                  }
                  this.getTableData();
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消审核'
                });
              });
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },


        //  查询信息
        checkAuditInfo(){
          this.getTableData();
        },
        formatDateTime(date) {
          var y = date.getFullYear();
          var m = date.getMonth() + 1;
          m = m < 10 ? ('0' + m) : m;
          var d = date.getDate();
          d = d < 10 ? ('0' + d) : d;
          var h = date.getHours();
          h=h < 10 ? ('0' + h) : h;
          var minute = date.getMinutes();
          minute = minute < 10 ? ('0' + minute) : minute;
          var second=date.getSeconds();
          second=second < 10 ? ('0' + second) : second;
          return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
        },

        //得到选择器里面的组织
        getOrganizationName(){
          Audit.getOrganizationList(
            {organizationId:Auth.getUser().organizationId}
          ).then(res=>{
            console.log(res);
            this.OrganizationOptions = res.data.data;
          })
        },
      },
      created:function () {
        this.getOrganizationName();
        this.getTableData();

      },
    }
</script>

<style scoped>
  .box,.name-input,.identityCase,.academy,.name,.input{
    display: flex;
    align-items: center;
    align-content: space-between;
  }
  .name,.typeKind,.case{
    font-size: 14px;
    color: rgba(0, 0, 0, 0.847059);
    line-height: 22px;
    text-align: center;
  }

  .line-two,.type,.whether,.button{
    display: flex;
    align-items: center;
    align-content: space-between;
  }
  .button{
    margin-left: 9%;
  }
.table{
  margin-top:39px;
  min-height:250px;

}
.cell{
  font-size: 12px;
  font-family: "Microsoft Tai Le Bold","Microsoft Tai Le";
  font-weight: 700;
  text-align: left;
  line-height: 53px;
  font-style: normal;
  color: rgba(0, 0, 0, 0.847059);
}
.el-table-column--selection .cell {
  padding-left: 21px;
  padding-right: 14px;
}
.el-dialog {
  position: relative;
  margin: 0 auto 50px;
  border-radius: 2px;
  -webkit-box-shadow: 0 1px 3px rgba(0,0,0,.3);
  box-shadow: 0 1px 3px rgba(0,0,0,.3);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 39%;
}
.el-dialog__body {
  border:1px solid;
  box-shadow: 0 1px 3px rgba(0,0,0,.3);
}

  >>>.el-button--danger{
    height: 32px;line-height: 9px;
    background-color: #ff0000;
    margin-right: 20px;
  }
  .table_button {
    font-size: 13px;
    color: #F56C6C;
    background: none;
    display: inline-block;
    /*margin-left: 4px;*/
  }
  /*页码*/
  .pages {
    display: flex;
    justify-content: center;
    margin-top: 2%;
  }
</style>
