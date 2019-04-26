<template>
  <div class="list-header">
    <div class="list-title" v-if="/(check|timing|down)/.test(page_type)">
      <h3>{{page_title}}</h3>
      <div>
        <el-button class="mr20"
                   type="text"
                   size="small"
                   v-if="/(check|timing|down)/.test(page_type)"
                   @click="sortList">创建时间{{order_add_time ? '↑' : '↓'}}
        </el-button>
        <el-input v-model="meta_title" size="small" placeholder="请输入奖品关键词" style="width: 400px;"
                  @keyup.native.enter="initList">
          <el-button slot="append" icon="el-icon-search" @click="initList"></el-button>
        </el-input>
      </div>
    </div>
    <div class="list-search-title" v-if="!/(check|timing|down)/.test(page_type)">
      <h3>
        <!-- cece -->
        <a href="javascript:;" v-if="homepage==1"
            v-for="(item,index) in person_list"
           :key="index"
           :class="((index+1)===person_c_type)?'on':''"
           @click="personChooseType(index+1,item.status)"
        >{{item.name}}</a>

         <a href="javascript:;"   v-if="!homepage"
           v-for="(item,index) in status_list"
           :key="index"
           :class="(index===current_type)?'on':''"
           @click="chooseType(index,item.status)"
        >{{item.name}}</a>
      </h3>
      <el-input v-model="meta_title" size="small" placeholder="请输入奖品关键词" style="width: 400px;"
                @keyup.native.enter="initList">
        <el-button slot="append" icon="el-icon-search" @click="initList"></el-button>
      </el-input>
    </div>
    <div class="list-search" v-if="!/(check|timing|down)/.test(page_type)">
      <div class="Z-row">
        <span class="Z-name">上线时间：</span>
        <el-date-picker
          class="mr20"
          v-model="addtime"
          type="daterange"
          size="small"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeTime">
        </el-date-picker>
        <el-button v-for="(item,index) in recen_list"
                   :key="index"
                   @click="chooseTime(item.status)"
                   type="text">{{item.name}}
        </el-button>
        <div class="r">
          <el-button type="text" @click="sortOnlineTimeList">上线时间
            <span v-show="sort_type==='order_online_time'">{{sort_value==='ASC' ? '↑' : '↓'}}</span>
          </el-button>
          <el-button class="ml20" type="text" @click="sortStartTimeList">开奖时间
            <span v-show="sort_type==='order_lottery_time'">{{sort_value==='ASC' ? '↑' : '↓'}}</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    props: {
      page_type: {
        type: String,
        default: ''
      },
      page_title: {
        type: String,
        default: ''
      },
      //cece
      homepage:{
        type:String,
        default:''
      }
      
    },
    data() {
      return {
        status_list: [  //上线活动状态列表
          {name: '全部', status: ''},
          {name: '进行中', status: 0},
          {name: '已开奖', status: 1},
          {name: '已失效', status: 2}
        ],
        //cece
        person_list:[
          {name: '申请', status: 0},
          {name: '首页', status: ''},
        ],
        recen_list: [  //快捷上线时间查询列表
          {name: '今天', status: 1},
          {name: '近3天', status: 3},
          {name: '近7天', status: 7}
        ],
        current_type: 0,  //当前选择的活动状态
        person_c_type:1,  //cece当前个人抽奖的状态
        meta_title: '', //搜索关键字
        addtime: [],  //搜索时间数组
        order_add_time: false,  //创建时间排序
        order_online_time: false, //上线时间排序
        order_lottery_time: false,  //开奖时间排序
        last_days: 0, //快捷上线时间查询
        list_type: '',  //列表状态
        send_status: '',  //上线活动状态
        person_s_status:'',//cece个人当前个人抽奖上线
        sort_type: 'order_online_time',  //排序类型
        sort_value: 'DESC'  //排序值
      }
    },
    computed: {
      //获取列表状态字符串对应状态值
      status() {
        switch (this.page_type) {
          case 'check':
            return 0
          case 'timing':
            return 21
          case 'online':
            return 1
          case 'down':
            return -2
        }
      }
    },
    created() {
      this.list_type = this.page_type
      this.initList()
      this.personInitList();
    },
    methods: {
      //获取宝贝列表
      initList() {
        const data = {
          status: this.status,
          send_status: this.send_status,
          s_online_time: this.addtime[0],
          e_online_time: this.addtime[1],
          meta_title: this.meta_title,
          last_days: this.last_days
        }
        switch (this.sort_type) {
          case 'order_add_time':
            Object.assign(data, {
              order_add_time: this.sort_value
            })
            break
          case 'order_online_time':
            Object.assign(data, {
              order_online_time: this.sort_value
            })
            break
          case 'order_lottery_time':
            Object.assign(data, {
              order_lottery_time: this.sort_value
            })
            break
        }
        this.$store.dispatch('getPersonalList', data)
        //重置快捷上线时间搜索
        this.last_days = 0
      },
      //获取首页申请的列表
      personInitList() {
        const data = {
          is_home:this.person_c_type,
          status: this.status,
          send_status: this.person_s_status,
          s_online_time: this.addtime[0],
          e_online_time: this.addtime[1],
          meta_title: this.meta_title,
          last_days: this.last_days
        }
        switch (this.sort_type) {
          case 'order_add_time':
            Object.assign(data, {
              order_add_time: this.sort_value
            })
            break
          case 'order_online_time':
            Object.assign(data, {
              order_online_time: this.sort_value
            })
            break
          case 'order_lottery_time':
            Object.assign(data, {
              order_lottery_time: this.sort_value
            })
            break
        }
        this.$store.dispatch('personListForHome', data)
        //重置快捷上线时间搜索
        this.last_days = 0
      },
      //切换type
      chooseType(index, status) {
        this.current_type = index
        this.send_status = status
        this.initList()
      },
      //cece切换type
      personChooseType(index, status){
        this.person_c_type = index
        this.person_s_status = status
        this.personInitList();
        console.log(this.person_c_type,this.person_s_status)
      },
      //选择时间
      changeTime(val) {
        if (!val) {
          this.addtime = []
        }
        this.initList()
      },
      //时间快捷按钮
      chooseTime(status) {
        this.last_days = status
        const et = new Date()
        const st = new Date(et.getTime() - status * 86400 * 1000)
        this.addtime = [st, et]
        this.initList()
      },
      //创建时间排序
      sortList() {
        this.order_add_time = !this.order_add_time
        this.sort_type = 'order_add_time'
        this.sort_value = this.order_add_time ? 'ASC' : 'DESC'
        this.initList()
      },
      //上线时间排序
      sortOnlineTimeList() {
        this.order_online_time = !this.order_online_time
        this.sort_type = 'order_online_time'
        this.sort_value = this.order_online_time ? 'ASC' : 'DESC'
        this.initList()
      },
      //开奖时间排序
      sortStartTimeList() {
        this.order_lottery_time = !this.order_lottery_time
        this.sort_type = 'order_lottery_time'
        this.sort_value = this.order_lottery_time ? 'ASC' : 'DESC'
        this.initList()
      },
      ...mapActions([
        'getPersonalList','personListForHome'
      ])
    }
  }
</script>

<style lang="less">
  .list-header {
    .list-search-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #dcdfe6;
      height: 50px;
      line-height: 50px;
      h3 {
        a {
          margin-right: 30px;
          font-size: 18px;
          display: inline-block;
          vertical-align: middle;
          line-height: 42px;
          border-bottom: 4px solid transparent;
          &.on {
            color: #FC6B6B;
            border-bottom-color: #FC6B6B;
          }
        }
      }
    }
  }
</style>
