//添加打包出口文件环境
'usr strict'

const path=require("path");

module.exports={
    NODE_ENV:"'jmc'",
    index:path.resolve(__dirname,'../../../jiguozhidx/cj/protected/modules/admin/views/index/index.php'),
    assetsRoot: path.resolve(__dirname,'../../../jiguozhidx/jiguo-dev/cdn/cjd')
}