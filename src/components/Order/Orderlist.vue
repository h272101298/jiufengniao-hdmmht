<template>
  <el-row class="warp" style="padding:20px 0 0 20px;">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>购物订单</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">

      <el-form :inline="true">

        <el-form-item label="订单类型：">
          <el-select v-model="filter.type" placeholder="全部订单" @change="changetype">
            <el-option label="全部订单" value=""></el-option>
            <el-option label="普通订单" value="origin"></el-option>
            <el-option label="拼团订单" value="group"></el-option>
            <el-option label="积分订单" value="score"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="订单状态：">
          <el-select v-model="filter.state" placeholder="全部订单" @change="changestate">
            <el-option label="全部状态" value=""></el-option>
            <el-option label="未付款" value="1"></el-option>
            <el-option label="待发货" value="2"></el-option>
            <el-option label="待收货" value="3"></el-option>
            <el-option label="已完成" value="4"></el-option>
            <el-option label="待退款" value="5"></el-option>
            <el-option label="退款成功" value="6"></el-option>
            <el-option label="拒绝退款" value="7"></el-option>

          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filter.search" placeholder="请输入订单号" style="min-width: 225px;" ></el-input>
        </el-form-item>

        <el-form-item>
          <div class="block">
            <span class="demonstration">请选择下单时间：</span>
            <el-date-picker v-model="filter1.date" type="daterange" range-separator="/" @change="getSTime" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getlist">搜索</el-button>
          <el-button size="small" @click="clear">清空</el-button>
        </el-form-item>
      </el-form>


      <el-table :data="list" border stripe size="small" id="out-table" style="width:95%;">
        <el-table-column prop="id" label="ID" width="100" align="center">
        </el-table-column>+
        <el-table-column prop="number" label="订单号" min-width="100" align="center">
        </el-table-column>

        <el-table-column prop="user_id" label="用户id" min-width="100" align="center">
        </el-table-column>
        <el-table-column prop="price" label="总计" min-width="150" align="center">
        </el-table-column>

        <el-table-column prop="type" label="订单类型" min-width="150" align="center">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.type=='origin'">普通订单</el-tag>
            <el-tag type="success" v-if="scope.row.type=='group'">拼团订单</el-tag>
            <el-tag type="warning" v-if="scope.row.type=='score'">积分订单</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="state" label="订单状态" min-width="200" align="center">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.state=='1'">未付款</el-tag>
            <el-tag type="primary" v-if="scope.row.state=='2'">待发货</el-tag>
            <el-tag type="warning" v-if="scope.row.state=='3'">待收货</el-tag>
            <el-tag type="success" v-if="scope.row.state=='4'">已完成</el-tag>
            <el-tag type="danger" v-if="scope.row.state=='5'">待退款</el-tag>
            <el-tag type="success" v-if="scope.row.state=='6'">退款成功</el-tag>
            <el-tag type="info" v-if="scope.row.state=='7'">拒绝退款</el-tag>

            <el-tag type="warning" v-if="scope.row.group && scope.row.group.state==1">拼团中</el-tag>
            <el-tag type="warning" v-if="scope.row.group && scope.row.group.state==2">拼团成功</el-tag>
            <el-tag type="warning" v-if="scope.row.group && scope.row.group.state==3">拼团失败</el-tag>

          </template>
        </el-table-column>

        <el-table-column prop="created_at" label="下单时间" min-width="200" align="center">
        </el-table-column>

        <el-table-column label="操作" min-width="300" align="center">
         <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleSee(scope.row)">订单详情</el-button>
          <el-button type="success" v-show="scope.row.type=='group' && scope.row.group.state==2 && scope.row.state=='2'" size="mini" @click="handleSend(scope.row)">发货</el-button>
          <el-button type="success" v-show="scope.row.type=='origin' && scope.row.state=='2'" size="mini" @click="handleSend(scope.row)">发货</el-button>
          <el-button type="success" v-show="scope.row.type=='score' && scope.row.state=='2'" size="mini" @click="handleSend(scope.row)">发货</el-button>

          <el-button type="success" size="mini" v-if="scope.row.state=='5'" @click="refundpass(scope.row)">同意退款</el-button>
          <el-button type="info" size="mini" v-if="scope.row.state=='5'" @click="refundrefuse(scope.row)">拒绝退款</el-button>

        </template>
      </el-table-column>
    </el-table>

    <el-pagination style="float:left;margin:20px 0 200px 0px;" :current-page="currentPage" :page-sizes="[20, 30, 40, 50,100,200]" :page-size="limit" @current-change="handleCurrentChange" @size-change="handleSizeChange" layout="total,sizes, prev, pager, next, jumper" :total="count" prev-text="上一页" next-text="下一页">
    </el-pagination>


    <!-- <el-button type="primary" style="float:left;margin:20px 50px;" size="small"><a style="color:#fff;" :href="orderexcel" download="" mce_href="#">导出Excel表</a></el-button> -->
  </el-col>


  <el-col>
    <el-dialog title="快递信息" :visible.sync="dialogSendVisible" width="800px" center>
      <el-form :model="kuaidi" ref="kuaidi" label-width="120px" :rules="sendrule">
        <el-form-item label="快递名称：" label-width="120px" prop="express">

          <el-select v-model="kuaidi.express_id" placeholder="全部" @change="xzkauidi">
            <el-option v-for="item in expressarr" :label="item.title" :value="item.id" :key="item.id"></el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="快递单号：" label-width="120px" prop="express_number">
         <el-input v-model="kuaidi.express_number" placeholder="请输入快递单号" type="number"></el-input>
       </el-form-item>
       <el-button type="primary" size="small" @click="submitsend" style="margin-left: calc(50% - 28px);">提交</el-button>
     </el-form>
   </el-dialog>
 </el-col>


 <el-col>
  <el-dialog title="订单详情" :visible.sync="dialogSeeVisible" width="1200px" center>
    <el-form label-position="right" label-width="110px" size="mini">

      <el-form-item label="订单状态：" class="fw6">
        <el-tag type="danger" v-if="currow.state=='1'" class="fw4">未付款</el-tag>
        <el-tag type="primary" v-if="currow.state=='2'" class="fw4">待发货</el-tag>
        <el-tag type="warning" v-if="currow.state=='3'" class="fw4">待收货</el-tag>
        <el-tag type="success" v-if="currow.state=='4'" class="fw4">已完成</el-tag>
        <el-tag type="info" v-if="currow.state=='5'" class="fw4">已取消</el-tag>
      </el-form-item>


      <el-form-item label="总计：" class="fw6">
        <div class="fw4" v-if="currow.type!=='score'">￥{{currow.price}}</div>
        <div class="fw4" v-if="currow.type=='score'">{{currow.price}}积分</div>
      </el-form-item>

      <el-form-item label="物流信息：" class="fw6" v-show="currow.state=='3' || currow.state=='4'">
        <div class="fw4" v-if="currow.express">快递公司： {{currow.express.title}}</div>
        <div class="fw4">快递编号： {{currow.express_number}}</div>
      </el-form-item>

      <el-form-item label="用户名称：" class="fw6">
        <div style="display: flex;align-items: center;;">
          <img :src="currow.user.avatarUrl" style="width:60px;height:60px;border-radius: 50%" />
          <span class="fw4" style="margin-left: 15px">{{currow.user.nickname}}</span>
        </div>
      </el-form-item>

      <el-form-item label="收货信息：" class="fw6">
        <div class="fw4">姓名： {{currow.address.name}}</div>
        <div class="fw4">电话： {{currow.address.phone}}</div>
        <div class="fw4">地址： {{currow.address.city}}{{currow.address.address}}</div>

      </el-form-item>

      <el-form-item label="商品信息：" class="fw6">

        <el-table :data="[currow.product]" border stripe size="mini" id="out-table">
          <el-table-column label="商品缩略图" width="100" align="center">
            <template slot-scope="scope">
              <img :src="currow.picture" style="max-width:80px;max-height:64px;" />
            </template>
          </el-table-column>

          <el-table-column label="商品名称" min-width="100" align="center">
           <template slot-scope="scope">
            <p class="fw4" v-if="currow.type=='score'">{{scope.row.title}}</p>
            <p class="fw4" v-if="currow.type!=='score'">{{scope.row.name}}</p>
          </template>
        </el-table-column>

        <el-table-column label="单价" min-width="100" align="center">
         <template slot-scope="scope">
          <p class="fw4" v-if="currow.type!=='score'">￥{{scope.row.price}}</p>
          <p class="fw4" v-if="currow.type=='score'">{{scope.row.score}}积分</p>
        </template>
      </el-table-column>

      <el-table-column label="数量" min-width="100" align="center">
       <template slot-scope="scope">
        <p class="fw4">{{currow.number}}</p>
      </template>
    </el-table-column>

  </el-table>
</el-form-item>



</el-form>
</el-dialog>
</el-col>


<el-col>
  <el-dialog title="操作不可恢复，是否确定退款？" :visible.sync="dialogDelVisible" width="30%">
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitdel()">确 定</el-button>
      <el-button @click="dialogDelVisible = false">取 消</el-button>
    </div>
  </el-dialog>
</el-col>



</el-row>
</template>

<script>

  import { allorderGet } from '../../api/api';
  import { oneorderGet } from '../../api/api';
  import { shipgoods } from '../../api/api';
  import { deliveryGet } from '../../api/api';
  import { refund } from '../../api/api';

  import hosturl from '../../api/api';


  import { Message } from 'element-ui';


  // import FileSaver from 'file-saver'
  // import XLSX from 'xlsx'


  export default {
    data() {
      return {
        list:[],
        currentPage: 1,
        count:0,
        limit:20,
        dialogSeeVisible:false,
        dialogSendVisible:false,
        dialogDelVisible:false,
        filter:{
          search:'',
          state:'',
          start:'',
          end:'',
          type:''
        },
        filter1:{
          date:''
        },

        sendId:'',
        expressarr:[],

        kuaidi:{
          express_id:'',
          express_number:''
        },
        sendrule:{
          // express: [
          // {required: true, message: '请选择快递公司', trigger: 'change'},
          // ],
          express_number: [
          {required: true, message: '请输入快递单号', trigger: 'blur'},
          ],
        },

        checkper1:false,

        currow:{
          express:{
            title:''
          },
          id: 0,
          number: "",
          price: "",
          state: "",
          user: {
           nickname: "",
           avatarUrl: "",
         },
         store: {
           name: "",
           manager: "",
         },
         address: [{
           id: 0,
           order_id: 0,
           name: "",
           phone: "",
           address: "",
           zip_code: "",
         }],
       },

       orderexcel:'',
     };
   },

   methods:{
    checkPer(){
      var per = sessionStorage.getItem('permissions');

      if(per.indexOf('orderListDo')>-1){
        this.checkper1=true;
      }

    },


    getlist(){
      var allParams = '?page='+ this.currentPage + '&limit=' + this.limit+ '&search=' + this.filter.search+'&start=' + this.filter.start+'&end=' + this.filter.end+'&state='+this.filter.state+'&type='+this.filter.type;
      allorderGet(allParams).then((res) => {
        this.list=res.data.data;
        this.count=res.data.count

        // console.log(hosturl+'v3'+'/export/orders'+'?page=1')

        this.orderexcel=hosturl+'v3'+'/export/orders'+'?page='+ this.currentPage + '&limit=' + this.limit+ '&search=' + this.filter.search+'&start=' + this.filter.start+'&end=' + this.filter.end+'&state='+this.filter.state+'&type='+this.filter.type
      });
    },

   //  exportExcel () {
   //   var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
   //   var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
   //   try {FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '购物订单.xlsx')}
   //   catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
   //   return wbout
   // },

   getSTime(val){
    this.filter.start=val[0];
    this.filter.end=val[1];
    console.log(this.filter)
      // this.getlist();
    },

    changetype(val){
      this.filter.type=val;
      this.getlist();
    },

    changestate(val){
      this.filter.state=val;
      this.getlist();
    },

    clear(){
      this.filter={
        search:'',
        state:'',
        start:'',
        end:'',
        type:''
      }
      this.filter1={
        date:''
      }
      this.getlist();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getlist();
    },

    handleSizeChange(val){
      this.limit = val;
      this.getlist();
    },



    handleSee(row){
      var allParams = '?id='+row.id;
      oneorderGet(allParams).then((res) => {
        // console.log(res.data)
        this.currow=res.data;
      });

      this.dialogSeeVisible = true;
    },

    getexpress(){
      var allParams = '?page=1&limit=10000';
      deliveryGet(allParams).then((res) => {
        this.expressarr=res.data.data;
      });
    },

    xzkauidi(val){
      this.kuaidi.express_id=val
    },

    handleSend(row){
      this.kuaidi={
        id:row.id,
        express_id:'',
        express_number:''
      }
      this.dialogSendVisible = true;
    },

    submitsend(){
      var that =this;
      that.$refs.kuaidi.validate((valid) => {
        if (valid) {
          var allParams = that.kuaidi;
          console.log(allParams)
          shipgoods(allParams).then((res) => {
            // console.log(res)
            this.getlist();
            this.$message({
              message: '提交成功',
              type: 'success'
            });
            this.dialogSendVisible = false;
          });
        }else{
          return false;
        }
      })
    },

    refundpass(row) {
      this.dialogDelVisible = true;
      this.delId = row.id;
      this.refundtype=1
    },

    refundrefuse(row) {
      this.dialogDelVisible = true;
      this.delId = row.id;
      this.refundtype=2
    },

    submitdel(){
      if(this.refundtype==1){
       const loading = this.$loading({
        lock: true,
        text: '退款中，请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
       var allParams={
        id:this.delId,
        pass:1
      }

      refund(allParams).then((res) => {
        if (res.msg === "ok") {
         this.$message({
          message: '退款成功',
          type: 'success'
        });
         loading.close();
         this.getlist();
         this.dialogDelVisible = false;
       } else {
         loading.close();
         this.$message({
          message: res.msg,
          type: 'error'
        });
       }
     })
    }else{
     var allParams={
      id:this.delId,
      pass:2
    }
    refund(allParams).then((res) => {
      if (res.msg === "ok") {
       this.$message({
        message: '退款成功',
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
   })
  }
},


},

mounted: function () {
  this.getlist();
  this.getexpress();
  // this.checkPer();
}
}
</script>

<style>

</style>