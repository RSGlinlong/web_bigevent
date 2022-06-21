var layer = layui.layer
var form = layui.form
$(function() {
    initArtCateList()
        // 页面渲染函数
    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                var str = template('tpl-table', res)
                $('#tbody').html(str)

            }
        });
    }
    // 添加类别点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            title: '添加文章分类',
            content: $('#dialog-add').html(),
            type: 1,
            area: ['500px', '250px']
        })
    })

    // 确认添加函数事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败', {
                        icon: 5
                    })
                }
                layer.msg('新增文章分类成功', {
                    icon: 6
                })
                layer.close(indexAdd)
                initArtCateList()
            }
        });
    });

    // 编辑文章分类
    var indexEdit = null
    $('#tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            title: '编辑文章分类',
            content: $('#dialog-edit').html(),
            type: 1,
            area: ['500px', '250px']
        })

        var id = $(this).attr('data-id')
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        });
    })

    // 编辑文章分类提交
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    })
                }
                layer.msg(res.message, {
                    icon: 6
                })
                layer.close(indexEdit)
                initArtCateList()
            }
        });
    })

    // 删除分类
    $('#tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        layer.confirm('确定删除?', {
            icon: 3,
            title: '提示'
        }, function(index) {

            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message, {
                            icon: 5
                        })
                    }
                    layer.msg(res.message, {
                        icon: 6
                    })
                    layer.close(index);
                    initArtCateList()
                }
            });


        });
    })
})