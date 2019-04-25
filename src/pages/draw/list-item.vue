<template>
  <router-link :to="`/draw/edit/${listItem.id}`" target="_blank">
    <li class="item">
      <div class="item-img">
        <img v-lazy="`http://s1.jiguo.com/${listItem.cover}/640`">
      </div>
      <div class="item-content">
        <div class="item-title">
          <div>
            <div class="b ft16 "
                 v-for="(item,index) in listItem.meta_list"
                 :key="index">
              <span>{{item.title}}</span>
              <span class="ml10">x{{item.num}}</span>

              <span v-if="listItem.popularity_award==1">
                <span class="renqiCode" v-if="item.meta_type==2 && listItem.admin_type==3">人气奖</span>
              <span class="chouCode" v-else-if="index==0 && listItem.admin_type==3" >抽奖码</span>
              </span>
              <span v-else>
                 <span class="chouCode" v-if="index==0 && listItem.admin_type==3" >抽奖码</span>
              <span class="teamCode" v-if="index==0 && listItem.admin_type==2">组队</span>
              </span>
            </div>
          </div>
          <div class="gray tr">
            <p>
              <span>排序值：{{listItem.listorder}}</span>
              <span class="ml10">{{listItem.add_time}}</span>
            </p>
            <p v-if="/(timing)/.test(page_type) && listItem.online_time">定时上线：{{listItem.online_time}}</p>
          </div>
        </div>
        <div class="flex-between mt10">
          <div class="item-desc gray ft12" >
            <slot name="content"></slot>
          </div>
          <slot name="bottom"></slot>
        </div>
      </div>
    </li>
  </router-link>
</template>

<script>
  export default {
    props: {
      listItem: {
        type: Object,
        default: null
      },
      page_type: {
        type: String,
        default: ''
      }
    },
    data() {
      return {}
    }
  }
</script>

<style lang="less" scoped>
  .chouCode,.teamCode,.renqiCode{
    padding: 0px 5px;
    color: green;
    border: 1px solid green;
    font-size: 12px;
  }
  .teamCode{
    color: blue;
    border: 1px solid blue;
  }
  .renqiCode{
    color: gold;
    border: 1px solid gold;
  }
  li {
    display: flex;
    padding: 5px;
    margin: 30px 0;
    cursor: pointer;
    position: relative;
    transition: all linear .2s;
    .item-img {
      width: 240px;
      height: 120px;
      margin-right: 10px;
      overflow: hidden;
      img {
        width: 100%;
        transition: all .5s ease-out .1s;
      }
    }
    .item-content {
      flex: 1;
    }
    .item-title {
      min-height: 92px;
      display: flex;
      justify-content: space-between;
    }
    .item-bottom {
      font-size: 12px;
      & > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    &:hover {
      background-color: #F7F7F7;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      transform: translate3d(0, -2px, 0);
      z-index: 2;
      &:hover {
        .item-img {
          img {
            transform: scale(1.1);
          }
        }
      }
    }
  }
</style>
