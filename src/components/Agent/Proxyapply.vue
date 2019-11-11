<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>代理管理</el-breadcrumb-item>
        <el-breadcrumb-item>分销申请</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
<!--         <el-form :inline="true" :model="filters">
         <el-form-item>
          <el-input v-model="filters.name" placeholder="请输入：用户ID/姓名/电话号码" style="min-width: 240px;" size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" size="mini">搜索</el-button>
          <el-button @click="clearss"  size="mini">清空</el-button>
        </el-form-item>
      </el-form> -->
    </el-col>

    <!--列表-->
    <el-table :data="applyData" highlight-current-row style="width: 95%;" size="small" stripe border>
      <el-table-column prop="id" label="申请ID" width="100" align="center">
      </el-table-column>
      <el-table-column prop="user_id" label="用户ID" width="100" align="center">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="min-200" align="center">
      </el-table-column>

      <el-table-column prop="phone" label="电话号码" width="min-200" align="center">
      </el-table-column>

      <el-table-column prop="account" label="银行卡号" width="min-200" align="center">
      </el-table-column>

      <el-table-column prop="bank" label="开户银行" width="min-200" align="center">
      </el-table-column>

      <el-table-column prop="created_at" label="注册时间" width="min-200" align="center">
      </el-table-column>

      <el-table-column prop="id" label="操作" width="200" align="center" v-show="checkper1">
        <template slot-scope="scope">
          <el-tag size="mini" type="success" v-show="scope.row.state==2 ? true : false">审核通过</el-tag>
          <el-tag size="mini" type="danger" v-show="scope.row.state==3 ? true : false">已拒绝</el-tag>
          <el-button size="mini" v-show="scope.row.state==1 ? true : false" type="primary" @click="handleEdit(scope.$index, scope.row)">通过</el-button>
          <el-button size="mini" v-show="scope.row.state==1? true : false" type="danger" @click="handleDelete(scope.$index, scope.row)">拒绝</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination style="float:left;margin:20px 0 0 0px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
    </el-pagination>
  </el-col>

</el-col>

<!-- 不通过确认 -->
<el-col>
  <el-dialog title="此操作不可恢复，是否确定不通过？" :visible.sync="dialogDelVisible" width="30%">
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogDelVisible  = false">取 消</el-button>
      <el-button type="primary" @click="submitdel()">确 定</el-button>
    </div>
  </el-dialog>
</el-col>

</el-row>
</template>


<script>

  import { aapplyGet } from '../../api/api';
  import { aapplycheck } from '../../api/api';
  // import { aapplyReject } from '../../api/api';
  import { Message } from 'element-ui';

  export default {
    data() {
      return {

        applyData: [],
        currentid:'',
        currentPage: 1,
        count:0,
        limit:10,
        dialogDelVisible:false,
        filters: {
          name: ''
        },
        dialogSeeVisible: false,
        checkper1:false,
      }
    },
    methods: {

      checkPer(){
        var per = sessionStorage.getItem('permissions');

        if(per.indexOf('proxyApplyCheck')>-1){
          this.checkper1=true;
        }

      },



      //获取列表
      getlist: function () {
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit;
        aapplyGet(allParams).then((res) => {
          this.applyData=res.data.data;
          this.count=res.data.count;
        });
      },

      search:function(){
        if(this.filters.name==''){
          this.$message.error('请输入搜索条件');
          return;
        }else{
          this.getlist();
        }
      },

      clearss:function(){
        this.filters.name='';
        this.getlist();
      },

      //页码更改
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getlist();
      },

      //改变每页条数
      handleSizeChange(val){
        this.limit = val;
        this.getlist();
      },


      handleEdit(index, row) {
        // console.log(row.id)
        var allParams ={
          id:row.id,
          state:2
        };
        aapplycheck(allParams).then((res) => {
          console.log(res)
          Message({
            message: "审核成功",
            type: 'success'
          });
          this.getlist();
        });
      },

      handleDelete(index, row) {
        this.currentid= row.id
        this.dialogDelVisible = true;
      },

      submitdel(){
        var allParams ={
          id:this.currentid,
          state:3
        };
        aapplycheck(allParams).then((res) => {
          console.log(res)
          Message({
            message: "审核成功",
            type: 'success'
          });
          this.dialogDelVisible = false;
          this.getlist();
        });
      },

    },

    mounted() {
      this.getlist();
      // this.checkPer();
    }
  }
</script>

<style scoped>

</style>
