<template>
  <div class="add-wrap">
    <DrawForm :formData="formData" :isEdit="true" :url="`/admin/Lotterylist/EditSave?id=${$route.params.id}`"/>
  </div>
</template>

<script>
  import {getInfo} from '@/api/draw'
  import DrawForm from './draw-form'

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
            console.log(this.formData);
          }
        })
      }
    },
    components: {
      DrawForm
    }
  }
</script>