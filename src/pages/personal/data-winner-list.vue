<!--中奖名单-->
<template>
  <div class="winner-list">
    <el-table
      :data="meta_list.data"
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
    <el-row class="Z-row" v-if="meta_list.team_num>0">组队上限人数{{meta_list.team_num}}人</el-row>
    <el-row class="mt30 table-header clear">
      <el-select v-model="search.mid"
                 size="small"
                 @change="changeMeta">
        <el-option
          label="全部奖项名单"
          value="">
        </el-option>
        <el-option
          v-for="item in meta_list.data"
          :key="item.id"
          :label="item.title"
          :value="item.id">
        </el-option>
      </el-select>
      <!--<div class="r">-->
        <!--<el-button size="small" @click="exportSelectionExcel">导出选中信息</el-button>-->
        <!--<el-button class="ml20" size="small" @click="_getLotteryList(true)">导出全部信息</el-button>-->
        <!--<el-button class="ml20" size="small" :loading="isSendPush" @click="sendPush">提醒所有未填写用户</el-button>-->
      <!--</div>-->
    </el-row>
    <el-table
      :data="winner_list"
      :header-cell-style="{backgroundColor:'#f5f7fa',fontSize:'14px',color:'#000'}"
      style="width: 100%;font-size: 12px;"
      v-if="winner_list.length"
      @selection-change="selectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="用户名">
        <template slot-scope="scope">
          <div class="flex-right-auto" style="align-items: center;">
            <img width="32px" :src="scope.row.user_info.avatar" :alt="scope.row.user_info.username">
            <span class="flex-right ml5">{{scope.row.user_info.username}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="uid"
        label="uid">
      </el-table-column>
      <el-table-column
        prop="title"
        label="奖品">
      </el-table-column>
      <el-table-column
        width="220px"
        label="收货信息">
        <template slot-scope="scope">
          <div v-if="scope.row.express_note">{{scope.row.express_note}}</div>
          <div v-else>
            <p class="flex-right-auto">
              <span class="gray">姓名：</span>
              <span class="flex-right">{{scope.row.receive_address.userName}}</span>
            </p>
            <p class="flex-right-auto">
              <span class="gray">手机：</span>
              <span class="flex-right">{{scope.row.receive_address.telNumber}}</span>
            </p>
            <p class="flex-right-auto">
              <span class="gray">地址：</span>
              <span
                class="flex-right">{{scope.row.receive_address.provinceName + scope.row.receive_address.cityName + scope.row.receive_address.countyName + scope.row.receive_address.detailInfo
                }}</span>
            </p>
            <p class="flex-right-auto">
              <span class="gray">备注：</span>
              <span class="flex-right">{{scope.row.receive_remarks}}</span>
            </p>
          </div>
        </template>
      </el-table-column>
      <!--<el-table-column-->
        <!--label="快递信息">-->
        <!--<template slot-scope="scope">-->
          <!--<div v-if="scope.row.send_order">-->
            <!--<p>{{scope.row.send_company}}</p>-->
            <!--<p>{{scope.row.send_order}}</p>-->
          <!--</div>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--label="操作">-->
        <!--<template slot-scope="scope">-->
          <!--<p class="gray"-->
             <!--v-if="scope.row.is_notice==='1' && scope.row.express_note && !scope.row.send_company"-->
          <!--&gt;已提醒用户</p>-->
          <!--<p class="gray"-->
             <!--v-if="scope.row.is_notice==='2' && scope.row.express_note && !scope.row.send_company"-->
          <!--&gt;提醒失败</p>-->
          <!--<el-button v-if="!scope.row.express_note && !scope.row.send_order"-->
                     <!--type="text"-->
                     <!--@click="openSendLayer(scope.row)"-->
          <!--&gt;填写快递信息-->
          <!--</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>

    <!--分页-->
    <el-row class="mt30 tc" v-if="res_data && (res_data.count>res_data.size)">
      <el-pagination
        @current-change="handleCurrentChange"
        :background="true"
        :current-page="Number(res_data.page)"
        :page-size="Number(res_data.size)"
        layout="total, prev, pager, next, jumper"
        :total="Number(res_data.count)">
      </el-pagination>
    </el-row>

    <!--填写快递信息-->
    <el-dialog
      class="flex-center"
      title="填写快递信息"
      top="0"
      width="420px"
      :visible="isSendLayer"
      :close-on-click-modal="false"
      @close="closeSendLayer">
      <div>
        <div class="Z-block-row">
          <span class="Z-name">快递公司：</span>
          <div class="Z-content">
            <el-input v-model="sendData.send_company"></el-input>
          </div>
        </div>
        <div class="Z-block-row">
          <span class="Z-name">快递单号：</span>
          <div class="Z-content">
            <el-input v-model="sendData.send_order"></el-input>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="closeSendLayer">取 消</el-button>
        <el-button type="primary"
                   :disabled="!hasSendData"
                   @click="subSendData">提交并通知用户
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getLotteryList, subSend, sendPushMsg} from '@/api/draw'

  export default {
    data() {
      return {
        search: {
          mid: '',  //奖品id
          lid: this.$route.params.id  //活动id
        },
        page: '',  //当前页码
        res_data: {}, //全部请求数据
        idAry: [],  //选中的中奖orderid
        cur_item: {}, //当前操作的中奖人信息
        meta_list: [],  //奖品列表
        winner_list: [],  //中奖名单
        isSendPush: false,  //是否发出提醒
        isSendLayer: false, //是否显示填写快递弹窗
        sendData: {
          send_company: '',  //快递公司
          send_order: ''  //快递单号
        }
      }
    },
    computed: {
      //  是否完整填写快递信息
      hasSendData() {
        if (this.sendData.send_company !== ''
          && this.sendData.send_order !== '') {
          return true
        } else {
          return false
        }
      }
    },
    created() {
      this._getLotteryList()
    },
    methods: {
      //获取中奖列表
      _getLotteryList(download = false, idAry = []) {
        let params = Object.assign(this.search, {
          size: this.res_data.size || 20,
          page: this.page || 1
        })
        download ? params.download = true : params.download = ''
        if (idAry.length) params.idAry = idAry

        getLotteryList({
          params: params
        }).then(res => {
          if (!download) {
            if (res.resultCode === '0') {
              this.res_data = res.result
              this.meta_list = res.result.meta_list
              this.winner_list = res.result.data
            } else {
              this.$message.error(res.errorMsg)
            }
          }
        })
      },
      //切换奖品
      changeMeta() {
        this._getLotteryList()
      },
      //发送提醒push
      sendPush() {
        const params = {
          lid: this.$route.params.id
        }
        this.isSendPush = true
        sendPushMsg({
          params: params
        }).then(res => {
          this.isSendPush = false
          if (res.resultCode === '0') {
            this.$message.success(res.errorMsg)
            this._getLotteryList()
          } else {
            this.$message.error(res.errorMsg)
            this._getLotteryList()
          }
        })
      },
      //更新选中项
      selectionChange(val) {
        this.idAry = val.map(item => {
          return item.orderid
        })
      },
      //导出选中信息
      // exportSelectionExcel() {
      //   this._getLotteryList(true, this.idAry)
      // },
      //打开填写快递弹窗
      openSendLayer(item) {
        this.cur_item = item
        this.isSendLayer = true
      },
      //提交快递信息
      subSendData() {
        const params = Object.assign(this.sendData, {
          orderid: this.cur_item.orderid
        })

        subSend({
          params: params
        }).then(res => {
          if (res.resultCode === '0') {
            this.$message.success('提交成功')
            this.closeSendLayer()
            this._getLotteryList()
          } else {
            this.$message.error(res.errorMsg)
          }
        })
      },
      //关闭填写快递弹窗
      closeSendLayer() {
        this.isSendLayer = false
        this.cur_item = {}
        this.sendData.send_company = ''
        this.sendData.send_order = ''
      },
      //翻页
      handleCurrentChange(val) {
        this.page = val
        this._getLotteryList()
      }
    }
  }
</script>

<style lang="less">
  .winner-list {
    .table-header {
      background-color: #CEE1F5;
      height: 42px;
      padding: 5px;
    }
  }
</style>
