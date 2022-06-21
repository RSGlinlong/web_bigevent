var layer = layui.layer
var form = layui.form
var laypage = layui.laypage
$(function () {

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        const y = dt.getFullYear()
        const m = addZero(dt.getMonth() + 1)
        const d = addZero(dt.getDay())

        const hh = addZero(dt.getHours())
        const mm = addZero(dt.getMinutes())
        const ss = addZero(dt.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    // 补零函数
    function addZero(n) {
        return n > 9 ? n : '0' + n
    }


    //定义一个查询对象 将来请求数据时
    // 需要将请求参数提交至服务器
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, // 页面显示行数
        cate_id: '', //文章分类id
        state: '' //文章发布状态
    }


    // 获取文章列表数据的方法并调用
    initTable()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var str = template('tpl-table', res.data)
                $('#tbody').html(str)
                renderPage(res.total)
            }
        });
    }


    //获取文章分类
    initCate();

    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据分类失败')
                }
                var str = template('tpl-cate', res)
                $('[name=cate_id]').html(str)
                form.render()
            }
        });
    }

    // 筛选点击事件
    $('#screenForm').on('submit', function (e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state
        // 注意 根据最新的筛选条件 重新渲染
        initTable()
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'test1', //分页的容器的ID
            count: total, // 总数据的条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的页  
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: ['2', '3', '5', '10'],
            // 触发jump事件的方法有两种
            // 1. 点击页码的时候，会触发jump回调
            // 2. 只要调用laypage.render方法，就会触发jump回调
            jump: function (obj, first) {
                // 把最新的页码值 赋值到q这个查询参数中
                q.pagenum = obj.curr
                // 把最新的条目数 复制到q的条目数中
                q.pagenum = obj.limit
                // 如果first不等于true 证明jump回调不是通过调用render函数
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 点击删除按钮事件
    $('#tbody').on('click', '.btn-delete', function () {
        var length = $('.btn-delete').length()
        layer.confirm('确定删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            var id = $(this).attr('data-Id')
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章数据成功', {
                            icon: 5
                        })
                    }
                    layer.msg('删除文章数据成功', {
                        icon: 6
                    })
                    // 当数据删除完成后， 需要判断当前这一页中， 是否还有剩余的数据
                    // 如果没有剩余的数据 则让页码值-1 然后再重新调用渲染列表initTable()
                    if (length === 1) {
                        q.pagenum = q.pagenum = 1 ? q.pagenum : q.pagenum - 1
                        initTable()
                    }
                }
            });

            layer.close(index);
        });

    });



})