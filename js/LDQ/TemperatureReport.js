var url = "http://192.168.2.128:8081";
var StorageRoom_list = [];
var xNum;
$(function () {
    // 获取库房信息
    $.ajax({
        method: "GET",   //请求方式
        url: url + "/admin/areamodule/areaEnvironmentLog/selectRegionList",
        success: function (data) {    //返回结果
            StorageRoom_list = data.row;
            if (StorageRoom_list.length > 0) {
                var selectList = $("#mjj-select");
                var selectList1 = $("#mjj-select1");  // 详情页的库房选择
                for (var i = 0; i < StorageRoom_list.length; i++) {
                    var names = StorageRoom_list[i].name;
                    if(names === undefined){
                        continue;
                    }
                    var option = '<option class="options" value="' + StorageRoom_list[i].storeid + '">' + StorageRoom_list[i].name + '</option>';
                    selectList.append(option);
                    selectList1.append(option);
                }
            }
        }
    });

    // 获取每月有几周
    jQuery.getWeeks = function (year, month) {
        var d = new Date();
        // 该月第一天
        d.setFullYear(year, month - 1, 1);
        var w1 = d.getDay();
        if (w1 == 0) w1 = 7;
        // 该月天数
        d.setFullYear(year, month, 0);
        var dd = d.getDate();
        // 第一个周一
        var d1;
        if (w1 != 1) d1 = 7 - w1 + 2;
        else d1 = 1;
        var week_count = Math.ceil((dd - d1 + 1) / 7);
        return week_count;
    };

    // 控制单选按钮的显示
    $(':radio').click(function () {
        var RadioType = $(this).val();  //获取选中的radio的值
        if (RadioType === "m" || RadioType === "d") {
            $("#select-week").css("display", "none");
            $(".week-num").css("display", "none");
        }
        else if (RadioType === "w") {
            $("#select-week").css("display", "inline");
            $(".week-num").css("display", "inline");
        }
    });

    // 查找数据
    var table_title; // 图标的标题
    var startDate;
    var mon, nian, X_text;
    // 查找数据
    $(".btn-search").on("click", function () {
        // $('#ChartView').empty();
        // 温度数据
        var data_wd = [];
        // 湿度数据
        var data_sd = [];
        // x轴的数据
        var data_x = [];
        var RoomId = $("#mjj-select  option:selected").val();
        var RoomName = $("#mjj-select  option:selected").text();
        for (var i = 0; i < StorageRoom_list.length; i++) {
            if (RoomName === StorageRoom_list[i].name) {
                var regionid = StorageRoom_list[i].regionid;
            }
        }
        var RadioType = $('input:radio:checked').val();
        startDate = $('#startTime1').val();
        mon = startDate.split("-")[1];
        nian = startDate.substring(0, 4);

        var weekNum = $('#select-week').val();
        if (RadioType === "m" || RadioType === "d") {
            weekNum = '';
        }
        var RadioText = $("input:radio:checked").next("label").text();
        // 计算x轴显示的数字
        if (RadioText === "月") {
            X_text = "日";
            table_title = nian + '年' + mon + "月";
            if (mon === '01' || mon === '03' || mon === '05' || mon === '07' || mon === '08' || mon === '10' || mon === '12') {
                xNum = 31;
            }
            else if (mon === '02') {
                if ((nian % 4 === 0 && nian % 100 !== 0) || nian % 400 === 0) {
                    xNum = 29;
                } else {
                    xNum = 28;
                }
            } else {
                xNum = 30;
            }
        } else if (RadioText === "周") {
            X_text = "周";
            table_title = nian + '年' + mon + "月的第" + weekNum + "周";
            xNum = 7;
        } else {
            X_text = "时";
            table_title = startDate;
            xNum = 24;
        }
        $.ajax({
            method: "GET",
            url: url + "/admin/areamodule/areaEnvironmentLog/selectLineChartData?",
            data: "map[type]=" + RadioType + "&map[storeId]=" + RoomId + "&map[regionId]=" + regionid + "&map[startTime]=" + startDate + "&map[week]=" + weekNum,
            success: function (data) {
                var datas = data.row;
                if (datas !== null) {
                    $("#data_none").hide();
                    $("#ChartView").show();
                    var list_num = [];
                    for (var i = 1; i < xNum + 1; i++) {
                        list_num.push({sd: 0, num: i, wd: 0});
                    }
                    for (var j = 0; j < datas.length; j++) {
                        list_num[datas[j].num - 1] = datas[j];
                    }
                    for (var k = 0; k < list_num.length; k++) {
                        data_x.push(list_num[k].num);
                        data_wd.push(list_num[k].wd);
                        data_sd.push(list_num[k].sd);
                    }

                    // 基于准备好的dom，初始化echarts实例
                    var myChart = echarts.init(document.getElementById('ChartView'));
                    var option = {
                        title: {
                            text: table_title + "  " + '温湿度报表',
                            left: 'center'
                        },
                        // 切换图的类型，折线，柱状
                        toolbox: {
                            show: true, // 加载工具条
                            feature: {
                                dataZoom: {
                                    yAxisIndex: 'none'
                                },
                                dataView: {readOnly: false},  //数据预览
                                magicType: {type: ['line', 'bar']},
                                restore: {},  // 复原
                                saveAsImage: {}  // 保存图片
                            }
                        },
                        legend: {
                            data: ['温度（°C）', '湿度（%RH）'],
                            left: 'left',
                            orient: 'vertical' // 竖着排
                        },
                        grid: {
                            left: '10%',
                            right: '10%',
                            top: '15%'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        xAxis: {
                            name: "/" + X_text,
                            type: 'category',
                            data: data_x,
                            nameGap: 20,
                            axisLabel: {
                                interval: 0
                            },
                            nameTextStyle: {
                                fontSize: 18
                            }
                        },
                        yAxis: {
                            type: 'value',
                            name: "指数",
                            nameGap: 15,
                            axisLabel: {
                                formatter: '{value}'
                            },
                            nameTextStyle: {
                                fontSize: 18
                            }
                        },
                        series: [{
                            name: '温度（°C）',
                            data: data_wd,
                            type: 'line', // 直线
                            smooth: true,  // 让折线图连接起来圆滑一些
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                            markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }
                        }, {
                            name: '湿度（%RH）',
                            data: data_sd,
                            type: 'line',
                            smooth: true,  // 让折线图连接起来圆滑一些
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                            markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }
                        }]
                    };
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                } else {
                    $("#ChartView").hide();
                    $("#data_none").show();
                }
            }
        });
    });

    // 详情弹出框
    $(".btn-detail").on("click", function () {
        layui.use('layer', function () {
            var layer = layui.layer;
            layer.open({
                type: 1,
                title: ["详情", 'font-size:18px; background-color: #009688; color: white'],
                content: $("#details"), //这里content是一个普通的String
                area: ['1300px', '750px']
            });
            //  详情里的查找
            $(".btn-find").on("click", function () {
                var RoomIds = $("#mjj-select1  option:selected").val();
                var RoomNames = $("#mjj-select1  option:selected").text();
                for (var i = 0; i < StorageRoom_list.length; i++) {
                    if (RoomNames === StorageRoom_list[i].name) {
                        var regionids = StorageRoom_list[i].regionid;
                    }
                }
                var report_startDate = $('#startTime').val() + " 00:00:00";
                var report_endDate = $('#endTime').val() + " 23:59:59";
                layui.use('table', function () {
                    var table = layui.table;
                    table.render({
                        method: "GET",
                        url: url + "/admin/areamodule/areaEnvironmentLog/select?map[storeId]=" + RoomIds + "&map[regionId]=" + regionids + "&map[createTime-gte]=" + report_startDate + "&map[createTime-lte]=" + report_endDate,
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
                        elem: '#wd-sd',
                        height: "full-160",
                        cols: [[
                            {field: 'tourPlayerId', title: '序号', type: 'numbers', fixed: 'left', align: "center"},
                            {field: 'wd', title: '温度 °C', sort: true, align: "center"},
                            {field: 'sd', title: '湿度 %RH', sort: true, align: "center"},
                            {field: 'createTime', title: '创建时间', sort: true, align: "center"}
                        ]],
                        page: true,
                        done: function (res, curr, count) {
                        }
                    });
                });
            });
        });
    });

    // 详情页数据
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

    // 根据时间的年月 得到周数
    var years = NowDate.substring(0, 4);
    var months = NowDate.split("-")[1];
    var monthNum = jQuery.getWeeks(years, months);
    var selectWeek = $("#select-week");
    for (var w = 1; w <= monthNum; w++) {
        var optionW = '<option class="option-week" value="' + w + '">' + w + '</option>';
        selectWeek.append(optionW);
    }
    layui.use('laydate', function () {
        // 弹出层的日期
        // 开始日期
        var laydate = layui.laydate;
        laydate.render({
            elem: '#startTime',
            value: NowDate
        });
        // 结束日期
        var laydate1 = layui.laydate;
        laydate1.render({
            elem: '#endTime',
            value: NowDate
        });

        // 页面上的日期选择
        // 开始日期
        var laydate2 = layui.laydate;
        laydate2.render({
            elem: '#startTime1',
            value: NowDate,
            done: function (value) {
                $("#select-week").empty();
                $('#startTime1').change();  // 一定要加上这句！！！不然没有回调！！！
                var years = value.substring(0, 4);
                var months = value.split("-")[1];
                if (months.split("")[0] === '0') {
                    months = months.substring(0);
                }
                var monthNum = jQuery.getWeeks(years, months);
                var selectWeek = $("#select-week");
                for (var w = 1; w <= monthNum; w++) {
                    var optionW = '<option class="option-week" value="' + w + '">' + w + '</option>';
                    selectWeek.append(optionW);
                }
            }
        });
    });

});
