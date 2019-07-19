//添加打包出口文件环境
'usr strict'
const path=require('path')

module.exports={
    NODE_ENV:'"pingzi"',
    index:path.resolve(__dirname,'../../cj/protected/modules/admin/views/index/index.php'),
    assetsRoot: path.resolve(__dirname,'../../cdn/cjd')
}
   