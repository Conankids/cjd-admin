<!--个人抽奖列表-->
<template>
  <div class="add-wrap">
    <DataLibrary :is_homepage='type'/>
  </div>
</template>

<script>
  import DataLibrary from './data-library'

  export default {
    data(){
        return{
           type:"1" //传给子组件的是个人申请页面的状态值，便于区分。
        }
    },
    components: {
      DataLibrary
    }
  }
</script>
