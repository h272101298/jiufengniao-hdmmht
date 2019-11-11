<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品回收站</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
<!--      <el-form :inline="true">
      <el-form-item>
        <el-input v-model="filter.name" placeholder="请输入商品名称/商品分类/商家名称" style="min-width: 260px;" ></el-input>
      </el-form-item>

      <el-form-item label="商品状态：">
        <el-select v-model="filter.state" placeholder="全部" @change="changestate">
          <el-option label="上架" value="0"></el-option>
          <el-option label="下架" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="medium" @click="getlist">搜索</el-button>
        <el-button size="medium" @click="clear">清空</el-button>
      </el-form-item>
    </el-form> -->

    <el-table :data="list" v-loading="loading" border stripe size="small">
      <el-table-column prop="id" label="编号" min-width="70" align="center">
      </el-table-column>
      <el-table-column prop="cover" label="图片" min-width="200" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.cover" style="max-width:60px;max-height:60px;" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" min-width="200" align="center">
      </el-table-column>
      <el-table-column prop="brokerage" label="分佣" min-width="200" align="center">
      </el-table-column>
<!--       <el-table-column prop="name" label="价格" min-width="150" align="center">
</el-table-column> -->
<!--       <el-table-column prop="name" label="所属商家" min-width="200" align="center">
</el-table-column> -->

<!-- <el-table-column prop="state" label="上架状态" min-width="150" align="center">
  <template slot-scope="scope">
    <el-tag type="success" v-show="scope.row.state==1" @click="changejia(scope.row)">上架</el-tag>
    <el-tag type="info" v-show="scope.row.state==0" @click="changejia(scope.row)">下架</el-tag>
  </template>
</el-table-column>

<el-table-column prop="review" label="审核状态" min-width="150" align="center">
  <template slot-scope="scope">
    <el-tag type="success" v-show="scope.row.state==1">已审核</el-tag>
    <el-tag type="info" v-show="scope.row.state==0">未审核</el-tag>
  </template>
</el-table-column> -->


<!-- <el-table-column prop="express_price" label="邮费" min-width="150" align="center">
</el-table-column> -->
<el-table-column prop="created_at" label="创建时间" min-width="150" align="center">
</el-table-column>
<!--       <el-table-column prop="name" label="审核状态" min-width="150" align="center">
</el-table-column> -->
<el-table-column label="操作" min-width="200" align="center">
 <template slot-scope="scope">
  <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)" v-show="checkper2">重新上架</el-button>
  <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)" v-show="checkper2">永久删除</el-button>

</template>
</el-table-column>
</el-table>

<el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
</el-pagination>
</el-col>

<el-col>
  <el-dialog title="确认永久删除该商品么？" :visible.sync="dialogDelVisible" width="30%">
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
  import { goodRecycle } from '../../api/api';
  import { goodDel } from '../../api/api';

  export default {
    data() {
      return {

        list:[],

        loading: false,
        currentPage: 1,
        count:0,
        limit:10,

        dialogDelVisible:false,

        filter:{
          name:'',
          state:''
        },


        editId:'',
        delId:'',

        editable:[],


        checkper1:false,
        checkper2:false,
      };
    },

    methods:{
      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit+ '&deleted=2';
        goodGet(allParams).then((res) => {
          this.list=res.data.data;
          this.count=res.data.count
        });
      },

      handleEdit(index,row){
        var allParams='?id='+row.id
        goodRecycle(allParams).then((res) => {
          console.log(res)
          if (res.msg === "ok") {
           this.$message({
            message: '上架成功',
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

      checkPer(){
        var per = sessionStorage.getItem('permissions');

        // if(per.indexOf('productShelf')>-1){
        //   this.checkper1=true;
        // }

        if(per.indexOf('productDel')>-1){
          this.checkper2=true;
        }
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
      this.checkPer();
    }
  }
</script>


<style>
.icon{
  width: 20px;
  height: 20px;
  margin: 2px;
}
</style>