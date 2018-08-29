var url = "http://192.168.2.128:8081";

$(function () {
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var date = myDate.getDate();
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
    // var NewdataRow = [];

    $(".count-btn").bind("click", function () {
        var startTime = $("#test1").val();
        var endTime = $("#test2").val();
        var TimeType = $(".selectDate").val();
        alert(TimeType);
        var TimeType1;

        if (TimeType === "年 - 月 - 日") {
            var startTime1 = startTime;
            var endTime1 = endTime;
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
        $.ajax({
            method: "GET",
            url: url + "/admin/areamodule/fileBorrow/slectStatistics?",
            data: "currentPage=" + "1" + "&pageSize=" + "2" + "&formatDate=" + TimeType1 + "&start=" + startTime1 + "&end=" + endTime1,
            success: function (data) {
                var dataRows = data.rows;
                if (dataRows.length > 0) {
                    // console.log(dataRows);
                    // 将统计的数据渲染到表格中
                    layui.use('table', function () {
                        var table = layui.table;
                        table.render({
                            elem: '#countNum',
                            height: 730, // 设置容器高度，若超出高度出现纵向滚动条
                            page: true, //开启分页
                            cols: [[ //表头
                                {field: 'tourPlayerId', width: 100, title: '序号', type: 'numbers', fixed: 'left'},
                                {field: 'year', title: '年度', width: 85, sort: true},
                                {field: 'month', title: '月份', width: 80, sort: true},
                                {field: 'day', title: '日', width: 80, sort: true},
                                {field: 'rdTypeName', title: '借阅类型', width: 150, sort: true},
                                {field: 'useIntention', title: '借阅目的', width: 150, sort: true},
                                {
                                    field: 'borrowNum',
                                    title: '借阅次数',
                                    width: 150,
                                    sort: true,
                                    event: 'BorNum',
                                    style: 'color: red;'
                                },
                                {
                                    field: 'packNum',
                                    title: '借阅件数',
                                    width: 150,
                                    sort: true,
                                    event: 'packNumber',
                                    style: 'color: red;'
                                },
                                {
                                    field: 'peopleNum',
                                    title: '借阅人数',
                                    width: 150,
                                    sort: true,
                                    event: 'peopleNumber',
                                    style: 'color: red;'
                                }
                            ]],
                            data: dataRows
                        });
                        //监听工具条
                        table.on('tool(test)', function (obj) {
                            var data = obj.data;
                            console.log(data);
                            // if (obj.event === "BorNum"){
                            //
                            // }
                        });


                    });
                }
            }

        });


    });


});






