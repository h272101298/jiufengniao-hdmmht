<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>代理管理</el-breadcrumb-item>
        <el-breadcrumb-item>代理列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <!--工具条-->

      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="代理列表" name="list">


          <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <!--     <el-form :inline="true" :model="filters">
             <el-form-item>
              <el-input v-model="filters.name" placeholder="请输入代理名称/手机号码" style="min-width: 240px;" size="mini"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini"  @click="getlist">搜索</el-button>
              <el-button @click="clearss" size="mini" >清空</el-button>
            </el-form-item>
          </el-form> -->
        </el-col>

        <el-table :data="list" highlight-current-row style="width: 1000px;"  size="small" border> 

          <el-table-column prop="id" label="ID" width="60" align="center">
          </el-table-column>
          <el-table-column prop="user.nickname" label="昵称" min-width="140" align="center">
          </el-table-column>
<!--           <el-table-column prop="name" label="姓名" min-width="140" align="center">
          </el-table-column> -->

          <el-table-column prop="user" label="头像" min-width="100" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.user.avatarUrl" v-if="scope.row.user" style="width:40px;height:40px;border-radius:50%;margin:5px 0 -5px 0;" />
            </template>
          </el-table-column>
          
<!--           <el-table-column prop="phone" label="电话号码" min-width="140" align="center">
          </el-table-column> -->
          <el-table-column prop="user.created_at" label="注册时间" min-width="100" align="center">
          </el-table-column>
<!-- 
          <el-table-column label="操作" width="80" align="center">

          </el-table-column> -->
        </el-table>


        <el-pagination style="float:left;margin: 20px 0px 0px 0px;" :current-page="currentPage" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页"></el-pagination>
      </el-tab-pane>

      <el-tab-pane label="分佣设置" name="config">


        <el-form :inline="true" :model="filters">

          <el-table border :data="ratio" highlight-current-row size="mini" style="width: 801px; margin-bottom:20px;">
            <el-table-column prop="system" label="平台" width="200" align="center">
            </el-table-column>
            <el-table-column prop="level1" label="一级代理" width="200" align="center">
            </el-table-column>
            <el-table-column prop="level2" label="二级代理" width="200" align="center">
            </el-table-column>
            <el-table-column prop="level3" label="三级代理" width="200" align="center">
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="dialogEditVisible = true">修改</el-button>
        </el-form-item>
      </el-form>


    </el-tab-pane>
  </el-tabs>

</el-col>


<el-col>
  <el-dialog title="分佣设置：" :visible.sync="dialogEditVisible" center>

    <el-form ref="ratiolist" :model="ratiolist" label-width="120px" style="width:80%" :rules="rules">

      <el-form-item label="平台：" prop="system">
        <el-input v-model="ratiolist.system" type="number" placeholder="请输入百分比"> <template slot="append">%</template></el-input>
      </el-form-item>
      <el-form-item label="一级代理：" prop="level1">
        <el-input v-model="ratiolist.level1" type="number" placeholder="请输入百分比"> <template slot="append">%</template></el-input>
      </el-form-item>
      <el-form-item label="二级代理：" prop="level2">
        <el-input v-model="ratiolist.level2" type="number" placeholder="请输入百分比"> <template slot="append">%</template></el-input>
      </el-form-item>
      <el-form-item label="三级代理：" prop="level3">
        <el-input v-model="ratiolist.level3" type="number" placeholder="请输入百分比"> <template slot="append">%</template></el-input>
      </el-form-item>
      <el-form-item label="注意：">
        <span>三个等级代理佣金之和需为100</span>
      </el-form-item>
      <el-form-item style="margin-left: calc(50% - 120px);">
        <el-button type="primary" @click="save()">保存</el-button>
        <el-button @click="dialogEditVisible  = false">取 消</el-button>
      </el-form-item>

    </el-form>

  </el-dialog>
</el-col>






<el-col>
  <el-dialog title="填写备注：" :visible.sync="noteVisible" style="min-width:400px;">
    <el-form :data="note" label-width="120px" style="width:80%;">
      <el-form-item label="备注:">
        <el-input  type="textarea" v-model="note.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submitnote()">确 定</el-button>
    </el-form>
  </el-dialog>
</el-col>

</el-row>

</template>


<script>
  import { agentGet } from '../../api/api';
  import { ratioPost } from '../../api/api';
  import { ratioGet } from '../../api/api';


  export default {
    data() {

      var checkvalue = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('此项不能为空'));
        }
        setTimeout(() => {
          if (Math.sign(value) == 1) {
            if(value%1 === 0){
             callback();
           }else{
            callback();
          }
        } else if(Math.sign(value) == 0) {
          callback(new Error('不能为0'));
        } else if(Math.sign(value) == -1) {
          callback(new Error('请输入正数'));
        }else{
          callback(new Error('请输入数字'));
        }
      }, 100);
      };

      return {
        activeName:'list',
        ratiolist:{
          system:'',
          level1:'',
          level2:'',
          level3:'',
        },
        ratio:[{
          system:'请设置',
          level1:'请设置',
          level2:'请设置',
          level3:'请设置',
        }],
        list: [],
        note:{
          remark:'',
          id:''
        }, 

        rules:{
          system: [{required: true, trigger: 'blur',validator: checkvalue}],
          level1: [{required: true, trigger: 'blur',validator: checkvalue}],
          level2: [{required: true, trigger: 'blur',validator: checkvalue}],
          level3: [{required: true, trigger: 'blur',validator: checkvalue}],
        },

        agentid:'',
        currentPage: 1,
        count:0,
        limit:10,
        filters: {
          name: ''
        },
        users: [],
        form: {},
        dialogVisible: false,
        dialogEditVisible:false,
        noteVisible: false
      }
    },
    methods: {

      getlist: function () {
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit + '&search=' + this.filters.name;
        agentGet(allParams).then((res) => {
          this.list=res.data.data;
          this.count=res.data.count;
        });
      },



      clearss:function(){
        this.filters.name='';
        this.getlist();
      },


      stopshop(row){
        var allParams =  row.id;
        agentChange(allParams).then((res) => {
          this.getlist();
        });
      },




      getratio(){
        var allParams = '';
        ratioGet(allParams).then((res) => {
          // console.log(res.data==null)
          if(res.data!==null){
            this.ratio[0].system=res.data.system;
            this.ratio[0].level1=res.data.level1;
            this.ratio[0].level2=res.data.level2;
            this.ratio[0].level3=res.data.level3;
          }
        });
      },

      save(){

        this.$refs.ratiolist.validate((valid) => {
          if (valid) {
            // console.log(this.newdelive)
            ratioPost(this.ratiolist).then((res) => {
              if (res.msg === "ok") {
               this.$message({
                message: '提交成功',
                type: 'success'
              });
               this.dialogEditVisible=false
               this.getratio();
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


      //页码更改
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getlist();
      },

      //改变每页条数
      handleSizeChange(val){
        this.limit = val;
        this.getlist();
      },


    },
    mounted() {
      this.getlist();
      this.getratio();
    }
  }
</script>


<style scoped>

</style>
