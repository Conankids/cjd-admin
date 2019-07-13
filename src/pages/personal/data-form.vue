<!---->
<template>
  <el-form
    class="draw-form"
    :model="info"
    :rules="rules"
    ref="form"
    label-position="left"
    v-loading="isEdit && !isInit"
    element-loading-text="拼命加载中">

    <!--抽奖类型设置-->
    <el-form-item>
      <div class="typeSet ">
        <div class="typeTitle ft20">
          <strong>抽奖类型</strong>
        </div>
        <div class="typeList ">
          <div class="typeOne" v-for="(item,index) in options.adminTypeList" :key="index" :class="{choosed:choosed==item.type}" v-on:click="chooseType(item)">
            <div class="drawName ft16">
              <i class="ft24" :class="item.icon"></i>
              <strong><label>{{item.title}}</label></strong>
            </div>
            <div class="drawText"><strong>{{item.desc}}</strong></div>
          </div>
        </div>
      </div>
    </el-form-item>
    <div class="awardTitle ft20">
      <strong>抽奖信息设置</strong>
    </div>
    <!--上传封面图-->
    <el-form-item>
      <el-upload
        class="uploader"
        action="/admin/Lotterylist/UploadImg"
        accept="image/*"
        :show-file-list="false"
        :before-upload="uploadBannerBefore"
        :on-error="uploadBannerError"
        :on-success="uploadBannerSuccess">
        <div class="cover" v-loading="cover_loading">
          <div class="cover-pic" v-show="info.cover">
            <img :src="`http://s1.jiguo.com/${info.cover}`">
          </div>
          <div class="cover-desc" v-show="!info.cover">
            <img src="../../assets/icon-img.png">
            <p class="cover-title">上传封面图</p>
            <p class="cover-tips">建议尺寸1080x540像素</p>
          </div>
          <div class="cover-edit tc">
            <div class="crop" @click="crop">
              <i class="font-icon-crop"></i>
            </div>
            <div class="cover-change">
              <p>更换封面图</p>
              <p class="ft12">建议尺寸1080x540</p>
            </div>
          </div>
        </div>
      </el-upload>
    </el-form-item>

    <!--上线后不可更改字段-->
    <div v-if="isEdit && formData.status!=='0'">
      <el-row v-for="(item,index) in info.meta_list" :key="index">
        <el-form-item class="w500 iblock"
                      :prop="`meta_list.${index}.title`"
                      :rules="[{validator: title_rule, trigger: 'change'}]">
          <el-input class="event-title"
                    v-model="item.title"
                    placeholder="请输入奖品名称">
            <span :class="item.title.length>24?'red':''" slot="suffix">{{item.title.length}}/24</span>
          </el-input>
        </el-form-item>
        <span class="iblock ml20">奖品数量：{{item.num}}</span>
      </el-row>
    </div>
    <!--设置奖品名称-->
    <div v-else>
      <el-row v-for="(item,index) in info.meta_list" :key="index">
        <el-form-item class="w500 iblock"
                      :prop="`meta_list.${index}.title`"
                      :rules="[{validator: title_rule, trigger: 'change'}]">
          <el-input class="event-title"
                    v-model="item.title"
                    placeholder="请输入奖品名称">
            <span :class="item.title.length>24?'red':''" slot="suffix">{{item.title.length}}/24</span>
          </el-input>
        </el-form-item>

        <el-form-item class="iblock ml10"
                      label="价格："
                      label-width="60px"
                      size="small"
                      :prop="`meta_list.${index}.price`"
                      :rules="[{validator: price_rule, trigger: 'change'}]">
          <el-input class="w100" v-model="item.price" type="number"></el-input>
          元
        </el-form-item>

        <el-form-item class="iblock ml20"
                      label="奖品数量："
                      label-width="100px"
                      size="small"
                      :prop="`meta_list.${index}.num`"
                      :rules="[{validator: num_rule, trigger: 'change'}]">
          <el-input class="w100" v-model="item.num" type="number" min="1"></el-input>
          个
        </el-form-item>
        <div class="iblock icon-del"
             v-if="info.meta_list.length>1"
             @click="delAward(index)"></div>
        <div class="iblock blue cp icon-add"
             v-if="!((index!==info.meta_list.length-1) || (info.meta_list.length>3))"
             @click="addAward">&nbsp;添加奖项
        </div>
      </el-row>
    </div>

    <!--奖品介绍-->
    <el-form-item prop="detail">
      <el-row class="ft16">奖品介绍：</el-row>
      <el-input type="textarea"
                :rows="10"
                v-model="info.detail"
                placeholder="请输入奖品介绍">
      </el-input>
    </el-form-item>

    <!--赞助商信息-->
    <el-form-item label="赞助商信息：" label-width="100px">
      <el-radio-group v-model="info.is_sponsor">
        <el-radio label="0">无</el-radio>
        <el-radio label="1">有</el-radio>
      </el-radio-group>
    </el-form-item>

    <!--赞助商详细信息-->
    <el-row class="sponsor-wrap" v-show="info.is_sponsor==='1'">
      <el-form-item label="赞助商名：" label-width="100px">
        <el-input class="w200"
                  v-model="info.sponsor_name"
                  placeholder="8字以内"></el-input>
      </el-form-item>
      <el-form-item>
        <el-row>赞助商介绍：</el-row>
        <el-input type="textarea"
                  :rows="10"
                  v-model="info.sponsor_detail"
                  placeholder="请输入赞助商介绍">
        </el-input>
      </el-form-item>
      <el-row>
        <el-form-item class="iblock">
          <el-checkbox v-model="info.is_wxcode_url"
                       true-label="1"
                       false-label="0">小程序跳转
          </el-checkbox>
        </el-form-item>
        <el-form-item class="iblock ml20">
          <el-select v-model="info.sponsor_wxcode_id"
                     placeholder="请选择">
            <el-option
              v-for="item in options.sponsor_wxcode_list"
              :key="item.id"
              :label="item.wxcode_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="iblock ml20 w140">
          <el-input v-model="info.sponsor_btn_name" placeholder="跳转按钮文案"></el-input>
        </el-form-item>
        <el-form-item class="iblock ml20 w280">
          <el-input v-model="info.sponsor_wxcode_url" placeholder="跳转页面路径，不填写则跳首页"></el-input>
        </el-form-item>
        <el-row class="red">注意：若需增加支持跳转小程序，请联系技术组！</el-row>
      </el-row>
    </el-row>

    <!--上线后不可更改字段-->
    <div v-if="isEdit && formData.status!=='0'">
      <el-row class="Z-row">
        <span class="Z-name">开奖时间：</span>{{info.lottery_time}}
      </el-row>
      <el-row class="Z-row">
        <span class="Z-name">定时上线：</span>{{info.online_time}}
      </el-row>
      <el-row class="Z-row">
        <span class="Z-name">参与条件：</span>{{info.apply_condition_tips ? info.apply_condition_tips : '无'}}
      </el-row>
      <el-row class="Z-block-row">
        <span class="Z-name">组队设置：</span>
        <div class="Z-content">
          <p>{{info.is_team === '0' ? '不可组队' : `可组队 ${info.team_num}人`}}</p>
          <p class="lh20 red ft12">组队不会增加单个用户中奖概率，但有助于用户主动分享裂变；组队不必组满，队中有一人中奖，其他队员可领取同样产品
            组队抽奖最终奖品数量不可控，最多可能需要“总填写奖品数量X组队数量”个奖品</p>
        </div>
      </el-row>
      <el-row class="Z-row">
        <span class="Z-name">邮费设置：</span>目前为平台包邮，后续可根据需要调整
      </el-row>
    </div>
    <div v-else>
      <!--开奖时间-->
      <el-form-item label="开奖时间：" label-width="100px" prop="lottery_time">
        <el-date-picker
          v-model="info.lottery_time"
          type="datetime"
          :picker-options="options.pickerOptions"
          value-format="yyyy-MM-dd HH:mm"
          placeholder="选择开奖时间">
        </el-date-picker>
      </el-form-item>

      <!--定时上线时间-->
      <el-form-item label="定时上线：" label-width="100px" prop="online_time">
        <el-date-picker
          v-model="info.online_time"
          type="datetime"
          :picker-options="options.pickerOptions"
          value-format="yyyy-MM-dd HH:mm"
          placeholder="选择定时上线时间">
        </el-date-picker>
        <span class="gray ml20">不填写定时，则提交后进入待审核列表</span>
      </el-form-item>

      <!--参与条件-->
      <el-form-item label="参与条件：" label-width="100px">
        <el-radio-group v-model="info.apply_condition">
          <el-radio label="0">无</el-radio>
          <el-radio label="1">关注「抽奖帝」服务号</el-radio>
          <el-radio label="2">
            参与抽奖次数大于
            <el-input class="w70" v-model.number="gt_join_draw_num" type="number" min="0"
                      size="small"></el-input>
            次
          </el-radio>
          <el-radio label="3">
            发起抽奖次数大于
            <el-input class="w70" v-model.number="gt_start_draw_num" type="number" min="0"
                      size="small"></el-input>
            次
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <!--组队设置-->
      <el-form-item label="组队人数：" label-width="100px" v-show="info.admin_type==2">
        <el-radio-group v-model="info.team_num">
          <el-input class="w100" v-model="info.team_num" type="number" min="0" size="small"></el-input>
        </el-radio-group>
        <p class="lh20 red ft12 mt20">组队不会增加单个用户中奖概率，但有助于用户主动分享裂变；组队不必组满，队中有一人中奖，其他队员可领取同样产品
          组队抽奖最终奖品数量不可控，最多可能需要“总填写奖品数量X组队数量”个奖品</p>
      </el-form-item>

      <!--邮费设置-->
      <el-form-item label="邮费设置：" label-width="100px">目前为平台包邮，后续可根据需要调整</el-form-item>
    </div>

    <!--提交-->
    <div class="sub-fixed-box" ref="subWrap">
      <el-form-item class="sub-wrap tc">
        <el-button type="primary"
                   :loading="isSending"
                   style="width: 200px"
                   @click="submit('form')">提交
        </el-button>
      </el-form-item>

    </div>

    <!--小程序二维码-->
    <div class="qrcode-wrap" ref="qrcode" v-if="formData.status==='1'">
      <div class="qrcode">
        <img :src="formData.wxcode_qrcode_url" alt="">
        <p>微信扫一扫</p>
        <p>前往小程序浏览</p>
      </div>
      <div class="order-status pd5">
        <p>小程序页面路径：</p>
        <p class="wxcode-url">
          <span>{{formData.wxcode_url}}</span>
          <el-button
            type="text"
            size="mini"
            v-clipboard:copy="formData.wxcode_url"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError">复制
          </el-button>
        </p>
      </div>
    </div>

    <MyCropper :isShow.sync="showCropper" :cropperData="cropperData" @updateImg="updateImg"/>
  </el-form>
</template>


<script>
  import qs from 'qs'
  import {subEvent, getWxcodeList} from '@/api/draw'
  import MyCropper from '@/components/my-cropper'

  const FILE_LIMIT_SIZE = 2 * 1024 * 1024

  export default {
    props: {
      url: {
        type: String,
        default: ''
      },
      formData: {
        type: Object,
        default: null
      },
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const title_rule = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请填写奖品名称'))
        } else if (value.length > 24) {
          callback(new Error('奖品名称不能超过24个字'))
        } else {
          callback()
        }
      }
      const num_rule = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请填写奖品数量'))
        } else if (value < 1) {
          callback(new Error('奖品数量不能小于1'))
        } else {
          callback()
        }
      }
      const price_rule = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请填写价格'))
        } else if (value < 1) {
          callback(new Error('价格不能小于1'))
        } else {
          callback()
        }
      }
      const lottery_time = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请填写开奖时间'))
        } else if (new Date(value) < new Date()) {
          callback(new Error('开奖时间必须大于当前时间'))
        } else {
          callback()
        }
      }
      const online_time = (rule, value, callback) => {
        if (value && new Date(value) < new Date()) {
          callback(new Error('定时上线时间必须大于当前时间'))
        } else {
          callback()
        }
      }
      return {
        title_rule: title_rule, //奖品名称校验
        num_rule: num_rule,  //奖品数量校验
        price_rule:price_rule,//价格校验
        // img_rule:img_rule,//图片校验
        cover_loading: false,
        isInit: false,  //表单数据是否初始化完成
        isSending: false, //是否正在提交数据
        gt_join_draw_num: '', //参与抽奖次数
        gt_start_draw_num: '',  //发起抽奖次数
        showCropper: false, //显示裁剪弹窗
        cropperData: {},  //裁剪数据
        choosed:0,//已选状态
        info: {  //待提交的表单数据
          meta_list: [  //奖品列表
            {
              title: '',
              num: '',
              price:'1',
              // img:''
            }
          ],
          cover: '',  //封面图
          detail: '', //奖品介绍
          is_sponsor: '0',  //是否有赞助商信息
          sponsor_name: '', //赞助商名
          admin_type: '1',//抽奖类型
          sponsor_detail: '', //赞助商介绍
          is_wxcode_url: '',  //小程序跳转
          sponsor_wxcode_id: '',  //小程序id
          sponsor_wxcode_name: '',  //小程序名称
          sponsor_btn_name: '', //按钮文案
          sponsor_wxcode_url: '',  //跳转路径
          lottery_time: '', //开奖时间
          online_time: '',  //上线时间
          apply_condition: '0', //参与条件
          is_team: '0', //是否组队
          team_num: '2',  //组队人数
          apply_condition_num: '',  //参与条件里限制的抽奖次数
          apply_condition_tips: ''  //参与条件文案
        },
        rules: {
          detail: [
            {required: true, message: '请输入奖品介绍', trigger: 'blur'}
          ],
          lottery_time: [
            {validator: lottery_time, trigger: 'change'},
          ],
          online_time: [
            {validator: online_time, trigger: 'change'},
          ]
        },
        options: {
          sponsor_wxcode_list: [],
          pickerOptions: {
            //开奖时间限制(大于当前时间)
            disabledDate(time) {
              return time.getTime() < Date.now() - 8.64e7
            },
          },
          adminTypeList: [
            {title: '普通抽奖', icon: 'font-icon-choujiang', desc: '直接参与，无裂变行为',type:1},
            {title: '组队抽奖', icon: 'font-icon-team', desc: '一人中奖，队伍成员获得相同产品',type:2},
            {title: '抽奖码', icon: 'font-icon-choujiangma', desc: '邀请好友可获得额外抽奖码',type:3},
          ]
        }
      }
    },
    computed: {
      sponsor_wxcode_name() {
        for (let val of this.options.sponsor_wxcode_list) {
          if (this.info.sponsor_wxcode_id === val.id) {
            return val.wxcode_name
          }
        }
      },
      apply_condition_tips() {
        switch (this.info.apply_condition) {
          case '0':
            return '无'
          case '1':
            return '关注「抽奖帝」服务号'
          case '2':
            this.info.apply_condition_num = this.gt_join_draw_num
            return `参与抽奖次数大于${this.info.apply_condition_num}次`
          case '3':
            this.info.apply_condition_num = this.gt_start_draw_num
            return `发起抽奖次数大于${this.info.apply_condition_num}次`
        }
      }
    },
    created() {
      this.initWxcodeList()
    },
    destroyed() {
      //组件销毁时移除滚动事件
      window.onscroll = null
    },
    methods: {
      //获取赞助商小程序列表
      initWxcodeList() {
        getWxcodeList().then(res => {
          if (res.resultCode === '0') {
            this.options.sponsor_wxcode_list = res.result.data
            if (!this.isEdit) {
              this.info.sponsor_wxcode_id = this.options.sponsor_wxcode_list[0].id
              this.info.sponsor_wxcode_name = this.options.sponsor_wxcode_list[0].wxcode_name
            }
          } else {
            this.$message.error(res.errorMsg)
          }
        })
      },
      //初始化form信息
      initFormData() {
        for (let i in this.info) {
          this.info[i] = this.formData[i]
        }
        this.info.id = this.formData.id
        if (this.info.apply_condition === '2') {
          this.gt_join_draw_num = this.info.apply_condition_num
        } else if (this.info.apply_condition === '3') {
          this.gt_start_draw_num = this.info.apply_condition_num
        }
        this.choosed=this.info.admin_type||0
        this.isInit = true
        //二维码悬浮及提交按钮悬浮
        this.$nextTick(() => {
          let qrcodeTop
          const subWrapLeft = this.$refs['subWrap'].offsetLeft
          if (this.formData.status === '1') {
            qrcodeTop = this.$refs['qrcode'].offsetTop
          }
          console.log(1)
          window.onscroll = () => {
            console.log(2)
            //屏幕宽度低于最小body宽时保证提交按钮悬浮在正确的位置
            const scrollLeft = document.querySelector('html,body').scrollLeft
            let subWrapLeftNum = subWrapLeft
            subWrapLeftNum -= scrollLeft
            this.$refs['subWrap'].style.left = `${subWrapLeftNum}px`

            //二维码悬浮
            if (this.formData.status === '1') {
              const scrollTop = document.querySelector('html,body').scrollTop
              let qrcodeTopNum = qrcodeTop
              qrcodeTopNum += scrollTop
              this.$refs['qrcode'].style.top = `${qrcodeTopNum}px`
            }
          }
        })
      },
      uploadBannerBefore(file) {
        if (file.size > FILE_LIMIT_SIZE) {
          this.$message.error('上传文件不能超过2MB')
          return false
        }
        this.cover_loading = true
      },
      uploadBannerSuccess(response) {
        this.cover_loading = false
        //图片上传成功后的数据处理
        if (response.success === 'false') {
          this.$message.error(response.errorMsg)
          return
        }
        this.info.cover = response.result.fileid
      },
      uploadBannerError() {
        this.$message.error('上传失败')
        this.cover_loading = false
      },
      //图片裁剪
      crop(e) {
        e.stopPropagation()
        if (!this.info.cover) {
          this.$message.error('请先上传封面图')
          return
        }
        this.cropperData.url = `http://s1.jiguo.com/${this.info.cover}`
        this.cropperData.ratio = 2
        this.showCropper = true
      },
      //裁剪后更新图片
      updateImg(cropData) {
        this.info.cover = cropData
      },
      //添加奖项
      addAward() {
        this.info.meta_list.push({
          title: '',
          num: ''
        })
      },
      //删除奖项
      delAward(index) {
        this.info.meta_list.splice(index, 1)
      },
      //复制成功回调
      onCopy() {
        this.$message.success('复制成功')
      },
      //复制失败回调
      onError() {
        this.$message.error('复制失败')
      },
      submit(formName) {
        console.log(this.url);
        //提交
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //处理提交数据
            const info_meta_list = this.info.meta_list
            this.info.apply_condition_tips = this.apply_condition_tips
            this.info.sponsor_wxcode_name = this.sponsor_wxcode_name

            this.isSending = true
            subEvent({
              url: this.url,
              data: qs.stringify({
                info: this.info,
                info_meta_list: info_meta_list
              })
            }).then(res => {
              this.isSending = false
              if (res.resultCode === '0') {
                console.log(res);
                console.log(this.url);
                this.$message.success('提交成功')
                const _this = this
                setTimeout(function () {
                  if (_this.isEdit) {
                    _this.$router.push('/draw/onlinelist')
                  } else if (_this.info.online_time) {
                    _this.$router.push('/draw/timinglist')
                  } else {
                    _this.$router.push('/draw/checklist')
                  }
                }, 300)
              } else {
                this.$message.error(res.errorMsg)
              }
            })
          } else {
            this.$message.error('提交失败，请检查活动信息是否完整')
          }
        })
      },
      chooseType(item) {
        if(item.type) {
          this.info.admin_type = item.type
          this.choosed=item.type
        }
      }
    },
    watch: {
      //监听表单数据请求，请求完成后初始化数据
      formData(val) {
        this.initFormData()
      }
    },
    components: {
      MyCropper
    }
  }
</script>

<style lang="less">
  .typeSet {
    width: 100%;
    height: 250px;
  }


  .typeList {
    width: 100%;
    height: 210px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .typeOne{
    width: 250px;
    height: 110px;
    border: 1px solid #E6E6E6;
  }
  .choosed{
    border: 2px solid #FD6A6A;
    position: relative;
  }
  .choosed:after{
    position: absolute;
    width: 0;
    height: 0;
    right: 0;
    bottom: 0;
    content: "✔";
    color: #fff;
    line-height: 12px;
    text-align: center;
    font-size: 20px;
    border-style: solid;
    border-width: 18px;
    border-color: transparent #FD6A6A #FD6A6A transparent;
  }

  .typeOne > div{
    line-height: 55px;
    text-align: center;
    height: 55px;
  }

  .drawText {
    font-size: 14px;
    color: #E6E6E6;
  }

  .awardTitle, .typeTitle {
    width: 100%;
    line-height: 40px;
    height: 40px;
    text-align: left;
    margin-bottom: 40px;
    padding-left: 10px;
    background-color: #E6E6E6;
  }

  .typeTitle {
    margin-bottom: 0;
  }

  .draw-form {
    position: relative;
    padding-bottom: 80px;
    .cover {
      width: 600px;
      height: 300px;
      background-color: #E6E6E6;
      position: relative;
      padding-top: 0.1px;
      .cover-pic {
        width: 100%;
        height: 100%;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      .cover-desc {
        margin-top: 93px;
        text-align: center;
        img {
          width: 56px;
          height: 38px;
        }
        .cover-title {
          margin-top: 13px;
          font-size: 20px;
          line-height: 28px;
          color: #808080;
        }
        .cover-tips {
          font-size: 14px;
          line-height: 20px;
          color: #a6a6a6;
        }
      }
      .cover-edit {
        position: absolute;
        bottom: 0;
        right: 0;
        display: flex;
        justify-content: flex-end;
        color: #fff;
        .crop {
          width: 38px;
          height: 38px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.5);
          margin-right: 15px;
          .font-icon-crop {
            font-size: 26px;
          }
        }
        .cover-change {
          width: 120px;
          height: 38px;
          line-height: 17px;
          background-color: rgba(0, 0, 0, 0.5);
          p:first-of-type {
            line-height: 20px;
          }
        }
      }
    }
    .event-title {
      input {
        font-size: 18px;
        outline: none;
        border-color: transparent !important;
        border-bottom-color: #dcdfe6 !important;
      }
    }
    .sponsor-wrap {
      background-color: #F2F2F2;
      padding: 20px;
      margin-bottom: 22px;
      position: relative;
      &:after {
        content: '';
        display: block;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-bottom-color: #F2F2F2;
        position: absolute;
        top: -20px;
        left: 158px;
      }
    }
    .sub-fixed-box {
      min-width: 1350px;
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: 0 60px 0 316px;
      z-index: 10;
    }
    .sub-wrap {
      background-color: #fff;
      box-shadow: 0px -20px 10px rgba(255, 255, 255, 0.8);
      max-width: 1220px;
      min-width: 860px;
      min-height: 100px;
      margin: 0 auto;
    }
    .qrcode-wrap {
      position: absolute;
      right: 0px;
      top: 0px;
      width: 200px;
      border: 1px solid #BFBFBF;
      background-color: #fff;
      .qrcode {
        width: 180px;
        margin: 15px auto 15px;
        text-align: center;
        img {
          width: 100%;
          margin-bottom: 15px;
        }
      }
      .order-status {
        border-top: 1px solid #BFBFBF;
        border-bottom: 1px solid #BFBFBF;
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
    }
  }

</style>
