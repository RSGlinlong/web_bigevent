var layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
$(function() {
    // 初始化图片url
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 点击上传按钮
    $('#btnChooseImage').on('click', function() {
        $('#file').click()
    })

    // 文件选中后事件
    $('#file').on('change', function(e) {
        let filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择图片!')
        }
        // 获取文件
        let file = e.target.files[0]
            // 调用URL方法获取图片的地址
        let imgUrl = URL.createObjectURL(file)
            // 更新裁剪区
        $image.cropper('destroy').attr('src', imgUrl).cropper(options)
    })

    // 确定上传事件
    $('#btnUpload').on('click', function() {
        // 把图片转换为base64编码
        var dataURl = $image.cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        }).toDataURL('image/png')
        $.ajax({
            type: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURl
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败', { icon: 5 })
                }
                return layer.msg('更换头像成功!', { icon: 6 }), window.parent.getUserinfo()

            }
        });
    })

})

// 初始化图片
function getUserinfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        success: function(res) {
            $image.attr('src', res.data.user_pic)
        }
    })
}