$.ajaxPrefilter(function(options) {
    // 拼接根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url);
})