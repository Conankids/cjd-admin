module.exports = {
  '/protected': {
    target: 'http://new.jiguo.com',
    secure: true,
    changeOrigin: true
  },
  '/admin': {
    target: 'http://cj.jiguo.com',
    secure: true,
    changeOrigin: true
  }
}