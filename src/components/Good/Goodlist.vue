<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
     <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" size="small" @click="newone" v-show="checkper3">新增商品</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="filter.name" placeholder="请输入商品名称/商品分类" style="min-width: 260px;" size="small"></el-input>
      </el-form-item>

      <el-form-item label="商品状态：">
        <el-select v-model="filter.state" placeholder="全部" @change="changestate" size="small">
          <el-option label="上架" value="0"></el-option>
          <el-option label="下架" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" @click="getlist">搜索</el-button>
        <el-button size="small" @click="clear">清空</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" v-loading="loading" border stripe size="small" @cell-click="cellclick">
      <el-table-column prop="id" label="编号" min-width="70" align="center">
      </el-table-column>
      <el-table-column prop="cover" label="图片" min-width="140" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.cover" style="max-width:60px;max-height:60px;" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" min-width="200" align="center">
      </el-table-column>
      <el-table-column prop="sales_volume" label="销量" min-width="100" align="center">
      </el-table-column>


      <el-table-column label="排序" width="100" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.offersort" v-if="scope.row.offer==0&&scope.row.review==1&&scope.row.state==1" size="mini" type="number" min="0"></el-input>
          <div v-if="scope.row.offerData">{{scope.row.offerData.sort}}</div>
        </template>
      </el-table-column>

      <el-table-column prop="offer" label="首页推荐" min-width="100" align="center" v-show="checkper2">
        <template slot-scope="scope">
          <el-button type="success" size="mini" v-show="scope.row.offer==1&&scope.row.review==1 && scope.row.state==1&&scope.row.state==1" @click="changeoffer(scope.row)">是</el-button>
          <el-button type="" size="mini" v-show="scope.row.offer==0&&scope.row.review==1&&scope.row.state==1" @click="changeoffer(scope.row)">否</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="state" label="上架状态" min-width="100" align="center" v-show="checkper2">
        <template slot-scope="scope">
          <el-button type="success" size="mini" v-show="scope.row.state==1&&scope.row.review==1" @click="changejia(scope.row)">上架</el-button>
          <el-button type="" size="mini" v-show="scope.row.state==0&&scope.row.review==1" @click="changejia(scope.row)">下架</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="review" label="审核状态" min-width="100" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-show="scope.row.review==1">已审核</el-tag>
          <el-tag type="info" v-show="scope.row.review==0">未审核</el-tag>
        </template>
      </el-table-column>


      <el-table-column prop="created_at" label="创建时间" min-width="150" align="center">
      </el-table-column>

      <el-table-column label="操作" width="180" align="center">
       <template slot-scope="scope">
        <el-tooltip class="icon" effect="dark" content="编辑" placement="top">
          <img src="../../../static/images/icon/edit.png" @click="handleEdit(scope.$index, scope.row)" v-show="checkper3">
        </el-tooltip>
        <el-tooltip class="icon" effect="dark" content="查看详情" placement="bottom">
          <img src="../../../static/images/icon/look.png" @click="handleSee(scope.$index, scope.row)">
        </el-tooltip>

        <el-tooltip class="icon" effect="dark" content="审核" placement="bottom">
          <img src="../../../static/images/icon/check.png" v-show="scope.row.review==0 && checkper1" @click="handleCheck(scope.row)">
        </el-tooltip>
        <el-tooltip class="icon" effect="dark" content="加入回收站" placement="top">
          <img src="../../../static/images/icon/delete.png" @click="handleDelete(scope.$index, scope.row)">
        </el-tooltip>

        <el-tooltip class="icon" effect="dark" content="推送" placement="bottom">
          <img src="../../../static/images/icon/select.png" @click="handlepush(scope.$index, scope.row)">
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination style="float:left;margin-top:20px;" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
  </el-pagination>
</el-col>



<el-col>
  <el-dialog title="选择推送" :visible.sync="dialogSelVisible" width="30%">
    <el-form label-width="110px" :model="selpush" label-position='left' :rules="pushrule" ref="selpush">
      <el-form-item label="商品名称：" class="fw6" prop="name">

<!--         <el-select v-model="selpush.type" placeholder="请选择推送类型" @change="bindsel">
          <el-option label="热门" value="hot">热门</el-option>
          <el-option label="新品" value="new">新品</el-option>
          <el-option label="优惠" value="offer">优惠</el-option>
        </el-select> -->
        <el-input v-model="selpush.name" placeholder="请输入商品名称"></el-input>
      </el-form-item>

      <el-form-item label="商品简介：" class="fw6" prop="detail">
        <el-input v-model="selpush.detail" placeholder="请输入商品简介"></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="submitsel()">确 定</el-button>
      <el-button type="info" size="small" @click="dialogSelVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</el-col>





<el-col>
  <el-dialog title="确认将该商品加入购物车么？" :visible.sync="dialogDelVisible" width="30%">
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" @click="submitdel()">确 定</el-button>
      <el-button type="primary" @click="dialogDelVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</el-col>







<el-col>
  <el-dialog title="商品预览" :visible.sync="dialogSeeVisible" width="30%" @open="opendialog" center >
    <el-form label-width="100px" :model="currow" label-position='left'>
      <el-form-item label="商品名称：" class="fw6">
        <span class="fw4">{{currow.name}}</span>
      </el-form-item>

      <el-form-item label="商品描述：" class="fw6">
        <template slot-scope="scope">
          <span class="fw4">{{currow.share_detail==null ? '暂无' : currow.share_detail }}</span>    
        </template>
      </el-form-item>

      <el-form-item label="商品缩略图：" class="fw6">
        <template slot-scope="scope">
          <img :src="currow.cover" class="seeimg" />
        </template>
      </el-form-item>

      <el-form-item label="分佣比例：" class="fw6">
        <span class="fw4">{{currow.brokerage}}</span>
      </el-form-item>

<!--       <el-form-item label="分享标题：" class="fw6">
        <template slot-scope="scope">
          <span class="fw4">{{currow.share_title}}</span>
        </template>
      </el-form-item> -->

    </el-form>
  </el-dialog>
</el-col>


</el-row>
</template>



<script>
  import { goodGet } from '../../api/api';
  import { goodRecycle } from '../../api/api';
  import { goodCheck } from '../../api/api';
  import { goodShelf } from '../../api/api';
  // import { goodhot } from '../../api/api';
  // import { goodnew } from '../../api/api';
  import { goodoffer } from '../../api/api';
  import { goodnotify } from '../../api/api';
  
  export default {
    data() {
      return {

        list:[],

        loading: false,
        count:0,
        currentPage: 1,
        // limit:100,
        limit:10,

        dialogDelVisible:false,
        dialogSeeVisible:false,
        dialogSelVisible:false,
        filter:{
          name:'',
          state:''
        },

        currow:'',
        editId:'',
        delId:'',
        checkper1:false,
        checkper2:false,
        checkper3:false,
        editable:[],


        selpush:{
          name:'',
          detail:''
        },
        pushrule:{
         name: [
         {required: true, message: '请输入商品名称', trigger: 'blur'},
         ],
         detail: [
         {required: true, message: '请输入商品简介', trigger: 'blur'},
         ],
       }
     };
   },

   methods:{
    getlist(){
      var allParams = '?page='+ this.currentPage + '&limit=' + this.limit+ '&name=' + this.filter.name+ '&state=' + this.filter.state;
      goodGet(allParams).then((res) => {
        this.list=res.data.data;
        this.count=res.data.count
      });
    },

    newone(){
      this.$router.push({ path: '/Good/Goodnew' });
      window.sessionStorage.removeItem('goodeditid')
    },

    changestate(val){
      this.filter.state=val
    },

    clear(){
      this.filter={
        name:'',
        state:''
      }
      this.getlist();
    },

    handlepush(index,row){
     this.dialogSelVisible = true;    
     this.selId = row.id;
     this.selpush={
      name:'',
      detail:''
    }
  },

  bindsel(e){
    console.log(e)
    this.selpush.type=e
  },

  submitsel(){
    // console.log(this.selpush)
    this.$refs.selpush.validate((valid) => {
     if (valid) {
       var allParams ={
        id:this.selId,
        name:this.selpush.name,
        intro:this.selpush.detail
      }
      goodnotify(allParams).then((res) => {
       this.dialogSelVisible = false;
       this.$message({
        message: '提交成功',
        type: 'success'
      });
     });
    }else{
      return false;
    }
  })
  },


  checkPer(){
    var per = sessionStorage.getItem('permissions');
      // console.log(per.indexOf('productReview')>-1)
      if(per.indexOf('productReview')>-1){
        this.checkper1=true;
      }

      if(per.indexOf('productShelf')>-1){
        this.checkper2=true;
      }

      if(per.indexOf('productAdd')>-1){
        this.checkper3=true;
      }
    },

    // changehot(index){
    //     // console.log(index)
    //     var allParams = '?product_id='+ index.id;
    //     goodhot(allParams).then((res) => {
    //      console.log(res)
    //      this.getlist();
    //    });
    //   },

    //   changenew(index){
    //     // console.log(index)
    //     var allParams = '?product_id='+ index.id;
    //     goodnew(allParams).then((res) => {
    //      console.log(res)
    //      this.getlist();
    //    });
    //   },

    changeoffer(row){
        // console.log(index)
       //  var allParams = '?product_id='+ index.id;
       //  goodoffer(allParams).then((res) => {
       //   console.log(res)
       //   this.getlist();
       // });

       if(row.offer==0&&!row.offersort){
        this.$message({
          message: '请先输入排序值',
          type: 'error'
        });
      }else{
        var allParams = '?product_id='+ row.id+"&sort="+row.offersort;
        goodoffer(allParams).then((res) => {
         console.log(res)
         this.getlist();
       });
      }
    },


    changejia(index){
      // console.log(index)
      var allParams = '?id='+ index.id;
      goodShelf(allParams).then((res) => {
       console.log(res)
       this.getlist();
     });
      
      // console.log(index.offer==1)

      if(index.offer==1){
        this.changeoffer(index)
      }
    },

    handleCheck(index){
        // console.log(index)
        var allParams = '?id='+ index.id;
        goodCheck(allParams).then((res) => {
         console.log(res)
         this.getlist();
       });
      },


      handleSee(index,row) {
        this.currow=row
        this.dialogSeeVisible = true;
      },


      opendialog(){
        setTimeout(() => {
          this.setdetail();
        }, 100);
      },

      setdetail(){
        var seeBox = document.getElementById("detail");
        seeBox.innerHTML=this.currow.detail;
      },




      handleEdit(index, row){
        sessionStorage.setItem('goodeditid',row.id);
        this.$router.push({ path: '/Good/Goodnew' });
      },

      handleDelete(index, row) {
        this.dialogDelVisible = true;
        this.delId = row.id;
      },

      submitdel(){
        this.dialogDelVisible = false;
        var allParams='?id='+this.delId
        goodRecycle(allParams).then((res) => {
          console.log(res)
          if (res.msg === "ok") {
           this.$message({
            message: '加入成功',
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

      cellclick(row, column, cell, event){
      // console.log(row, column, cell, event)
      // console.log([cell][0].innerText)
      this.editable =true
    },


    submit(){
      this.editable =false
    }
  },

  mounted: function () {
    this.getlist();
    this.checkPer()
  }
}
</script>


<style scoped>
.icon{
  width: 20px;
  height: 20px;
  margin: 2px;
}
/*.el-button+.el-button {
  margin-left: 0px;
  }*/
  .seeimg{
    max-width: 150px;
    max-height: 150px;
  }
/*.el-form-item {
 margin-bottom: 0px!important;
 }*/
</style>