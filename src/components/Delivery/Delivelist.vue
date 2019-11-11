<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>快递配置</el-breadcrumb-item>
        <el-breadcrumb-item>快递列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">


      <el-button type="primary" size="mini" @click="newone">新增快递</el-button>
      <span style="padding: 6px 10px;font-size: 14px;background-color: #E9F0D8;color:#468847;width: 370px; text-align: center;margin-left: 10px;">请<a style="color: #4077ca" 
        href="https://ying.fengniaotuangou.cn/ExpressCode.xlsx" download="" mce_href="#">点击下载</a>快递简码，填写对应快递的简码，否则查询将失败</span>

        <el-table :data="list" v-loading="loading" border stripe size="small" style="margin-top: 10px;">
          <el-table-column prop="title" label="快递名称" min-width="200" align="center">
          </el-table-column>
          <el-table-column prop="code" label="快递简码" min-width="200" align="center">
          </el-table-column>
          <el-table-column prop="created_at" label="添加时间" min-width="200" align="center">
          </el-table-column>

          <el-table-column label="操作" width="400" align="center">
           <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
      </el-pagination>

    </el-col>


    <el-col>
      <el-dialog :title="diatitle" :visible.sync="dialogNewVisible" width="500" center style="min-width: 500px">
        <el-form ref="newdelive" :model="newdelive" label-width="120px" :rules="rules" status-icon>
          <el-form-item label="快递名称:" prop="title">
            <el-input v-model="newdelive.title" placeholder="请输入快递名称"></el-input>
          </el-form-item>
          <el-form-item label="快递简码:" prop="code">
            <el-input v-model="newdelive.code" placeholder="请输入快递简码"></el-input>
          </el-form-item>
          <el-form-item style="margin-left: calc(50% - 200px);">
            <el-button size="mini" type="primary" @click="save()">保 存</el-button>
            <el-button size="mini" @click="dialogNewVisible = false">取 消</el-button>
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

  import { deliveryGet } from '../../api/api';
  import { deliveryPost } from '../../api/api';
  import { deliveryDel } from '../../api/api';


  export default {
    data() {
      return {
        activeName:'list',

        currentPage: 1,
        list:[],
        loading: false,
        count:0,
        limit:10,
        dialogNewVisible:false,
        dialogDelVisible:false,
        newdelive:{
          title:'',
          code:''
        },
        rules: {
          title: [{required: true, trigger: 'blur',message: '请输入快递名称'}],
          code: [{required: true, trigger: 'blur',message: '请输入快递简码'}]
        },
        configrule:{
          businessId: [{required: true, trigger: 'blur',message: '请输入商户ID'}],
          apiKey: [{required: true, trigger: 'blur',message: '请输入API key'}]
        },
        editId:'',
        delId:'',

        diatitle:'新增快递',

        // kaiguan:1,
        noconfig:false,
        config:{
          businessId:null,
          apiKey:null
        },

        configinfo:{
          api_key:null,
          business_id:null
        },
        checkper1:false,
        checkper2:false,
        checkper3:false,


      };
    },

    methods:{
      checkPer(){
        var per = sessionStorage.getItem('permissions');

        if(per.indexOf('expressAdd')>-1){
          this.checkper1=true;
        }

        if(per.indexOf('expressDel')>-1){
          this.checkper2=true;
        }


        if(per.indexOf('expressConfig')>-1){
          this.checkper3=true;
        }
      },



      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit;
        deliveryGet(allParams).then((res) => {
          this.list=res.data.data;
        });
      },

      newone(){
        this.dialogNewVisible=true
        this.newdelive={
          title:'',
          code:''
        }
      },

      save(){

        this.$refs.newdelive.validate((valid) => {
          if (valid) {
            deliveryPost(this.newdelive).then((res) => {
              if (res.msg === "ok") {
               this.$message({
                message: '提交成功',
                type: 'success'
              });
               this.dialogNewVisible=false
               this.getlist();
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

      handleEdit(index, row){
        this.diatitle='编辑快递';
        this.putorup='put';
        this.editId = row.id;
        this.dialogNewVisible=true
        this.newdelive={
          id: row.id,
          title:row.title,
          code:row.code
        }
      },

      handleDelete(index, row) {
        this.dialogDelVisible = true;
        this.delId = row.id;
      },

      submitdel(){
        this.dialogDelVisible = false;
        var allParams='?id='+this.delId
        deliveryDel(allParams).then((res) => {
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

      // this.checkPer();
    }
  }
</script>


<style>

</style>
