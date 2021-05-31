<template>
  <div>
  <el-table :data="data"   style="width: 100%; min-height: 290px "
            :row-style="showTr" size="mini"
            :header-cell-style="{background:'rgb(250,250,250)',color:'#262626'}"
  >
    <el-table-column v-for="(column,index) in columns" :key="column.dataIndex" :label="column.text" show-overflow-tooltip >
      <template slot-scope="scope">
        <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
        <i v-if="!scope.row._expanded && toggleIconShow(index,scope.row)" class="el-icon-caret-right" aria-hidden="true" @click="toggle(scope.$index)"></i>
        <i v-if="scope.row._expanded && toggleIconShow(index,scope.row)" class="el-icon-caret-bottom" aria-hidden="true" @click="toggle(scope.$index)"></i>
        <span>
                    {{scope.row[column.dataIndex]}}
                </span>
      </template>
    </el-table-column>
    <el-table-column label="操作" :width="200" align="center">
      <template slot-scope="scope">
        <el-button type="text" class="table_button" @click="openUpdate(scope.row)">修改</el-button>
        &nbsp;&nbsp;
        <el-button  type="text" class="table_button" @click="deleteOrganization(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

    <el-dialog title="修改组织" :visible.sync="dialogFormVisibles">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="组织名称" :label-width="formLabelWidth" prop="organizationName">
          <el-input v-model="form.organizationName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="说明" :label-width="formLabelWidth" prop="remark">
          <el-input v-model="form.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibles = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdate('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import tool from './tool';
  import {organizationS} from "./treeGridJs";
  import {organizationStructure} from "../organizationStructure";
    export default {
      name: "TreeGrid",
      props: {
        // 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
        treeStructure: {
          type: Boolean,
          default: function () {
            return false
          }
        },
        // height: {
        //   type: Number,
        //   default: function () {
        //     return 290
        //   }
        // },
        more: {
          type: Boolean,
          default: function () {
            return false
          }
        },
        // 这是相应的字段展示
        columns: {
          type: Array,
          default: function () {
            return []
          }
        },
        // 这是数据源
        dataSource: {
          type: Array,
          default: function () {
            return []
          }
        },
        // 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
        requestUrl: {
          type: String,
          default: function () {
            return ''
          }
        },
        // 这个是是否展示操作列
        treeType: {
          type: String,
          default: function () {
            return 'normal'
          }
        },
        // 是否默认展开所有树
        defaultExpandAll: {
          type: Boolean,
          default: function () {
            return true
          }
        },


      },
      data() {
        return {
          dialogFormVisibles:false,
          formLabelWidth: '120px',
          form:{
            id:'',
            organizationName:'',
            remark:''
          },
          tempForm:{},
          rules: {
            organizationName: [
              { required: true, message: '请输入组织名称', trigger: 'change' },
            ],
            remark: [
              { required: true, message: '请选择说明', trigger: 'change' }
            ],
          }
        }
      },
      computed: {
        // 格式化数据源
        data: function () {
          let me = this;
          if (me.treeStructure) {
            let data = tool.treeToArray(me.dataSource, null, null, me.defaultExpandAll)
            return data
          }
          return me.dataSource
        }
      },
      methods: {
        openUpdate(row){
          if (this.$refs['form']!==undefined)
            this.$refs['form'].resetFields();
          this.form.organizationId = row.id;
          this.form.organizationName = row.organizationName;
          this.form.remark = row.remark;
          this.dialogFormVisibles = true;
        },
        submitUpdate(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$confirm('此操作将确认修改该组织相关信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                organizationS.updateInfo(this.form)
                  .then(res=>{
                    if(res.data.code === 200){
                      this.$message({
                        message:res.data.message,
                        type:'success'
                      });
                    }else{
                      this.$message.error(res.data.message);
                    }

                    this.dialogFormVisibles = false;
                    this.$parent.getOrganizationStructureList()
                  })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消修改'
                });
              });

            } else {
              return false;
            }
          });
        },
        deleteOrganization(row){
          // console.log(row.children[0]);
            this.$confirm('此操作将永久删除该组织, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if(row.amount === 0){
                organizationS.deleteInfo({organizationId:row.id}).then(res=>{
                  if(res.data.code === 200) {
                    this.$message({
                      message: res.data.message,
                      type: 'success'
                    });
                  }else{
                    this.$message.error(res.data.message);
                  }
                  this.$parent.getOrganizationStructureList();
                })
              }else{
                this.$message({
                  message: '该级组织人数不为0，无法删除哦！',
                  type: 'warning'
                });
              }

            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });


          // else{
          //   if (row.children[0]===undefined)
          //   this.$message({
          //     message: '删除失败，当前组织人数不为0',
          //     type: 'error'
          //   });
          //   else{
          //     this.$message({
          //       message: '删除失败，您还有下级组织未删除',
          //       type: 'error'
          //     });
          //
          //   }
          // }
        },
        // 显示行
        showTr(row, index) {
          let show = (row.row._parent ? (row.row._parent._expanded && row.row._parent._show) : true)
          row.row._show = show
          return show ? '' : 'display:none;'
        },
        // 展开下级
        toggle(trIndex) {
          let me = this
          let record = me.data[trIndex]
          record._expanded = !record._expanded
        },
        // 显示层级关系的空格和图标
        spaceIconShow(index) {
          let me = this
          if (me.treeStructure && index === 0) {
            return true
          }
          return false
        },
        // 点击展开和关闭的时候，图标的切换
        toggleIconShow(index, record) {
          let me = this
          if (me.treeStructure && index === 0 && record.children && record.children.length > 0) {
            return true
          }
          return false
        },
      }

    }
</script>

<style scoped>
  .ms-tree-space {
    position:relative;
    top:1px;
    display:inline-block;
    font-family:"Glyphicons Halflings";
    font-style:normal;
    font-weight:400;
    line-height:1;
    width:18px;
    height:14px;

  }
  .ms-tree-space::before {
    content:"";
  }
  table td {
    line-height:26px;
  }
  .table_button {
    font-size: 13px;
    color: #F56C6C;
    background: none;
    display: inline-block;
    /*margin-left: 4px;*/
  }

</style>
