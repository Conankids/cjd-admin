<!--撤下和审核的弹窗以及业务处理-->
<template>
  <div class="add-wrap">
    <div>
      <!-- 审核页面 -->
      <el-dialog title="审核" :visible.sync="dialogCheck" center width="30%">
        <el-form :model="form">
          <el-form-item label="特殊资源">
            <el-radio-group v-model="form.is_affirm">
              <el-radio label="通过"></el-radio>
              <el-radio label="拒绝"></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="填写信息">
            <el-input type="textarea" v-model="form.desc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button @click="dialogCheck = false">取 消</el-button>
          <el-button type="primary" @click="dialogCheck = false">确 定</el-button>-->
          <el-button @click="sendInfo()">提交</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 撤下页面 -->
  </div>
</template>

<script>
import {deletFromHome,addForHome} from '@/api/draw.js'

export default {
  data() {
    return {
      type: "1",
      dialogCheck: false,
      form: {
        is_affirm: ""
      }
    };
  },
  methods: {
    //审核内容
    openDialog() {
      // console.log(item);
      this.dialogCheck = true;
    },
    sendInfo() {
      this.dialogCheck = false;
    },
    //撤下页面
    openRemove() {
      this.$confirm("确定将抽奖从首页撤下？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
         
        });
    }
  }
};
</script>
