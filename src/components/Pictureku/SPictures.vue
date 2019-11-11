<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>图库</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">



    <el-table :data="list" border stripe size="small" style="width:1000px;margin-top: 10px">
      <el-table-column prop="id" label="编号" min-width="100" align="center">
      </el-table-column>

      <el-table-column prop="url" label="图片(点击看大图)" min-width="200" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" height="350" trigger="click">
            <img :src="scope.row.url" style="height:350px;" />
            <img :src="scope.row.url" slot="reference" style="height:50px;" />
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="created_at" label="上传时间" min-width="200" align="center">
      </el-table-column>

      <el-table-column label="操作" min-width="200" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="imgdel(scope.$index, scope.row)"  v-if=" scope.row.state=='1'">删除</el-button>
          <el-button type="success" size="mini" @click="imgpass(scope.$index, scope.row)" v-if="type=='2' && scope.row.state=='0'">通过</el-button>
          <el-button type="info" size="mini" @click="imgreject(scope.$index, scope.row)" v-if="type=='2' && scope.row.state=='0'">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[ 20, 30, 50, 100]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
    </el-pagination>
  </el-col>



  <el-col>
    <el-dialog title="上传图片" :visible.sync="dialogNewVisible" width="500" center style="min-width: 500px">
      <el-form ref="newimg" :model="newimg" label-width="120px">

        <el-form-item label="上传图片：">
          <el-upload class="upload-demo" list-type="picture-card" :action="upurl" :data="uptoken" :on-success="handleSuccess" :on-exceed="handleExceed" :file-list="indexpost" :limit="1" :show-file-list="true" accept="image/*">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">可上传JPG/PNG文件</div>
          </el-upload>
        </el-form-item>

        <el-form-item style="margin-left: calc(50% - 200px);">
          <el-button size="mini" type="primary" @click="savepost()">上传</el-button>
          <el-button size="mini" @click="dialogNewVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-col>

  <el-col>
    <el-dialog title="删除不可恢复，是否确定删除？" :visible.sync="dialogDelVisible" width="30%">
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitdel()">确 定</el-button>
        <el-button size="mini" @click="dialogDelVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-col>


</el-row>
</template>

<script>


  import { pictureGet } from '../../api/api';

  import { picturePost } from '../../api/api';

  import { pictureDel } from '../../api/api';

  import { piccheck } from '../../api/api';

  import { Message } from 'element-ui';

  import qiniu from '../../api/qiniu';


  export default {
    data() {
      return {
        uptoken:{
          token:qiniu.token,
        },
        upurl:qiniu.upurl,


        currentPage: 1,
        list:[],
        count:0,
        limit:20,
        dialogNewVisible:false,
        indexpost:[],
        newimg:{},
        imgSrc:'',
        type:'2',

        dialogDelVisible:false,

        checkper1:false,
      };
    },

    methods:{


      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit+ '&type=' + this.type;
        pictureGet(allParams).then((res) => {
          this.list=res.data.data;
          this.count=res.data.count;
        });
      },

      imgdel(index, row) {
        this.dialogDelVisible = true;
        this.delId = row.id;
      },

      submitdel(){
        var allParams='?id='+this.delId
        pictureDel(allParams).then((res) => {
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

      upimg(){
        this.dialogNewVisible=true
      },

      handleSuccess(res, file){
        this.imgSrc = qiniu.showurl+ res.key
      },

      handleExceed(files, fileList) {
        this.$message.warning(`一次只能上传1张图片`);
      },

      savepost(){
        var allParams={
          url:this.imgSrc,
          type:1
        }
        picturePost(allParams).then((res) => {
          if (res.msg === "ok") {
           this.$message({
            message: '提交成功',
            type: 'success'
          });
           this.postimgSrc=''
           this.getlist();
           this.dialogNewVisible=false
         } else {
           this.$message({
            message: res.msg,
            type: 'error'
          });
         }
       });
      },




      imgpass(index, row){
       var allParams ='?id='+row.id+'&pass=1'
       piccheck(allParams).then((res) => {
        console.log(res)
        Message({
          message: "审核成功",
          type: 'success'
        });
        this.getlist();
      });
     },


     imgreject(index, row){
       var allParams ='?id='+row.id+'&pass=2'
       piccheck(allParams).then((res) => {
        console.log(res)
        Message({
          message: "审核成功",
          type: 'success'
        });
        this.getlist();
      });
     }

   },

   mounted: function () {
    this.getlist();

  }

}
</script>


<style>

</style>
