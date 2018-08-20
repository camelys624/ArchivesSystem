let url = "http://192.168.2.128:8081";
let form;
$(function () {
    layui.use(['form', 'upload', 'tree', 'table', 'layer'], function () {
        form = layui.form; //获取form模块
        let upload = layui.upload, //获取upload模块
            layer = layui.layer,
            tree = layui.tree,
            table = layui.table;
        form_select();

        //提交新增表单
        form.on('submit(add_save)', function (data) {
            console.log(data.field);
            $.ajax({
                type: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                url: url + '/admin/basicsModule/sysDictCode/add',
                data: data.field,
                success: function (res) {
                    layer.msg(res.msg);
                    getdata_table(data.field.parentId); //重新加载数据
                }
            });
            layer.closeAll(); //关闭弹出框
            return false;
        });
        //提交修改表单
        form.on('submit(edit_save)', function (data) {
            $.ajax({
                type: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                url: url + '/admin/basicsModule/sysDictCode/update',
                data: data.field,
                success: function (res) {
                    layer.msg(res.msg);
                    let parentID = $($("td[data-field='parentId'] div")[0]).text();
                    getdata_table(parentID); //重新加载数据
                }
            });
            layer.closeAll();
            return false;
        });
    });
    //为每个一级目录节点绑定事件    
    $("#side_ul").on('click', '.side_list', function () {
        $(".side_list").removeClass("side_list_act");
        $(this).addClass('side_list_act');
        let parentId = $(this).attr("name").replace("side_list", "");
        getdata_table(parentId);
    });

    //默认打开第一个子项目的数据
    getdata_table(2);
    $($(".side_list")[1]).addClass('side_list_act');
    //新增按钮
    $("#add_btn").click(function () {
        //  alert($($("td[data-field='parentId'] div")[0]).text());
        let parentID = $($("td[data-field='parentId'] div")[0]).text();
        $("#add input[name='parentId']").val(parentID);
        layer.open({
            type: 1,
            title: '字典管理',
            skin: 'btn-class',
            content: $("#add"),
            area: ['450px', '420px']
        });
    });

    //提交修改请求
    $("#edit_form").submit(function (data) {
        $.ajax({
            type: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            url: url + '/admin/basicsModule/sysDictCode/update',
            success: function (res) {
                console.log(res);
            }
        });
        //layer.close();
    });
});
//请求左边导航部分
function form_select() {
    $.ajax({
        method: "GET", //请求方式
        url: url + "/admin/basicsModule/sysDictCode/selectByParentId",
        data: "parentId=0", //请求参数
        success: function (data) { //返回结果
            slide_list = data;
            let side_ul = $("#side_ul");
            let add_select = $("#add_select");
            for (let i = 0; i < data.length; i++) {
                let li = '<li class="side_list" name="side_list' + data[i].id + '">' + data[i].svalue + '</li>';
                side_ul.append(li);
            }
            form.render();
        }
    });

}

//请求表格数据
function getdata_table(parentId) {
    $.ajax({
        method: "GET",
        url: url + "/admin/basicsModule/sysDictCode/selectByParentId",
        data: "parentId=" + parentId, //请求参数
        success: function (data) {
            layui.use(['table', 'layer'], function () {
                let table = layui.table,
                    layer = layui.layer;
                table.render({
                    elem: '#data_table',
                    height: 580,
                    page: true, //开启分页
                    cols: [[ //表头
                        {
                            field: 'id',
                            title: '字典编号',
                            width: 180,
                            sort: true
                        },
                        {
                            field: 'fkTypeCode',
                            title: '字典类型',
                            width: 100
                        },
                        {
                            field: 'parentId',
                            title: '字典父编号',
                            width: 100
                        },
                        {
                            field: 'code',
                            title: '字典值',
                            width: 100
                        },
                        {
                            field: 'svalue',
                            title: '字典名称',
                            width: 120
                        },
                        {
                            field: 'diabled',
                            title: '禁用状态',
                            width: 100
                        },
                        {
                            field: 'createTime',
                            title: '创建时间',
                            width: 177
                        },
                        {
                            field: 'updateTime',
                            title: '更新时间',
                            width: 177
                        },
                        {
                            fixed: 'right',
                            title: "操作",
                            width: 120,
                            align: 'center',
                            toolbar: '#barDemo'
                        }
                    ]],
                    data: data
                });
                //监听工具条
                table.on('tool(test)', function (obj) {
                    let data = obj.data;
                    console.log(data);
                    if (obj.event === 'del') {
                        layer.confirm('确定删除id为  ' + data.id + '  的数据项吗', function (index) {
                            obj.del();
                            $.ajax({
                                type: "POST",
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                url: url + '/admin/basicsModule/sysDictCode/del',
                                data: "id[]=" + data.id,
                                success: function (res) {
                                    console.log(res.msg);
                                }
                            });
                            layer.close(index);
                        });
                    } else if (obj.event === 'edit') { //修改操作
                        $("#edit_form input[name='id']").val(data.id);
                        $("#edit_form input[name='code']").val(data.code);
                        $("#edit_form input[name='svalue']").val(data.svalue);
                        $("#edit_form input[name='fkTypeCode']").val(data.fkTypeCode);
                        layer.open({
                            type: 1,
                            title: '字典修改',
                            skin: 'add-class',
                            content: $("#edit"),
                            area: ['450px', '420px']
                        });
                    }
                });
            });
        }
    });
}