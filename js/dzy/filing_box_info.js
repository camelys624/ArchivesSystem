var url = "http://192.168.2.128:8081";
var fileboxOperation = new Object; //定义更多操作对象
var location;
$(function () {
    layui.use(['form', 'upload', 'element', 'table', 'laydate'], function () {
        var form = layui.form,
            upload = layui.upload,
            element = layui.element,
            layer = layui.layer,
            table = layui.table,
            laydate = layui.laydate;

    });
    gettable_data(); //获取档案盒列表信息
    open_layer(); //注册打开弹出框事件

    fileboxOperation.btn();
});

/*档案盒操作按钮*/
fileboxOperation.btn = function () {

    //取消默认鼠标右键事件
    $(document).bind('contextmenu', function (e) {
        e.preventDefault();
        return false;
    });
    $(".main").mousedown(function (e) {
        if (e.which == 1) {
            $("#mousedown_right").hide();
        }
    });

    //修改档案盒信息
    $("#modify_info,#modify_info_m").click(function () {
        //console.log(fileboxOperation.trdata);
        $("#add_content input[name='boxName']").val(fileboxOperation.trdata.boxName);
        $("#add_content input[name='boxNum']").val(fileboxOperation.trdata.boxNum);
        $("#add_content input[name='fondsNo']").val(fileboxOperation.trdata.fondsNo);
        $("#add_content input[name='filesNo']").val(fileboxOperation.trdata.filesNo);
        $("#add_content input[name='accurate']").val(fileboxOperation.trdata.accurate);
        $("#add_content input[name='stpNumber']").val(fileboxOperation.trdata.stpNumber);
        $("#add_content input[name='duration']").val(fileboxOperation.trdata.duration);
        $("#add_content input[name='security']").val(fileboxOperation.trdata.security);
        $("#add_content input[name='rdLocationAddr']").val(fileboxOperation.trdata.rdLocationAddr);
        $("#add_content input[name='details']").val(fileboxOperation.trdata.details);
        $("#add_content input[name='rfid']").val(fileboxOperation.trdata.rfid);
        layer.open({
            type: 1,
            title: '修改档案盒',
            area: ['680px', '590px'],
            content: $("#add_content")
        });
        tableon_hiden();
        fileboxOperation.add_chenge = "chenge";
        $("#mousedown_right").hide();
    });

    //删除档案盒事件
    $("#filebox_del,#filebox_del_m").click(function () {
        fileboxOperation.delete();
        $("#mousedown_right").hide();
    });

    /*提交表单信息*/
    layui.use(['form'], function () {
        var form = layui.form;
        //添加档案盒事件
        form.on('submit(fileboxadd_save)', function (data) {
            fileboxOperation.add(data.field);
        });

        //提交档案盒借阅表单
        form.on('submit(Borrowing_yes)', function (data) {
            //console.log(data.field);
            if (data.field.userName.length < 2 || data.field.userName.length > 8) {
                layer.msg("姓名长度应为2-8位");
                return false;
            }
            if (data.field.userPhone.length != 11) {
                layer.msg("手机号码格式不正确(11位)，请重新填写！");
                return false;
            }
            var jsonData = JSON.stringify(data.field);
            $.ajax({
                type: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                url: url + '/admin/areamodule/fileBorrow/add',
                data: jsonData,
                success: function (res) {
                    gettable_data(); //刷新数据
                    layer.msg(res.msg);
                }
            });
            layer.closeAll(); //关闭弹出框

            $("#add_content,#query_content,#Borrowing_content").hide();
            return false;
        });
    });

    //档案盒借阅
    $("#Borrowing,#Borrowing_m").click(function () {
        if (fileboxOperation.trdata.status == 1) { //判断档案盒目前状态，1：未在架，2：在架，3：已借出
            layer.msg("该档案盒未在架，无法借阅！");
        } else if (fileboxOperation.trdata.status == 3) {
            layer.msg("该档案盒已借出，无法借阅！");
        } else if (fileboxOperation.trdata.status == 2) {
            layer.open({
                type: 1,
                title: '档案盒借阅',
                area: ['780px'],
                content: $("#Borrowing_content")
            });
            tableon_hiden();
            $("#bor_fkBoxId").val(fileboxOperation.trdata.id);
            fileboxOperation.box_file("bor_file_table");
        }
        $("#mousedown_right").hide();
    });

    //查看盒内档案
    $("#filebox_file,#filebox_file_m").click(function () {
        layer.open({
            type: 1,
            title: '盒内档案',
            area: ['670px', '400px'],
            content: $("#file_con")
        });
        tableon_hiden();
        fileboxOperation.box_file("file_table");
        $("#mousedown_right").hide();
    });

    //查询档案盒
    $("#query_field").change(function () {
        if ($(this).val() != "著录时间范围" && $(this).val() != "创建时间范围") {
            $("#query_datestar").attr("disabled", "disabled");
            $("#query_dateend").attr("disabled", "disabled");
            $("#query_text").removeAttr("disabled");
        } else {
            $("#query_datestar").removeAttr("disabled");
            $("#query_dateend").removeAttr("disabled");
            $("#query_text").attr("disabled", "disabled");
        }
    });
    $("#query_submit").click(function () {
        var query_way = $("#query_way").val(); //获取查询类型
        var query_field = $("#query_field").val(); //获取查询类型
        var query_text = $("#query_text").val(); //获取查询内容
        var datestar = $("#query_datestar").val(); //获取所要查询的时间
        var dateend = $("#query_dateend").val();
        var date = datestar + ' - ' + dateend; //整合发送的时间数据
        var send_content = query_text; //默认设置发送的数据为所填写的查询内容中的数据
        var code; //请求字段
        var queryurl;
        if (query_way == "模糊查询") {
            queryurl = url + '/admin/areaModule/fileBoxInfo';
            //alert(url + code + '=' + send_content);
        } else if (query_way == "精准查询") {
            queryurl = url + '';
        }
        switch (query_field) {
        case "盒名称":
            code = 'map[boxName-like]';
            break;
        case "盒号":
            code = 'map[boxNum-like]';
            break;
        case "条码":
            code = 'map[boxBarcode-like]';
            break;
        case "存放位置":
            code = 'map[rdLocationAddr-like]';
            break;
        case "著录时间范围":
            code = 'date';
            send_content = date + '&pageSize=1&page=1';
            queryurl = url + '/admin/areamodule/fileBoxInfo/selectTime?';
            break;
        case "创建时间范围":
            code = 'map[createTime-gte]';
            send_content = datestar + ' 00:00:00' + '&map[createTime-lte]=' + dateend + ' 00:00:00';
            break;
        case "密级":
            code = 'map[security]';
            break;
        }
        if (query_text != "" || (dateend != "" && datestar != "")) {
            fileboxOperation.query(queryurl, code, send_content);
        } else {
            layer.msg('请填写查询内容');
        }
    });

    //关闭按钮
    $(".close_btn").click(function () {
        layer.close(layer.index);
    });

    //打开更改位置

    /*位置的选择*/
    //点击区列
    $(".tree").on('click', '.district_column', function (event) {
        var parentelement = $(this).parent().parent();
        var frame_index = parentelement.index(parentelement.parent().firstChild); //获取当前元素的父元素相对于第一个同胞元素的索引值----区
        var room_index = parentelement.parent().parent().index($(".tree").firstChild);
        location.rdRegionNum = parentelement.attr("id").replace("qu_num", "").split("qu_id")[0];
        location.regionId = parentelement.attr("id").replace("qu_num", "").split("qu_id")[1];
        location.storeId = parentelement.parent().parent().attr("id").replace("room", "");
        location.col = ''; // 清空列
        location.lay = ''; //清空节
        location.div = ''; //清空层
        location.slide = ''; //清空边
        $(".saveoption_right").empty(); //清空原来的内容
        var District_column = $(this).text().replace('左边右边', '');
        for (var section = 1; section < location.info[room_index].region[frame_index].lays + 1; section++) {
            for (var filelayer = 1; filelayer < location.info[room_index].region[frame_index].divs + 1; filelayer++) {
                var text = District_column + section + "节" + filelayer + "层左边";
                var p = '<p>' + text + '</p>';
                $(".saveoption_right").append(p);
                text = District_column + section + "节" + filelayer + "层右边";
                p = '<p>' + text + '</p>';
                $(".saveoption_right").append(p);
            }
        }
    });

    //点击左右边
    $(".tree").on('click', '.left_right', function (event) {
        var parentelement = $(this).parent().parent().parent().parent();
        var frame_index = parentelement.index(parentelement.parent().firstChild); //获取当前元素的父元素相对于第一个同胞元素的索引值----密集架
        var room_index = parentelement.parent().parent().index($(".tree").firstChild);
        $(".saveoption_right").empty(); //清空原来的内容
        location.col = ''; // 清空列
        location.lay = ''; //清空节
        location.div = ''; //清空层
        location.slide = ''; //清空边
        event.stopPropagation(); //阻止事件冒泡
        var District_column = $(this).parent().parent().text().substr(0, 4);
        for (var section = 1; section < location.info[room_index].region[frame_index].lays + 1; section++) {
            for (var filelayer = 1; filelayer < location.info[room_index].region[frame_index].divs + 1; filelayer++) {
                var text = District_column + section + "节" + filelayer + "层" + $(this).text();
                var p = '<p>' + text + '</p>';
                $(".saveoption_right").append(p);
            }
        }
    });

    //点击选中位置
    $(".saveoption_right").on('click', 'p', function () {
        location.col = $(this).text().split("区")[1].split("列")[0]; // 获取列
        location.lay = $(this).text().split("列")[1].split("节")[0]; //获取节
        location.div = $(this).text().split("节")[1].split("层")[0]; //获取层
        location.slide = $(this).text().split("层")[1].split("边")[0]; //获取边
        if (location.slide == "左") {
            location.locationg = 1;
        } else if (location.slide == "右") {
            location.locationg = 2;
        };
        $(this).parent().children().css({
            background: "",
            color: "#000"
        });
        $(this).css({
            background: "rgb(0,150,136)",
            color: "#fff"
        });
    });

    //确定提交位置
    $("#location_yes").click(function () {
        var transmit = function () {
            fileboxOperation.trdata.storeId = parseInt(location.storeId);
            fileboxOperation.trdata.rdRegionNum = parseInt(location.rdRegionNum);
            fileboxOperation.trdata.regionId = parseInt(location.regionId);
            fileboxOperation.trdata.col = parseInt(location.col);
            fileboxOperation.trdata.lay = parseInt(location.lay);
            fileboxOperation.trdata.div = parseInt(location.div);
            fileboxOperation.trdata.locationg = parseInt(location.locationg);
        };

        if (location.btn == "chenge_location" || location.btn == "chenge_location_m") {
            transmit();
            if (location.col == undefined || location.lay == undefined || location.div == undefined || location.col == '' || location.lay == '' || location.div == '') {
                layer.msg("请选择位置");
            } else {
                //console.log(fileboxOperation.trdata);
                var jsonData = JSON.stringify(fileboxOperation.trdata);
                //console.log(jsonData);
                $.ajax({
                    type: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    url: url + "/admin/areamodule/fileBoxInfo/update",
                    data: jsonData,
                    success: function (res) {
                        //console.log(res);
                        if (res.state) {
                            layer.closeAll();
                            gettable_data();
                        };
                        if (res.msg) {
                            layer.msg(res.msg);
                        }
                    }
                });
            };
            //  console.log(jsonData);
            location.storeId = ''; //清空位置信息
            location.rdRegionNum = '';
            location.regionId = '';
            location.col = '';
            location.lay = '';
            location.div = '';
            location.locationg = '';
            transmit();

        }
        if (location.btn == "saveoption_choose") {
            if (location.col == undefined || location.lay == undefined || location.div == undefined || location.col == '' || location.lay == '' || location.div == '') {
                layer.msg("请选择位置");
            } else {
                var slide;
                if (location.locationg == 1) {
                    slide = "左边";
                } else {
                    slide = "右边";
                }
                var location_text = location.rdRegionNum + "区" + location.col + "列" + location.lay + "节" + location.div + "层" + slide;
                $("input[name='rdLocationAddr']").val(location_text);
                layer.close(layer.index);
            }
        }
    });

    //树形结构操作
    $(".tree").on('click', 'li:has(ul)', function (event) {
        if (this == event.target) {
            if ($(this).children().is(':hidden')) {
                $(this).css('list-style-image', 'url("../../img/DZY/-.gif")').children().show();
            } else {
                $(this).css('list-style-image', 'url("../../img/DZY/+.gif")').children().hide();
            }
        }
        return false;
    });

};
/*Ajax请求档案盒删除操作*/
fileboxOperation.delete = function () {
    var jsonData = JSON.stringify(fileboxOperation.trdata);
    console.log(jsonData);
    $.ajax({
        type: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        url: url + '/admin/areamodule/fileBoxInfo/delete',
        data: jsonData,
        success: function (res) {
            $("#operation_model").hide();
            gettable_data(); //刷新数据
            layer.msg(res.msg);
        }
    });
};
/*Ajax请求添加/修改档案盒*/
fileboxOperation.add = function (data) {

    data.storeId = parseInt(location.storeId);
    data.rdRegionNum = parseInt(location.rdRegionNum);
    data.regionId = parseInt(location.regionId);
    data.col = parseInt(location.col);
    data.lay = parseInt(location.lay);
    data.div = parseInt(location.div);
    data.locationg = parseInt(location.locationg);

    if (fileboxOperation.add_chenge == "add") {
        var url2 = '/admin/areamodule/fileBoxInfo/add';
    }
    if (fileboxOperation.add_chenge == "chenge") {
        data.id = fileboxOperation.trdata.id;
        var url2 = "/admin/areamodule/fileBoxInfo/update";
    }
    var jsonData = JSON.stringify(data);
    $.ajax({
        type: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        url: url + url2,
        data: jsonData,
        success: function (res) {
            if (res.state) {
                gettable_data();
                layer.closeAll();
            }
            layer.msg(res.msg);
        }
    });
};
/*Ajax请求根据档案盒id查询盒内档案*/
fileboxOperation.box_file = function (tablename) {
    $.ajax({
        type: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        url: url + '/admin/areaModule/FileArchivesInfo',
        data: 'map[fkBoxId]=' + fileboxOperation.trdata.id,
        success: function (res) {
            if (res.rows != null && res.rows.length > 0) {
                layui.use(['table', 'layer'], function () {
                    var table = layui.table,
                        layer = layui.layer;
                    table.render({
                        elem: '#' + tablename,
                        //height: 300,
                        //page: true, //开启分页
                        cols: [[{
                            type: 'numbers',
                            title: '序号',
                            width: 50
                        }, {
                            field: 'arcName',
                            title: '档案名',
                            width: 104
                        }, {
                            field: 'id',
                            title: '档案信息编号',
                            width: 160
                        }, {
                            field: 'rdLocationAddr',
                            title: '位置',
                            width: 160
                        }, {
                            field: 'deleted',
                            title: '详情',
                            width: 190
                        }]],
                        data: res.rows
                    });
                })
            } else {
                layer.msg("该档案盒内无档案！");
                tablename = "#" + tablename;
                $(tablename).nextAll().empty(); //清空原来表格的内容
            }

        }
    });
};
/*Ajax请求查询档案盒*/
fileboxOperation.query = function (queryurl, code, send_content) {
    $.ajax({
        type: 'GET',
        url: queryurl,
        data: code + '=' + send_content,
        success: function (res) {
            if (res.rows != null && res.rows.length > 0) {
                var cols = getMapping("fileBoxInfo", false, 'filebox_operation');
                layui.use(['table', 'layer'], function () {
                    var table = layui.table,
                        layer = layui.layer;
                    table.render({
                        elem: '#filing_info_table',
                        height: 580,
                        page: true, //开启分页
                        cols: [cols],
                        data: res.rows
                    });
                    layer.closeAll();
                    $("#query_text").val(""); //清空输入的查询数据
                    $("#query_datestar").val("");
                    $("#query_dateend").val("");
                    fileboxOperation.tableon();
                    fileboxOperation.offset_top = 0;
                });

            }
            if (res.msg) {
                layer.msg(res.msg);
            }
            if (res.error) {
                layer.msg(res.error);
            }
        }
    });
};

//获取库房、密集架、列、节、层等位置信息
fileboxOperation.location = function () {
    $(".tree").empty(); //清空原来的内容
    $(".saveoption_right").empty(); //清空原来的内容
    location.col = ''; // 清空列
    location.lay = ''; //清空节
    location.div = ''; //清空层
    location.slide = ''; //清空边
    $.ajax({
        type: "GET",
        url: url + "/admin/areamodule/araeStoreInfo/getStoreAndRegion",
        success: function (res) {
            location.info = res.list;

            for (var room_num = 0; room_num < res.list.length; room_num++) { //获取库房
                var Storage_Room = $('<li class="Storage_Room" id="room' + res.list[room_num].id + '">' + res.list[room_num].store_name + '</li>');
                var Room_ul = $('<ul></ul>');
                for (var frame_num = 0; frame_num < res.list[room_num].region.length; frame_num++) { //获取每个库房的密集架
                    var Dense_frame = $('<li class="Dense_frame" id="qu_num' + res.list[room_num].region[frame_num].qu_num + 'qu_id' + res.list[room_num].region[frame_num].id + '">' + res.list[room_num].region[frame_num].qu_num + '区' + '</li>');
                    var column_ul = $("<ul></ul>");
                    for (var column_num = 0; column_num < res.list[room_num].region[frame_num].cols; column_num++) { //获取每个密集架中的区列

                        var District_column = $('<li class="district_column">' + res.list[room_num].region[frame_num].qu_num + '区' + (column_num + 1) + '列</li>'); //区列名
                        var slide_ul = $('<ul></ul>');
                        var left = $('<li class="left_right">左边</li>');
                        var right = $('<li class="left_right">右边</li>');
                        slide_ul.append(left);
                        slide_ul.append(right);
                        slide_ul.hide();
                        if (slide_ul.text() != "") {
                            District_column.append(slide_ul); //把左右边加入区列
                        }
                        column_ul.append(District_column); //把区列加入密集架
                        column_ul.hide();
                    };
                    if (column_ul.text() != "") {
                        Dense_frame.append(column_ul);
                    }

                    Room_ul.append(Dense_frame);
                    Room_ul.hide();
                };
                if (Room_ul.text() != "") {
                    Storage_Room.append(Room_ul);
                }

                $(".saveoption_left .tree").append(Storage_Room);

            };
            $('.saveoption_left li:has(ul)').css({
                cursor: 'pointer',
                'list-style-image': 'url(../../img/DZY/+.gif)'
            }).children().hide();

            $('.saveoption_left li:not(:has(ul))').css({
                cursor: 'default',
                'list-style-image': 'none'
            });
        }
    });
}

/*档案盒监听工具条*/
fileboxOperation.tableon = function () {
    layui.use(['table', 'layer'], function () {
        var table = layui.table;
        table.on('tool(filing_info)', function (obj) {
            var data = obj.data;
            //console.log(data);
            if (obj.event === 'one') {
                var document_width = $(document).width(); //获取浏览器窗口宽度
                var width = $("#operation_model").css("width").replace('px', '');
                var right = document_width - $(this).offset().left + 25;
                var top = $(this).offset().top - 10;
                if (top == fileboxOperation.offset_top) {

                    $("#operation_model").css({
                        right: right + 'px',
                        top: top + 'px'
                    });
                    if ($("#operation_model").css("display") == 'none') {
                        $("#operation_model").show();
                        $("#operation_model").css({
                            width: '0px'
                        }).animate({
                            width: '345px'
                        });
                    } else {
                        $("#operation_model").animate({
                            width: '0px'
                        }, function () {
                            $("#operation_model").hide();
                        });
                    }
                } else {
                    $("#operation_model").show();
                    $("#operation_model").css({
                        right: right + 'px',
                        top: top + 'px',
                        width: '0px'
                    }).animate({
                        width: '345px'
                    });
                    fileboxOperation.offset_top = top;
                }
                fileboxOperation.trdata = data; //传送该行数据信息
            }
        });
    });
};

//隐藏更多操作条
var tableon_hiden = function () {
    $("#operation_model").animate({
        width: '0px'
    }, function () {
        $("#operation_model").hide();
    });
}

/*打开弹窗操作*/
function open_layer() {
    //档案盒信息添加
    $("#filebox_add").click(function () {
        layer.open({
            type: 1,
            title: '添加档案盒',
            area: ['680px', '590px'],
            content: $("#add_content")
        });
        fileboxOperation.add_chenge = "add";
        tableon_hiden();
    });
    //档案盒信息查询
    $("#filebox_query").click(function () {
        layer.open({
            type: 1,
            title: '档案盒查询',
            area: ['460px', '300px'],
            content: $("#query_content")
        });
        tableon_hiden();
    });

    //Excel操作
    $("#Excel_operation").click(function () {
        layer.open({
            type: 1,
            title: 'Excel操作',
            area: ['250px', '220px'],
            content: $("#Excel_content")
        });
        tableon_hiden();
    });

    //选择添加档案盒存放位置,打开更改位置
    $("#saveoption_choose,#chenge_location,#chenge_location_m").click(function () {
        layer.open({
            type: 1,
            title: '更改位置',
            area: ['780px', '530px'],
            content: $("#saveoption_con")
        });
        tableon_hiden();
        location.btn = $(this).attr("id");
        fileboxOperation.location();
        $("#mousedown_right").hide();
    });

};

/*获取档案盒列表信息*/
function gettable_data() {
    //获取档案盒列表信息
    //var offset_top = 0;
    fileboxOperation.offset_top = 0;

    layui.use(['table', 'layer'], function () {
        var table = layui.table,
            layer = layui.layer;
        var cols = getMapping("fileBoxInfo", false, 'filebox_operation');
        table.render({ //其它参数在此省略
            //            elem: '#filing_info_table',
            height: 'full-65',
            page: true, //开启分页
            elem: '#filing_info_table',
            cols: [cols],
            url: url + "/admin/areamodule/fileBoxInfo?map[deleted]=0",
            response: {
                statusName: 'code', //数据状态的字段名称，默认：code
                statusCode: 1, //成功的状态码，默认：0
                msgName: 'msg', //状态信息的字段名称，默认：msg
                countName: 'total', //数据总数的字段名称，默认：count
                dataName: 'rows' //数据列表的字段名称，默认：data
            },
            request: {
                pageName: 'currentPage', //页码的参数名称，默认：page          
                limitName: 'pageSize' //每页数据量的参数名，默认：limit
            },
            done: function (res, curr, count) {
                var data = res.rows;
                $('.layui-table-body tr').each(function (e) {
                    //表单鼠标右键操作
                    $(this).mousedown(function (e) {
                        var index = $(this).attr('data-index');
                        if (e.which == 3) {
                            tableon_hiden(); //隐藏更多操作导航条
                            $("#mousedown_right").show();
                            var x = e.originalEvent.x + 'px';
                            var y = e.originalEvent.y + 'px';
                            $("#mousedown_right").css({
                                top: y,
                                left: x
                            });
                            fileboxOperation.trdata = data[index];
                        }
                        if (e.which == 1) {
                            $("#mousedown_right").hide();
                            //tableon_hiden();
                        }
                    });
                })
            }
        });

        //调用档案盒监听工具条
        fileboxOperation.tableon();

    });
    //        $.ajax({
    //        type: "GET",
    //        url: url + "/admin/areamodule/fileBoxInfo?map[deleted]=0",
    //        data: "", //请求参数
    //        success: function (data) {
    //            //console.log(data);
    //            console.log(data);
    //            var cols = getMapping("fileBoxInfo", false, 'filebox_operation');
    //            for (var i = 0; i < data.rows.length; i++) {
    //                if (data.rows[i].status == 1) {
    //                    data.rows[i].status = "未在架";
    //                } else if (data.rows[i].status == 2) {
    //                    data.rows[i].status = "在架";
    //                } else if (data.rows[i].status == 3) {
    //                    data.rows[i].status = "已借出";
    //                }
    //
    //                if (data.rows[i].deleted == 0) {
    //                    data.rows[i].deleted = "可删除";
    //                } else if (data.rows[i].deleted == 1) {
    //                    data.rows[i].deleted = "不可删除";
    //                }
    //            }
    //                layui.use(['table', 'layer'], function () {
    //                    var table = layui.table,
    //                        layer = layui.layer;
    //                    table.render({
    //                        elem: '#filing_info_table',
    //                        height: 'full-65',
    //                        page: true, //开启分页
    //                        cols: [cols],
    //                        data: data.rows,
    //                        done: function (res, curr, count) {
    //                            var data = res.data;
    //                            $('.layui-table-body tr').each(function (e) {
    //                                //表单鼠标右键操作
    //                                $(this).mousedown(function (e) {
    //                                    var index = $(this).attr('data-index');
    //                                    if (e.which == 3) {
    //                                        tableon_hiden(); //隐藏更多操作导航条
    //                                        $("#mousedown_right").show();
    //                                        var x = e.originalEvent.x + 'px';
    //                                        var y = e.originalEvent.y + 'px';
    //                                        $("#mousedown_right").css({
    //                                            top: y,
    //                                            left: x
    //                                        });
    //                                        fileboxOperation.trdata = data[index];
    //                                    }
    //                                    if (e.which == 1) {
    //                                        $("#mousedown_right").hide();
    //                                    }
    //                                    //console.log(data[index]);
    //                                });
    //    
    //                            })
    //                        }
    //                    });
    //                //调用档案盒监听工具条
    //                fileboxOperation.tableon();
    //
    //            });
    //        }
    //    });

    //获取未上架档案列表信息
    $.ajax({
        type: "GET",
        url: url + "/admin/areamodule/fileBorrow",
        data: "map[status]=1", //请求参数
        success: function (data) {
            //console.log(data);
            var cols = getMapping("fileBorrow", true, 'Onshelf_operation');
            //console.log(cols);
            layui.use(['table', 'layer'], function () {
                var table = layui.table,
                    layer = layui.layer;
                table.render({
                    elem: '#fileshelf_info_table',
                    height: 580,
                    page: true, //开启分页
                    cols: [cols],
                    data: data.rows
                });

                //监听工具条
                table.on('tool(fileshelf_info)', function (obj) {
                    var data = obj.data;
                    console.log(data);
                    if (obj.event === 'one_Onshelf') {
                        alert("档案上架");
                    } else if (obj.event === 'send_Offshelf') {
                        alert("发送档案上架任务");
                    } else if (obj.event === 'send_Offshelf') {
                        alert("发送档案下架任务");
                    }
                });
            });
        }
    });

}

//映射表头
function getMapping(key, checkbox, operation_name) {
    var data = null;
    var aj = $.ajax({
        url: url + "/admin/basicsModule/sysDictCode/selectFieldMapping?code=" + key,
        dataType: "json",
        async: false,
        success: function (msg) {
            data = msg;
        }
    })
    var re = [{
        type: 'numbers'
    }];
    if (checkbox) {
        re = [{
            type: 'checkbox'
        }, {
            type: 'numbers',
            title: '序号'
        }];
    }
    //console.log(data);
    if (data.state) {
        for (var row of data.list) {
            var a = {};
            a["field"] = row.code;
            a["title"] = row.svalue;
            a["width"] = 120;
            if (row.code == "status") {
                a["templet"] = '#titleTpl';
            }
            re.push(a);
        }
    }
    if ($("div").is('.operation_model')) {
        var barDemo = {
            fixed: 'right',
            title: "操作",
            width: 105,
            align: 'center',
            toolbar: '#' + operation_name
        };
        re.push(barDemo);
    }
    return re;

}