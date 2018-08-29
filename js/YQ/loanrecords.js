var url = 'http://192.168.2.128:8081';
// 由于表头在下方需重复使用，所以将它放在外边
var tableHead = [
    [
        //表头
        { field: 'tourPlayerId', title: '序号', width: 120, align: 'center', fixed: 'left', type: 'numbers' },
        { field: 'name', title: '档案（盒）名称', align: 'center', width: 250 },
        {
            field: 'status',
            title: '借还状态',
            align: 'center',
            width: 150,
            templet: function(d) {
                // console.log(d);
                return d.status ? '已借出' : '已归还';
            }
        },
        {
            field: 'type',
            title: '类型',
            align: 'center',
            width: 150,
            templet: function(d) {
                // console.log(d);
                return d.type ? '档案' : '档案盒';
            }
        },
        { field: 'borrowid', title: '档案ID', align: 'center', width: 300 },
        { field: 'creater', title: '操作者', align: 'center', width: 168 },
        { field: 'userName', title: '借阅人', align: 'center', width: 150 },
        { field: 'userPhone', title: '联系方式', align: 'center', width: 200 },
        { field: 'id', title: '借阅记录ID', align: 'center', width: 300 },
        { field: 'renewals', title: '续借次数', align: 'center', width: 120 }
    ]
];


layui.use(['table', 'layer', 'laypage', 'form'], function() {
    var table = layui.table;
    var laypage = layui.laypage;
    var layer = layui.layer;
    var form = layer.form;
    var info = "";

    //表格初始化由此开始------------------------------------------------------------------------------------------------
    table.render({
        elem: '#loan-records-table',
        height: 'full-45',
        page: true, //开启分页
        cols: tableHead,
        method: 'get',
        url: url + '/admin/areamodule/fileHistory',
        request: {
            pageName: 'currentPage', //页码的参数名称，默认：page
            limitName: 'pageSize' //每页数据量的参数名，默认：limit
        },
        response: {
            statusName: 'code', //数据状态的字段名称，默认：code
            statusCode: 1, //成功的状态码，默认：0
            msgName: 'msg', //状态信息的字段名称，默认：msg
            countName: 'total', //数据总数的字段名称，默认：count
            dataName: 'rows', //数据列表的字段名称，默认：data
        }
    });


    //表格初始化到此结束------------------------------------------------------------------------------------------------

    // 查询借阅记录由此开始--------------------------------------------------------------------------------------------------
    $('#search').on('click', function() {
        //弹出层
        layer.open({
            type: 1, //层的类型为页面层
            btnAlign: 'l', //按钮的位置居左
            moveOut: false, //不允许借阅查询弹出层被拖动到该界面之外的地方
            title: ['借阅记录查询', 'font-size:18px'], //借阅查询弹出层的标题及样式
            area: ['350px', '210px'], //借阅弹出层的大小
            content: $('#searchDiv'), //绑定借阅弹出层的显示内容
            btn: '提交', //增加弹出层的提交按钮
            resize: false, //不允许拉伸弹出层
            skin: 'my-skin', //自定义按钮的样式

            //点击右上角的x时，取消并隐藏查询div
            cancel: function(index, layero) {
                $('#searchDiv').hide();
                layer.close(index);
            },
            //弹出层上的提交按钮的点击事件
            btn1: function(index, layero) {
                // 获取弹出层第一个下拉列表：档案名称 or 条形码
                var fileLog = $(layero).find("#fileLog").val();
                // 获取弹出层第二个下拉列表：精确查找 or 模糊查找
                var findType = $(layero).find("#findType").val();
                //获取弹出层上用户输入框的值
                var inputInfo = $(layero).find("#inputInfo").val();
                //要传过去的数据
                var data = [
                    ['fileLog', fileLog],
                    ['findType', findType],
                    ['inputInfo', inputInfo]
                ];
                var info = '=' + inputInfo;
                // 模糊查找与精确查找
                if (findType == "模糊查找") {
                    switch (fileLog) {
                        case '档案名称':
                            info = 'map[name-like]' + info;
                            break;
                        case '条形码':
                            info = 'map[barcode-like]' + info;
                            break;
                        case 'RFID码':
                            info = 'map[rfid-like]' + info;
                            break;
                    }
                } else {
                    switch (fileLog) {
                        case '档案名称':
                            info = 'map[name]' + info;
                            break;
                        case '条形码':
                            info = 'map[barcode]' + info;
                            break;
                        case 'RFID码':
                            info = 'map[rfid]' + info;
                            break;
                    }
                }
                console.log(info);
                // 根据查询界面选择和输入的值，将查询的数据请求下来并显示到表格中
                $.ajax({
                    url: url + '/admin/areamodule/fileHistory',
                    type: 'get',
                    data: info,
                    //请求成功时执行的动作
                    success: function(data) {
                        // console.log(data);
                        //将请求到的数据渲染到表格中
                        layui.use(['layer', 'table', 'laypage', 'form'], function() {
                            var layer = layui.layer;
                            var table = layui.table;
                            //表格渲染
                            table.render({
                                elem: '#loan-records-table', //绑定html中的表格
                                height: 700, //设置表格高度
                                page: true, //开启分页
                                cols: tableHead, //表格的表头
                                data: data.rows, //将返回数据data中row的值取出并放入表格
                            });
                        });
                    }
                });

                //查询成功后，将两个下拉框和用户输入框的值设置成初始值
                $(layero).find("#fileLog").val("档案名称");
                $(layero).find("#findType").val("精确查找");
                $(layero).find("#inputInfo").val("");
                //隐藏借阅查询div
                $('#searchDiv').hide();
                //关闭该弹出层
                layer.close(index);
            }
        });

    });
    // 查询借阅记录到此结束--------------------------------------------------------------------------------------------------

    //Excel操作由此开始--------------------------------------------------------------------------------------------------
    $('#excel').change(function() {
        // select的选中值
        var excelAction = $('#excel option:selected').val();
        // console.log(excelAction);
        // 弹出层第一个下拉列表：档案名称 or 条形码 or RFID码
        var fileLog = $(layero).find("#fileLog").val();
        // 弹出层第二个下拉列表：精确查找 or 模糊查找
        var findType = $(layero).find("#findType").val();
        // 弹出层用户输入框的值
        var inputInfo = $(layero).find("#inputInfo").val();
        // 弹出层的输入框
        // console.log(fileLog + " " + findType + " " + inputInfo);
        // 创建数组存储以上信息，发送请求
        var data = [
            ['excelAction', excelAction],
            ['fileLog', fileLog],
            ['findType', findType],
            ['inputInfo', inputInfo]
        ];
    });
    //Excel操作到此结束--------------------------------------------------------------------------------------------------
});