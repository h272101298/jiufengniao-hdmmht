<template>
 <el-row class="warp" style="padding:20px 0 0 20px;">
  <el-col :span="24" class="warp-breadcrum">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>设计师等级</el-breadcrumb-item>
    </el-breadcrumb>
  </el-col>


  <el-col :span="24" class="warp-main">

   <el-form :inline="true">
    <el-form-item>
      <el-button type="primary" size="mini" @click="newone">新增等级</el-button>
    </el-form-item>
  </el-form>

  <el-table :data="list" border stripe style="width:1121px" size="mini">
    <el-table-column prop="id" label="编号" min-width="120" align="center">
    </el-table-column>
    <el-table-column prop="title" label="标题" min-width="250" align="center">
    </el-table-column>
    <el-table-column prop="need" label="积分" min-width="250" align="center">
    </el-table-column>
    <el-table-column label="操作" min-width="250" align="center">
     <template slot-scope="scope">
      <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
      <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
    </template>
  </el-table-column>

</el-table>

<el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
</el-pagination>
</el-col>


<el-col>
  <el-dialog :title="diatitle" :visible.sync="dialogNewVisible" width="500" center style="min-width: 500px">
    <el-form ref="newlevel" :model="newlevel" label-width="120px" :rules="rules" status-icon>

      <el-form-item label="标题:" prop="title">
        <el-input v-model="newlevel.title" style="max-width: 300px;" placeholder="请输入标题"></el-input>
      </el-form-item>

      <el-form-item label="数量:" prop="need">
        <el-input v-model="newlevel.need" type="number" style="max-width: 300px;" placeholder="请输入数量"></el-input>
      </el-form-item>

      <el-form-item style="margin-left: calc(50% - 200px);">
        <el-button type="primary" @click="save()">提 交</el-button>
        <el-button @click="dialogNewVisible = false">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</el-col>


<el-col>
  <el-dialog title="删除不可恢复，是否确定删除？" :visible.sync="dialogDelVisible" width="30%">
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitdel()">确 定</el-button>
      <el-button @click="dialogDelVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</el-col>


</el-row>
</template>

<style>
  .fw4{
    font-weight: 400;
  }
  .fw6{
    font-weight: 600;
  }
</style>

<script>


  import {levelsGet} from '../../api/api';
  import {levelGet} from '../../api/api';
  import {levelPost} from '../../api/api';
  import {levelDel} from '../../api/api';



  export default {
    data() {
      return {


        checkper1:false,
        checkper2:false,


        currentPage: 1,
        list:[],
        count:0,
        limit:10,
        dialogNewVisible:false,
        dialogDelVisible:false,
        editId:'',
        delId:'',
        diatitle:'新增等级',
        newlevel:{
          title:'',
          need:''
        },
        rules: {
          title: [{required: true, trigger: 'blur',message: '请输入标题'}],
          need: [{required: true, trigger: 'blur',message: '请输入数量'}]
        },
        currow:'',

      };
    },


    methods:{


      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit;
        levelsGet(allParams).then((res) => {
          this.list=res.data.data;
          this.count=res.data.count
        });
      },



      newone(){
       this.putorup='up';
       this.diatitle='新增等级',
       this.dialogNewVisible=true,
       this.newlevel={
         title:'',
         need:''
       }
     },


     handleEdit(index, row){
      this.diatitle='编辑等级';
      this.dialogNewVisible = true;
      this.putorup='put';
      this.editId = row.id;
      this.newlevel={
        title:row.title,
        need:row.need
      }
    },

    save(){

      this.$refs.newlevel.validate((valid) => {
        if (valid) {
          if( this.putorup=='put'){
            var allParams = {
              title:this.newlevel.title,
              id:this.editId,
              need:this.newlevel.need,
            };
          }else{
            var allParams = {
              title:this.newlevel.title,
              need:this.newlevel.need,
            };
          }
          levelPost(allParams).then((res) => {
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

    handleDelete(index, row) {
      this.dialogDelVisible = true;
      this.delId = row.id;
    },

    submitdel(){
      this.dialogDelVisible = false;
      var allParams='?id='+this.delId
      levelDel(allParams).then((res) => {
        // console.log(res)
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
