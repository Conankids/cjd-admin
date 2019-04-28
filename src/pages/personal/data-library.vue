<!--奖品列表-->
<template>
  <div class="list-wrap">
    <Search :page_type="type" :page_title="pageTitle" :homepage="is_homepage"/>

    <div class="list-box"
         v-loading="isLoading"
         element-loading-text="拼命加载中">
      <ul class="list" v-if="drawList">
        <ListItem v-for="(item,index) in drawList.data"
                  :key="index"
                  :listItem="item"
                  :page_type="type">
          <!-- 插槽功能 -->
          <div slot="content">
            <div class="width-con">
            <span class="is_test_phone" v-if="item.is_share==1">已验证手机号</span>
            <span :class="{'ml10':item.is_share==1}">开奖时间：{{item.lottery_time}}</span>
            <span class="ml10">发起者：{{item.username}}</span>
            <span class="ml10">uid：{{item.uid}}</span>
            </div>
          </div>
          <div slot="bottom">
            <div class="gray"></div>
            <div class="item-control">
              <!-- 首页个人页面的操作 -->
               <span v-if="is_homepage" class="mr10">
                <span v-show="item.is_home==1">
                  <el-tooltip content="审核"
                            placement="top"
                            >
                  <el-button icon="font-icon-check" size="small" circle
                            @click.prevent="checkPerApply(item)"></el-button>
                </el-tooltip>
               </span>
                
                <span v-show="item.is_home==2">
                  <el-tooltip content="撤下"
                            placement="top"
                            >
                  <el-button icon="font-icon-remove" size="small" circle
                            @click.prevent="removePerApply(item)"></el-button>
                  </el-tooltip>
                </span>

                <span class="ml10">
                  <el-tooltip content="排序值"
                              placement="top"
                              >
                    <el-button icon="font-icon-sort" size="small" circle
                              @click.prevent="showSortCode(item)"></el-button>
                  </el-tooltip>
                </span>

               </span>

              <el-tooltip content="中奖名单"
                          placement="top">
                <router-link :to="{name:'data_winnerlist',params:{id:item.id}}"
                             target="_blank">
                  <el-button icon="font-icon-user-list" size="small" circle></el-button>
                </router-link>
              </el-tooltip>
              <el-tooltip content="活动数据"
                          placement="top">
                <router-link :to="{name:'data_statistics',params:{id:item.id}}"
                             target="_blank">
                  <el-button icon="font-icon-Statistics" size="small" circle></el-button>
                </router-link>
              </el-tooltip>
              <el-tooltip content="小程序码"
                          placement="top"
                          >
                <el-button icon="font-icon-qrcode" size="small" circle
                           @click.prevent="showCode(item)"></el-button>
              </el-tooltip>
              <el-tooltip content="删除"
                          placement="top">
                <el-button icon="el-icon-close" size="small" circle
                           @click.prevent="delItem(item)"></el-button>
              </el-tooltip>
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

     <!-- 个人抽奖审核页面 -->
      <el-dialog title="审核" 
      :visible.sync="dialogCheck" 
       width="30%"
       >
        <el-form :model="checkForm">
          <el-form-item label="">
            <el-radio-group v-model="checkForm.is_affirm">
              <el-radio label="1" style="margin-right:200px">同意</el-radio>
              <el-radio label="2">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="">
            <el-input type="textarea"
             v-model="checkForm.desc"
             :rows="3"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:center">
            <el-button type="primary" style="width:140px;" @click="personSendInfo()">提交</el-button>
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
  import {online, offline, del, getCode,deletFromHome,addForHome,setSortCode} from '@/api/draw'
  import ListItem from './datalist-item'
  import Search from './data-search'


  export default {
    props: {
      type: {
        type: String,
        default: ''
      },
      pageTitle: {
        type: String,
        default: ''
      },
      //cece
      is_homepage:{
        type:String,
        default:''
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
        isShowQrcode: false ,//是否显示二维码弹窗
        uid:'',//发布用户id
        username:'',//发布者名字
        dialogCheck: false,//审核模板
        checkForm: {
          id:'',
          is_affirm: "1",//审核内容
          desc: "",//审核内容
        }
      }
    },
    computed: {
      //是否显示加载loading
      isLoading() {
        if(this.is_homepage){
          return this.$store.state.personApply.isLoading         
        }else{
          return this.$store.state.personal.isLoading
        }
      },
      //抽奖活动列表数据
      drawList() {
        if(this.is_homepage){
          return this.$store.state.personApply.list
        }else{
          return this.$store.state.personal.list
        }
      },
    },
    methods: {
      initList() {
          //请求列表数据
          const data = Object.assign(this.drawList.search, {
            page: this.page,
            size: this.drawList.size
          })
          if(this.is_homepage){
            this.$store.dispatch('personListForHome', data)
          }else{
            this.$store.dispatch('getPersonalList', data)
          }
      },
      delItem(item) {
        if (item.status === '1' && item.send_status === '0') {
          this.isShowDel = true
          this.item = item
        } else {
          this.$confirm('确认删除用户发起的活动吗？', '提示', {
            cancelButtonText: '取消',
            confirmButtonText: '确认并通知发起人',
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
      //cece审核个人抽奖
      checkPerApply(item){
       this.checkForm.id=item.id;
       this.dialogCheck = true;
      },
      personSendInfo() {
        addForHome({
          params:{
            id:this.checkForm.id,
            agree:this.checkForm.is_affirm,
            reason:this.checkForm.desc
          }
        }).then((res)=>{
            if(res.resultCode==0){
              this.$message.success(res.errorMsg);
              this.initList();
            }else{
              this.$message.error(res.errorMsg);
            }
           })
        this.dialogCheck = false;
     },
      //cece撤下个人抽奖
      removePerApply(item){
        this.$confirm("确定将抽奖从首页撤下？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            deletFromHome({
            params:{
              id:item.id,
            }
          }).then((res)=>{
              if(res.resultCode==0){
                this.$message.success(res.errorMsg);
                this.initList();
              }else{
                this.$message.error(res.errorMsg);
              }
            })
          })
          .catch(() => {
          
          });
      },
      //个人抽奖排序值
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
        'getPersonalList','personListForHome'
      ])
    },
    components: {
      Search,
      ListItem,
    },
    created(){
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
    .is_test_phone{
      border: 1px solid #999999;
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

  .width-con{
    height:20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
