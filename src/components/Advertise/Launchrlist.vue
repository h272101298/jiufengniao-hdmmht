<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>轮播图管理</el-breadcrumb-item>
        <el-breadcrumb-item>登录页轮播</el-breadcrumb-item>
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

  import {launcherGet} from '../../api/api';
  import {launcherPost} from '../../api/api';
  import {launcherDel} from '../../api/api';

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
      launcherGet(allParams).then((res) => {
        this.list=res.data;
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
    }else{
      if( this.putorup=='put'){
        var allParams = {
          url:this.imgSrc,
          id:this.editId,
        };
      }else{
        var allParams = {
          url:this.imgSrc,
        };
      }
      launcherPost(allParams).then((res) => {
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
    launcherDel(allParams).then((res) => {
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

  // this.checkPer();
}
}
</script>


<style scoped>


/*.el-form-item {
  margin-bottom: 0px!important;
  }*/
</style>
