var form = layui.form
var layer = layui.layer
$(function() {
    // 表单验证
    form.verify({
        nickname: function(value) {
            if (value > 6) {
                return "昵称长度必须在1 - 6个字符之间！"
            }
        }
    });

    // 调用初始化用户的基本信息函数
    initUserInfo()

    // 重置表单
    $('#resetBtn').click(function(e) {
        e.preventDefault();
        //调用初始化用户的基本信息
        initUserInfo()
    });

    // 提交更新用户信息
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败', { icon: 5 })
                }
                layer.msg('更新用户信息成功', { icon: 6 })
                window.parent.getUserinfo()
            }
        });
    })
})


// 初始化用户的基本信息
function initUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败')
            } else {
                form.val('formUserInfo', res.data)
                    // $('#nickname').val(res.data.nickname);
                    // $('#email').val(res.data.email);
            }

        }
    });
}