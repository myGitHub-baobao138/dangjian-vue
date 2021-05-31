<template>
  <div style="width:100%;margin:0 auto;">
    <div class="nav-form-top function-part">
      <div class="input-content">
        <span>组织名称：</span>
        <el-input placeholder="请输入" class="input_box" size="medium" v-model="searchOrganizationName" clearable
                  @change="getAllInfor"></el-input>
      </div>
      <div class="input-content">
        <span>职务名称：</span>
        <el-input placeholder="请输入" class="input_box" size="medium" v-model="searchPostName" clearable
                  @change="getAllInfor"></el-input>
      </div>
      <div class="button-flex">
        <el-button type="danger" style="margin-left: 2%" @click="getAllInfor">查询</el-button>
        <el-button type="danger" @click="Establish">创建</el-button>
      </div>

    </div>
    <el-table :data="information" :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}"
              class="form-table-top">
      <el-table-column label="组织名称" prop="getOrganizationName" :show-overflow-tooltip="true"
                       align="center"></el-table-column>
      <el-table-column label="职务名称" prop="postName" :show-overflow-tooltip="true" align="center"></el-table-column>
      <el-table-column label="职务权限" prop="rightColumns" :show-overflow-tooltip="true" align="center"
                       :formatter="formateRight"></el-table-column>
      <el-table-column label="分配人员" prop="createPartyName" align="center"></el-table-column>
      <el-table-column label="最近分配时间" prop="createTime" align="center"></el-table-column>
      <el-table-column label="操作" align="center" min-width="100px">
        <template slot-scope="scope">
          <!--          <el-button type="text" class="text_button" @click="updatePermission(scope.row)">分配菜单</el-button>-->
          <el-button type="text" class="text_button" @click="updateAuthority(scope.row)">分配权限</el-button>
          <el-button type="text" class="text_button" @click="deleteById(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--页码-->
    <div class="pages">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalEssay">
      </el-pagination>
    </div>

    <!--创建权限弹窗-->
    <div>
      <el-dialog title="创建权限" :visible.sync="createdVisible" :before-close="createClose">
        <div>
          <el-form :model="addForm" ref="ruleForm" :rules="rules">
            <div class="read">
              <el-form-item label="组织名称:" prop="organizationId" class="read">
                <el-select v-model="addForm.organizationId" placeholder="请选择" size="medium" filterable
                           style="width: 198px">
                  <el-option
                    v-for="item in organizationList"
                    :key="item.organizationId"
                    :label="item.organizationName"
                    :value="item.organizationId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="职务名称:" prop="postId" class="read" style="margin-left: 10px">
                <el-select v-model="addForm.postId" placeholder="请选择" size="medium" style="width: 200px">
                  <el-option
                    v-for="item in postList"
                    :key="item.postId"
                    :label="item.postName"
                    :value="item.postId">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div style="clear: both"></div>
        <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveCreate">确 定</el-button>
                <el-button @click="createClose">取 消</el-button>
              </span>
      </el-dialog>
    </div>

    <!--查看权限弹窗-->
    <div style="text-align: left;">
      <el-dialog title="查看信息" :visible.sync="checkVisible">
        <el-form :model="viewForm">
          <div class="read" style="margin-left: 2%">
            <el-form-item label="组织名称：" class="read" prop="getOrganizationName">
              <el-input v-model="viewForm.getOrganizationName" style="width: 110%" readonly></el-input>
            </el-form-item>
            <el-form-item label="职务名称：" class="read" prop="postName" style="margin-left: 6%">
              <el-input v-model="viewForm.postName" style="width: 100%" readonly></el-input>
            </el-form-item>
          </div>
          <el-form-item label="权限名称：" class="read" style="margin-left: 2%">
            <el-input v-model="viewForm.rightColumns" style="width: 120%" readonly/>
          </el-form-item>
          <el-form-item>
            <div style="margin-left:45%">
              <el-button @click="cleanCheck">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>

    <!--修改权限弹窗-->
    <div style="text-align: left;">
      <el-dialog title="分配权限" :visible.sync="updateVisible" :before-close="updateClose">
        <el-form style="margin: 0 20px" :model="updateForm">
          <div class="read">
            <el-form-item label="组织名称:" class="read">
              <el-input v-model="updateForm.getOrganizationName" size="medium" readonly></el-input>
            </el-form-item>
            <el-form-item label="职务名称：" class="read" style="margin-left: 10px">
              <el-input v-model="updateForm.postName" size="medium" readonly></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div>
          <div style=" float: left; border: 1px solid #ccc;width: 100%;">
            <!--使用树形穿梭框组件-->
            <el-tree
              :props="rightProps"
              :data="rightData"
              default-expand-all
              :default-checked-keys="hasRights"
              ref="rightTree"
              show-checkbox
              node-key="id"
              highlight-current
              @check-change="handleCheckChange">
            </el-tree>
          </div>
        </div>
        <div style="clear: both"></div>
        <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveUpdate">确 定</el-button>
                <el-button @click="updateClose">取 消</el-button>
              </span>
      </el-dialog>
    </div>
    <el-dialog title="分配菜单" :visible.sync="updateVisible1" :before-close="updateClose1">
      <div class="input-inline">
        <span>组织名称：</span>
        <el-input placeholder="请输入" disabled class="input_box" size="medium"
                  v-model="permissionForm.organizationName"></el-input>
      </div>
      <div class="input-inline">
        <span>职务名称：</span>
        <el-input placeholder="请输入" disabled class="input_box" size="medium"
                  v-model="permissionForm.postName"></el-input>
      </div>
      <el-tree
        :data="menuTreeList"
        show-checkbox
        default-expand-all
        node-key="permissionId"
        ref="tree1"
        highlight-current
        @node-click="handleCheckChange"
        :props="defaultProps">
      </el-tree>
      <div style="margin-top: 20px" align="center">
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="handleClear()">取消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
    import {Auth} from '../../../store/modules/auth'
    import {Msg} from "../../../tools/message";
    import {authorityManage} from './authorityManageJS'
    import treeTransfer from 'el-tree-transfer' // 引入

    export default {
        name: "authorityManage",

        data() {
            return {
                userInfo: Auth.getUser(),

                currentUserInfor: {},

                information: [],

                createdVisible: false,
                updateVisible: false,
                checkVisible: false,

                addForm: {
                    postId: ''
                }, //创建的表单
                updateForm: {},   //修改表单
                viewForm: {},

                searchPostName: '', //查询职务名称
                searchOrganizationName: '',  //查询组织名称

                organizationId: '',   //删除时的组织id
                postId: '',          //删除时的职务id

                // 页码
                currentPage: 1,//当前页
                totalEssay: 0,//总共的文章数量
                pageSize: 5,

                ruleForm: {
                    organizationId: "",
                    postId: "",
                },
                rules: {       //验证
                    organizationId: [
                        {required: true, message: "请输入职务名称", trigger: ['blur', 'change']},],
                    postId: [
                        {required: true, message: "请选择", trigger: ['change']},],
                },

                rightData: [],     // 传递权限信息
                hasRights: [], // 已有权限
                rightProps: {
                    children: 'children',
                    label: 'rightName'
                },
                organizationName: '',
                organizationList: [],
                postList: [],
                menuTreeList: [],
                defaultProps: {
                    children: 'children',
                    label: 'permissionName'
                },
                roleId: null,
                updateVisible1: false,
                permissionForm: {
                    organizationId: '',
                    organizationName: '',
                    postId: '',
                    postName: '',
                    permissionIds: ''
                }
            }
        },

        watch: {
            searchOrganizationName: function () {
                var startlen = this.searchOrganizationName.length;
                this.searchOrganizationName = this.searchOrganizationName.replace(/[^\u4E00-\u9FA5]/g, ''); // 清除除了中文以外的输入的字符
                var endlen = this.searchOrganizationName.length;
                if (startlen != endlen) {
                    Msg.warn("组织名称只能输入中文!");
                }
            },
            searchPostName: function () {
                var startlen = this.searchPostName.length;
                this.searchPostName = this.searchPostName.replace(/[^\u4E00-\u9FA5]/g, ''); // 清除除了中文以外的输入的字符
                var endlen = this.searchPostName.length;
                if (startlen != endlen) {
                    Msg.warn("职务名称只能输入中文!");
                }
            },
            'addForm.organizationId': function () {
                this.addForm.postId = '';  //清空职务
                this.ruleForm.postId = '';  //清空职务信息验证

                for (var i = 0; i < this.organizationList.length; i++) {
                    if (this.organizationList[i].organizationId === this.addForm.organizationId) {
                        this.postList = this.organizationList[i].posts;
                        return;
                    }
                }
            }
        },
        methods: {

            /*创建*/
            Establish() {
                // this.getAllRightList();
                setTimeout(() => {
                    this.getOrganizationAndPost();
                }, 100);

                this.createdVisible = true;
                // this.getAuthority();  // 获取左侧的权限
            },

            /*处理职务显示*/
            formateRight(row, column, cellvalue) {
                var rightColumns;
                if (!cellvalue) {
                    rightColumns = "————";
                } else {
                    rightColumns = cellvalue;
                }
                return rightColumns;
            },
            /*分配权限                还没弄完
            **/
            updateAuthority(row) {
                this.updateVisible = true;
                this.getRightList(row.postId, row.organizationId);
                this.updateForm = row;
                this.updateForm.postId = row.postId;
                this.updateForm.organizationId = row.organizationId;

            },

            /*清除创建框*/
            createClose() {
                this.createdVisible = false;
                this.$refs.ruleForm.clearValidate();
                this.$refs.ruleForm.resetFields();

                this.addForm = {postId: ''};
                this.toData = [];
            },

            /*清除修改框*/
            updateClose() {
                this.updateVisible = false;
                this.updateForm = {};
                // this.fromData = [];
                this.toData = [];
            },
            /*清除弹出框*/
            clean() {
                this.updateVisible = false;
            }
            ,
            /*清除查看框*/
            cleanCheck() {
                this.checkVisible = false;
                this.viewForm = {};
            },
            getRightCheckedNodes() {
                var rights = this.$refs.rightTree.getCheckedKeys().join(',');// 获取当前的选中的数据[数组] -id, 把数组转换成字符串
                return rights;
            },
            /*修改保存*/
            saveUpdate() {
                authorityManage.allocateRoleRight({
                    organizationId: this.updateForm.organizationId, postId: this.updateForm.postId,
                    rightInfo: this.getRightCheckedNodes()
                })
                    .then(
                        res => {
                            Msg.success("分配成功");
                            this.getAllInfor();
                            this.updateClose();
                        }
                    )
                    .catch(err => {
                        console.log(err);
                    });
            },

            /*创建保存*/
            saveCreate() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        console.log("ddd", this.toData);
                        authorityManage.createRightInfo({
                            organizationId: this.addForm.organizationId, postId: this.addForm.postId,
                            partyId: this.userInfo.partyId, createTime: ''
                        })
                            .then(
                                res => {
                                    if (res.data.code === 400)
                                        Msg.error("创建失败,角色已经存在,请分配权限!");
                                    else
                                        Msg.success("创建成功");
                                    this.getAllInfor();
                                    this.createClose();
                                }
                            )
                            .catch(err => {
                                this.createClose();
                                console.log(err);
                            });
                    } else {
                        Msg.error('请填写正确的资料信息后再提交！');
                    }
                });


            },

            //条数处理
            handleSizeChange(val) {
                this.pageSize = val;
                this.getAllInfor();
            }
            ,
            // 页码处理
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getAllInfor();
            }
            ,

            //删除权限
            deleteById(row) {
                this.$confirm('是否确认删除该角色?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.organizationId = row.organizationId;
                    this.postId = row.postId;

                    authorityManage.deleteRightRoleAndResource({
                        organizationId: this.organizationId,
                        postId: this.postId
                    }).then(
                        res => {
                            Msg.success("删除成功");
                            this.getAllInfor();
                            this.organizationId = '';
                            this.postId = '';
                        })
                        .catch(err => {
                            Msg.error("删除失败");
                            console.log(err);
                        })
                })
            },


            //获取表格中的职务信息
            getAllInfor() {
                authorityManage.findRightBaseInfo({
                    postName: this.searchPostName,
                    postId: this.userInfo.postId,
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    organizationName: this.searchOrganizationName,
                    organizationId: this.userInfo.organizationId,
                    organizationRank: this.userInfo.organizationRank
                })
                    .then(
                        res => {
                            if (res.data.code === 200) {
                                this.information = res.data.data.list;
                                this.totalEssay = res.data.data.total;
                            } else if (res.data.code === 403) {
                                Msg.error('权限不足');
                            } else {
                                this.information = [];
                                this.totalEssay = 0;
                            }
                        }
                    )
                    .catch(err => {
                        Msg.error("网络繁忙");
                    });
            }
            ,
            getRightList(postId, organizationId) {
                authorityManage.findRightList({postId: postId, organizationId: organizationId}).then(
                    res => {
                        this.rightData = res.data.data.rightsList;
                        this.hasRights = res.data.data.hasRights;
                    }
                )
                    .catch(err => {
                        // alert("查询失败");
                        console.log(err);
                    });
            },
            getOrganizationAndPost() {
                authorityManage.organizationAndPost({
                    organizationName: '',
                    postName: '',
                    organizationRank: this.userInfo.organizationRank
                }).then(
                    res => {
                        this.organizationList = res.data.data;
                    })
                    .catch(err => {
                        // alert("查询失败");
                        console.log(err);
                    });
            },


            updateClose1() {
                this.updateVisible1 = false;
            },
            treeList() {
                authorityManage.getAllPermissions().then(response => {
                    this.menuTreeList = response.data.data;
                    console.log(response.data.data);
                });
            },
            getRoleMenu() {

                authorityManage.getRolePermission({
                    postId: this.permissionForm.postId,
                    organizationId: this.permissionForm.organizationId
                }).then(response => {
                    let menuList = response.data.data;

                    let checkedMenuIds = [];
                    if (menuList != null && menuList.length > 0) {
                        for (let i = 0; i < menuList.length; i++) {
                            let menu = menuList[i];


                            if (menu.children != null && menu.children.length > 0) {
                                let menu1 = menu.children;
                                for (let j = 0; j < menu1.length; j++) {
                                    if (menu1[j].children != null && menu1[j].children.length > 0) {
                                        for (let k = 0; k < menu1[j].children.length; k++) {
                                            checkedMenuIds.push(menu1[j].children[k].permissionId);
                                        }
                                    } else {
                                        checkedMenuIds.push(menu1[j].permissionId);

                                    }
                                }
                            } else {
                                checkedMenuIds.push(menu.permissionId);
                            }
                        }
                    }

                    this.$refs.tree1.setCheckedKeys(checkedMenuIds);
                });
            },
            handleCheckChange(data, checked) {

            },
            handleSave() {
                this.permissionForm.permissionIds = this.getCheckedNodes();
                this.$confirm('是否分配菜单？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        postId: this.permissionForm.postId,
                        organizationId: this.permissionForm.organizationId,
                        permissionIds: this.permissionForm.permissionIds
                    }

                    authorityManage.changePermission(params).then(response => {
                        if (response.data.data) {
                            this.$message({
                                message: '分配成功',
                                type: 'success',
                                duration: 1000
                            });
                        } else {
                            this.$message({
                                message: '分配失败',
                                type: 'error',
                                duration: 1000
                            });
                        }
                    });
                    this.updateVisible1 = false;
                })
            },
            handleClear() {
                this.updateVisible1 = false;
                this.$refs.tree1.setCheckedKeys([]);
            },
            updatePermission(row) {
                this.permissionForm.organizationId = row.organizationId;
                this.permissionForm.organizationName = row.getOrganizationName;
                this.permissionForm.postId = row.postId;
                this.permissionForm.postName = row.postName;
                if (this.menuTreeList.length === 0) {
                    this.treeList();
                }
                this.getRoleMenu();
                this.updateVisible1 = true;

            },
            getCheckedNodes() {
                var rad = ''
                var ridsa = this.$refs.tree1.getCheckedKeys().join(',')// 获取当前的选中的数据[数组] -id, 把数组转换成字符串
                var ridsb = this.$refs.tree1.getCheckedNodes()// 获取当前的选中的数据{对象}
                ridsb.forEach(ids => {//获取选中的所有的父级id
                    if (ids.permissionUpId) {
                        rad += ',' + ids.permissionUpId
                    }
                })
                rad = rad.substr(1) // 删除字符串前面的','
                var rids = rad + ',' + ridsa
                var arr = rids.split(',')//  把字符串转换成数组
                arr = [...new Set(arr)]; // 数组去重
                rids = arr.join(',')// 把数组转换成字符串
                return rids;
            },
        }
        ,
        created() {
            this.getAllInfor();
            this.treeList();

        }
        ,
        mounted() {

        }
        ,
        components: {
            treeTransfer
        } // 注册
    }


</script>

<style lang="less" scoped>
  /*各种头部的距离*/
  .nav-form-top, .form-table-top {
    margin-top: 2%;
  }

  .input-content, .function-part, .button-flex {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-right: 2%;
  }

  /*//输入框*/
  .input_box {
    width: 210px;
    height: 40px;

  }

  .read {
    display: flex;
  }

  .text_button {
    font-size: 13px;
    color: red;
    background: none;
    /*margin-left: 4px;*/
  }

  .el-button--danger {
    background-color: red;

  }

  /*页码*/
  .pages {
    display: flex;
    justify-content: center;
    margin-top: 2%;
  }

  .input-inline {
    display: inline-block;
    margin-right: 5px;
    margin-bottom: 10px;
  }
</style>
