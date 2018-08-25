<template>
  <div class="user-manage">
    <el-form :inline="true"
             label-width="90px">
      <el-form-item label="用户昵称：">
        <el-input class="w140" v-model="search.username"></el-input>
      </el-form-item>
      <el-form-item label="用户id：">
        <el-input class="w140" v-model="search.uid"></el-input>
      </el-form-item>
      <el-form-item label="用户状态：">
        <el-select class="w140" v-model="search.is_ban">
          <el-option v-for="(item,index) in options"
                     :key="index"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="_getUserList">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="user_list.data"
        :header-cell-style="{backgroundColor:'#f5f7fa'}"
        style="width: 100%">
      <el-table-column
          prop="username"
          label="用户昵称">
      </el-table-column>
      <el-table-column
          prop="uid"
          label="用户ID">
      </el-table-column>
      <el-table-column
          prop="reg_date"
          label="注册时间">
      </el-table-column>
      <el-table-column
          label="状态">
        <template slot-scope="scope">
          {{getStatus(scope.row)}}
        </template>
      </el-table-column>
      <el-table-column
          label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editStatus(scope.row)">修改状态</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-row class="mt30 tc" v-if="user_list && (user_list.count>user_list.size)">
      <el-pagination
          @current-change="handleCurrentChange"
          :background="true"
          :current-page="Number(user_list.page)"
          :page-size="Number(user_list.size)"
          layout="total, prev, pager, next, jumper"
          :total="Number(user_list.count)">
      </el-pagination>
    </el-row>

    <!--修改状态-->
    <el-dialog
        class="flex-center"
        title="修改状态"
        top="0"
        width="420px"
        :visible="isShowEditStatus"
        :close-on-click-modal="false"
        @close="closeEditStatusLayer">
      <div>
        <el-row class="Z-row">
          <span class="Z-name">用户昵称：</span>{{cur_item.username}}
        </el-row>
        <el-row class="Z-row">
          <span class="Z-name">用户ID：</span>{{cur_item.uid}}
        </el-row>
        <el-row class="Z-row">
          <span class="Z-name">状态：</span>
          <el-radio-group v-model="edit_data.is_ban">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">封禁</el-radio>
          </el-radio-group>
        </el-row>
        <el-row class="Z-row" v-show="edit_data.is_ban==='1' && cur_item.is_ban==='0'">
          <span class="Z-name">封禁时间：</span>
          <el-radio-group v-model="edit_data.ban_time">
            <el-radio label="1">一天</el-radio>
            <el-radio label="30">一个月</el-radio>
            <el-radio label="0">永久</el-radio>
          </el-radio-group>
        </el-row>
      </div>
      <div slot="footer">
        <el-button type="primary"
                   @click="sendEditStatus">确定
        </el-button>
        <el-button @click="closeEditStatusLayer">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getUserList, editUserStatus} from '@/api/user'

  export default {
    data() {
      return {
        isShowEditStatus: false,  //是否显示修改状态弹窗
        page: '', //当前页码
        user_list: [],  //用户列表
        cur_item: {}, //当前操作用户数据
        edit_data: {  //修改状态数据
          is_ban: '0',
          ban_time: ''
        },
        search: { //搜索数据
          username: '',
          uid: '',
          is_ban: ''
        },
        options: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '正常',
            value: '0'
          },
          {
            label: '封禁',
            value: '1'
          }
        ]
      }
    },
    created() {
      this._getUserList()
    },
    methods: {
      //获取用户列表
      _getUserList() {
        const data = Object.assign(this.search, {
          size: this.user_list.size || 20,
          page: this.page || 1
        })
        getUserList({
          params: data
        }).then(res => {
          if (res.resultCode === '0') {
            this.user_list = res.result
          } else {
            this.$message.error(res.errosrMsg)
          }
        })
      },
      //用户状态对应显示文案
      getStatus(user) {
        if (user.is_ban === '0') {
          return '正常'
        } else if (user.is_forever_ban === '0') {
          return `封禁至${user.ban_time}`
        } else {
          return '永久封禁'
        }
      },
      //显示修改文案弹窗
      editStatus(item) {
        this.cur_item = item
        this.edit_data.is_ban = item.is_ban
        this.isShowEditStatus = true
      },
      //提交修改数据
      sendEditStatus() {
        const edit_data = Object.assign(this.edit_data, {
          uid: this.cur_item.uid
        })
        editUserStatus({
          params: edit_data
        }).then(res => {
          if (res.resultCode === '0') {
            this.$message.success('修改成功')
            this.closeEditStatusLayer()
            this._getUserList()
          } else {
            this.$message.error(res.errorMsg)
          }
        })
      },
      //关闭修改状态弹窗
      closeEditStatusLayer() {
        this.isShowEditStatus = false
        this.cur_item = {}
        this.edit_data.is_ban = '0'
        this.edit_data.ban_time = ''
      },
      //翻页
      handleCurrentChange(val) {
        this.page = val
        this._getUserList()
      }
    }
  }
</script>