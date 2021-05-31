<template>
    <div>

<!--      <div class="bread" >-->
<!--        <el-breadcrumb separator="/">-->
<!--          <el-breadcrumb-item :to="{ path: '/three' }">党建服务</el-breadcrumb-item>-->
<!--          <el-breadcrumb-item :to="{ path: '/three' }">三会一课</el-breadcrumb-item>-->
<!--          <el-breadcrumb-item>发布会议/课程</el-breadcrumb-item>-->
<!--        </el-breadcrumb>-->
<!--      </div>-->

      <div style="display: flex;justify-content:center;margin-top: 25px;">

        <el-form :model="threeOneDetails" ref="threeOneDetailsForm" :rules="threeOneDetailsRules" label-width="120px">
          <h2>发布会议/课程</h2>

          <el-form-item label="标题："  prop="title">
            <el-input size="small" placeholder="请输入标题" style="width:580px;" v-model="threeOneDetails.title"/>
          </el-form-item>

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
              <el-form-item label="请选择："  prop="selectedPartyList">
                <el-select  placeholder="请选择参会人员" multiple v-model="selectedPartyList" size="small" style="width:290px;margin-left: 6px" @change="selectAllChange" >
                  <!--<el-option label="选择所有" value="all"></el-option>-->
                  <el-option v-for="item in organization_party" :label="item.label" :value="item.key" :key="item.key" ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="10">
              <el-form-item prop="hostParticipate">
                <el-select v-model="threeOneDetails.hostParticipate" filterable placeholder="请选择授课人员"  size="small" style="width:290px;margin-left: 6px" >
                  <el-option
                    v-for="item in organization_party"
                    :key="item.key" :label="item.label" v-model="item.key">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>
            <el-col :span="10" >
              <el-form-item label="开始时间：" class="read" prop="meetingTime">

                <el-date-picker   type="datetime"
                                  v-model="threeOneDetails.meetingTime" size="small" style="width: 180px"
                                  placeholder="请选择">
                </el-date-picker>
                <!--<el-time-picker-->
                  <!--v-model="threeOneDetails.begin" size="small" style="width: 180px"-->
                  <!--placeholder="请选择">-->
                <!--</el-time-picker>-->
              </el-form-item>
            </el-col>
            <el-col :span="10" style="margin-left: 108px">
              <el-form-item label="类别:"  prop="meetingCategory">
                <el-select v-model="threeOneDetails.meetingCategory" size="small" placeholder="请选择">
                  <el-option
                    v-for="item in type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="学习内容："prop="mainContent">
            <el-input placeholder="请输入学习内容"  v-model="threeOneDetails.mainContent" type="textarea" :rows="7" style="width: 570px;"></el-input>
          </el-form-item>

          <el-row>
            <el-col :span="10">
              <el-form-item label="时长(h)：" class="read" prop="meetingDuration">
                <el-input size="small" placeholder="请输入" v-model="threeOneDetails.meetingDuration" style="width:180px;"/>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="会议形式：" class="read" prop="meetingForm">
                <el-input size="small" placeholder="例如 座谈会" v-model="threeOneDetails.meetingForm" style="width:180px;"/>
              </el-form-item>
            </el-col>
          </el-row>


          <!--底部按钮-->
          <el-form-item>
            <el-button type="danger" @click="saveThreeOne('threeOneDetailsForm')" v-if="flag==1">保存</el-button>
            <el-button type="danger" style="margin-left: 5%" @click="submitInsertThreeOne('threeOneDetailsForm')" v-if="flag==1">发布</el-button>
            <el-button style="margin-left: 5%" @click="jumpToThree">取消</el-button>
            <el-button type="danger" style="margin-left: 5%" @click="submitUpdateThreeOne('threeOneDetailsForm')" v-if="flag==2">确定</el-button>
          </el-form-item>

        </el-form>
      </div>
    </div>
</template>

<script>
  import {threeLessonsMethods} from './threeLessonsJS';
  import {Auth} from "../../../../store/modules/auth";
  import {ThemeDayMethods} from '../themeDay/themeDayJs'
  import {Msg} from "../../../../tools/message.js"


  export default {
        name: "createThree",
      data(){
        //验证会议时长
        var checkMeetingDuration = (rule, value, callback) => {
          console.log("三会一课duration验证")
          console.log(value)
          if (!value) {
            return callback(new Error('时长不能为空'));
          }
          // setTimeout(() => {
            var re = /^((([^0][0-9]+|0)\.([0-9]{1,2}))$)|^(([1-9]+)\.([0-9])$)/;
            if (!re.test(value) ) {
              callback(new Error('请输入形如 1.5 的值'));
            } else {
              if (value < 0 ){
                callback(new Error('时长必须大于0'));
              } else {
                callback();
              }
            }
          // }, 100);
        };
        var checkThreeOneTitle = (rule , value, callback) =>{
          if(!value){
            return callback(new Error('标题不能为空'));
          }
          // var re = /^[\u4E00-\u9FA5A-Za-z0-9-]+$/;
          var re = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
          var re1 = /^[0-9]*$/;
          if(!re.test(value)){
            callback(new Error("请输入有效的标题"));
          }

          else{
            if(re1.test(value)){
              callback(new Error("标题不能为纯数字"));
            }
            callback();
          }
        };
        var checkMeetingForm = (rule , value, callback) =>{
          if(!value){
            return callback(new Error('会议形式不能为空'));
          }
          // var re=/^[\u4E00-\u9FA5A-Za-z0-9]+$ | ^[\u4E00-\u9FA5A-Za-z0-9]{2,20}$/;
          var re = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
          var re1 = /^[0-9]*$/;

          if(!re.test(value)){
            callback(new Error("请输入有效的的会议形式"));
          }else{
            if(re1.test(value)){
              callback(new Error("标题不能为纯数字"));
            }
            callback();
          }
        };
        var checkSelectedPartyList= (rule , value, callback) =>{
          if(this.selectedPartyList == '' || this.selectedPartyList == null){
            return callback(new Error('参会人员不能为空'));
          } else{
            callback();
          }
        };
          return{
            threeOneDetails:{
              title:'',hostParticipate:'',
              meetingForm:'',meetingCategory:'',
              organizationId:'',meetingTime:'',
              meetingDuration:'',meetingEditorId:'',
              mainContent:''
            },
            userInformation:{},
            flag:0,//1-新增 2-修改
            select_type:"",
            //三会一课的类别
            type:[
              {value:1,label:"1.党委会"},
              {value:2,label:"2.委员会"},
              {value:3,label:"3.小组会"},
              {value:4,label:"4.党课"},
            ],
            threeOneDetailsForm:{
              title:'', meetingCategory:'',  meetingForm:'',  meetingTime:'', meetingDuration:'',  checkedParticipateId:'',
              mainContent:'',
            },
            threeOneDetailsRules:{
              title:[
                {required: true, message: '请输入标题', trigger: 'blur'},
                {validator: checkThreeOneTitle, trigger: 'blur' },
                { max: 32, message: "允许输入最大字符数为32个", trigger: "blur" },
              ],
              meetingCategory:{
                required: true, message: '请选择类别', trigger: 'change'
              },
              meetingForm:[
                {required: true, message: '请输入会议形式', trigger: 'blur'},
                {validator:checkMeetingForm , trigger:'blur'},
              ],
              meetingTime:{
                required: true, message: '请输入会议时间', trigger: 'blur'
              },
              meetingDuration:[
                {required: true, message: '请输入会议时长', trigger: 'blur'},
                {validator: checkMeetingDuration, trigger: 'blur' }
              ],
              selectedPartyList:{
                validator: checkSelectedPartyList , trigger: 'blur'
              },
              hostParticipate:{
                required: true, message: '请选择授课人员', trigger: 'blur'
              },
              mainContent:{
                required: true, message: '请输入会议内容', trigger: 'blur'
              },
            },
            organizationList:[],
            participantsLis:[],
            organization_party:[],
            selectedPartyList:{},
            selectHostParticipate:'',
            checkAll: false,
            isIndeterminate: true,
            insertTheeOneId:'',
            defaultProps: {
              children: 'children',
              label: 'organizationName'
            },
          }
      },
      created(){
          this.userInformation = Auth.getUser();
          this.flag=this.$route.query.flag;

        ThemeDayMethods.selectStructureParty({rank:this.userInformation.organizationRank,organizationId:this.userInformation.organizationId}).then(res=>{
          this.organizationList = res.data.data;
        });

        //新建
        if(this.flag == 1){
          threeLessonsMethods.getPartyMemberListByOrganization({organizationId:this.userInformation.organizationId}).then(res=>{
            this.organization_party = res.data.data;
          });
        }
        //编辑
        if(this.flag ==2){

          this.getUpdateThreeOneDetail(this.$route.query.id);

          threeLessonsMethods.getParticipateList({threeOneId:this.$route.query.id}).then(res=>{
            console.log("传过来的id：")
            console.log(this.$route.query.id)
            console.log("get three one attend party:")
            console.log(res.data.data)
            this.organization_party = res.data.data;
            threeLessonsMethods.getAttendIdList({id:this.threeOneDetails.id}).then(res=>{
              this.selectedPartyList = res.data.data;
              // this.selectedPartyList=this.selectedPartyList.split(",");
              console.log("参会人员id：");
              // console.log(this.threeOneDetails.id);
              // console.log(res);
              console.log(this.selectedPartyList)
            })
          })
        }
      },
      methods:{
        jumpToThree(){
          this.$router.push({path:'/three',
         })
        },
        //得到要修改的三会一课
        getUpdateThreeOneDetail(data){
          threeLessonsMethods.getThreeOneDetails({id:data}).then(res=>{
            this.threeOneDetails = res.data.data;
            this.selectHostParticipate = this.threeOneDetails.hostParticipate;

            // threeLessonsMethods.getAttendIdList({id:this.threeOneDetails.id}).then(res=>{
            //   this.selectedPartyList = res.data.data;
            //   // this.selectedPartyList = this.selectedPartyList.split(",");
            //   console.log("参会人员id：");
            //   // console.log(this.threeOneDetails.id);
            //   // console.log(res);
            //   console.log(this.selectedPartyList)
            // })
          })
        },

        //保存新增的三会一课
        saveThreeOne(formName){

          this.$refs[formName].validate((valid) => {
            if (valid) {
                var data={
                  title:this.threeOneDetails.title,
                  hostParticipate:this.threeOneDetails.hostParticipate,
                  meetingForm: this.threeOneDetails.meetingForm,
                  meetingCategory: this.threeOneDetails.meetingCategory,
                  organizationId: this.userInformation.organizationId,
                  meetingTime:threeLessonsMethods.changeDateYMDHMS(this.threeOneDetails.meetingTime),
                  meetingDuration: this.threeOneDetails.meetingDuration,
                  meetingStatus:'0',
                  releaseTime:threeLessonsMethods.getCurrentTime(),
                  meetingEditorId: this.userInformation.partyId,
                  mainContent: this.threeOneDetails.mainContent
                };

                this.selectedPartyList=this.selectedPartyList.join(",");

                threeLessonsMethods.insertThreeOne(data).then(res=>{
                  this.insertTheeOneId = res.data.data;
                  threeLessonsMethods.insertAttendThreeOne({selectedPartyList:this.selectedPartyList,threeOneId:this.insertTheeOneId})
                });
                this.$router.push({path:'/three',});
                Msg.success("保存成功！")
            } else {
              // console.log('error submit!!');
              Msg.error("请根据提示填写正确的数据！")
              return false;
            }
          });
        },

        //发布新增的三会一课
        submitInsertThreeOne(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$confirm('确定要发布选中的文章么?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                var data={
                  title:this.threeOneDetails.title,
                  hostParticipate:this.threeOneDetails.hostParticipate,
                  meetingForm: this.threeOneDetails.meetingForm,
                  meetingCategory: this.threeOneDetails.meetingCategory,
                  organizationId: this.userInformation.organizationId,
                  meetingTime:threeLessonsMethods.changeDateYMDHMS(this.threeOneDetails.meetingTime),
                  meetingDuration: this.threeOneDetails.meetingDuration,
                  meetingStatus:'1',
                  releaseTime:threeLessonsMethods.getCurrentTime(),
                  meetingEditorId: this.userInformation.partyId,
                  mainContent: this.threeOneDetails.mainContent
                };
                this.selectedPartyList=this.selectedPartyList.join(",");
                threeLessonsMethods.insertThreeOne(data).then(res=>{
                  this.insertTheeOneId = res.data.data;
                  threeLessonsMethods.insertAttendThreeOne({selectedPartyList:this.selectedPartyList,threeOneId:this.insertTheeOneId})
                });
                this.$router.push({path:'/three',});

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
            } else {
              // console.log('error submit!!');
              Msg.error("请根据提示填写正确的数据！")
              return false;
            }
          });

        },

        //提交修改后的三会一课
        submitUpdateThreeOne(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.threeOneDetails.meetingTime = threeLessonsMethods.changeDateYMDHMS(this.threeOneDetails.meetingTime);
              var updateInfo = {
                id:this.threeOneDetails.id,
                title:this.threeOneDetails.title,
                hostParticipate: this.threeOneDetails.hostParticipate,
                mainContent:this.threeOneDetails.mainContent,
                meetingForm:this.threeOneDetails.meetingForm,
                meetingCategory:this.threeOneDetails.meetingCategory,
                meetingTime:this.threeOneDetails.meetingTime,
                meetingDuration:this.threeOneDetails.meetingDuration,
              };

              this.selectedPartyList=this.selectedPartyList.join(",");
              threeLessonsMethods.updateThreeOne(this.threeOneDetails).then(res=>{
                threeLessonsMethods.deleteParticipatesThreeOne({threeOneId:this.threeOneDetails.id}).then(res=>{
                    threeLessonsMethods.insertAttendThreeOne({selectedPartyList:this.selectedPartyList,threeOneId:this.threeOneDetails.id})
                  });
              });
              this.$router.push({path:'/three',});
            } else {
              // console.log('error submit!!');
              Msg.error("请根据提示填写正确的数据！")
              return false;
            }
          });


        },

        //得到选中的组织id
        getCheckedKeys(data, checked, indeterminate) {//节点选中状态变化的函数
          console.log(data);
          console.log(checked);
          console.log(indeterminate);
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
          threeLessonsMethods.getPartyMemberListByOrganization({organizationId:dataId}).then(res=>{
            this.organization_party = res.data.data;
          })
        },

        getInfo(obj, index){
          console.log(obj);
          console.log(index);
        },

        handleItemChange(val) {
          console.log(val);
        },

        //多选下拉框的全选--未实现
        selectAllChange(val,oldval){
          // if(val.indexOf('all')!=-1 && oldval.indexOf('all')==-1 && val.length>1){                      //如果新的选择里有勾选了选择所有选择所有 则 只直线勾选所有整个选项
          //   this.selectedPartyList=['all'];
          // }else if(index = val.indexOf('all')!=-1 && oldval.indexOf('all')!=-1 && val.length>1){        //如果操作前有勾选了选择所有且当前也选中了勾选所有且勾选数量大于1  则移除掉勾选所有
          //   this.selectedPartyList.splice(val.indexOf('all'),1)
          // }
          console.log("selectedPartyList:");
          console.log(this.selectedPartyList)
        }
      }
    }
</script>

<style scoped>

</style>
