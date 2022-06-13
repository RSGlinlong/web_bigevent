$(function() {
    // 调用ajax获取用户信息函数
    getUserinfo()
        // 用户退出登录函数
    $('#btnLogout').click(function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            // 清除本地token
            localStorage.removeItem('token')
                // 跳转至登录页面
            location.href = '/login.html'
                // 关闭confirm弹出层
            layer.close(index);

        });
    });
})

// ajax获取用户信息函数
function getUserinfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        success: function(res) {
                if (res.status !== 0) return layui.layer.msg('获取用户信息失败');

                // 调用渲染用户信息函数
                renderAvatar(res.data)
            }
            // complete: function(res) {
            //     // 判断用户信息获取失败 (用于防止用户未登录直接进入主页网址)
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         // 清除token
            //         localStorage.removeItem('token')
            //         location.href = '/login.html'
            //     }
            // }
    });
}

// 渲染用户信息及头像
function renderAvatar(user) {
    // 获取用户名称
    let name = user.nikename || user.username
        // 渲染用户名
    $('#username').html(name);

    // 按需渲染头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show();
        $('.layui-nav-img').hide();
    }
}