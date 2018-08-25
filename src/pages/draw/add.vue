<template>
  <div class="add-wrap">
    <DrawForm :formData="formData" url="/admin/Lotterylist/AddSave"/>
  </div>
</template>

<script>
  import DrawForm from './draw-form'

  export default {
    data() {
      return {
        formData: {}
      }
    },
    created() {
      //模拟异步触发draw-form组件的watch事件
      setTimeout(() => {
        this.formData = {
          meta_list: [
            {
              title: '',
              num: '',
              price:'1'
            }
          ],
          cover: '',
          detail: '',
          is_sponsor: '0',
          sponsor_name: '',
          sponsor_detail: '',
          is_wxcode_url: '1',
          sponsor_wxcode_id: '',
          sponsor_wxcode_name: '',
          sponsor_btn_name: '',
          sponsor_wxcode_url: '',
          lottery_time: '',
          online_time: '',
          apply_condition: '0',
          is_team: '0',
          team_num: '2',
          admin_type:'1',
          apply_condition_num: '',
          apply_condition_tips: ''
        }
      })
    },
    components: {
      DrawForm
    }
  }
</script>
