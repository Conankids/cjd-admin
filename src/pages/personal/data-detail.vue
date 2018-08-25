<!--数据概况-->
<template>
  <div class="draw-statistics" >
    <el-row class="Z-row detail-list">
      <div class="detail-item" v-for="(item,index) in statistics" :key="index">
        <h4>{{item.num}}</h4>
        <p>{{item.text}}</p>
      </div>
    </el-row>
    <el-row class="tips-wrap">
      <h4>名词解释：</h4>
      <ul class="mt10 pl15">
        <li>发起数：发起个人抽奖活动数</li>
        <li>参与数：参与个人抽奖的人数</li>
        <li>平均参与数：参与数/发起数</li>
      </ul>
    </el-row>
  </div>
</template>

<script>
  import {getData} from '@/api/draw'

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
              in_num: item.in_num,
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
              num: this.data.all.list_count,
              text: '总计发起数'
            },
            {
              num: this.data.all.apply_count,
              text: '总计参与人数'
            },
            {
              num: this.data.all.avg,
              text: '总计平均人参与数'
            },
            {
              num: this.data.today.list_count,
              text: '今日发起数'
            },
            {
              num: this.data.today.apply_count,
              text: '今日参与数'
            },
            {
              num: this.data.today.avg,
              text: '今日平均参与数'
            },
            {
              num: this.data.week.list_count,
              text: '近7天发起数'
            },
            {
              num: this.data.week.apply_count,
              text: '近7天参与数'
            },
            {
              num: this.data.week.avg,
              text: '近7天平均参与数'
            }
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
        getData({
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

<style lang="less" scoped>
  .draw-statistics {
    .table-header {
      background-color: #f5f7fa;
    }
    .detail-list {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      .detail-item {
        width: 30%;
        height: 140px;
        line-height: 70px;
        color: #000;
        text-align: center;
        padding: 20px;
        border-bottom: 1px solid #F2F2F2;
        h4 {
          font-size: 36px;
          line-height: 50px;
        }
      }
      .detail-item:nth-child(7),.detail-item:nth-child(8),.detail-item:nth-child(9){
        border-bottom: none;
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
