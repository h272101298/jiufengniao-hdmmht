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
        <el-button type="primary" size="small" @click="newone" v-show="checkper1">新增分类</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="filter.title" size="small" placeholder="请输入分类名称" style="min-width: 260px;" ></el-input>
      </el-form-item>

      <el-form-item label="分类级别：">
        <el-select v-model="filter.level" placeholder="全部" @change="searchlevel" size="small">
          <el-option label="一级" value="1"></el-option>
          <el-option label="二级" value="2"></el-option>
          <el-option label="三级" value="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" @click="getlist">搜索</el-button>
        <el-button size="small" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" border stripe style="width:95%" size="small">
      <el-table-column prop="id" label="编号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="logo" label="分类logo" width="300" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.logo" style="max-width:50px;max-height:50px;" v-show="scope.row.level==3" />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="名称" width="300" align="center">
      </el-table-column>
      <el-table-column prop="level" label="级别" min-width="200" align="center">
      </el-table-column>

      <el-table-column prop="parent.title" label="上级分类" min-width="200" align="center">
      </el-table-column>

      <el-table-column label="操作" width="400" align="center">
       <template slot-scope="scope">
        <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)" v-show="checkper1">编辑</el-button>

        <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)" v-show="checkper2">删除</el-button>
      </template>
    </el-table-column>

  </el-table>

  <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
  </el-pagination>



</el-col>

<el-col>
  <el-dialog :title="diatitle" :visible.sync="dialogNewVisible" width="500" center style="min-width: 500px">
    <el-form ref="newadv" :model="newadv" label-width="120px">



      <el-form-item label="分类名称：">
        <el-input v-model="newadv.title" style="max-width: 300px;" placeholder="请输入分类名称"></el-input>
      </el-form-item>

      <el-form-item label="分类等级：" prop="level">
        <el-select v-model="newadv.level" placeholder="请选择分类等级" @change="changelv">
          <el-option label="一级分类" value="1" key="1"></el-option>
          <el-option label="二级分类" value="2" key="2"></el-option>
          <el-option label="三级分类" value="3" key="3"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="上级分类：" prop="uplevel" v-show="noone">
        <el-select v-model="newadv.uplevel" placeholder="请选择上级分类" @change="chooseup" filterable :loading="loading">
          <el-option v-for="item in levelarr" :label="item.title" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="分类logo：" v-show="nothree">
        <el-upload class="upload-demo" :action="upurl" :data="uptoken" :before-upload="beforeUpload" :on-success="handleSuccess" :show-file-list="false" accept="image/*">
          <img :src="imgSrc" class="pre-img" style="max-width:200px;max-height:200px;border:2px dashed #ccc;border-radius:0px;display: block" >
          <el-button size="small" type="primary" style="display: block;margin-top: 20px;">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">可上传JPG/PNG文件，且大小不超过1M，建议图片长宽比为5:4</div>
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
  import { typehot } from '../../api/api';

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
        currentPage: 1,
        list:[],
        count:0,
        limit:10,
        dialogNewVisible:false,
        dialogDelVisible:false,
        filter:{
          title:'',
          level:''
        },
        putorup:'up',
        imgSrc:"../static/images/default.png",
        newadv:{
         title:'',
         logo:'',
         parent:0
       },
       filter1:{
        level:''
      },
      levelarr:[],
      diatitle:'新增商品',
      noone:false,
      nothree:false,
      editId:'',
      delId:'',


      checkper1:false,
      checkper2:false,

    };
  },

  methods:{
    checkPer(){
      var per = sessionStorage.getItem('permissions');
      // console.log(per)
      if(per.indexOf('productTypeAdd')>-1){
        this.checkper1=true;
      }

      var per = sessionStorage.getItem('permissions');
      // console.log(per)
      if(per.indexOf('productTypeDel')>-1){
        this.checkper2=true;
      }
    },

    getlist(){
      var allParams = '?page='+ this.currentPage + '&limit=' + this.limit +'&title=' + this.filter.title+'&level=' + this.filter.level;
      typeGet(allParams).then((res) => {
        this.list=res.data.data;
        this.count=res.data.count
      });
    },

    getlist1(){
      var allParams = '?page=1&limit=10000&level=' + this.filter1.level;
      typeGet(allParams).then((res) => {
        this.levelarr=res.data.data;
      });
    },

    searchlevel(val){
      this.filter.level=val;
      this.getlist();
    },

    clear(){
      this.filter={
        title:'',
        level:''
      }
    },

    changehot(index){


     var allParams = '?type_id='+ index.id;
     typehot(allParams).then((res) => {
       // console.log(res)
       this.getlist();
     });
     

   },

   newone(){
     this.putorup='up';
     this.imgSrc="../static/images/default1.png";
     this.diatitle='新增分类',
     this.dialogNewVisible=true,
     this.filter1.level='',
     this.newadv={
       title:'',
       logo:'',
       parent:0
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
    this.newadv.logo =qiniu.showurl+ res.key;
    this.imgSrc =qiniu.showurl+ res.key;
  },

  changelv(val){
    // console.log(val)
    if(val==1){
      this.noone=false
      this.nothree=false
    }
    else if(val==2){
      this.noone=true
      this.nothree=false
      this.filter1.level=1
      this.getlist1()
    }
    else if(val==3){
      this.noone=true
      this.nothree=true
      this.filter1.level=2
      this.getlist1()
    }
  },

  chooseup(val){
    // console.log(val)
    this.newadv.parent=val
  },

  save(){

    if(this.newadv.logo=='' && this.nothree==true){
      this.$message({
        message: '请上传分类logo',
        type: 'error'
      });
    }else if(this.newadv.title==''){
      this.$message({
        message: '请输入分类名称',
        type: 'error'
      });
    }
    else{
      if( this.putorup=='put'){
        var allParams = {
          title:this.newadv.title,
          id:this.editId,
          logo:this.imgSrc,
          parent:this.newadv.parent,
        };
      }else{
        var allParams = {
          title:this.newadv.title,
          logo:this.imgSrc,
          parent:this.newadv.parent,
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
    this.imgSrc=row.logo;
    this.newadv.logo=row.logo;
    this.newadv.title=row.title
    this.filter1.level=''
  },

  handleDelete(index, row) {
    this.dialogDelVisible = true;
    this.delId = row.id;
  },

  submitdel(){
    this.dialogDelVisible = false;
    var allParams='?id='+this.delId
    typeDel(allParams).then((res) => {
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
