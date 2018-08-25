<template>
  <div class="draw-statistics" v-if="data">
    <el-table
        :data="meta_list"
        :header-cell-style="{backgroundColor:'#f5f7fa'}"
        sum-text="总计"
        show-summary
        style="width: 100%">
      <el-table-column
          prop="title"
          label="奖品名称">
      </el-table-column>
      <el-table-column
          prop="num"
          label="预设奖品数量">
      </el-table-column>
      <el-table-column
          prop="in_num"
          label="实际奖品数量">
      </el-table-column>
    </el-table>
    <el-row class="Z-row" v-if="data.meta_info.team_num>0">组队上限人数{{data.meta_info.team_num}}人</el-row>
    <el-row class="Z-row detail-list">
      <div class="detail-item" v-for="(item,index) in statistics" :key="index">
        <h4>{{item.num}}</h4>
        <p>{{item.text}}</p>
      </div>
    </el-row>
    <el-row class="tips-wrap">
      <h4>名词解释：</h4>
      <ul class="mt10 pl15">
        <li>活动UV：活动详情页UV与组队转发页面UV之和</li>
        <li>报名人数：总共参与人数之和</li>
        <li>分享邀请人数：通过别人的分享链接、或者海报图参与的人数</li>
        <li>分享参与占比：分享邀请人数/报名人数</li>
        <!--<li>队伍平均人数：参与组队人数/队伍数</li>-->
        <!--<li>参与转化率：报名人数/活动UV</li>-->
        <!--<li>组队率：参与组队人数/报名人数</li>-->
      </ul>
    </el-row>
  </div>
</template>

<script>
  import {getShowData} from '@/api/draw'

  export default {
    data() {
      return {
        data: null
      }
    },
    computed: {
      meta_list() {
        if (this.data) {
          return this.data.meta_info.data.map(item => {
            return {
              title: item.title,
              num: item.num,
              in_num: item.in_num
            }
          })
        } else {
          return []
        }
      },
      statistics() {
        if (this.data) {
          return [
            {
              num: this.data.uv_total,
              text: '活动UV'
            },
            {
              num: this.data.user_total,
              text: '报名人数'
            },
            {
              num: this.data.team_user_total,
              text: '分享邀请人数'
            },
            {
              num: this.data.share_user_avg,
              text: '分享参与占比'
            },
            // {
            //   num: this.data.team_avg_user,
            //   text: '队伍平均数'
            // },
            // {
            //   num: this.data.conversion_rate,
            //   text: '参与转化率'
            // },
            // {
            //   num: this.data.team_rate,
            //   text: '组队转化率'
            // }
          ]
        } else {
          return []
        }
      }
    },
    created() {
      this._getShowData()
    },
    methods: {
      _getShowData() {
        const params = {
          id: this.$route.params.id
        }
        getShowData({
          params: params
        }).then(res => {
          if (res.resultCode === '0') {
            this.data = res.result
          } else {
            this.$message.error(res.errorMsg)
          }
        }).catch(err => {
        })
      }
    }
  }
</script>

<style lang="less">
  .draw-statistics {
    .table-header {
      background-color: #f5f7fa;
    }
    .detail-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .detail-item {
        width: 20%;
        color: #000;
        text-align: center;
        margin-bottom: 40px;
        h4 {
          font-size: 36px;
          line-height: 50px;
        }
      }
    }
    .tips-wrap {
      padding: 20px;
      color: #808080;
      background-color: #F2F2F2;
      h4 {
        font-size: 16px;
        color: #595959;
      }
    }
  }
</style>