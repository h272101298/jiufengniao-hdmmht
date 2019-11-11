<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增商品</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">



      <el-form ref="newgood" :model="newgood" label-width="120px" :rules="rules">


        <el-form-item label="分类：">
          <el-select v-model="newgood.type_id" placeholder="请选择分类" filterable>
            <el-option v-for="item in typeArr" :label="item.title" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="名称：" prop="name">
          <el-input v-model="newgood.name" style="max-width: 300px;" placeholder="请输入名称"></el-input>
        </el-form-item>

        <el-form-item label="价格：" prop="price">
          <el-input v-model="newgood.price" style="max-width: 300px;" placeholder="请输入价格"></el-input>
        </el-form-item>

        <el-form-item label="团购价：" prop="group_price">
          <el-input v-model="newgood.group_price" style="max-width: 300px;" placeholder="请输入团购价"></el-input>
        </el-form-item>


        <el-form-item label="底图：">
          <el-upload class="upload-demo" :action="upurl" :data="uptoken" :before-upload="beforeUpload" :on-success="baseSuccess" :show-file-list="false" accept="image/*">
            <img :src="newgood.base_pic" class="pre-img" style="max-width:200px;max-height:200px;border:2px dashed #ccc;border-radius:0px;display: block" >
            <el-button size="small" type="primary" style="display: block;margin-top: 20px;">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">可上传JPG/PNG文件，且大小不超过1M</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="遮罩图：">
          <el-upload class="upload-demo" :action="upurl" :data="uptoken" :before-upload="beforeUpload" :on-success="maskSuccess" :show-file-list="false" accept="image/*">
            <img :src="newgood.mask_pic" class="pre-img" style="max-width:200px;max-height:200px;border:2px dashed #ccc;border-radius:0px;display: block" >
            <el-button size="small" type="primary" style="display: block;margin-top: 20px;">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">可上传JPG/PNG文件，且大小不超过1M</div>
          </el-upload>
        </el-form-item>



        <el-form-item style="margin-left: calc(50% - 200px);">
          <el-button type="primary" @click="save()">保 存</el-button>
          <el-button @click="dialogNewVisible = false">取 消</el-button>
        </el-form-item>

      </el-form>
    </el-col>
  </el-row>
</template>



<script>


  import { typeGet } from '../../api/api';

  import { goodoneGet } from '../../api/api';

  import { goodPost } from '../../api/api';

  import qiniu from '../../api/qiniu';

  import { Message } from 'element-ui';

  export default {
    data() {
      return {
       uptoken:{
        token:qiniu.token,
      },
      upurl:qiniu.upurl,

      newgood:{
        name:'',
        type_id:'',
        base_pic:'../static/images/default1.png',
        mask_pic:'../static/images/default1.png',
        price:'',
        group_price:''
      },
      typeArr:[],

      rules:{
        name: [
        {required: true, message: '请输入名称', trigger: 'blur'},
        ],
        price: [
        {required: true, message: '请输入价格', trigger: 'blur'},
        ],
        group_price: [
        {required: true, message: '请输入团购价', trigger: 'blur'},
        ],
      },
    };
  },

  methods:{
    gettype(){
      var allParams = '';
      typeGet(allParams).then((res) => {
        this.typeArr=res.data.data;
      });
    },

    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        this.$message.error('图片大小不能超过 1MB!');
      }
      return isLt1M;
    },

    baseSuccess(res, file) {
      this.newgood.base_pic =qiniu.showurl+ res.key;
    },

    maskSuccess(res, file) {
      this.newgood.mask_pic =qiniu.showurl+ res.key;
    },

    save(){
      if(this.newgood.type_id==''){
        Message({
          message: "请选择分类",
          type: 'error'
        });
        return
      }else if(this.newgood.base_pic=='../static/images/default1.png'){
       Message({
        message: "请上传底图",
        type: 'error'
      });
       return
     }else if(this.newgood.mask_pic=='../static/images/default1.png'){
       Message({
        message: "请上传遮罩图",
        type: 'error'
      });
       return
     }

     this.$refs.newgood.validate((valid) => {
      if (valid) {
        var allParams=this.newgood
        goodPost(allParams).then((res) => {
          if (res.msg === "ok") {
           this.$message({
            message: '提交成功',
            type: 'success'
          });
           this.$router.push({ path: '/Model/Modellist' });
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

   checkgoodid(){
    var goodid=sessionStorage.getItem('goodeditid');
    if(goodid){
      this.goodid=goodid
      var allParams = '?id='+ goodid;
      goodoneGet(allParams).then((res) => {
        this.newgood=res.data
        this.newgood.type_id=parseInt(res.data.type_id)
      })
    }
  }
},

mounted: function () {
  this.checkgoodid()
  this.gettype()
}
}
</script>