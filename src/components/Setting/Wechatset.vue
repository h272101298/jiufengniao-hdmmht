<template>
 <el-row class="warp" style="padding:20px 0 0 20px;">
  <el-col :span="24" class="warp-breadcrum">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>微信设置</el-breadcrumb-item>
    </el-breadcrumb>
  </el-col>


  <el-col :span="24" class="warp-main">
    <el-row>

      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="微信配置" name="list">

          <el-form ref="wechatset" :model="wechatset" label-width="120px" class="form" status-icon size="small" :rules="rules1" style="width:600px;margin-top: 20px">

            <el-form-item label="小程序AppId：" prop="app_id">
              <el-input v-model="wechatset.app_id" placeholder="请输入小程序AppId" v-show="show"></el-input>
              <label v-show="set">{{wxset.app_id}}</label>
            </el-form-item>

            <el-form-item label="AppSecret：" prop="app_secret">
              <el-input v-model="wechatset.app_secret" placeholder="请输入AppSecret" v-show="show"></el-input>
              <label v-show="set">{{wxset.app_secret}}</label>
            </el-form-item>

            <el-form-item label="微信商户号：" prop="mch_id">
              <el-input v-model="wechatset.mch_id" placeholder="请输入微信商户号" v-show="show"></el-input>
              <label v-show="set">{{wxset.mch_id}}</label>
            </el-form-item>

            <el-form-item label="商户Api密钥：" prop="api_key">
              <el-input v-model="wechatset.api_key" placeholder="请输入AppKey" v-show="show"></el-input>
              <label v-show="set">{{wxset.api_key}}</label>
            </el-form-item>

            <el-form-item label="商户Api证书：">

              <label v-show="set">{{wxset.ssl_cert}}</label>
              <label v-show="set">{{wxset.ssl_key}}</label>

              <el-upload v-show="show" :action="base" :on-remove="handleRemove" :on-success="handleSuccess" :limit="2" :on-exceed="handleExceed" :on-error="handleError" :file-list="wechatset.File">
                <el-button size="small" type="primary">上传证书</el-button>
              </el-upload> 
              <span v-show="show">提示：证书为pem格式文件，第一个为证书部分，第二个为秘钥部分，请按顺序上传</span>
            </el-form-item>

            <el-form-item>
              <el-button v-if="set && checkper1" size="small" type="primary" style="margin-left:0px;margin-top:20px;" @click="changebase">编辑</el-button>
              <el-button v-if="show" size="small" type="primary" style="margin-left:0px;margin-top:20px;" @click="confirm">提交</el-button>
              <el-button v-if="show" size="small" @click="cancel">取消</el-button>
            </el-form-item>
          </el-form>

        </el-tab-pane>

        <el-tab-pane label="模板消息" name="config">

<!--          <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" size="mini" @click="newone">新增</el-button>
          </el-form-item>
        </el-form> -->

        <el-table :data="modellist" border stripe style="width:1000px" size="mini">
          <el-table-column prop="title" label="键名" width="120" align="center">
          </el-table-column>
          <el-table-column prop="content" label="键值" min-width="300" align="center">
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
           <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>



    </el-tab-pane>
  </el-tabs>

</el-row>
</el-col>



<el-col>
  <el-dialog :title="diatitle" :visible.sync="dialogNewVisible" width="500" center style="min-width: 500px">
    <el-form ref="newmodel" :model="newmodel" label-width="120px" :rules="rules" status-icon>

      <el-form-item label="键名:" prop="title">
        <el-input v-if="putorup=='up'" v-model="newmodel.title" style="max-width: 600px;" placeholder="请输入键名"></el-input>
        <span v-if="putorup=='put'">{{newmodel.title}}</span>
      </el-form-item>

      <el-form-item label="键值:" prop="content" style="margin-bottom: 40px">
        <el-input v-model="newmodel.content" style="max-width: 600px;" placeholder="请输入键值"></el-input>
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



<script>


  import qiniu from '../../api/qiniu';

  import hosturl from '../../api/api';

  import { wxconfigPost } from '../../api/api';
  import { wxconfigGet } from '../../api/api';
  import {  configPost } from '../../api/api';
  import {  configGet } from '../../api/api';
  import {  configsGet } from '../../api/api';
  import {  configDel } from '../../api/api';

  import { Message } from 'element-ui';


  export default {
    data() {
      return {
        base:hosturl+'/upload',
        activeName:'list',

        show:false,
        set:true,
        checkper1:false,
        uptoken:{
          token:qiniu.token,
        },
        upurl:qiniu.upurl,


        wechatset:{
          app_id:'',
          app_secret:'',
          mch_id:'',
          api_key:'',
          File:[],
        },

        wxset:{},

        rules1:{
          app_id: [
          {required: true, message: '请输入AppId', trigger: 'blur'},
          ],
          app_secret: [
          {required: true, message: '请输入AppSecret', trigger: 'blur'},
          ],
          mch_id: [
          {required: true, message: '请输入商户号', trigger: 'blur'},
          ],
          api_key: [
          {required: true, message: '请输入AppKey', trigger: 'blur'},
          ],
        },


        modelshow:false,
        modelset:true,
        // modeldata:{
        //   collage_notify:'',
        //   buying_notify:'',
        //   card_notify:'',
        //   shop_notify:'',
        //   product_notify:'',
        //   reduce_notify:'',
        //   voucher_notify:'',
        //   proxy_notify:'',
        //   promotion_notify:''
        // },

        // rules2:{
        //   collage_notify: [
        //   {required: true, message: '请输入模板消息ID', trigger: 'blur'},
        //   ],
        //   buying_notify: [
        //   {required: true, message: '请输入模板消息ID', trigger: 'blur'},
        //   ],
        //   card_notify: [
        //   {required: true, message: '请输入模板消息ID', trigger: 'blur'},
        //   ],
        //   shop_notify: [
        //   {required: true, message: '请输入模板消息ID', trigger: 'blur'},
        //   ],
        //   product_notify: [
        //   {required: true, message: '请输入模板消息ID', trigger: 'blur'},
        //   ],
        //   reduce_notify: [
        //   {required: true, message: '请输入模板消息ID', trigger: 'blur'},
        //   ],
        //   voucher_notify: [
        //   {required: true, message: '请输入模板消息ID', trigger: 'blur'},
        //   ],
        //   proxy_notify: [
        //   {required: true, message: '请输入模板消息ID', trigger: 'blur'},
        //   ],
        //   promotion_notify: [
        //   {required: true, message: '请输入模板消息ID', trigger: 'blur'},
        //   ],
        // }

        modellist:[],

        rules: {
          title: [{required: true, trigger: 'blur',message: '请输入标题'}],
          content: [{required: true, trigger: 'blur',message: '请输入模板id'}]
        },
        diatitle:'新增id',
        newmodel:{
         title:'',
         content:''
       },
       editId:'',

       putorup:'up',
       dialogNewVisible:false,
       dialogDelVisible:false
     };
   },

   methods:{
    checkPer(){
      var per = sessionStorage.getItem('permissions');
      if(per.indexOf('txConfig')>-1){
        this.checkper1=true;
      }
    },

    getconfig(){
      var allParams = '';
      wxconfigGet(allParams).then((res) => {
        if(res.data==null){
          this.show=true
          this.set=false
        }else{
          this.wxset=res.data
        }
      });
    },

    handleSuccess(res, file) {
      this.wechatset.File.push(res.data.url)
      console.log(res.data.url)
    },

    handleRemove(file, fileList) {
      this.wechatset.File=[]
      for(var i=0;i<fileList.length;i++){
        this.wechatset.File.push(res.data.url)
      }
    },

    handleExceed(files, fileList) {
      this.$message.warning(`只能上传 2 个文件`);
    },

    handleError(err, file, fileLis){
      Message({
        message: "请上传pem格式文件",
        type: 'error'
      });
    },

    changebase(){
      this.show=true
      this.set=false
    },

    confirm(){
      this.$refs.wechatset.validate((valid) => {
        if (valid) {
         if(this.wechatset.File.length!==2){
          Message({
            message: "请上传两个证书",
            type: 'error'
          });
        }else{
          var allParams={
            app_id:this.wechatset.app_id,
            app_secret:this.wechatset.app_secret,
            mch_id:this.wechatset.mch_id,
            api_key:this.wechatset.api_key,
            ssl_cert:this.wechatset.File[0],
            ssl_key:this.wechatset.File[1],
          }
          console.log(allParams)
          wxconfigPost(allParams).then((res) => {
            console.log(res)
            if (res.msg === "ok") {
             this.$message({
              message: '提交成功',
              type: 'success'
            });
             this.getconfig()
             this.show=false
             this.set=true
           } else {
             this.$message({
              message: res.msg,
              type: 'error'
            });
           }
         });
        }
      }else{
        return false;
      }
    })
    },

    cancel(){
      this.show=false
      this.set=true
    },





    getmodel(){
      var allParams = '';
      configsGet(allParams).then((res) => {
        this.modellist=[res.data[0]]
        // this.modellist=res.data
      });
    },

    newone(){  
      this.dialogNewVisible=true;
      this.$refs.newmodel.clearValidate();
      this.putorup='up';
      this.diatitle='新增';

      this.newmodel={
       title:'',
       content:''
     }
   },

   handleEdit(index, row){
    this.diatitle='编辑';
    this.dialogNewVisible = true;
    this.putorup='put';
    this.editId = row.id;
    this.newmodel={
      title:row.title,
      content:row.content
    }
  },

  handleDelete(index, row) {
    this.dialogDelVisible = true;
    this.delId = row.id;
  },

  submitdel(){
    this.dialogDelVisible = false;
    var allParams='?id='+this.delId
    configDel(allParams).then((res) => {
      if (res.msg === "ok") {
       this.$message({
        message: '删除成功',
        type: 'success'
      });
       this.getmodel();
       this.dialogDelVisible = false;
     } else {
       this.$message({
        message: res.msg,
        type: 'error'
      });
     }
   });
  },


  save(){
    this.$refs.newmodel.validate((valid) => {
      if (valid) {
        if( this.putorup=='put'){
          var allParams = {
            title:this.newmodel.title,
            id:this.editId,
            content:this.newmodel.content,
          };
        }else{
          var allParams = {
            title:this.newmodel.title,
            content:this.newmodel.content,
          };
        }
        configPost(allParams).then((res) => {
          if (res.msg === "ok") {
           this.$message({
            message: '提交成功',
            type: 'success'
          });
           this.getmodel();
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


},

mounted: function(){
  this.getconfig();
  this.getmodel();
      // this.checkPer();
    }
  }
</script>

<style scoped>
  .grey{
    color: #aaa;
    float: left;
  }
</style>