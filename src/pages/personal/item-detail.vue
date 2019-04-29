<!--奖品详情-->
<template>
<div v-loading="initLoading" style="min-height:500px">
  <div class="itemWrap" v-if="formData">
    <div class="itemDesc">
      <div class="itemPic">
        <img :src="`http://s1.jiguo.com/${formData.cover}`" alt="">
      </div>
      <div class="itemText">
        <div class="text" v-for="item in formData.meta_list">
          <span class="ft20 fc">{{item.title}}</span>
          <span class="ft16"><strong>奖品数量：{{item.num}}</strong></span>
        </div>
      </div>
    </div>

    <div class="describe">
      <div class="descTitle">
        <strong class="ft20">抽奖说明</strong>
      </div>
      <div class="descContent mt20">
        <span class="ft16 ">{{formData.detail}}</span>
      </div>
    </div>

    <div class="userInfo">
      <div class="awardType ">
        <div class="type w280"><strong>发起人：</strong><span class="ml40">{{formData.username}}</span></div>
      </div>
      <div class="awardType ">
        <div class="type w280"><strong>uid：</strong><span class="ml40">{{formData.uid}}</span></div>
      </div>
      <div class="awardType ">
        <div class="type w300"><strong>发起时间：</strong><span class="ml40">{{formData.online_time}}</span></div>
      </div>
      <div class="awardType " v-if="formData.is_share==1">
        <div class="type w300"><strong>手机号：</strong><span class="ml40">{{formData.user_tel}}</span></div>
      </div>
      <div class="awardType ">
        <div class="type w300" v-if="formData.type==1"><strong>开奖方式：</strong><span class="ml40">按时间自动开奖</span></div>
        <div class="type w300" v-if="formData.type==2"><strong>开奖方式：</strong><span class="ml40">按人数自动开奖</span></div>
        <div class="type w300" v-if="formData.type==3"><strong>开奖方式：</strong><span class="ml40">手动开奖</span></div>
      </div>
      <div class="awardTime">
        <div class="type w300"><strong>开奖时间：</strong><span class="ml40">{{formData.lottery_time}}</span></div>
        <div class="type w300"><strong>开奖人数：</strong><span class="ml40">{{formData.apply_num}}</span></div>
      </div>
    </div>
  </div>
</div>

</template>

<script>
  import {getLotteryList, subSend} from '@/api/draw'
  import {getInfo} from '@/api/draw'
  import {getItemData} from "@/api/draw"

  export default {
    data() {
      return {
        initLoading: false,
        formData: null,
      }
    },
    created() {
      this._getInfo()
    },
    methods: {
      _getInfo() {
        const params = {
          id: this.$route.params.id      //当前路由上的id值
        }
        this.initLoading = true
        getItemData({  //draw中定义的方法
          params: params
        }).then(res => {
          this.initLoading = false
          if (res.resultCode === '0') {
            this.formData = res.result
          }
        })
      }
    },
  }
</script>

<style lang="less">
  .itemDesc {
    width: 100%;
  }

  .text {
    width: 800px;
    height: 40px;
    line-height: 40px;
    margin-bottom: 40px;
    display: flex;
    justify-content:space-between;
    align-content: center;
  }

  .itemPic {
    width: 700px;
    height: 400px;
    margin-bottom: 40px;
    img {
      width: 100%;
    }
  }

  .describe {
    margin-bottom: 50px;
  }

  .awardType {
    height: 100px;
  }

  .type {
    float: left;
    height: 50px;
    line-height: 50px;
    text-align: left;
  }

  .awardTime {
    height: 50px;
  }
</style>
