<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>轮播图管理</el-breadcrumb-item>
        <el-breadcrumb-item>首页轮播</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
     <el-row>

       <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" size="mini" @click="newone">新增轮播</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="list" border stripe size="small" style="width:1001px">
        <el-table-column prop="id" label="轮播编号" width="200" align="center">
        </el-table-column>
        <el-table-column prop="url" label="轮播图片" width="500" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.url" style="max-width:90px;max-height:90px;" />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="300" align="center">
         <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
    </el-pagination>



  </el-row>
</el-col>



<el-col>
  <el-dialog :title="diatitle" :visible.sync="dialogNewVisible" width="500" center style="min-width: 500px">
    <el-form ref="newadv" :model="newadv" label-width="120px">

      <el-form-item label="上传图片：">
        <el-upload class="upload-demo" list-type="picture-card" :action="upurl" :data="uptoken" :on-success="handleSuccess" :on-exceed="handleExceed" :file-list="postarr" :limit="1" :show-file-list="true" accept="image/*">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">可上传JPG/PNG文件，建议图片比例为16:9</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="商品分类：">
        <el-select v-model="type" placeholder="请选择分类">
          <el-option v-for="item in typeArr" :label="item.title" :value="item.id" :key="item.id"></el-option>
        </el-select>
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

  import {bannerGet} from '../../api/api';
  import {bannerPost} from '../../api/api';
  import {bannerDel} from '../../api/api';

  import { typeGet } from '../../api/api';

  import qiniu from '../../api/qiniu';


  export default {
    data() {
      return {
        // activeName:'otherpost',
        activeName:'banner',

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

        putorup:'up',
        imgSrc:"",
        product_id:"",
        newadv:{},
        diatitle:'新增轮播',
        postarr:[],
        editId:'',
        delId:'',

        type:'',
        typeArr:[],
        
        checkper1:false,
        checkper2:false,



      };
    },

    methods:{

     checkPer(){
      var per = sessionStorage.getItem('permissions');
      if(per.indexOf('advertAdd')>-1){
        this.checkper1=true;
      }
      if(per.indexOf('advertDel')>-1){
        this.checkper2=true;
      }
    },


    getlist(){
      var allParams = '?page='+ this.currentPage + '&limit=' + this.limit;
      bannerGet(allParams).then((res) => {
        this.list=res.data.data;
        this.count=res.data.count;
      });
    },

    newone(){
     this.putorup='up';
     this.postarr=[];
     this.diatitle='新增广告',
     this.dialogNewVisible=true
   },


   handleSuccess(res, file) {
    this.imgSrc =qiniu.showurl+ res.key
  },

  handleExceed(files, fileList) {
    this.$message.warning(`一次只能上传1张图片`);
  },

  save(){
    if(this.imgSrc==''){
      this.$message({
        message: '请选择图片',
        type: 'error'
      });
    }else if(this.type==''){
      this.$message({
        message: '请选择分类',
        type: 'error'
      });
    }
    else{
      if( this.putorup=='put'){
        var allParams = {
          url:this.imgSrc,
          id:this.editId,
          type:this.type
        };
      }else{
        var allParams = {
          url:this.imgSrc,
          type:this.type
        };
      }
      bannerPost(allParams).then((res) => {
        if (res.msg === "ok") {
         this.$message({
          message: '提交成功',
          type: 'success'
        });
         this.imgSrc=''
         this.getlist();
         this.dialogNewVisible=false
         this.goodData=[]
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
    this.diatitle='编辑广告';
    this.dialogNewVisible = true;
    this.putorup='put';
    this.editId = row.id;
    this.type = row.type;
    this.postarr=[]
    this.imgSrc=row.url
    this.postarr.push(Object.assign({},{"url":row.url}));
  },

  handleDelete(index, row) {
    this.dialogDelVisible = true;
    this.delId = row.id;
  },

  submitdel(){
    this.dialogDelVisible = false;
    var allParams='?id='+this.delId
    bannerDel(allParams).then((res) => {
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


  gettype(){
    var allParams = '?page=1&limit=99999';
    typeGet(allParams).then((res) => {
      this.typeArr=res.data.data;
    });
  },

},

mounted: function () {

  this.getlist();
  this.gettype();
  // this.checkPer();
}
}
</script>


<style scoped>


/*.el-form-item {
  margin-bottom: 0px!important;
  }*/
</style>
