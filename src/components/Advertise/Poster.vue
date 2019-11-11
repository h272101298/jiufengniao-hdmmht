<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>广告管理</el-breadcrumb-item>
        <el-breadcrumb-item>分销海报</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
     <el-row>

      <el-table :data="list" border stripe size="small" style="width:801px">

        <el-table-column prop="href" label="海报" width="500" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.href" style="max-width:120px;max-height:120px;" />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="300" align="center">
         <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <!-- <el-button type="danger" size="mini" @click="submitdel(scope.$index, scope.row)">删除</el-button> -->
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
        <el-button size="small" type="primary" @click="save()">保 存</el-button>
        <el-button size="small" @click="dialogNewVisible = false">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</el-col>


</el-row>
</template>



<script>

  import {posterGet} from '../../api/api';
  import {posterPost} from '../../api/api';
  import {posterDel} from '../../api/api';

  import qiniu from '../../api/qiniu';


  export default {
    data() {
      return {
        uptoken:{
          token:qiniu.token,
        },
        upurl:qiniu.upurl,

        list:[],
        
        dialogNewVisible:false,

        putorup:'up',
        imgSrc:"",

        newadv:{
          title:'',
          href:'',
          id:''
        },

        diatitle:'编辑海报',
        postarr:[],
        editId:'',
        delId:'',


      };
    },

    methods:{
      getlist(){
        var allParams = '';
        posterGet(allParams).then((res) => {
          console.log(res.data.data)
          this.list=res.data.data;
        });
      },

      handleEdit(index, row){
        this.diatitle='编辑海报';
        this.dialogNewVisible = true;
        this.putorup='put';
        this.editId = row.id;

        this.postarr=[]
        this.imgSrc=row.href
        this.postarr.push(Object.assign({},{"url":row.href}));
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
        }
        else{
          var allParams = {
            href:this.imgSrc,
            title:'agentposter',
            id:1
          };
          posterPost(allParams).then((res) => {
            if (res.msg === "ok") {
             this.$message({
              message: '提交成功',
              type: 'success'
            });
             this.imgSrc=''
             this.getlist();
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

      submitdel(){
        this.dialogDelVisible = false;
        var allParams='?id=2'
        posterDel(allParams).then((res) => {
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


    },

    mounted: function () {
      this.getlist();
    }
  }
</script>


<style scoped>


/*.el-form-item {
  margin-bottom: 0px!important;
  }*/
</style>
