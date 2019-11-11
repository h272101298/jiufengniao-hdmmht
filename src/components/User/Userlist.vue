<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
<!--      <el-form :inline="true">
      <el-form-item>
        <el-input v-model="filter.name" placeholder="请输入昵称" size="mini" style="min-width: 200px;" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getlist">搜索</el-button>
        <el-button size="mini" @click="clear">清空</el-button>
      </el-form-item>
    </el-form> -->

    <el-table :data="list" border stripe size="small" style="width:1000px;">
      <el-table-column prop="id" label="用户编号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" min-width="140" align="center">
      </el-table-column>

      <el-table-column prop="avatarUrl" label="头像" min-width="100" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.avatarUrl" style="width:40px;height:40px;border-radius:50%;margin:5px 0 -5px 0;" />
        </template>
      </el-table-column>

      <el-table-column prop="userInfo.name" label="姓名" min-width="140" align="center">
      </el-table-column>
      <el-table-column prop="userInfo.sex" label="性别" min-width="140" align="center">
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.userInfo && scope.row.userInfo.sex==1">男</el-tag>
          <el-tag type="warning" v-if="scope.row.userInfo && scope.row.userInfo.sex==2">女</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="userInfo.phone" label="手机" width="150" align="center">
      </el-table-column>
<!--       <el-table-column prop="userInfo.email" label="邮箱" width="180" align="center">
      </el-table-column> -->
      <el-table-column prop="created_at" label="注册日期" width="200" align="center">
      </el-table-column>

<!--       <el-table-column prop="bindStore" label="绑定店铺" width="200" align="center">
        <template slot-scope="scope">
          <p v-show="scope.row.bind!==0">{{scope.row.bindStore}}</p>
        </template>
      </el-table-column> -->

<!--       <el-table-column label="操作" min-width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="newmember(scope.$index, scope.row)" v-show="checkper1">开通会员</el-button>

          <el-button type="warning" size="mini" v-if="scope.row.bind==0" @click="bindshop(scope.$index, scope.row)">绑定店铺</el-button>

          <el-button type="danger" size="mini" v-if="scope.row.bind!==0" @click="unbindshop(scope.$index, scope.row)">解绑店铺</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
    </el-pagination>
  </el-col>


  <el-col>
    <el-dialog title="成为会员：" :visible.sync="dialogNewVisible" center>
      <el-form label-width="120px" style="width:80%">
        <el-form-item label="选择等级：">
          <el-select placeholder="请选择会员等级" @change="setlevel" v-model="level">
            <el-option v-for="item in levelArr" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: calc(50% - 120px);">
          <el-button type="primary" @click="memberpost()">保存</el-button>
          <el-button @click="dialogNewVisible  = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-col>

  <el-col>
    <el-dialog title="绑定店铺：" :visible.sync="dialogBindVisible" center>
      <el-form label-width="120px" style="width:80%">
        <el-form-item label="选择商家：">
          <el-select placeholder="请选择商家" @change="setshop" v-model="shop">
            <el-option v-for="item in shoparr" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: calc(50% - 120px);">
          <el-button type="primary" @click="shobind()">保存</el-button>
          <el-button @click="dialogBindVisible  = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-col>


  <el-col>
    <el-dialog title="是否确定解绑？" :visible.sync="dialogDelVisible" width="30%">
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitdel()">确 定</el-button>
        <el-button @click="dialogDelVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-col>


</el-row>
</template>

<script>


  import { userGet } from '../../api/api';

  // import { mconfigGet } from '../../api/api';

  // import { usertohy } from '../../api/api';

  // import { shopGet } from '../../api/api';

  // import { bindshop } from '../../api/api';

  // import { unbindshop } from '../../api/api';


  export default {
    data() {
      return {
        currentPage: 1,
        list:[],
        count:0,
        limit:10,
        dialogNewVisible:false,
        dialogBindVisible:false,
        dialogDelVisible:false,
        filter:{
          name:''
        },

        levelArr:[],

        shoparr:[],

        level:'',
        shop:'',
        checkper1:false,
      };
    },

    methods:{
      checkPer(){
        var per = sessionStorage.getItem('permissions');
        if(per.indexOf('setMember')>-1){
          this.checkper1=true;
        }
      },

      getlist(){
        var allParams = '?page='+ this.currentPage + '&limit=' + this.limit + '&name=' + this.filter.name;
        userGet(allParams).then((res) => {
          this.list=res.data.data;
          this.count=res.data.count;
        });
      },

      getlevel(){
        var that= this;
        var allParams = '';
        mconfigGet(allParams).then((res) => {
          that.levelArr=res.data.data;
        });
      },

      getshop(){
        var that= this;
        var allParams = '';
        shopGet(allParams).then((res) => {
          that.shoparr=res.data.data;
        });
      },

      unbindshop(index, row){
        this.dialogDelVisible=true
        this.userid=row.id
      },

      submitdel(){
       var allParams='?&user_id='+this.userid
       console.log(allParams)
       unbindshop(allParams).then((res) => {
          // console.log(res)
          if (res.msg === "ok") {
           this.$message({
            message: '解绑成功',
            type: 'success'
          });
           this.dialogDelVisible=false
           this.getlist();
         } else {
           this.$message({
            message: res.msg,
            type: 'error'
          });
         }
       });
     },

     bindshop(index, row){
      this.dialogBindVisible=true
      this.userid=row.id
    },

    setshop(res){
      this.shop=res
    },

    shobind(){
      if(this.shop==''){
       this.$message({
        message: '请选择店铺',
        type: 'error'
      });
       return
     }

     var allParams='?store_id='+this.shop+'&user_id='+this.userid
     console.log(allParams)
     bindshop(allParams).then((res) => {
      if (res.msg === "ok") {
       this.$message({
        message: '提交成功',
        type: 'success'
      });
       this.dialogBindVisible=false
       this.getlist();
     } else {
       this.$message({
        message: res.msg,
        type: 'error'
      });
     }
   });
   },




   clear(){
    this.filter={
      name:''
    },
    this.getlist();
  },

  newmember(index, row){
    this.dialogNewVisible=true
    this.userid=row.id
  },



  setlevel(res){
    console.log(res)
    this.level=res
  },

  memberpost(){
    if(this.level==''){
     this.$message({
      message: '请选择会员等级',
      type: 'error'
    });
     return
   }
   var allParams={member_id:this.level,user_id:this.userid}
   console.log(allParams)
   usertohy(allParams).then((res) => {
          // console.log(res)
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
  // this.getlevel();
  // this.getshop();
  // this.checkPer();
}

}
</script>


<style>

</style>
