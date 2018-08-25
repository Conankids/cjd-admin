<template>
  <el-dialog :visible="isShow"
             title="图片剪裁"
             :close-on-click-modal="false"
             @open="openCropper"
             @close="closeCropper">
    <el-row>
      <el-col :span="16">
        <div class="cropper">
          <img :src="cropperData.url" ref="cropperImg">
        </div>
      </el-col>
      <el-col :span="8" class="tc">
        <div id="preview" class="previewBox"></div>
        <div class="mt50">
          <el-button type="primary"
                     :loading="isUpload"
                     icon="el-icon-setting"
                     @click="crop">裁剪
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  import {upLoadPic} from '@/api/draw'
  import Cropper from 'cropperjs'
  import 'cropperjs/dist/cropper.min.css'

  export default {
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      cropperData: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        isUpload: false,
        cropper: {},
        updateData: {}
      }
    },
    methods: {
      openCropper() {

        this.$nextTick(() => {
          let img = this.$refs.cropperImg
          this.cropper = new Cropper(img, {
            viewMode: 1,
            dragMode: 'move',
            preview: '#preview',
            aspectRatio: this.cropperData.ratio,
            restore: false,
            center: false,
            highlight: false,
            toggleDragModeOnDblclick: false
          })
        })
      },
      closeCropper() {
        this.$emit('update:isShow', false)
        this.cropper.destroy()
      },
      crop() {
        let cas = this.cropper.getCroppedCanvas({
          fillColor:'#fff',
          imageSmoothingQuality: 'high'
        })
        this.isUpload = true
        cas.toBlob((blob) => {
          let data = new FormData()
          let _id = 'id-' + String(Math.random()).replace('.', '')
          data.append('file', blob, `${_id}.jpeg`)
          upLoadPic({
            data: data
          }).then(res => {
            this.isUpload = false
            if (res.resultCode === 0) {
              this.updateData = res.result.fileid
              this.$emit('updateImg', this.updateData)
              this.$emit('update:isShow', false)
            } else {
              this.$message.error(res.errorMsg)
            }
          })
        }, 'image/jpeg', '0.95')
      }
    }
  }
</script>

<style lang="less" scoped>
  .cropper {
    img {
      width: 100%;
    }
  }

  .previewBox {
    width: 160px;
    height: 90px;
    overflow: hidden;
    margin: 0 auto;
  }
</style>