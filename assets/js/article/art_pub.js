$(function() {
    var form = layui.form
    var layer = layui.layer
        // 获取文章分类
    initCate()
    initEditor()

    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                var str = template('tpl-cate', res)
                $('[name=cate_id]').html(str)
                form.render()
            }
        });
    }

    // 初始化封面图片区域
    var $image = $('#image')
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    $image.cropper(options)

    // 选择封面文件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    //监听 coverFile 的change事件 
    $('#coverFile').on('change', function(e) {
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        $image.cropper('destroy').attr('src', newImgURL).cropper(options)
    })

    //定义文章的发布状态
    var art_state = '已发布'
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    // 为表单监听提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)

        $image.cropper('getCroppedCanvas', {
            width: 400,
            hight: 280
        }).toBlob(function(blob) {
            fd.append('cover_img', blob)
            publishArticle(fd)

        })
    });

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            // 注意 如果向服务器提交的是Formdata格式数据, 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败', { icon: 5 })
                }
                layer.msg('发布文章成功', { icon: 6 })
                location.href = '/article/art_list.html'
            }
        });
    }

})