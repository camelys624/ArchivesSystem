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
    var NewdataRow = [];

    $(".count-btn").bind("click", function () {
        var startTime = $("#test1").val();
        var endTime = $("#test2").val();
        var TimeType = $(".selectDate").val();
        alert(TimeType);
        var TimeType1;

        if (TimeType == "年 - 月 - 日") {
            var startTime1 = startTime;
            var endTime1 = endTime;
            TimeType1 = "YYYY-MM-DD";
        } else if (TimeType == "年 - 月") {
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
                    for (var i = 0; i < dataRows.length; i++) {
                        var dataRow = dataRows[i];
                        dataRow.num = i + 1;
                        NewdataRow.push(dataRow);
                        console.log(dataRow)
                    }
                    // console.log(JSON.stringify(dataRows));
                    console.log(NewdataRow);
                    // 将统计的数据渲染到表格中
                    layui.use('table', function () {
                        var table = layui.table;
                        table.render({
                            elem: '#countNum',
                            height: 730, // 设置容器高度，若超出高度出现纵向滚动条
                            page: true, //开启分页
                            cols: [[ //表头
                                {field: 'num', title: '序号', width: 80, sort: true, fixed: 'left'},
                                {field: 'year', title: '年度', width: 85, sort: true},
                                {field: 'month', title: '月份', width: 80, sort: true},
                                {field: 'day', title: '日', width: 80, sort: true},
                                {field: 'rdTypeName', title: '借阅类型', width: 150, sort: true},
                                {field: 'useIntention', title: '借阅目的', width: 150, sort: true},
                                {field: 'borrowNum', title: '借阅次数', width: 150, sort: true, event: 'BorNum', style:'color: red;'},
                                {field: 'packNum', title: '借阅件数', width: 150, sort: true, event: 'packNumber', style:'color: red;'},
                                {field: 'peopleNum', title: '借阅人数', width: 150, sort: true, event: 'peopleNumber', style:'color: red;'}
                            ]],
                            data: NewdataRow
                        });
                        //监听工具条
                        table.on('tool(test)', function(obj) {
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

    // 数据的导出
    // $(".export-btn").bind("click", function(){
    //   // console.log(JSON.stringify(NewdataRow));
    //
    // });


});

// var students = JSON.stringify(NewdataRow);
//
// $(function downloadExl(data, type) {
//
//     var keys = Object.keys(data[0]);
//     var firstRow = {};
//     keys.forEach(function (item) {
//         firstRow[item] = item;
//     });
//     data.unshift(firstRow);
//     var content = {};
//     // 把json格式的数据转为excel的行列形式
//     var sheetsData = data.map(function (item, rowIndex) {
//         return keys.map(function (key, columnIndex) {
//             return Object.assign({}, {
//                 value: item[key],
//                 position: (columnIndex > 25 ? getCharCol(columnIndex) : String.fromCharCode(65 + columnIndex)) + (rowIndex + 1),
//             });
//         });
//     }).reduce(function (prev, next) {
//         return prev.concat(next);
//     });
//
//     sheetsData.forEach(function (item, index) {
//         content[item.position] = {v: item.value};
//     });
//     //设置区域,比如表格从A1到D10,SheetNames:标题，
//     var coordinate = Object.keys(content);
//     var workBook = {
//     SheetNames: ["helloSheet"],
//                    Sheets: {
//                          "helloSheet": Object.assign({}, content, { "!ref": coordinate[0] + ":" + coordinate[coordinate.length - 1] }),
//                             }
//             };
//                 //这里的数据是用来定义导出的格式类型
//                var excelData = XLSX.write(workBook, { bookType: "xlsx", bookSST: false, type: "binary" });
//                var blob = new Blob([string2ArrayBuffer(excelData)], { type: "" });
//                saveAs(blob, "hello.xlsx");
//             },
//        //字符串转字符流
//         function string2ArrayBuffer(s) {
//                 var buf = new ArrayBuffer(s.length);
//                  var view = new Uint8Array(buf);
//                  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
//                  return buf;
//            },
//      // 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
//        function getCharCol(n) {
//                 var temCol = "",
//                       s = "",
//                        m = 0;
//              while (n > 0) {
//                         s = String.fromCharCode(m + 64) + s;
//                         n = (n - m) / 26
//                     }
//                return s
// },





