<template>
 <el-row class="warp" style="padding:20px 0 0 20px;">
  <el-col :span="24" class="warp-breadcrum">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
      <el-breadcrumb-item>基本设置</el-breadcrumb-item>
    </el-breadcrumb>
  </el-col>


  <el-col :span="24" class="warp-main">
    <el-row>

      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="签到设置" name="list">

          <el-form ref="signset" :model="signset" label-width="160px" class="form" status-icon size="small" style="width:600px;" :rules="signrule">

            <el-form-item label="连续签到1天奖励：" prop="onnum">
              <el-input class="numinput" placeholder="请输入奖励数量" v-model="signset.onnum" v-show="show" ><template slot="append">积分</template></el-input>
              <div v-show="set" class="showlabel">
                <label v-show="set">{{signdata[0].reward}}积分</label>
              </div>
            </el-form-item>

            <el-form-item label="连续签到2天奖励：" prop="twnum">
              <el-input class="numinput" placeholder="请输入奖励数量" v-model="signset.twnum" v-show="show" ><template slot="append">积分</template></el-input>
              <div v-show="set" class="showlabel">
                <label v-show="set">{{signdata[1].reward}}积分</label>
              </div>
            </el-form-item>

            <el-form-item label="连续签到3天奖励：" prop="trnum">
              <el-input class="numinput" placeholder="请输入奖励数量" v-model="signset.trnum" v-show="show" ><template slot="append">积分</template></el-input>
              <div v-show="set" class="showlabel">
                <label v-show="set">{{signdata[2].reward}}积分</label>
              </div>
            </el-form-item>

            <el-form-item label="连续签到4天奖励：" prop="fonum">
              <el-input class="numinput" placeholder="请输入奖励数量" v-model="signset.fonum" v-show="show" ><template slot="append">积分</template></el-input>
              <div v-show="set" class="showlabel">
                <label v-show="set">{{signdata[3].reward}}积分</label>
              </div>
            </el-form-item>

            <el-form-item label="连续签到5天奖励：" prop="finum">
              <el-input class="numinput" placeholder="请输入奖励数量" v-model="signset.finum" v-show="show" ><template slot="append">积分</template></el-input>
              <div v-show="set" class="showlabel">
                <label v-show="set">{{signdata[4].reward}}积分</label>
              </div>
            </el-form-item>

            <el-form-item label="连续签到6天奖励：" prop="sinum">
              <el-input class="numinput" placeholder="请输入奖励数量" v-model="signset.sinum" v-show="show" ><template slot="append">积分</template></el-input>
              <div v-show="set" class="showlabel">
                <label v-show="set">{{signdata[5].reward}}积分</label>
              </div>
            </el-form-item>

            <el-form-item label="连续签到7天奖励：" prop="senum">
              <el-input class="numinput" placeholder="请输入奖励数量" v-model="signset.senum" v-show="show"><template slot="append">积分</template></el-input>
              <div v-show="set" class="showlabel">
                <label v-show="set">{{signdata[6].reward}}积分</label>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button v-if="set" size="small" type="primary" style="margin-left:0px;margin-top:20px;" @click="changebase" >编辑</el-button>
              <el-button v-if="show" size="small" type="primary" style="margin-left:0px;margin-top:20px;" @click="confirmqd">提交</el-button>
              <el-button v-if="show" size="small" @click="cancelqd">取消</el-button>
            </el-form-item>
          </el-form>

        </el-tab-pane>

        <el-tab-pane label="其它设置" name="config">

          <el-form ref="scoredata" :model="scoredata" label-width="160px" class="form" status-icon size="small" style="width:600px;">

            <el-form-item label="发布获得积分：" prop="add_score">
              <el-input style="width: 300px;" placeholder="请输入积分数量" v-model="scoredata.add_score"></el-input>
              <el-button style="margin-left: 10px;" size="small" type="primary" @click="postscore('add_score')">提交</el-button>
            </el-form-item>

            <el-form-item label="购物获得比例：">
              <el-input style="width: 300px;" placeholder="请输入百分比" v-model="scoredata.buy_score"><template slot="append">%</template></el-input>
              <el-button style="margin-left: 10px;" size="small" type="primary" @click="postscore('buy_score')">提交</el-button>
            </el-form-item>

            <el-form-item label="拼团限时：">
              <el-input style="width: 300px;" placeholder="请输入拼团限时" v-model="scoredata.grouptime"><template slot="append">小时</template></el-input>
              <el-button style="margin-left: 10px;" size="small" type="primary" @click="postscore('grouptime')">提交</el-button>
            </el-form-item>

          </el-form>
        </el-tab-pane>



      </el-tabs>

    </el-row>
  </el-col>


</el-row>
</template>



<script>


  import { signPost } from '../../api/api';
  import { signGet } from '../../api/api';

  import {  configPost } from '../../api/api';
  import {  configsGet } from '../../api/api';

  import { Message } from 'element-ui';

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
            callback(new Error('请输入整数'));
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
        // activeName:'config',

        show:false,
        set:true,

        signset:{
          onnum:'',
          ontype:'积分',
          twnum:'',
          twtype:'积分',
          trnum:'',
          trtype:'积分',
          fonum:'',
          fotype:'积分',
          finum:'',
          fitype:'积分',
          sinum:'',
          sitype:'积分',
          senum:'',
          setype:'积分',
        },

        signdata:[{
          reward:0,type:1
        },{
          reward:0,type:1
        },{
          reward:0,type:1
        },{
          reward:0,type:1
        },{
          reward:0,type:1
        },{
          reward:0,type:1
        },{
          reward:0,type:1
        },],

        signrule:{
          onnum:[{required: true, trigger: 'blur',validator: checkvalue}],
          twnum:[{required: true, trigger: 'blur',validator: checkvalue}],
          trnum:[{required: true, trigger: 'blur',validator: checkvalue}],
          fonum:[{required: true, trigger: 'blur',validator: checkvalue}],
          finum:[{required: true, trigger: 'blur',validator: checkvalue}],
          sinum:[{required: true, trigger: 'blur',validator: checkvalue}],
          senum:[{required: true, trigger: 'blur',validator: checkvalue}]
        },

        scoreshow:false,
        scoreset:true,
        scoredata:{
          add_score:'',
          buy_score :'',
          grouptime:''
        },

      };
    },

    methods:{
      getsign(){
        var allParams = '';
        signGet(allParams).then((res) => {
          if(res.data==''){
            this.show=true
            this.set=false
          }else{
            this.signdata=res.data
          }
        });
      },

      changebase(){
        this.show=true
        this.set=false
      },

      confirmqd(){
        this.$refs.signset.validate((valid) => {
          if (valid) {

            var allParams={
              configs:[{days:1,type:1,reward:this.signset.onnum},
              {days:2,type:1,reward:this.signset.twnum},
              {days:3,type:1,reward:this.signset.trnum},
              {days:4,type:1,reward:this.signset.fonum},
              {days:5,type:1,reward:this.signset.finum},
              {days:6,type:1,reward:this.signset.sinum},
              {days:7,type:1,reward:this.signset.senum}
              ]
            }
            signPost(allParams).then((res) => {
              if (res.msg === "ok") {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.getsign()
                this.show=false
                this.set=true
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

      cancelqd(){
        this.show=false
        this.set=true
        this.$refs.signset.clearValidate();
      },







      getscore(){
        var allParams=""
        configsGet(allParams).then((res) => {
          // console.log(res.data)

          this.scoredata.add_score=res.data[2].content
          this.scoredata.buy_score=res.data[3].content
          this.scoredata.grouptime=res.data[1].content
        });
      },

      jifenkg(val){
        this.showjifen=val
        // console.log(val)
        if(val==2){
         var allParams={
          state:0,
        }
        integralPost(allParams).then((res) => {});
      }
    },

    changescore(){
      this.scoreshow=true
      this.scoreset=false
    },

    postscore(e){

      if(e=='add_score'){
        if (this.scoredata.add_score) {
          var allParams={
            title:e,
            content:this.scoredata.add_score
          }
        }else{
         this.$message({
          message: '请输入积分数量',
          type: 'error'
        });
         return
       }
     }else if(e=='buy_score'){
      if (this.scoredata.buy_score) {
        var allParams={
          title:e,
          content:this.scoredata.buy_score
        }
      }else{
       this.$message({
        message: '请输入百分比',
        type: 'error'
      });
       return
     }
   }else if(e=='grouptime'){
    if (this.scoredata.grouptime) {
      var allParams={
        title:e,
        content:this.scoredata.grouptime
      }
    }else{
     this.$message({
      message: '请输入拼图限时',
      type: 'error'
    });
     return
   }
 }

 configPost(allParams).then((res) => {

  if (res.msg === "ok") {
   this.$message({
    message: '提交成功',
    type: 'success'
  });
   this.getscore();
 }
});
},

},

mounted: function(){
  this.getsign();
  this.getscore();

}
}
</script>

<style scoped>
  .grey{
    color: #aaa;
    float: left;
  }
  .numinput{
    width: 320px;
  }
  .mt5{
    float: right;
  }

  .showlabel{
    width:320px;
    border-radius: 4px;
    border: 1px solid #00BB29;
    padding-left: 8px;
  }

  #bgw1,#bgw2 {
    color: #000!important;
  }

</style>