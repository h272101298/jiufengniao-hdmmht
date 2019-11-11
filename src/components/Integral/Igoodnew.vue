<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>积分商城</el-breadcrumb-item>
        <el-breadcrumb-item>编辑商品</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

      <el-form label-width="120px" width="900px" center style="width: 1000px" :rules="rules" ref="newgood" :model="newgood">
       <el-form-item label="商品名称：" prop="title">
        <el-input v-model="newgood.title" placeholder="请输入商品名称"></el-input>
      </el-form-item> 

      <el-form-item label="商品描述：" prop="detail">
        <el-input v-model="newgood.detail" placeholder="请输入商品描述"></el-input>
      </el-form-item>

<!--       <el-form-item label="分享标题：" prop="share_title">
        <el-input v-model="newgood.share_title" placeholder="请输入分享标题"></el-input>
      </el-form-item> -->

      <el-form-item label="兑换积分：" prop="score">
        <el-input v-model="newgood.score" type="number" min="0" placeholder="请输入兑换积分"></el-input>
      </el-form-item>

      <el-form-item label="商品缩略图：" prop="cover">
        <el-upload :action="upurl" :data="uptoken" list-type="picture-card" :on-success="handleSuccess" :show-file-list="false" accept="image/*">
          <img :src="newgood.cover" class="pre-img" style="width:146px;height:146px;display: block">
          <p slot="tip" style="line-height: 15px;padding: 0;margin-block-start:10px;margin-block-end:0">可上传JPG/PNG文件</p>
        </el-upload>
      </el-form-item>

      <el-form-item label="商品相册：" prop="pictures">
        <el-upload :action="upurl" :data="uptoken" list-type="picture-card" :on-remove="handleRemove" :on-success="handlelistSuccess" :file-list="newgood.pictures" :multiple="true" accept="image/*">
          <img src="../../../static/images/default1.png" class="pre-img" style="width:146px;height:146px;display: block" >
          <p slot="tip" style="line-height: 15px;padding: 0;margin-block-start:10px;margin-block-end:0">可上传JPG/PNG文件</p>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save()" size="mini">保 存</el-button>
        <el-button @click="golist()" size="mini">取 消</el-button>
      </el-form-item>
    </el-form>


  </el-col>

</el-row>
</template>

<script>

  import qiniu from '../../api/qiniu';

  import { igoodPost } from '../../api/api';
  import { igoodoneGet } from '../../api/api';

  import { Message } from 'element-ui';

  export default {
    data() {
      var checkvalue = (rule, value, callback) => {
        if (!value) {return callback(new Error('兑换积分不能为空'));}
        setTimeout(() => {
          if (Math.sign(value) == 1) {
            if(value%1 === 0){callback();}
            else{callback();}
          } else if(Math.sign(value) == 0) {callback(new Error('不能为0'));} 
          else if(Math.sign(value) == -1) {callback(new Error('请输入正数'));}
          else{callback(new Error('请输入数字'));}
        }, 100);
      };

      return {

        uptoken:{
          token:qiniu.token,
        },
        upurl:qiniu.upurl,

        newgood:{
          title:'',
          detail:'',
          share_title:'1',
          cover:'../static/images/default1.png',
          pictures:[],
          score:null,
        },

        rules:{
          title: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
          ],
          detail: [
          {required: true, message: '请输入商品描述', trigger: 'blur'},
          ],
          share_title: [
          {required: true, message: '请输入分享标题', trigger: 'blur'},
          ],
          score: [
          {required: true, validator: checkvalue, trigger: 'blur'},
          ],
        },

        goodid:''
      }
    },


    methods:{
     checkgoodid(){
      var goodid=sessionStorage.getItem('igoodeditid');

      if(goodid){
        this.goodid=goodid

        var allParams = '?id='+ goodid;
        igoodoneGet(allParams).then((res) => {

          this.newgood={
            title:res.data.title,
            detail:res.data.detail,
            share_title:res.data.share_title,
            detail:res.data.detail,
            cover:res.data.cover,
            score:res.data.score
          }

          var images=[];
          for(var i=0;i<res.data.pictures.length;i++){
            images.push({
              uid:i,
              url:res.data.pictures[i].url,
              response:{
                key:1
              }
            })
          }
          this.newgood.pictures=images
          this.newgood.id=res.data.id

        });
      }
    },

    handleSuccess(res, file) {
      this.newgood.cover = qiniu.showurl+ res.key
    },

    handlelistSuccess(res, file,fileList){
      this.newgood.pictures=[]
      for(var i=0;i<fileList.length;i++){
        if(fileList[i].response.key !== 1){
          this.newgood.pictures.push(qiniu.showurl+ fileList[i].response.key)  
        }else {
          this.newgood.pictures.push(fileList[i].url)
        }
      }
    },

    handleRemove(file, fileList) {
      this.newgood.pictures=[]
      for(var i=0;i<fileList.length;i++){
        if(fileList[i].response.key !== 1){
          this.newgood.pictures.push(qiniu.showurl+ fileList[i].response.key)
        }else {
          this.newgood.pictures.push(fileList[i].url)
        }
      }
    },

    golist(){
      this.$router.push({ path: '/Integral/Igoodlist' });
    },

    save(){
      this.$refs.newgood.validate((valid) => {
        if (valid) {
          if(this.newgood.cover=="../static/images/default1.png"){
            Message({
              message: "请选择商品缩略图",
              type: 'error'
            });
            return
          }else if(this.newgood.pictures.length==0){
            Message({
              message: "请选择商品相册",
              type: 'error'
            });
            return
          }
        }else{
          return false;
        }

        var allParams=this.newgood

        var imgarr=this.newgood.pictures
        for (var i=0; i<imgarr.length; i++) {
          if(imgarr[i].url){
            imgarr[i]=imgarr[i].url
          }
        }

        allParams.pictures=imgarr

        var goodeditid = window.sessionStorage.getItem('igoodeditid')
        if(goodeditid){
          allParams.id=goodeditid;
        }

        console.log(allParams)

        igoodPost(allParams).then((res) => {
          console.log(res)

          Message({
            message: "提交成功",
            type: 'success'
          });
          this.$router.push({ path: '/Integral/Igoodlist' });
        });
      })
    },

  },


  mounted: function () {
    this.checkgoodid()
  }
}
</script>

<style scope>

</style>