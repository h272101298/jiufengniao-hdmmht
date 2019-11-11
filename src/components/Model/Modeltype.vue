<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">


     <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" size="small" @click="newone">新增分类</el-button>
      </el-form-item>

    </el-form>

    <el-table :data="list" border stripe style="width:95%" size="small">
      <el-table-column prop="id" label="编号" width="100" align="center">
      </el-table-column>

      <el-table-column prop="title" label="名称" width="300" align="center">
      </el-table-column>
      <el-table-column prop="icon" label="图片" width="300" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.icon" style="max-width:100px;max-height:100px;" />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="400" align="center">
       <template slot-scope="scope">
        <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

        <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>

  </el-table>



</el-col>

<el-col>
  <el-dialog :title="diatitle" :visible.sync="dialogNewVisible" width="500" center style="min-width: 500px">
    <el-form ref="newadv" :model="newadv" label-width="120px">



      <el-form-item label="分类名称：">
        <el-input v-model="newadv.title" style="max-width: 300px;" placeholder="请输入分类名称"></el-input>
      </el-form-item>


      <el-form-item label="图片：">
        <el-upload class="upload-demo" :action="upurl" :data="uptoken" :before-upload="beforeUpload" :on-success="handleSuccess" :show-file-list="false" accept="image/*">
          <img :src="imgSrc" class="pre-img" style="max-width:200px;max-height:200px;border:2px dashed #ccc;border-radius:0px;display: block" >
          <el-button size="small" type="primary" style="display: block;margin-top: 20px;">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">可上传JPG/PNG文件，且大小不超过1M，建议图片长宽比为1:1</div>
        </el-upload>
      </el-form-item>

      <el-form-item style="margin-left: calc(50% - 200px);">
        <el-button type="primary" @click="save()">保 存</el-button>
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



<script>


  import { typeGet } from '../../api/api';
  import { typePost } from '../../api/api';
  import { typeDel } from '../../api/api';

  import qiniu from '../../api/qiniu';

  import { Message } from 'element-ui';

  export default {
    data() {
      return {

        loading:false,
        uptoken:{
          token:qiniu.token,
        },
        upurl:qiniu.upurl,

        list:[],

        dialogNewVisible:false,
        dialogDelVisible:false,

        putorup:'up',
        imgSrc:"../static/images/default.png",
        newadv:{
         title:'',
         icon:'',
       },

       diatitle:'新增分类',

       editId:'',
       delId:'',


     };
   },

   methods:{


    getlist(){
      var allParams = '?page=1&limit=100000';
      typeGet(allParams).then((res) => {
        this.list=res.data.data;
        this.count=res.data.count
      });
    },


    newone(){
     this.putorup='up';
     this.imgSrc="../static/images/default1.png";
     this.diatitle='新增分类'
     this.dialogNewVisible=true
     this.newadv={
       title:'',
       icon:''
     }
   },

   beforeUpload(file) {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      this.$message.error('图片大小不能超过 1MB!');
    }
    return isLt1M;
  },

  handleSuccess(res, file) {
    this.newadv.icon =qiniu.showurl+ res.key;
    this.imgSrc =qiniu.showurl+ res.key;
  },

  save(){
   if(this.newadv.title==''){
    this.$message({
      message: '请输入分类名称',
      type: 'error'
    });
  }else if(this.newadv.icon==''){
    this.$message({
      message: '请上传分类logo',
      type: 'error'
    });
  }
  else{
    if( this.putorup=='put'){
      var allParams = {
        title:this.newadv.title,
        id:this.editId,
        icon:this.imgSrc,
      };
    }else{
      var allParams = {
        title:this.newadv.title,
        icon:this.imgSrc,
      };
    }
    typePost(allParams).then((res) => {
      if (res.msg === "ok") {
       this.$message({
        message: '提交成功',
        type: 'success'
      });
       this.getlist();
       this.noone=true
       this.dialogNewVisible=false
     } else {
       this.$message({
        message: res.msg,
        type: 'error'
      });
     }
   });
  }
},

handleEdit(index, row){
  this.diatitle='编辑分类';
  this.dialogNewVisible = true;
  this.putorup='put';
  this.editId = row.id;
  this.imgSrc=row.icon;
  this.newadv.icon=row.icon;
  this.newadv.title=row.title
},

handleDelete(index, row) {
  this.dialogDelVisible = true;
  this.delId = row.id;
},

submitdel(){
  this.dialogDelVisible = false;
  var allParams='?id='+this.delId
  typeDel(allParams).then((res) => {
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


<style>
  .icon{
    width: 20px;
    height: 20px;
    margin: 2px;
  }
</style>
