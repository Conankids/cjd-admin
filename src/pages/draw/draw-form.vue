<template>
  <el-form
    class="draw-form"
    :model="info"
    :rules="rules"
    ref="form"
    label-position="left"
    v-loading="isEdit && !isInit"
    element-loading-text="拼命加载中">
    <p @click="test()">点击查看</p>
    <!--抽奖类型设置-->
    <el-form-item>
      <div class="typeSet">
        <div class="typeTitle ft20">
          <strong>抽奖类型</strong>
        </div>
        <div class="typeList" :class="{'once':isEdit}">
          <div class="typeOne"
               v-for="(item,index) in options.adminTypeList"
               :key="index"
               :class="{choosed:choosed==item.type}"
               v-on:click="chooseType(item)"
               v-if="(info.admin_type==item.type && isEdit) || !isEdit">
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
      <el-row class="ft16">奖品图：
        <span class="gray ft14">建议尺寸：1080*540，第一张默认为封面图，最多上传6张产品图片</span>
      </el-row>
      <div class="product-pic-list">
        <div class="image" v-for="(item,i) in info.imgs" :key="i">
          <div class="deal-wrap" v-if="typeof item != 'object'">
            <i class="font-icon-crop deal-item" title="裁剪" @click="crop(i)"></i>
            <i class="el-icon-delete deal-item" title="删除" @click="delImg(i)"></i>
          </div>
          <i class="el-icon-loading" v-if="typeof item == 'object'"></i>
          <img v-else
               :src="`http://s1.jiguo.com/${item}/640`"
               alt="">
        </div>

        <!--上传-->
        <el-upload
          v-show="info.imgs.length<6"
          class="uploader"
          action="/admin/Lotterylist/UploadImg"
          accept="image/*"
          :multiple="true"
          :limit="6"
          :show-file-list="false"
          :before-upload="uploadBannerBefore"
          :on-exceed="uploadBannerExceed"
          :on-error="uploadBannerError"
          :on-success="uploadBannerSuccess">
          <div class="cover">
            <i class="el-icon-plus"></i>
            <span>添加图片</span>
          </div>
        </el-upload>
      </div>
    </el-form-item>

    <!-- 小程序推荐设置-->
    <!-- <div class="awardTitle ft20">
      <strong>小程序推荐</strong>
    </div> -->
    <div class="wx-system" style="margin-bottom:100px">
      <el-row class="ft16">小程序设置：</el-row>
      <el-row class="table-header">
        <div style="width: 220px;">选择小程序</div>
        <div style="width: 200px;">页面地址</div>
        <div style="width: 150px;">按钮名称</div>
        <div style="width: 200px;">封面图：建议尺寸640x400</div>
      </el-row>

      <!-- 判断是否是上线 -->
    <!-- <div v-if="isEdit && formData.status!=='0'"> -->
        <div>
      <el-row class="award-item" v-for="(item,index) in info.recommend_wxcode" :key="index">        
        <el-select v-model="item.sponsor_wxcode_name" 
          placeholder="请选择小程序"
          class="w200 iblock"
          size="mini"
          >
          <el-option
              v-for="item in options.sponsor_wxcode_list"
              :key="item.id"
              :label="item.wxcode_name"
              :value="item.id">
          </el-option>
        </el-select>

        <el-form-item class="iblock ml10"
                      size="mini"
                      >
          <el-input class="w180" v-model="item.sponsor_btn_name" type="text"></el-input>
        </el-form-item>

        <el-form-item class="iblock ml10"
                      size="mini"
        >
          <el-input class="w180" v-model="item.sponsor_wxcode_url" type="text"></el-input>
        </el-form-item>

        <!-- 上传文件 -->
        <el-form-item class="iblock ml50 w200"
                      size="mini"
          >
         <el-upload
            class="upload-demo"
            action="/admin/Lotterylist/UploadImg"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            accept="image/*"
            :multiple="true"
            :limit="1"
            :show-file-list="false"
            :before-upload="uploadBannerBefore"
            :on-exceed="uploadBannerExceed"
            :on-error="uploadBannerError"
            :on-success="uploadBannerSuccess">
            <span class="blue">选择文件</span>
          </el-upload>
        </el-form-item>

        <div class="iblock icon-del"
             v-if="(info.recommend_wxcode.length>1) || (info.recommend_wxcode.length>2)"
             @click="delWxList(index)"></div>
        <div class="iblock blue cp icon-add"
            v-if="isAddShow(index)"
             @click="addWxList()">&nbsp;
        </div>
      </el-row>
    </div>

    <!-- </div> -->

    </div>
    <!-- 小程序推荐设置-->


    <el-row class="ft16">奖品设置：</el-row>
    <el-row class="table-header">
      <div style="width: 220px;">奖项名称</div>
      <div style="width: 100px;">价格</div>
      <div style="width: 100px;">数量</div>
      <div style="width: 150px;">奖品类型</div>
    </el-row>
    <!--上线后不可更改字段-->
    <div v-if="isEdit && formData.status!=='0'">
      <el-row class="award-item" v-for="(item,index) in info.meta_list" :key="index" v-if="item.meta_type==1">
        <el-form-item class="w220 iblock"
                      size="mini"
                      :prop="`meta_list.${index}.title`"
                      :rules="[{validator: title_rule, trigger: 'change'}]">
          <el-input class="ft12"
                    v-model="item.title"
                    placeholder="请输入奖品名称">
            <span :class="item.title.length>24?'red':''" slot="suffix">{{item.title.length}}/24</span>
          </el-input>
        </el-form-item>

        <el-form-item class="iblock ml10"
                      size="mini"
                      :prop="`meta_list.${index}.price`">
          <el-input class="w80" v-model="item.price" type="number"></el-input>
        </el-form-item>

        <div class="w80 ml10 tc">{{item.num}}个</div>

        <div class="w140 ml10 tc">{{lottery_type_text(item.lottery_type)}}</div>

        <el-form-item class="iblock ml10"
                      size="mini"
                      style="width: 272px;">
          <div class="b ft12" v-if="item.lottery_type==1">目前为平台包邮，后续可根据需要调整</div>

          <div v-else-if="item.lottery_type==2">
            <div class=" iblock ml10 w100">{{item.wxcode_title}}</div>
            <div class="iblock ml10 w150">{{item.wxcode_path}}</div>
          </div>

          <div v-else>
            <div class="ticket-code-wrap">
              <div class="left-wrap">
                <div>已录入{{item.ticket_code_list.length}}个兑换码</div>
                <div class="left-content">兑换说明：{{item.ticket_code_desc}}</div>
              </div>
              <div class="right-wrap blue cp" @click="addTicketCode(index)">查看详情</div>
            </div>
          </div>
        </el-form-item>
      </el-row>
    </div>
    <!--设置奖品名称-->
    <div v-else>
      <el-row class="award-item" v-for="(item,index) in info.meta_list" :key="index" v-if="item.meta_type==1">
        <el-form-item class="w220 iblock"
                      size="mini"
                      :prop="`meta_list.${index}.title`"
                      :rules="[{validator: title_rule, trigger: 'change'}]">
          <el-input class="ft12"
                    v-model="item.title"
                    placeholder="请输入奖品名称">
            <span :class="item.title.length>24?'red':''" slot="suffix">{{item.title.length}}/24</span>
          </el-input>
        </el-form-item>

        <el-form-item class="iblock ml10"
                      size="mini"
                      :prop="`meta_list.${index}.price`">
          <el-input class="w80" v-model="item.price" type="number"></el-input>
        </el-form-item>

        <el-form-item class="iblock ml10"
                      size="mini"
                      :prop="`meta_list.${index}.num`"
                      :rules="[{validator: num_rule, trigger: 'change'}]">
          <el-input class="w80" v-model="item.num" type="number" min="1"></el-input>
        </el-form-item>

        <el-form-item class="iblock ml10 w140"
                      size="mini">
          <el-select v-model="item.lottery_type"
                     placeholder="请选择">
            <el-option
              v-for="l_t_item in lottery_type_filter"
              :key="l_t_item.type"
              :label="l_t_item.title"
              :value="l_t_item.type">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="iblock ml10"
                      size="mini"
                      style="width: 272px;">
          <div class="b ft12" v-if="item.lottery_type==1">目前为平台包邮，后续可根据需要调整</div>

          <div v-else-if="item.lottery_type==2">
            <el-select class="w100"
                       v-model="item.wxcode_id"
                       placeholder="请选择"
                       @change="changeLotteryType(item.wxcode_id,index)">
              <el-option
                v-for="item in options.sponsor_wxcode_list"
                :key="item.id"
                :label="item.wxcode_name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-form-item class="iblock ml10 w150" size="mini">
              <el-input v-model="item.wxcode_path" placeholder="填写领奖页面路径"></el-input>
            </el-form-item>
          </div>

          <div v-else>
            <div class="ticket-code-wrap" v-if="item.ticket_code_list && item.ticket_code_list.length">
              <div class="left-wrap">
                <div>已录入{{item.ticket_code_list.length}}个兑换码</div>
                <div class="left-content">兑换说明：{{item.ticket_code_desc}}</div>
              </div>
              <div class="right-wrap blue cp" @click="addTicketCode(index)">编辑</div>
            </div>
            <div class="blue cp" v-else @click="addTicketCode(index)">录入兑换码与兑换说明</div>
          </div>
        </el-form-item>
        <div class="iblock icon-del"
             v-if="(info.meta_list.length>1 && info.popularity_award == 2) || (info.meta_list.length>2 && info.popularity_award == 1)"
             @click="delAward(index)"></div>
        <div class="iblock blue cp icon-add"
             v-if="isShowAddBtn(index)"
             @click="addAward">&nbsp;
        </div>
      </el-row>
    </div>
    <!--人气奖-->
    <el-row v-if="info.admin_type==3">
      <el-form-item label="人气奖：" label-width="100px">
        <el-switch
          v-model="info.popularity_award"
          active-value="1"
          inactive-value="2"
          active-color="#13ce66"
          inactive-color="#BFBFBF"
          @change="changePopularity">
        </el-switch>
        <div class="popularity-tips">
          <i class="el-icon-question gray mt15 cp"></i>
          <div class="popularity-content">
            <p>开：打开则设有最高人气奖，数量为1个，开奖后由抽奖码最多者获得，抽奖码数量一样时，由最先获取同样数量的用户获得</p>
            <p class="mt10">关：关闭则不设最高人气奖</p>
          </div>
        </div>
      </el-form-item>
      <el-row v-for="(item,index) in info.meta_list" :key="index" v-if="item.meta_type==2" style="display: flex">
        <el-form-item class="w220 iblock"
                      size="mini"
                      :prop="`meta_list.${index}.title`"
                      :rules="[{validator: title_rule, trigger: 'change'}]">
          <el-input class="ft12"
                    v-model="item.title"
                    placeholder="请输入奖品名称">
            <span :class="item.title.length>24?'red':''" slot="suffix">{{item.title.length}}/24</span>
          </el-input>
        </el-form-item>

        <el-form-item class="iblock ml10"
                      size="mini"
                      :prop="`meta_list.${index}.price`">
          <el-input class="w80" v-model="item.price" type="number"></el-input>
        </el-form-item>

        <div class="iblock ml10 w80 tc">{{item.num}}个</div>

        <el-form-item class="iblock ml10 w140"
                      size="mini">
          <el-select v-if="!(isEdit && formData.status!=='0')"
                     v-model="item.lottery_type"
                     placeholder="请选择">
            <el-option
              v-for="l_t_item in options.lottery_type"
              :key="l_t_item.type"
              :label="l_t_item.title"
              :value="l_t_item.type">
            </el-option>
          </el-select>
          <div v-else class="tc">{{lottery_type_text(item.lottery_type)}}</div>
        </el-form-item>
        <!--填写-->
        <el-form-item v-if="!(isEdit && formData.status!=='0')"
                      class="iblock ml10"
                      size="mini"
                      style="width: 272px;">
          <div class="b ft12" v-if="item.lottery_type==1">目前为平台包邮，后续可根据需要调整</div>

          <div v-else-if="item.lottery_type==2">
            <el-select class="w100"
                       v-model="item.wxcode_id"
                       placeholder="请选择">
              <el-option
                v-for="item in options.sponsor_wxcode_list"
                :key="item.id"
                :label="item.wxcode_name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-form-item class="iblock ml10 w150" size="mini">
              <el-input v-model="item.wxcode_path" placeholder="填写领奖页面路径"></el-input>
            </el-form-item>
          </div>

          <div v-else>
            <div class="ticket-code-wrap" v-if="item.ticket_code_list.length">
              <div class="left-wrap">
                <div>已录入{{item.ticket_code_list.length}}个兑换码</div>
                <div class="left-content">兑换说明：{{item.ticket_code_desc}}</div>
              </div>
              <div class="right-wrap blue cp" @click="addTicketCode(index)">编辑</div>
            </div>
            <div class="blue cp" v-else @click="addTicketCode(index)">录入兑换码与兑换说明</div>
          </div>
        </el-form-item>
        <!--编辑-->
        <el-form-item v-else
                      class="iblock ml10"
                      size="mini"
                      style="width: 272px;">
          <div class="b ft12" v-if="item.lottery_type==1">目前为平台包邮，后续可根据需要调整</div>

          <div v-else-if="item.lottery_type==2">
            <div class="w100">{{item.wxcode_name}}</div>
            <div class="iblock ml10 w150">{{item.wxcode_path}}</div>
          </div>

          <div v-else>
            <div class="ticket-code-wrap">
              <div class="left-wrap">
                <div>已录入{{item.ticket_code_list.length}}个兑换码</div>
                <div class="left-content">兑换说明：{{item.ticket_code_desc}}</div>
              </div>
              <div class="right-wrap blue cp" @click="addTicketCode(index)">查看详情</div>
            </div>
          </div>
        </el-form-item>
      </el-row>
    </el-row>

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

    <!--兑换码与兑换说明-->
    <el-dialog
      :visible.sync="showTicket"
      width="600px">
      <div class="Z-block-row">
        <span class="Z-name">兑奖码：</span>
        <div class="Z-content">
          <el-input type="textarea"
                    :rows="6"
                    :readonly="isEdit && formData.status!=='0'"
                    v-model="ticket_code_data.ticket_code"
                    placeholder="请输入兑奖码">
          </el-input>
          <div class="gray">请输入兑换码，一行一个，上线后不可修改</div>
        </div>
      </div>
      <div class="Z-block-row">
        <span class="Z-name">兑奖说明：</span>
        <div class="Z-content">
          <el-input type="textarea"
                    :rows="6"
                    :readonly="isEdit && formData.status!=='0'"
                    v-model="ticket_code_data.ticket_code_desc"
                    placeholder="请输入兑奖说明">
          </el-input>
        </div>
      </div>
      <div slot="footer" class="tc" v-if="!(isEdit && formData.status!=='0')">
        <el-button type="primary" @click="subTicketCode">提 交</el-button>
      </div>
    </el-dialog>

    <MyCropper :isShow.sync="showCropper" :cropperData="cropperData" @updateImg="updateImg"/>
  </el-form>
</template>


<script>
  import qs from 'qs'
  import {subEvent, getWxcodeList} from '@/api/draw'
  import MyCropper from '@/components/my-cropper'

  const FILE_LIMIT_SIZE = 2 * 1024 * 1024

  const AWARD_ITEM = function (meta_type) {
    return {
      title: '',
      price: '',
      num: meta_type == 2 ? '1' : '',
      meta_type: meta_type,
      lottery_type: 1,
      wxcode_id: this.options.sponsor_wxcode_list[0].id,
      wxcode_title: this.options.sponsor_wxcode_list[0].wxcode_name,
      wxcode_appid: this.options.sponsor_wxcode_list[0].wxcode_appid,
      wxcode_path: '',
      ticket_code_list: [],
      ticket_code_desc: ''
    }
  }

  const WX_SYITEM=function(){
    return{
      sponsor_wxcode_name:'',
      sponsor_btn_name:'',
      sponsor_wxcode_url:'',
      cover:''
    }
  }

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
      // const price_rule = (rule, value, callback) => {
      //     if (!value) {
      //         callback(new Error('请填写价格'))
      //     } else if (value < 1) {
      //         callback(new Error('价格不能小于1'))
      //     } else {
      //         callback()
      //     }
      // }
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
        // price_rule:price_rule,//价格校验
        cover_loading: false,
        isInit: false,  //表单数据是否初始化完成
        isSending: false, //是否正在提交数据
        gt_join_draw_num: '', //参与抽奖次数
        gt_start_draw_num: '',  //发起抽奖次数
        showCropper: false, //显示裁剪弹窗
        cropperData: {},  //裁剪数据
        choosed: 0,//已选状态
        showTicket: false, //显示兑奖码弹窗
        ticket_code_data: {  //当前操作的兑奖码数据
          ticket_code: '',//当前操作的兑奖码数据
          ticket_code_desc: '',//当前操作的兑奖码数据
        },
        info: {  //待提交的表单数据
          meta_list: [], //奖品列表
          cover: '',  //封面图
          imgs: [], //产品图
          popularity_award: 2, //是否有人气奖
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
          apply_condition_tips: '',  //参与条件文案
          recommend_wxcode:[],//小程序的推荐列表
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
            {title: '普通抽奖', icon: 'font-icon-choujiang', desc: '直接参与，无裂变行为', type: 1},
            {title: '组队抽奖', icon: 'font-icon-team', desc: '一人中奖，队伍成员获得相同产品', type: 2},
            {title: '抽奖码', icon: 'font-icon-choujiangma', desc: '邀请好友可获得额外抽奖码', type: 3},
          ],
          lottery_type: [
            {title: '实物-快递', type: 1},
            {title: '跳转小程序领取', type: 2},
            {title: '兑换码', type: 3},
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
      },
      lottery_type_filter() {
        return this.info.admin_type == 2 ? this.options.lottery_type.filter(t => t.type != 3) : this.options.lottery_type
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
      test(){
        console.log(this.info.meta_list);
      },
      //获取赞助商小程序列表
      initWxcodeList() {
        getWxcodeList().then(res => {
          if (res.resultCode === '0') {
            // console.log(res);
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
        this.choosed = this.info.admin_type || 0
        this.isInit = true
        //二维码悬浮及提交按钮悬浮
        this.$nextTick(() => {
          let qrcodeTop
          const subWrapLeft = this.$refs['subWrap'].offsetLeft
          if (this.formData.status === '1') {
            qrcodeTop = this.$refs['qrcode'].offsetTop
          }
          window.onscroll = () => {
            //屏幕宽度低于最小body宽时保证提交按钮悬浮在正确的位置
            const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
            let subWrapLeftNum = subWrapLeft
            subWrapLeftNum -= scrollLeft
            this.$refs['subWrap'].style.left = `${subWrapLeftNum}px`

            //二维码悬浮
            if (this.formData.status === '1') {
              const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
//              console.log(scrollTop)
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
        this.info.imgs.push({uid: file.uid})
      },
      uploadBannerExceed() {
        this.$message.error('最多只能上传6张产品图片')
      },
      uploadBannerSuccess(response, file, fileList) {
        //图片上传成功后的数据处理
        if (response.success === 'false') {
          this.$message.error(response.errorMsg)
          return
        }
        this.info.imgs.forEach((t, i, arr) => {
          typeof t == 'object' && t.uid == file.uid && arr.splice(i, 1, response.result.fileid)
        })
      },
      uploadBannerError() {
        this.$message.error('上传失败')
        this.cover_loading = false
      },
      //图片裁剪
      crop(i) {
        this.cropperData.url = `http://s1.jiguo.com/${this.info.imgs[i]}`
        this.cropperData.idx = i
        this.cropperData.ratio = 2
        this.showCropper = true
      },
      //裁剪后更新图片
      updateImg(cropData) {
        this.info.imgs.splice(this.cropperData.idx, 1, cropData)
      },
      //删除产品图片
      delImg(i) {
        this.info.imgs.splice(i, 1)
      },
      //编辑时lottery_type转化为文字
      lottery_type_text(val) {
        let txt
        this.options.lottery_type.forEach(t => {
          t.type == val && (txt = t.title)
        })
        return txt
      },
      //切换抽奖类型
      changeLotteryType(val, index) {
        this.options.sponsor_wxcode_list.forEach(t => {
          if (t.id == val) {
            this.info.meta_list[index].wxcode_title = t.wxcode_name
            this.info.meta_list[index].wxcode_appid = t.wxcode_appid
          }
        })
      },
      //显示兑换码弹窗
      addTicketCode(i) {
        this.showTicket = true
        this.ticket_code_data.idx = i
        this.ticket_code_data.ticket_code = this.info.meta_list[i].ticket_code_list ? this.info.meta_list[i].ticket_code_list.join('\n') : ''
        this.ticket_code_data.ticket_code_desc = this.info.meta_list[i].ticket_code_desc || ''
      },
      //提交兑换码
      subTicketCode() {
        const ticket_code = this.ticket_code_data.ticket_code
        const ticket_code_desc = this.ticket_code_data.ticket_code_desc
        const idx = this.ticket_code_data.idx

        if (ticket_code.trim() == '') {
          this.$message.error('请先填写兑换码')
          return
        }

        const ticket_code_list = ticket_code.split('\n').filter(t => t != '')
        if (ticket_code_list.length != this.info.meta_list[idx].num) {
          this.$message.error(`请检查输入的兑换码数量！兑换码数量${ticket_code_list.length}，奖品数量${this.info.meta_list[idx].num}`)
          return
        }
        if (ticket_code_desc.trim() == '') {
          this.$message.error('请先填写兑换说明')
          return
        }

        //用\n匹配换行符并过滤掉空的兑换码
        this.info.meta_list[idx].ticket_code_list = ticket_code_list
        this.info.meta_list[idx].ticket_code_desc = ticket_code_desc
        this.showTicket = false
      },
      //添加奖项
      addAward() {
        this.info.meta_list.push(AWARD_ITEM.call(this, 1))
        console.log(this.info.meta_list);
      },
      //删除奖项
      delAward(index) {
        this.info.meta_list.splice(index, 1)
        console.log(this.info.meta_list);
      },
       //添加小程序
      addWxList() {
        this.info.recommend_wxcode.push(WX_SYITEM.call(this, 1))
        console.log(this.info.recommend_wxcode);
      },
      //删除小程序
      delWxList(index) {
        this.info.recommend_wxcode.splice(index, 1)
        console.log(this.info.recommend_wxcode);
      },
      // 上传数据
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      //人气奖开关变化
      changePopularity(val) {
        if (val == 1) {
          this.info.meta_list.unshift(AWARD_ITEM.call(this, 2))
        } else {
          this.info.meta_list.forEach((item, index) => {
            item.meta_type == 2 ? this.delAward(index) : ''
            return false
          })
        }
      },
      //是否显示添加奖项按钮(小程序列表按钮)
      isShowAddBtn(index) {
        const meta_list = this.info.meta_list
        if (this.info.popularity_award == 2) {
          if (!((index !== meta_list.length - 1) || (meta_list.length > 3))) {
            return true
          } else {
            return false
          }
        } else {
          if (!((index !== meta_list.length - 1) || (meta_list.length > 4))) {
            return true
          } else {
            return false
          }
        }
      },
      isAddShow(index){//是否添加小程序推荐的列表
        const recommend_wxcode = this.info.recommend_wxcode
        if (!((index !== recommend_wxcode.length - 1) || (recommend_wxcode.length > 1))) {
            return true
          } else {
            return false
          }
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
        //提交
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (!this.info.imgs.length) {
              this.$message.error('请上传产品图片！')
              return
            }
            //处理提交数据
            const info_meta_list = this.info.meta_list.map(a => a)
            //人气奖放置在奖品列表最后
            if (this.info.popularity_award == 1) {
              let popularity_award_idx, popularity_award
              info_meta_list.forEach((item, index) => {
                if (item.meta_type == 2) {
                  popularity_award = item
                  popularity_award_idx = index
                }
              })
              info_meta_list.splice(popularity_award_idx, 1)
              info_meta_list.push(popularity_award)
              console.log(info_meta_list)
            }
            //第一张产品默认为封面图
            this.info.cover = this.info.imgs[0]
            console.log(this.info.cover);
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
        if (item.type && this.formData.status != 1) {
          this.info.admin_type = item.type
          this.choosed = item.type
          //组队抽奖没有兑换码玩法
          if (item.type == 2) {
            this.info.meta_list.forEach(t => {
              if(t.lottery_type == 3){
                t.lottery_type = 1
                t.ticket_code_list = []
                t.ticket_code_desc = ''
              }
            })
          }
        }
      }
    },
    watch: {
      //监听表单数据请求，请求完成后初始化数据
      formData(val) {
        this.initFormData()
      },
      //关闭裁剪弹窗，清空裁剪数据
      showCropper(val) {
        !val && (this.cropperData = {})
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
    &.once {
      justify-content: space-between;
    }
  }

  .typeOne {
    width: 250px;
    height: 110px;
    border: 1px solid #E6E6E6;
  }

  .choosed {
    border: 2px solid #FD6A6A;
    position: relative;
  }

  .choosed:after {
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

  .typeOne > div {
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
    margin-bottom: 20px;
    padding-left: 10px;
    background-color: #E6E6E6;
  }

  .typeTitle {
    margin-bottom: 0;
  }

  .draw-form {
    position: relative;
    padding-bottom: 80px;
    .product-pic-list {
      display: flex;
      flex-wrap: wrap;
      .image {
        width: 200px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
        margin-right: 20px;
        margin-bottom: 20px;
        &:hover {
          .deal-wrap {
            display: flex;
          }
        }
        img {
          width: 100%;
        }
        .deal-wrap {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.3);
          display: none;
          justify-content: center;
          align-items: center;
        }
        .deal-item {
          color: #ffffff;
          font-size: 16px;
          cursor: pointer;
          &:hover {
            color: #369ad1;
          }
          & + .deal-item {
            margin-left: 20px;
          }
        }
      }
    }
    .uploader {
      margin-bottom: 20px;
    }
    .cover {
      width: 200px;
      height: 100px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px dashed #dcdfe6;
      color: #999999;
      &:hover {
        color: #369ad1;
        border-color: #369ad1;
      }
    }
    .table-header {
      line-height: 42px;
      background-color: #E6E6E6;
      display: flex;
      font-size: 14px;
      font-weight: bold;
      margin-top: 20px;
      div {
        padding-left: 20px;
      }
    }
    .award-item {
      padding: 28px 0 10px 0;
      border-bottom: 1px solid #dcdfe6;
      display: flex;
    }
    .ticket-code-wrap {
      display: flex;
      align-items: center;
      .left-wrap {
        width: 210px;
        font-size: 12px;
        line-height: 17px;
        color: #999999;
        .left-content {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .right-wrap {
        flex: 1;
        text-align: center;
      }
    }
    .popularity-tips {
      display: inline-block;
      vertical-align: middle;
      margin-left: 10px;
      position: relative;
      &:hover {
        .popularity-content {
          display: block;
        }
      }
      .popularity-content {
        display: none;
        position: absolute;
        width: 320px;
        padding: 5px;
        border: 1px solid #c0c4cc;
        z-index: 2;
        background-color: #fff;
        border-radius: 4px;
        line-height: 23px;
        top: 0px;
        left: 30px;
        &:before {
          content: '';
          border: 10px solid transparent;
          border-right-color: #c0c4cc;
          position: absolute;
          top: 10px;
          left: -20px;
        }
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
