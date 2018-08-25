<template>
    <el-card class="box-card">
        <div class="ft20" slot="header">找不到该页面</div>
        <div class="box-card-content">
            <i class="el-icon-error no-access"></i>
        </div>
        <div class="box-card-bottom">
            <el-button @click="backHome">返回首页</el-button>
            <el-button type="primary" @click="back">返回上一页</el-button>
        </div>
    </el-card>
</template>

<script>
    export default {
        data() {
            return {}
        },
        methods: {
            backHome() {
                this.$router.push('/')
            },
            back() {
                this.$router.go(-1)
            }
        }
    }
</script>

<style lang="less" scoped>
    .box-card {
        width: 500px;
        height: 400px;
        margin: 200px auto 0;
    }

    .box-card-content {
        text-align: center;
        font-size: 150px;
        color: #fc6b6b;
    }

    .box-card-bottom {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .no-access {
        animation: noAccess 1s linear 0s infinite;
    }

    @keyframes noAccess {
        0% {
            transform: translateX(0px);
        }
        3% {
            transform: translateX(-10px);
        }
        6% {
            transform: translateX(10px);
        }
        12% {
            transform: translateX(-10px);
        }
        18% {
            transform: translateX(10px);
        }
        24% {
            transform: translateX(-10px);
        }
        30% {
            transform: translateX(10px);
        }
        33% {
            transform: translateX(0px);
        }
        100% {
            transform: translateX(0px);
        }
    }
</style>