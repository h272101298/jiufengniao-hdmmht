<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>积分商城</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
     <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" size="mini" @click="newone">新增商品</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" border stripe size="small" style="width:95%;">
      <el-table-column prop="id" label="编号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="cover" label="图片" min-width="100" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.cover" style="max-width:80px;max-height:64px;" />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="名称" min-width="200" align="center">
      </el-table-column>

      <el-table-column prop="detail" label="商品描述" min-width="200" align="center">
      </el-table-column>

<!--       <el-table-column prop="share_title" label="分享标题" min-width="200" align="center">
      </el-table-column> -->

      <el-table-column prop="score" label="兑换积分" min-width="200" align="center">
      </el-table-column>

      <el-table-column prop="created_at" label="创建时间" width="150" align="center">
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
       <template slot-scope="scope">
        <el-tooltip class="icon" effect="dark" content="编辑" placement="top">
          <img src="../../../static/images/icon/edit.png" @click="handleEdit(scope.$index, scope.row)">
        </el-tooltip>
        <el-tooltip class="icon" effect="dark" content="删除" placement="bottom">
          <img src="../../../static/images/icon/delete.png" @click="handleDelete(scope.$index, scope.row)">
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
  </el-pagination>
</el-col>


<el-col>
  <el-dialog title="确认删除该商品么？" :visible.sync="dialogDelVisible" width="30%">
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" @click="submitdel()">确 定</el-button>
      <el-button type="primary" @click="dialogDelVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</el-col>


</el-row>
</template>

<script>
  import { igoodGet } from '../../api/api';
  import { igoodDel } from '../../api/api';

  export default {
    data() {
      return {
        list:[],
        currentPage: 1,
        count:0,
        limit:10,
        dialogDelVisible:false,
        editId:'',
        delId:'',
      }

    },

    methods:{
     getlist(){
      var allParams = '?page='+ this.currentPage + '&limit=' + this.limit;
      igoodGet(allParams).then((res) => {
        this.list=res.data.data;
        this.count=res.data.count
      });
    },

    newone(){
      this.$router.push({ path: '/Integral/Igoodnew' });
      window.sessionStorage.removeItem('igoodeditid')
    },


    handleEdit(index, row){
      sessionStorage.setItem('igoodeditid',row.id);
      this.$router.push({ path: '/Integral/Igoodnew' });
    },

    handleDelete(index, row) {
      this.dialogDelVisible = true;
      this.delId = row.id;
    },

    submitdel(){
      this.dialogDelVisible = false;
      var allParams='?id='+this.delId
      igoodDel(allParams).then((res) => {
        console.log(res)
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
 }
}
</script>


<style scoped>
  .icon{
    width: 20px;
    height: 20px;
    margin: 2px;
  }
  .seeimg{
    max-width: 150px;
    max-height: 150px;
  }
</style>