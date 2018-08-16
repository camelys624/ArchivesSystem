layui.use('table',function () {
    let table = layui.table,
        $ = layui.$;

    let base = 'http://192.168.2.128:8081/';
    let url = null;

    url = base + '/admin/areamodule/fileBoxInfo';
    $.ajax({
        url: url,
        success: function (result) {
            table.render({
                elem: '#box-table',
                page: true,
                cols: [[
                    {field: 'xuhao', title: '序号', type: 'numbers', fixed: 'left'},
                    {field: 'archivesNumber', title: '件号'},
                    {field: 'arcName', title: '题名'},
                    {field: 'archivesBarcode', title: '档案条码'},
                    {field: 'rdLocationAddr', title: '存放位置'},
                    {field: 'updateOperator', title: '著录人'},
                    {field: 'updateTime', title: '著录时间'},
                    {field: 'fkBoxId', title: '所属档案盒'},
                    {field: 'gdlType', title: '固定列位置'},
                    {field: 'width', title: '密集架宽度'},
                    {field: 'speed', title: '运行速度'},
                    {field: 'ventgaps', title: '通风间隔'},
                    {field: 'ip', title: '主机名', width: 200},
                    {field: 'right', title: '操作', width: 120, align: 'center', toolbar: '#group-box', fixed: 'right'}
                ]],
                data: result.rows

            });


        }
    });

    table.on('tool(table)',function (obj) {
        let data = obj.data,
            layEvent = obj.event;
        let value = {
            id: data.id,
            // arcids:
        };
        if(layEvent === 'group'){
            console.log(adc);
            // $.ajax({
            //     url: base + '/admin/areamodule/fileBoxInfo/groupBox',
            //     // data:
            // });
        }
    });
});