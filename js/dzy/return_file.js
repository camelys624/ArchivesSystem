$(function () {
    layui.use(['form', 'table'], function () {
        var form = layui.form, //获取form模块
            table = layui.table;

    });


    //检测输入条码长度
    $("#bar_code").on('keydown keyup chenge', function () {
        var len = $(this).val().length;
        $("#Num_of_words").text(len);
        // alert(1);
        if (len > 20) {
            $("#Num_of_words").css("color", "red");
        } else {
            $("#Num_of_words").css("color", "#000");
        }
    });

    //根据档案盒条码搜索档案盒
    $("#submite_query").click(function () {
        var code = $("#bar_code").val();
        ReturnFile.onShelf(code);
    });
    ReturnFile.getDate(); //获取
});

var url = "http://192.168.2.128:8081";
var ReturnFile = {
    onShelfFile: [],
    checked_arry: [],
    getDate: function () {
        var now = new Date();
        var date = now.getDate();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        if (month < 10) {
            month = '0'.toString() + month.toString();
        }
        var now_date = year + '-' + month + '-' + date;
        $("#date_info").val(now_date);
    },
    onShelf: function (code) { //模糊查询档案盒
        $.ajax({
            type: 'GET',
            url: url + '/admin/areamodule/fileBorrow/bybarcode',
            data: {
                'barcode': code
            },
            success: function (res) {
                if (res.state == undefined) {
                    layer.msg("未找到该档案盒");
                }
                if (res.state == false) {
                    layer.msg(res.msg);
                }
                if (res.state == true) {
                    var bor_id = res.row.id; //借阅表id
                    var existence = false;
                    for (var i = 0; i < ReturnFile.onShelfFile.length; i++) {
                        if (ReturnFile.onShelfFile[i].barcode == res.row.barcode) {
                            existence = true;
                            break;
                        }
                    }
                    if (!existence) {
                        ReturnFile.onShelfFile.push(res.row);
                    } else {
                        layer.msg("该条码已在待归还列表，无需重复添加！");
                    }
                    layui.use(['table'], function () {
                        var table = layui.table;
                        table.render({
                            elem: '#return_table',
                            height: "full-100",
                            cols: [[
                                {
                                    type: 'checkbox',
                                    fixed: 'left'
                            },
                                {
                                    type: 'numbers',
                                    title: '序号',
                            },
                                {
                                    field: 'name',
                                    title: '名称',
                            },
                                {
                                    field: 'useIntention',
                                    title: '借阅目的',
                            },
                                {
                                    field: 'barcode',
                                    title: '条码',
                            }
                        ]],
                            id: 'idTest',
                            data: ReturnFile.onShelfFile,
                            page: true, //开启分页
                            done: function () {}
                        });
                        var $ = layui.$,
                            active = {
                                getCheckData: function () { //获取选中数据

                                    var checkStatus = table.checkStatus('idTest'),
                                        data = checkStatus.data;
                                    var ids = [];
                                    for (var i = 0; i < data.length; i++) {
                                        ids.push(data[i].id);
                                    }
                                    //ReturnFile.returnFilebox(ids);
                                    console.log(ReturnFile.checked_arry);

                                    //删除归还行
                                    console.log($(".layui-table-box div tbody tr").length);
                                    $(".layui-table-main").remove();
                                    for (var i = 0; i < ReturnFile.checked_arry.length; i++) {
                                        var aa = '.layui-table-box div tbody tr:eq(' + (parseInt(ReturnFile.checked_arry[i]) + 3) + ')';
                                        $(aa).hide();
                                    }
                                },
                                getCheckLength: function () { //获取选中数目
                                    var checkStatus = table.checkStatus('idTest'),
                                        data = checkStatus.data;
                                },
                                isAll: function () { //验证是否全选
                                    var checkStatus = table.checkStatus('idTest');
                                    layer.msg(checkStatus.isAll ? '全选' : '未全选')
                                }
                            };

                        $('#return_btn').on('click', function () {
                            var type = $(this).data('type');
                            active[type] ? active[type].call(this) : '';
                        });

                        //监听复选框的选择
                        table.on('checkbox(table_result)', function (obj) {
                            var removeele = false;
                            var removeindex;
                            if (obj.checked) {
                                ReturnFile.checked_arry.push(obj.data.LAY_TABLE_INDEX);
                            } else {
                                for (var i = 0; i < ReturnFile.checked_arry.length; i++) {
                                    if (ReturnFile.checked_arry[i] == obj.data.LAY_TABLE_INDEX) {
                                        removeele = true;
                                        removeindex = i;
                                        break;
                                    }
                                }
                            }
                            if (removeele) {
                                ReturnFile.checked_arry.splice(i, 1);
                            }
                        });
                    });
                }
            }
        });
    },
    returnFilebox: function (data) {
        //        var ids = '';
        //        for (var i = 0; i < data.length; i++) {
        //            ids += data[i] + ',';
        //        }
        //        var jsondata = '{"ids":"' + ids + '"}';
        //        $.ajax({
        //            type: 'POST',
        //            headers: {
        //                'Content-Type': 'application/json'
        //            },
        //            url: url + '/admin/areamodule/fileBorrow/listBack',
        //            data: jsondata,
        //            success: function (res) {
        //                layer.msg(res.msg);
        //            }
        //        });
    }
}