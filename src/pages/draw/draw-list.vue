<template>
  <div class="list-wrap">
    <Search :page_type="type" :page_title="pageTitle"/>
    <div class="list-box"
         v-loading="isLoading"
         element-loading-text="拼命加载中">
      <ul class="list" v-if="drawList">
        <ListItem v-for="(item,index) in drawList.data"
                  :key="index"
                  :listItem="item"
                  :page_type="type">
          <div slot="content">
            <span>开奖：{{item.lottery_time}}</span>
            <span class="ml10">条件：{{item.apply_condition_tips}}</span>
            <span class="ml10"
                  v-if="item.admin_type==2">{{item.is_team === '1' ? `可组${item.team_num}人队` : '不可组队'}}</span>
          </div>
          <div slot="bottom">
            <div class="gray"></div>
            <div class="item-control">
              <el-tooltip content="中奖名单"
                          placement="top">
                <router-link :to="{name:'draw_winnerlist',params:{id:item.id}}"
                             target="_blank">
                  <el-button icon="font-icon-user-list" size="small" circle></el-button>
                </router-link>
              </el-tooltip>
              <el-tooltip content="活动数据"
                          placement="top">
                <router-link :to="{name:'draw_statistics',params:{id:item.id}}"
                             target="_blank">
                  <el-button icon="font-icon-Statistics" size="small" circle></el-button>
                </router-link>
              </el-tooltip>
              <el-tooltip content="小程序码"
                          placement="top"
                          v-if="/(online)/.test(type)">
                <el-button icon="font-icon-qrcode" size="small" circle
                           @click.prevent="showCode(item)"></el-button>
              </el-tooltip>
              <el-tooltip content="排序值"
                          placement="top"
                          v-if="/(online)/.test(type)">
                <el-button icon="font-icon-sort" size="small" circle
                           @click.prevent="showSortCode(item)"></el-button>
              </el-tooltip>
              <el-tooltip content="上线"
                          placement="top"
                          v-if="/(check|timing)/.test(type)">
                <el-button icon="font-icon-up" size="small" circle
                           @click.prevent="online(item.id)"></el-button>
              </el-tooltip>
              <el-tooltip content="下线"
                          placement="top"
                          v-if="/online/.test(type)">
                <el-button icon="font-icon-down" size="small" circle
                           @click.prevent="offlineLayer(item)"></el-button>
              </el-tooltip>
              <el-tooltip content="删除"
                          placement="top">
                <el-button icon="el-icon-close" size="small" circle
                           @click.prevent="delItem(item)"></el-button>
              </el-tooltip>
              <!--<el-tooltip content="复制活动"-->
              <!--placement="top">-->
              <!--<router-link :to="`/draw/copy/${item.id}`"-->
              <!--target="_blank">-->
              <!--<el-button icon="font-icon-copy" size="small" circle></el-button>-->
              <!--</router-link>-->
              <!--</el-tooltip>-->
            </div>
          </div>
        </ListItem>
        <el-row class="red mt20" v-if="!isLoading && !drawList.data.length">暂时没有活动...</el-row>
      </ul>
      <el-row class="mt30 tc" v-if="drawList && (drawList.count>drawList.size)">
        <el-pagination
          @current-change="handleCurrentChange"
          :background="true"
          :current-page="Number(drawList.page)"
          :page-size="Number(drawList.size)"
          layout="total, prev, pager, next, jumper"
          :total="Number(drawList.count)">
        </el-pagination>
      </el-row>
    </div>
    <el-dialog
      class="flex-center"
      title="小程序二维码"
      top="0"
      width="420px"
      :visible="isShowQrcode"
      :close-on-click-modal="false"
      @close="closeQrcodeLayer">
      <div class="tc"
           v-loading="!qrcode"
           element-loading-spinner="el-icon-loading"
           style="min-height: 200px">
        <img v-show="qrcode" :src="qrcode" width="150">
        <div class="tl">
          <p>小程序页面路径：</p>
          <p class="wxcode-url">
            <span>{{wxcode_url}}</span>
            <el-button
              type="text"
              size="mini"
              v-clipboard:copy="wxcode_url"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError">复制
            </el-button>
          </p>
        </div>
      </div>
    </el-dialog>

    <!--删除弹窗-->
    <el-dialog
      class="flex-center"
      title="提示"
      top="0"
      width="420px"
      :visible="isShowDel"
      :close-on-click-modal="false"
      @close="closeDelLayer">
      <div>
        <p>进行中的活动不允许删除</p>
        <el-checkbox v-model="isKnow">我已了解删除风险</el-checkbox>
      </div>
      <div slot="footer">
        <el-button type="primary"
                   :disabled="!isKnow"
                   @click="del">确认删除
        </el-button>
        <el-button @click="closeDelLayer">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import {online, offline, del, getCode, setSortCode} from '@/api/draw'
  import ListItem from './list-item'
  import Search from './draw-search'

  export default {
    props: {
      type: {
        type: String,
        default: ''
      },
      pageTitle: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        page: '', //当前页码
        item: '', //当前操作的活动数据
        qrcode: '', //二维码数据
        wxcode_url: '',  //小程序路径
        isKnow: false,  //删除弹窗是否知道
        isShowDel: false, //是否显示删除弹窗
        isShowQrcode: false //是否显示二维码弹窗
      }
    },
    computed: {
      //是否显示加载loading
      isLoading() {
        return this.$store.state.draw.isLoading
      },
      //抽奖活动列表数据
      drawList() {
        return this.$store.state.draw.list
      }
    },
    methods: {
      initList() {
        //请求列表数据
        const data = Object.assign(this.drawList.search, {
          page: this.page,
          size: this.drawList.size
        })
        this.$store.dispatch('getDrawList', data)
      },
      //删除活动(上线弹提示，未上线直接删除)
      delItem(item) {
        if (item.status === '1' && item.send_status === '0') {
          this.isShowDel = true
          this.item = item
        } else {
          this.$confirm('确认删除当前抽奖活动吗？', '提示', {
            confirmButtonText: '确认删除',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            del({
              params: {
                id: item.id
              }
            }).then(res => {
              if (res.resultCode === '0') {
                this.$message.success('删除成功')
                this.initList()
              } else {
                this.$message.error(res.errorMsg)
              }
            })
          }).catch(() => {
          })
        }
      },
      //删除活动(上线)
      del() {
        del({
          params: {
            id: this.item.id
          }
        }).then(res => {
          if (res.resultCode === '0') {
            this.closeDelLayer()
            this.$message.success('删除成功')
            this.initList()
          } else {
            this.$message.error(res.errorMsg)
          }
        })
      },
      //上线活动
      online(id) {
        this.$confirm('你确定要上线该活动吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          online({
            params: {
              id: id
            }
          }).then(res => {
            if (res.resultCode === '0') {
              this.$message.success('上线成功')
              this.initList()
            } else {
              this.$message.error(res.errorMsg)
            }
          })
        }).catch(() => {
        })
      },
      //下线(进行中不允许下线)
      offlineLayer(item) {
        if (item.send_status !== '2') {
          this.$confirm('进行中的活动不允许下线', '提示', {
            confirmButtonText: '知道了',
            showCancelButton: false,
            type: 'warning'
          }).then(() => {
          }).catch(() => {
          })
        } else {
          this.$confirm('你确定下线该活动吗？', '提示', {
            confirmButtonText: '确认下线',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            offline({
              params: {
                id: item.id
              }
            }).then(res => {
              if (res.resultCode === '0') {
                this.$message.success('下线成功')
                this.initList()
              } else {
                this.$message.error(res.errorMsg)
              }
            })
          }).catch(() => {
          })
        }
      },
      //打开二维码弹窗
      showCode(item) {
        this.isShowQrcode = true
        getCode({
          params: {
            id: item.id
          }
        }).then(res => {
          this.qrcode = res.result.wxcode_qrcode_url
          this.wxcode_url = item.wxcode_url
        }).catch(() => {
        })
      },

      //关闭二维码弹窗
      closeQrcodeLayer() {
        this.isShowQrcode = false
        this.qrcode = ''
      },
      //复制成功回调
      onCopy() {
        this.$message.success('复制成功')
      },
      //复制失败回调
      onError() {
        this.$message.error('复制失败')
      },
      //关闭删除弹窗
      closeDelLayer() {
        this.isShowDel = false
        this.isKnow = ''
      },
      showSortCode(item) {
        this.$prompt('排序值越大越靠前', '设置排序值', {
          confirmButtonText: '保存',
          cancelButtonText: '取消',
          inputPattern: /\d/,
          inputErrorMessage: '排序值只能是数值',
          inputValue: item.listorder,
          inputPlaceholder: '请输入排序值'
        }).then(({value}) => {
          setSortCode({
            params:{
              id:item.id,
              listorder:value
            }
          }).then(res=>{
            if(res.resultCode==0){
              this.$message.success(res.errorMsg)
              this.initList()
            }else{
              this.$message.error(res.errorMsg)
            }
          })
        }).catch(() => {
        })
      },
      //翻页
      handleCurrentChange(val) {
        this.page = val
        this.initList()
      },
      ...mapActions([
        'getDrawList'
      ])
    },
    components: {
      Search,
      ListItem
    }
  }
</script>

<style lang="less">
  .list-wrap {
    .list-box, .list {
      min-height: 500px;
    }
    .list-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #dcdfe6;
      padding-bottom: 20px;
      h3 {
        font-size: 20px;
      }
    }
    .item-control {
      a + .el-button {
        margin-left: 10px;
      }
      .el-button + a {
        margin-left: 10px;
      }
      a + a {
        margin-left: 10px;
      }
    }
    .wxcode-url {
      font-size: 12px;
      padding: 0 5px;
      border-radius: 3px;
      background-color: #F2F2F2;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .el-button.default-button {
    color: #606266;
    background-color: transparent;
    border-color: #dcdfe6;
  }
</style>
