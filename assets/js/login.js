$(function() {
    // 点击切换注册登录操作
    $('#link_reg').on('click', () => {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    $('#link_login').on('click', () => {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 从layui中 获取form对象
    let form = layui.form
    let layer = layui.layer
    form.verify({
        // 自定义了校验规则 用来管理密码
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致
        repwd: function(value) {
            const pwd = $('.reg-box [name=password]').val()
            if (value !== pwd) return '两次密码不一致'
        }
    })

    // 监听注册表单提交

    $('#form_reg').on('submit', function(e) {
        // 解除默认提交行为
        e.preventDefault();
        // 获取表单数据
        let data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
            // 请求注册 POST
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message, { icon: 5 });
            }
            layer.msg('注册成功,请登录！', { icon: 6 });
            $('#link_login').click()
        })
    })

    // 监听登录表单提交
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg('登录失败', { icon: 5 });
                layer.msg('登录成功!', { icon: 6 });
                // 登录成功后 将token保存至localStorage
                localStorage.setItem('token', res.token);
                // 登录验证成功 跳转至首页
                setTimeout(function() {
                    location.href = '/index.html'
                }, 750)

            }
        })
    })
})