<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
     <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" size="small" @click="newone">新增商品</el-button>
      </el-form-item>

    </el-form>

    <el-table :data="list" border stripe size="small" style="width:1500px">
      <el-table-column prop="id" label="编号" min-width="70" align="center">
      </el-table-column>

      <el-table-column prop="name" label="名称" min-width="100" align="center">
      </el-table-column>

      <el-table-column prop="base_pic" label="底图" min-width="100" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.base_pic" style="max-width:80px;max-height:80px;" />
        </template>
      </el-table-column>

      <el-table-column prop="mask_pic" label="遮罩图" min-width="100" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.mask_pic" style="max-width:80px;max-height:80px;" />
        </template>
      </el-table-column>

      <el-table-column prop="price" label="价格" min-width="80" align="center">
      </el-table-column>

      <el-table-column prop="group_price" label="团购价" min-width="80" align="center">
      </el-table-column>

      <el-table-column label="操作" min-width="150" align="center">
       <template slot-scope="scope">
        <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

        <el-button type="success" size="small" v-if="scope.row.recommend=='0'" @click="setDefault(scope.$index, scope.row)">设置默认</el-button>

        <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>

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
  import { goodGet } from '../../api/api';
  import { goodDel } from '../../api/api';
  import { goodDefault } from '../../api/api';

  
  export default {
    data() {
      return {

        list:[],

        loading: false,
        count:0,
        currentPage: 1,
        limit:10,

        dialogDelVisible:false,
        dialogSeeVisible:false,



        editId:'',
        delId:'',

      };
    },

    methods:{
      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit;
        goodGet(allParams).then((res) => {
          this.list=res.data.data;
          this.count=res.data.count
        });
      },

      newone(){
        this.$router.push({ path: '/Model/Modelnew' });
        window.sessionStorage.removeItem('goodeditid')
      },

      setDefault(index,row){
        var allParams={
          id:row.id
        }
        goodDefault(allParams).then((res) => {
          console.log(res)
          if (res.msg === "ok") {
           this.$message({
            message: '设置成功',
            type: 'success'
          });
           this.getlist();

         } else {
           this.$message({
            message: res.msg,
            type: 'error'
          });
         }
       });
      },


      handleEdit(index, row){
        sessionStorage.setItem('goodeditid',row.id);
        this.$router.push({ path: '/Model/Modelnew' });
      },

      handleDelete(index, row) {
        this.dialogDelVisible = true;
        this.delId = row.id;
      },

      submitdel(){
        this.dialogDelVisible = false;
        var allParams='?id='+this.delId
        goodDel(allParams).then((res) => {
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
</style>