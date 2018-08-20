var url = 'http://192.168.2.128:8081';
// 由于表头在下方需重复使用，所以将它放在外边
var tableHead = [
    [
        //表头
        { field: 'tourPlayerId', title: 'ID', width: 80, align: 'center', fixed: 'left', type: 'numbers' },
        { field: 'name', title: '档案（盒）名称', align: 'center', width: 140 },
        { field: 'status', title: '借还状态', align: 'center', width: 100 },
        { field: 'type', title: '类型', align: 'center', width: 70 },
        { field: 'borrowid', title: '档案ID', align: 'center', width: 200 },
        { field: 'creater', title: '操作者', align: 'center', width: 150 },
        { field: 'userName', title: '借阅人', align: 'center', width: 135 },
        { field: 'userPhone', title: '联系方式', align: 'center', width: 185 },
        { field: 'id', title: '借阅记录ID', align: 'center', width: 185 },
        { field: 'renewals', title: '续借次数', align: 'center', width: 100 },
        { fixed: 'right', title: '操作', width: 78, align: 'center', toolbar: '#barDemo', event: 'delete', style: 'cursor: pointer;' }

    ]
];


layui.use(['table', 'layer', 'laypage', 'form'], function() {
    var table = layui.table;
    var laypage = layui.laypage;
    var layer = layui.layer;
    var form = layer.form;
    var info = ""
    // 在借阅记录一打开时就发送请求，保证用户可以看到已存在的借阅记录
    $.ajax({
        url: url + '/admin/areamodule/fileHistory',
        type: 'get',
        // 请求成功后，将返回的数据渲染到表格中
        success: function(data) {
            var dataList = data.rows;
            console.log(dataList);
            table.render({
                elem: '#loan-records-table',
                height: 700,
                // limit: 5 , //限制显示条数
                page: true, //开启分页
                cols: tableHead,
                data: dataList,
            });
        }
    });

    //删除借阅记录由此开始-----------------------------------------------------------------------------
    table.on('tool(test)', function(obj) {
        // 被选中的单元格的数据
        var selectedCell = obj.data.id;
        console.log(selectedCell);
        //将id和id值转换成json格式
        var delById = '{' + '"' + 'id' + '"' + ':' + selectedCell + '}';
        console.log(delById);
        // 删除按钮点击事件
        if (obj.event === 'delete') {
            // 弹出层询问，确定的时候执行该动作
            layer.confirm('确定要删除这条借阅记录吗？', function(index) {
                obj.del();
                layer.close(index);
                $.ajax({
                    url: url + '/admin/areamodule/fileBorrow/delete?',
                    headers: { 'Content-Type': 'application/json' },
                    type: 'post',
                    data: delById,
                    success: function(data) {
                        alert(data.msg);
                        // window.location.reload();
                    }
                });
            });
        }
    });
    // TIPS:借阅记录只能查看，不能删除
    //删除借阅记录由此结束-----------------------------------------------------------------------------

    // 查询借阅记录由此开始------------------------------------------------------------------------------
    $('#search').on('click', function() {
        //弹出层
        layer.open({
            type: 1, //层的类型为页面层
            btnAlign: 'l', //按钮的位置居左
            moveOut: false, //不允许借阅查询弹出层被拖动到该界面之外的地方
            title: ['借阅记录查询', 'font-size:18px'], //借阅查询弹出层的标题及样式
            area: ['400px', '230px'], //借阅弹出层的大小
            content: $('#searchDiv'), //绑定借阅弹出层的显示内容
            btn: '提交', //增加弹出层的提交按钮

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
                var data = [
                    ['fileLog', fileLog],
                    ['findType', findType],
                    ['inputInfo', inputInfo]
                ];
                //查看是否取得用户选择值和输入值
                // console.log(data);
                //要传过去的数据
                var info = '=' + inputInfo;
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
                                // limit: 5 ,限制显示条数
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
    // 查询借阅记录由此结束------------------------------------------------------------------------------

    // excel操作由此开始------------------------------------------------------------------------------
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
    // excel操作由此结束------------------------------------------------------------------------------
});
// TIPS:后台还未写借阅记录的Excel操作接口：需要的参数除了data里的，还需要页码和页容量