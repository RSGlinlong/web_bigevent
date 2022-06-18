var layer = layui.layer
var form = layui.form
var laypage = layui.laypage
$(function() {

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
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
        pagenum: 2, //页码值
        pagesize: 5, // 页面显示行数
        cate_id: '', //文章分类id
        state: '' //文章发布状态
    }


    // 获取文章列表数据的方法并调用
    initTable()

    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
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
            success: function(res) {
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
    $('#screenForm').on('submit', function(e) {
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
            elem: 'test1',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum
        })
    }


})