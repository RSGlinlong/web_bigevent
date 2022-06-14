var form = layui.form
var layer = layui.layer
$(function() {
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function(value) {
            if (value === $('#oldPwd').val()) return '新旧密码不能一致'
        },
        dftPwd: function(value) {
            if (value !== $('#newPwd').val()) return '两次密码不一致'
        }
    })

    $('.layui-form').submit(function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                layer.msg(res.message, { icon: 6 })
                $('.layui-form')[0].reset()
            }
        });
    });

})