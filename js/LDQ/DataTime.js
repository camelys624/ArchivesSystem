var url = "http://192.168.2.128:8081";
//表头
var tableHead = [[
    {field: 'tourPlayerId', title: '序号', type: 'numbers', fixed: 'left', align: "center"},
    {field: 'doc_name', title: '名称', sort: true, align: "center"},
    {field: 'rdTypeName', title: '类型', sort: true, align: "center"},
    {field: 'userName', title: '借阅人', sort: true, align: "center"},
    {field: 'depart', title: '部门', sort: true, align: "center"},
    {field: 'userPhone', title: '借阅人电话', sort: true, align: "center"},
    {field: 'useIntention', title: '目的', sort: true, align: "center"},
    {field: 'createTime', title: '借阅日期', sort: true, align: "center"},
    {field: 'borrowing_days', title: '借阅天数', sort: true, align: "center"},
    {field: 'creater', title: '办理人', sort: true, align: "center"},
    {field: 'curreturnTime', title: '归还日期', sort: true, align: "center"},
    {field: 'remark', title: '备注', sort: true, align: "center"}
]];
$(function () {
    var startTime1, endTime1, TimeType1, detail_year, detail_mon, detail_day, rdType, useIntention;
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var date = myDate.getDate();
    if (month.toString().length < 2){
        month = "0" + month;
    }
    if(date.toString().length < 2){
        date = "0" + date;
    }
    // 拼接成想要的时间格式
    var NowDate = year + "-" + month + "-" + date;
    layui.use('laydate', function () {
        // 开始日期
        var laydate = layui.laydate;
        laydate.render({
            elem: '#test1',
            value: NowDate
        });
        // 结束日期
        var laydate1 = layui.laydate;
        laydate1.render({
            elem: '#test2',
            value: NowDate
        });
    });
    // 统计借阅数据
    $(".count-btn").on("click", function () {
        var startTime = $("#test1").val() + " 00:00:00";
        var endTime = $("#test2").val() + " 23:59:59";
        var TimeType = $(".selectDate").val();
        if (TimeType === "年 - 月 - 日") {
            startTime1 = startTime;
            endTime1 = endTime;
            TimeType1 = "YYYY-MM-DD";
        } else if (TimeType === "年 - 月") {
            startTime1 = startTime.slice(0, 7);
            endTime1 = endTime.slice(0, 7);
            TimeType1 = "YYYY-MM";
        } else {
            startTime1 = startTime.slice(0, 4);
            endTime1 = endTime.slice(0, 4);
            TimeType1 = "YYYY";
        }
        // 将统计的数据渲染到表格中
        layui.use('table', function () {
            var table = layui.table;
            table.render({
                method: "GET",
                url: url + "/admin/areamodule/fileBorrow/slectStatistics?formatDate=" + TimeType1 + "&start=" + startTime1 + "&end=" + endTime1,
                request: {
                    pageName: 'currentPage', //页码的参数名称，默认：page
                    limitName: 'pageSize' //每页数据量的参数名，默认：limit
                },
                response: {
                    statusName: 'code', //数据状态的字段名称，默认：code
                    statusCode: 1, //成功的状态码，默认：0
                    msgName: 'msg', //状态信息的字段名称，默认：msg
                    countName: 'total', //数据总数的字段名称，默认：count
                    dataName: 'rows' //数据列表的字段名称，默认：data
                },
                elem: '#countNum',
                height: "full-115", // 设置容器高度，若超出高度出现纵向滚动条
                page: true,
                cols: [[ //表头
                    {field: 'tourPlayerId', title: '序号', type: 'numbers', fixed: 'left', align: "center"},
                    {field: 'year', title: '年度', sort: true, align: "center"},
                    {field: 'month', title: '月份',sort: true, align: "center"},
                    {field: 'day', title: '日', sort: true, align: "center"},
                    {field: 'rdTypeName', title: '借阅类型', sort: true, align: "center"},
                    {field: 'useIntention', title: '借阅目的', sort: true, align: "center"},
                    {
                        field: 'borrowNum',
                        title: '借阅次数',
                        sort: true,
                        event: 'BorNum',
                        style: 'color: red;',
                        align: "center"
                    },
                    {
                        field: 'packNum',
                        title: '借阅件数',
                        sort: true,
                        event: 'packNumber',
                        style: 'color: red;',
                        align: "center"
                    },
                    {
                        field: 'peopleNum',
                        title: '借阅人数',
                        sort: true,
                        event: 'peopleNumber',
                        style: 'color: red;',
                        align: "center"
                    }
                ]],
                done: function (res, curr, count) {
                }
            });
            table.on('tool(test)', function (obj) {
                if (obj.event === "BorNum" || obj.event === "packNumber" || obj.event === "peopleNumber") {
                    var data = obj.data;
                    detail_year = data.year;
                    detail_mon = data.month;
                    detail_day = data.day;
                    rdType = data.rdTypeName;
                    useIntention = data.useIntention;
                    // 打开弹窗
                    layui.use('layer', function () {
                        var layer = layui.layer;
                        layer.open({
                            type: 1,
                            title: ["借阅统计详情", 'font-size:18px; background-color: #009688; color: white'],
                            content: $("#select-detail"),
                            area: ['1500px', '700px']

                        });
                    });
                    // 数据渲染
                    layui.use('table', function () {
                        var table1 = layui.table;
                        table1.render({
                            method: "GET",
                            url: url + "/admin/areamodule/fileBorrow/selectStatisticsDetail?year=" + detail_year + "&month=" + detail_mon + "&day=" + detail_day + "&rdTypeName=" + rdType + "&useIntention=" + useIntention,
                            request: {
                                pageName: 'currentPage', //页码的参数名称，默认：page
                                limitName: 'pageSize' //每页数据量的参数名，默认：limit
                            },
                            response: {
                                statusName: 'code', //数据状态的字段名称，默认：code
                                statusCode: 1, //成功的状态码，默认：0
                                msgName: 'msg', //状态信息的字段名称，默认：msg
                                countName: 'total', //数据总数的字段名称，默认：count
                                dataName: 'rows' //数据列表的字段名称，默认：data
                            },
                            elem: '#detail_table',
                            height: "full-200", // 设置容器高度，若超出高度出现纵向滚动条
                            cols: tableHead,
                            page: true,
                            done: function (res, curr, count) {
                            }
                        })
                    })
                }
            })
        });
    });
    // Excel导出
    $(".export-btn").click(function() {
        if (startTime1 !== undefined){
            var url2 = url + "/admin/areamodule/fileBorrow/borrowExport";
            $('.export-btn').attr('href', url2 + '?' + 'start=' + encodeURI(startTime1) + '&end=' + encodeURI(endTime1) + "&formatDate=" + encodeURI(TimeType1));
        }else {
            alert("请先统计出数据！")
        }

    });
    // 详情里Excel导出
    $(".exportExcel").click(function() {
        var url3 = url + "/admin/areamodule/fileBorrow/borrowDetailsExport";
        $('.exportExcel').attr('href', url3);
    });
});
