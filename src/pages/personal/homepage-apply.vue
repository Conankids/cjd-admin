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
           type:"1"
        }
    },
    components: {
      DataLibrary
    }
  }
</script>
