<template>
    <div class="createArticle">

<!--      &lt;!&ndash;面包屑&ndash;&gt;-->
<!--      <div style="margin-top: 10px">-->
<!--        <el-breadcrumb separator="/">-->

<!--          <el-breadcrumb-item :to="{path: '/themeDay' }">党建服务</el-breadcrumb-item>-->
<!--          <el-breadcrumb-item :to="{path:'/themeDay' }">党主题日管理</el-breadcrumb-item>-->
<!--          <el-breadcrumb-item v-if="flag==1">发布文章</el-breadcrumb-item>-->
<!--          <el-breadcrumb-item v-if="flag==2">编辑文章</el-breadcrumb-item>-->

<!--        </el-breadcrumb>-->
<!--      </div>-->

      <div style="display: flex;justify-content:center;margin-top: 25px;">

        <el-form :model="themeDayForm" ref="themeDayForm" :rules="themeDayFormRules" label-width="100px">
          <h2>党主题日开展记录</h2>

          <el-form-item label="标题："  prop="title">
            <el-input size="small" placeholder="请输入标题" style="width:580px;" v-model="themeDayForm.title" readonly />
          </el-form-item>

          <el-row>
            <el-col :span="10">
              <el-form-item label="支部名称："  prop="organizationName">
                <el-input size="small" placeholder="请输入支部名称" v-model="themeDayForm.organizationName" readonly/>
              </el-form-item>
            </el-col>
           <el-col :span="10" style="margin-left: 108px;">
             <el-form-item label="支部党员数：" class="read" prop="partyMembersNumber" >
               <el-input size="small" placeholder="请输入支部党员数" v-model="themeDayForm.partyMembersNumber" readonly/>
             </el-form-item>
           </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="支部书记：" prop="branchSecretaryName">
                <el-input size="small" placeholder="请输入支部书记" v-model="themeDayForm.branchSecretaryName" readonly/>
              </el-form-item>
            </el-col>
            <el-col :span="10" style="margin-left: 108px;">
              <el-form-item label="联系电话：" prop="phone">
                <el-input size="small" placeholder="请输入联系电话"  v-model="themeDayForm.phone" readonly/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10">
              <el-form-item label="学习时间：" class="read" prop="learningTime">
                <el-date-picker   type="datetime" v-model="themeDayForm.learningTime"
                size="small" style="width: 180px" placeholder="请选择">
                </el-date-picker>

              </el-form-item>
            </el-col>
            <el-col :span="10" style="margin-left: 108px;">
              <el-form-item label="学习地点：" class="read" prop="learningPlace">
                <el-input size="small" placeholder="请输入学习地点" v-model="themeDayForm.learningPlace" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="学习内容：" prop="learningContent">
            <el-input placeholder="请输入学习内容"  v-model="themeDayForm.learningContent" type="textarea" :rows="7" style="width: 570px;"></el-input>
          </el-form-item>

          <el-row>
            <el-col :span="10">
              <el-form-item label="学习方式：" class="read" prop="learningWay">
                <el-input size="small" placeholder="请输入学习方式" v-model="themeDayForm.learningWay"  />
              </el-form-item>
            </el-col>
            <el-col :span="10" style="margin-left: 108px;">
              <el-form-item label="月份：" class="read" prop="month">
                <el-date-picker v-model="themeDayForm.month"
                  type="month" value-format="MM"size="small" style="width: 180px"
                  placeholder="选择月">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="请选择组织：" class="read" >
            <el-tree
              :data="organizationList"
              default-expand-all
              node-key="id"
              ref="tree"
              highlight-current
              :expand-on-click-node="false"
              :props="defaultProps"
              @node-click="onSelectDepart">
            </el-tree>
          </el-form-item>

          <el-row>

            <el-col :span="10">
              <el-form-item label="请选择：" prop="participantsId">
                <el-select  placeholder="请选择参与人员" multiple v-model="selectedPartyList" size="small" style="width:290px;margin-left: 6px" @change="selectAllChange" >
                  <!--<el-option label="选择所有" value="all"></el-option>-->
                  <el-option v-for="item in organization_party" :label="item.label" :value="item.key" :key="item.key" ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <!--<el-col :span="10">-->
              <!--<el-form-item prop="hostParticipate">-->
                <!--<el-select v-model="hostParticipate" filterable placeholder="请选择授课人员"  size="small" style="width:290px;margin-left: 6px" >-->
                  <!--<el-option-->
                    <!--v-for="item in organization_party"-->
                    <!--:key="item.key" :label="item.label" v-model="item.key">-->
                  <!--</el-option>-->
                <!--</el-select>-->
              <!--</el-form-item>-->
            <!--</el-col>-->

          </el-row>

          <el-form-item label="总体效果：" class="read" prop="overallEffect">
            <el-input size="small" placeholder="请输入" v-model="themeDayForm.overallEffect" style="width:580px;margin-left: 6px"/>
          </el-form-item>

          <!--底部按钮-->
          <el-form-item>
            <el-button type="danger" @click="saveEssay('themeDayForm')" v-if="flag==1">保存</el-button>
            <el-button type="danger" style="margin-left: 5%" @click="publish('themeDayForm')" v-if="flag==1">发布</el-button>
            <el-button type="danger" style="margin-left: 5%" @click="submitUpdate('themeDayForm')" v-if="flag==2">确定</el-button>
            <el-button style="margin-left: 5%" @click="jumpToThemeDay">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
  import {ThemeDayMethods} from './themeDayJs'
  import {Auth} from "../../../../store/modules/auth";
  import {Msg} from "../../../../tools/message.js"

  // import treeTransfer from 'el-tree-transfer' // 引入
  import{threeLessonsMethods} from '../meeting/threeLessonsJS'

  export default {
        name: "createArticle",
      data(){
          var checkSelectedPartyList = (rule , value , callback)=>{
            console.log("编辑参与人员：");
            console.log(this.selectedPartyList)
            if(this.selectedPartyList == '' || this.selectedPartyList == null){
              return callback(new Error('参与人员不能为空'));
            }
            else{
              callback();
            }
          };
          return{
            flag:0,
            themeDayId:'',
            userInfo:{},
            phoneNumber:'',
            yearAndMonth:'',
            themeDayForm:{
              organizationId:'',organizationName:'',editorId:'',editorName:'',
              status:'',title:'',partyMembersNumber:'',branchSecretaryId:'',branchSecretaryName:'',
              phone:'',learningTime:'',releaseTime:'', learningPlace:'',learningContent:'',learningWay:'',
              month:null,participantsId:'',participantsName:'',overallEffect:''
            },

           organizationList:[],
            participantsLis:[],
            organization_party:[],
            selectedPartyList:{},
            hostParticipate:'',
            checkAll: false,
            isIndeterminate: true,

            defaultInfo:{organizationId:'',organizationName:'',branchSecretaryId:'',branchSecretaryName:'',phone:''},
            types:[
              {label:"选项" ,value:"选项"}
            ],
            title:['待选','参会'],

            renderFunc(h, option) {
              return option.label  //页面展示的数
            },

            defaultProps: {
              children: 'children',
              label: 'organizationName'
            },
            testProps:{
              value:'key',
              label:'label'
            },

            themeDayFormRules:{
              learningTime:{
                required: true, message: '请选择学习时间', trigger: 'blur'
              },
              learningPlace:{
                required: true, message: '请输入学习地点', trigger: 'blur'
              },
              learningContent:{
                required: true, message: '请输入学习内容', trigger: 'blur'
              },
              learningWay:{
                required: true, message: '请输入学习方式', trigger: 'blur'
              },
              month:{
                required: true, message: '请选择月份', trigger: 'blur'
              },
              participantsId:[
                // {required: true, message: '请选择参与人员', trigger: 'blur'},
                {validator: checkSelectedPartyList, trigger: 'blur'},
              ],
              // participantsName:{
              //   required: true, message: '请选择参与人员', trigger: 'blur'
              // },
              overallEffect:{
                required: true, message: '请输入总体效果', trigger: 'blur'
              },
            },

            toParticipate:{},
          }
      },

      created(){
        this.userInformation = Auth.getUser();
        this.flag=this.$route.query.flag;

        console.log("this.userInformation:")
        console.log(this.userInformation)

        ThemeDayMethods.selectStructureParty({rank:this.userInformation.organizationRank,organizationId:this.userInformation.organizationId}).then(res=>{
          this.organizationList = res.data.data;
        });

          //修改原有数据
          if(this.flag==2){
            this.themeDayId = this.$route.query.themeDayId;
            this.getUpdateDetails(this.themeDayId);
            ThemeDayMethods.getAttendThemeDayPartyList({id:this.themeDayId}).then(res=>{
              this.organization_party = res.data.data;
              ThemeDayMethods.getAttendThemeDayPartyIdList({id:this.themeDayId}).then(res=>{
                console.log("编辑theme day 参与人id：");
                console.log(res.data.data);
                // this.themeDayForm.participantsId = res.data.data;
                // this.themeDayForm.participantsId = this.themeDayForm.participantsId .split(",");
                this.selectedPartyList=res.data.data;
                this.selectedPartyList = this.selectedPartyList.split(",");
              })
            });

          }
          //新增数据
          if(this.flag==1){
            threeLessonsMethods.getPartyMemberListByOrganization({organizationId:this.userInformation.organizationId}).then(res=>{
              this.organization_party = res.data.data;
            });

            ThemeDayMethods.getInsertThemeDayDefaultThree({organizationId:this.userInformation.organizationId}).then(res=>{
              this.defaultInfo = res.data.data;
              this.themeDayForm.phone = this.defaultInfo.phone;
              this.themeDayForm.organizationName = this.defaultInfo.organizationName;
              this.themeDayForm.branchSecretaryName = this.defaultInfo.branchSecretaryName;
              this.yearAndMonth = ThemeDayMethods.getCurrentYearAndMonth();
              this.themeDayForm.title = this.defaultInfo.organizationName+this.yearAndMonth+"党员组织生活和支部主题党日开展情况记录表";


              var getNumberQuery={
                rank:this.userInformation.organizationRank,
                organizationId:this.userInformation.organizationId
              };

              ThemeDayMethods.getPartyMemberNumber(getNumberQuery).then(res=>{
                this.themeDayForm.partyMembersNumber = res.data.data;
              });

            });
          }
      },
      methods:{
        // 返回文章管理
        jumpToThemeDay(){
          this.$router.push({path:'/themeDay'})
        },

      //  得到默认生成的数据
        automaticGenerated(){
          // this.themeDayForm.title
        },
      //  得到要修改的数据
        getUpdateDetails(data){
          ThemeDayMethods.getThemeDayDetails({id:data}).then(res=>{
            this.themeDayForm=res.data.data;
          })
        },
      //  提交修改后的数据
        submitUpdate(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              // this.themeDayForm.participantsId=this.themeDayForm.participantsId.join(",");
              this.themeDayForm.participantsId = this.selectedPartyList.join(",");
              console.log("提交修改后的参与人员id")
              console.log(this.themeDayForm.participantsId)
              var data={
                id:this.themeDayId,
                title: this.themeDayForm.title,
                phone: this.themeDayForm.phone,
                participantsId:this.themeDayForm.participantsId,
                learningTime:ThemeDayMethods.changeDateYMDHMS(this.themeDayForm.learningTime),
                learningPlace:this.themeDayForm.learningPlace,
                learningContent:this.themeDayForm.learningContent,
                learningWay:this.themeDayForm.learningWay,
                month:this.themeDayForm.month,
                overallEffect:this.themeDayForm.overallEffect,
              };
              ThemeDayMethods.updateThemeDay(data).then(res=>{
              });
              this.jumpToThemeDay();
            } else {
              // console.log('error submit!!');
              Msg.error("请根据提示填写正确的数据！")
              return false;
            }
          });
        },

        //  发布新增的党主题日
        publish(formName){

          this.$confirm('确定要发布么?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.selectedPartyList=this.selectedPartyList.join(",");
                ThemeDayMethods.getInsertThemeDayDefaultThree({organizationId:this.userInformation.organizationId}).then(res=>{
                  this.defaultInfo = res.data.data;
                  var data={
                    title: this.themeDayForm.title,
                    organizationId:this.userInformation.organizationId,
                    branchSecretaryId:this.defaultInfo.branchSecretaryId,
                    partyMembersNumber:this.themeDayForm.partyMembersNumber,
                    phone: this.themeDayForm.phone,
                    learningTime:ThemeDayMethods.changeDateYMDHMS(this.themeDayForm.learningTime),
                    learningPlace:this.themeDayForm.learningPlace,
                    learningContent:this.themeDayForm.learningContent,
                    learningWay:this.themeDayForm.learningWay,
                    month:this.themeDayForm.month,
                    participantsId:this.selectedPartyList,
                    overallEffect:this.themeDayForm.overallEffect,
                    status:2,
                    editorId:this.userInformation.partyId,
                    releaseTime:ThemeDayMethods.getCurrentTime(),
                  };
                  ThemeDayMethods.insertThemeDay(data).then(res=>{
                    this.jumpToThemeDay();
                  })
                });
              } else {
                // console.log('error submit!!');
                Msg.error("请根据提示填写正确的数据！");
                return false;
              }
            });
            this.$message({
              type: 'success',
              message: '发布成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消发布'
            });
          });
        },

      //  保存新增的数据
        saveEssay(formName){

          this.$confirm('确定要保存么?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                // this.userInformation = Auth.getUser();
                ThemeDayMethods.getInsertThemeDayDefaultThree({organizationId:this.userInformation.organizationId}).then(res=>{
                  this.defaultInfo = res.data.data;

                  this.selectedPartyList=this.selectedPartyList.join(",");

                  var data={
                    title: this.themeDayForm.title,
                    organizationId:this.userInformation.organizationId,
                    branchSecretaryId:this.defaultInfo.branchSecretaryId,
                    partyMembersNumber:this.themeDayForm.partyMembersNumber,
                    phone: this.themeDayForm.phone,
                    learningTime:ThemeDayMethods.changeDateYMDHMS(this.themeDayForm.learningTime),
                    learningPlace:this.themeDayForm.learningPlace,
                    learningContent:this.themeDayForm.learningContent,
                    learningWay:this.themeDayForm.learningWay,
                    month:this.themeDayForm.month,
                    participantsId:this.selectedPartyList,
                    overallEffect:this.themeDayForm.overallEffect,
                    status:1,
                    editorId:this.userInformation.partyId,
                    releaseTime:ThemeDayMethods.getCurrentTime(),
                  };
                  console.log("新增的数据：");
                  console.log(data);
                  ThemeDayMethods.insertThemeDay(data).then(res=>{
                    this.jumpToThemeDay();
                  })
                });
              } else {
                // console.log('error submit!!');
                Msg.error("请根据提示填写正确的数据！");
                return false;
              }
            });
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消保存'
            });
          });
        },

        //得到的当前组织下的党员
        getPartyMemberList(){
          threeLessonsMethods.getPartyMemberListByOrganization({organizationId:id}).then(res=>{
            this.partyMemberList = res.data.data;
            console.log("得到的当前组织下的党员：")
            console.log(this.partyMemberList)
          })
        },

        //得到选中的组织id
        getCheckedKeys(data, checked, indeterminate) {//节点选中状态变化的函数
          console.log("hhhh")
          console.log(data)
          console.log(checked)
          console.log(indeterminate)
          // if(this.flag==true){
            // var that=this;that.flag=false;
            // setTimeout(      //延时加载，当第一次进去flag的true变成了false。所以第二次就不走这里了。过了500ms他去执行了访问接口的函数，这个时候
            //   function(){
            //     that.api();   //访问接口给后台传数据是这个                        
            //   },
            //   500)
          // }

        },

        //得到选中的组织id
        onSelectDepart(data) {
          let dataId = null;
          if (data == null) {
            dataId = 1;
            //给面包屑组件赋值
            // this.breadcrumb = 'SpringbootOA';
          } else {
            dataId = data.id
            //获取选中树组件的数组
            this.getCheckedKeys(dataId)
            //给面包屑组件赋值
            this.breadcrumb = data.label;
          }
          console.log("sdhufuas:");
          threeLessonsMethods.getPartyMemberListByOrganization({organizationId:dataId}).then(res=>{
            this.organization_party = res.data.data;
            console.log("得到的当前组织下的党员：");
            console.log(this.organization_party)
          })
        },

        getInfo(obj, index){
          console.log("回调:")
          console.log(obj);
          console.log(index);
        },

        handleItemChange(val) {
          console.log("看看是个啥：")
          console.log(val);
        },

        handleCheckAllChange(val) {
          this.checkAll =  !!this.checkAll;
          let checked = this.organization_party.map(function(item){return item.id;});
          this.selectedPartyList = this.checkAll ? checked : [];
          this.isIndeterminate = false;
        },

        handleCheckedCitiesChange(value) {
          let checkedCount = value.length;
          this.checkAll = checkedCount === this.organization_party.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.organization_party.length;
        },

        //多选下拉框的全选--未实现
        selectAllChange(val,oldval){
          // if(val.indexOf('all')!=-1 && oldval.indexOf('all')==-1 && val.length>1){                      //如果新的选择里有勾选了选择所有选择所有 则 只直线勾选所有整个选项
          //   this.selectedPartyList=['all'];
          // }else if(index = val.indexOf('all')!=-1 && oldval.indexOf('all')!=-1 && val.length>1){        //如果操作前有勾选了选择所有且当前也选中了勾选所有且勾选数量大于1  则移除掉勾选所有
          //   this.selectedPartyList.splice(val.indexOf('all'),1)
          // }

          // console.log("selectedPartyList:");
          console.log("participantsId:")
          console.log(this.themeDayForm.participantsId)
        }
      },
    }
</script>

<style scoped>
.createArticle{

}
</style>
