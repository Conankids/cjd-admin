<!--个人抽奖列表-->
<template>
  <div class="add-wrap">
    <dataLibrary :formData="formData" />
  </div>
</template>

<script>
  import {getInfo} from '@/api/draw'
  import dataLibrary from './data-library'

  export default {
    data() {
      return {
        formData: {}
      }
    },
    created() {
      this._getInfo()
    },
    methods: {
      _getInfo() {
        const params = {
          id: this.$route.params.id
        }
        getInfo({
          params: params
        }).then(res => {
          if (res.resultCode === '0') {
            this.formData = res.result
          }
        })
      }
    },
    components: {
      dataLibrary
    }
  }
</script>
