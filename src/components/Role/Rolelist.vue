<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
     <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" size="medium" @click="newone" v-show="checkper1">新增角色</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading="loading" border stripe size="small" style="width:75%;">
      <el-table-column prop="id" label="编号" width="130" align="center">
      </el-table-column>
      <el-table-column prop="name" label="角色名称" min-width="200" align="center">
      </el-table-column>

      <el-table-column prop="name" label="默认角色" min-width="200" align="center">
       <template slot-scope="scope">
        <el-button type="primary" size="small" @click="setrole(scope.$index, scope.row)" v-if="scope.row.default==1">是</el-button>
        <el-button type="info" size="small" @click="setrole(scope.$index, scope.row)" v-if="scope.row.default==0">否</el-button>
      </template>
    </el-table-column>

    <el-table-column label="操作" min-width="200" align="center">
     <template slot-scope="scope">
      <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)" v-show="checkper1">编 辑</el-button>
      <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)" v-show="checkper2">删 除</el-button>
    </template>
  </el-table-column>
</el-table>

<el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
</el-pagination>
</el-col>



<el-col>
  <el-dialog title="删除不可恢复，是否确定删除？" :visible.sync="dialogDelVisible" width="30%">
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" @click="submitdel()">确 定</el-button>
      <el-button @click="dialogDelVisible  = false" type="primary">取 消</el-button>
    </div>
  </el-dialog>
</el-col>


</el-row>
</template>

<script>

  import { permissionGet } from '../../api/api';
  import { roleGet } from '../../api/api';
  import { rolePost } from '../../api/api';
  import { roleDel } from '../../api/api';
  import { defaultrole } from '../../api/api';

  export default {
    data() {
      return {
        currentPage: 1,
        list:[],
        loading: false,
        count:0,
        limit:10,
        diatitle:'新增角色',
        dialogDelVisible:false,

        checkper1:false,
        checkper2:false,
      };
    },

    methods:{


      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit;
        roleGet(allParams).then((res) => {
          this.list=res.data.data;
        });
      },

      setrole(index,row){
        var allParams = '?role_id='+ row.id;
        defaultrole(allParams).then((res) => {
          this.getlist()
        });
      },

      newone(){
        this.$router.push({ path: '/Role/Roleedit' });
      },

      save(){
        this.$refs.newrole.validate((valid) => {
          if (valid) {
            console.log(this.newrole)

            if( this.putorup=='put'){
              var allParams = {
                id:this.editId,
                name:this.newrole.name,
                display_name:this.newrole.name,
                permissions:this.newrole.permissions
              }
            }else{
              var allParams = {
                name:this.newrole.name,
                display_name:this.newrole.name,
                permissions:this.newrole.permissions
              }
            }

            rolePost(allParams).then((res) => {
              if (res.msg === "ok") {
               this.$message({
                message: '提交成功',
                type: 'success'
              });
               this.getlist();
               this.dialogNewVisible=false 
             } else {
               this.$message({
                message: res.msg,
                type: 'error'
              });
             }
           });
          }else{
            return false;
          }
        })
      },
      
      checkPer(){
        var per = sessionStorage.getItem('permissions');

        if(per.indexOf('roleAdd')>-1){
          this.checkper1=true;
        }

        var per = sessionStorage.getItem('permissions');

        if(per.indexOf('roleDel')>-1){
          this.checkper2=true;
        }
      },



      handleEdit(index, row){

        this.editId = row.id;
        sessionStorage.setItem('roleeditname', row.name);
        sessionStorage.setItem('roleeditId', row.id);

        this.$router.push({ path: '/Role/Roleedit' });
      },

      handleDelete(index, row) {
        // console.log(index, row);
        this.dialogDelVisible = true;
        this.delId = row.id;
      },

      submitdel(){
        this.dialogDelVisible = false;
        var allParams='?id='+this.delId
        roleDel(allParams).then((res) => {

          if (res.msg === "ok") {
           this.$message({
            message: '删除成功',
            type: 'success'
          });
           this.getlist();
           this.dialogDelVisible = false;
         } else {
           this.$message({
            message: res.msg,
            type: 'error'
          });
         }
       });
      },




      handleCurrentChange(val) {
        this.currentPage = val;
        this.getlist();
      },

      handleSizeChange(val){
        this.limit = val;
        this.getlist();
      },
    },

    mounted: function () {
      this.getlist();
      this.checkPer();
    }
  }
</script>


<style>

</style>
