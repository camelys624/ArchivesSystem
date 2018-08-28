layui.use(['element', 'table'], function () {
    let element = layui.element,
        table = layui.table,
        $ = layui.$;

    let href;
    cols = [
        {field: 'xuhao', title: '序号', type: 'numbers', fixed: 'left'},
        {type: 'checkbox'},
        {field: 'fileName', title: '名称'},
        {field: 'createTime', title: '创建时间'},
        {field: 'creater', title: '创建人'},
        {field: 'rfid', title: 'rfid'},
        {field: 'borrowId', title: '借阅ID'},
        {field: 'id', title: '任务id'},
        {field: 'barcode', title: '条码'},
        {field: 'fileType', title: '文档类型'},
        {field: 'fileId', title: '档案或档案盒id'},
        {field: 'local', title: '存放位置'},
        {field: 'ip', title: 'ip'},
        {field: 'right', title: '操作', width: 80, align: 'center', toolbar: '#toolbar', fixed: 'right'}
    ];
    let data;
    $('#upTask').click(function () {
       href = base + 'admin/areamodule/fileOptionFrame?map[status]=2';
        showTable(href);
    });
    $('#doTask').click(function () {
       href = base + 'admin/areamodule/fileOptionFrame?map[status]=1';
       showTable(href);
    });
    let showTable = function (url) {
        url === undefined ? url = base+'admin/areamodule/fileOptionFrame?map[status]=2' :url;
        let table1 = table.render({
            elem: '#table',
            url: url,
            page: true,
            height:'full-105',
            cols: [cols],
            request: {
                pageName: 'currentPage',
                limitName: 'pageSize'
            },
            response: {
                statusCode: 1,
                countName: 'total',
                dataName: 'rows'
            },
            done: function (res, curr, count) {
                $(document).bind('contextmenu', function (e) {
                    e.preventDefault();
                    return false;
                });
                let data = res.rows;
                console.log(data);
                $('.layui-table-body tr').each(function (e) {
                    //表单鼠标右键操作
                    let drindex = null;
                    $(this).mousedown(function (e) {
                        let index = $(this).attr('data-index');
                        if (e.which == 3) {
                            $("#mousedown_right").show();
                            let x = e.originalEvent.x + 'px';
                            let y = e.originalEvent.y + 'px';
                            $("#mousedown_right").css({
                                top: y,
                                left: x
                            });

                            tableData = data[0];
                            drindex = index;
                        }
                        if (e.which == 1) {
                            $("#mousedown_right").hide();
                        }

                        console.log(data[index]);

                    });

                });

            }
        });
    };
    showTable();

    let openTask = function (data){
        let local = data.location[0];
        if(data.fileType === 0){
            data.fileType = '档案';
        }else if(table.fileType === 1){
            data.fileType = '档案盒'
        }
        if(local.localtion === 1){
            data.localtion = '左';
        }else if(local.localtion === 2){
            data.localtion = '右';
        }
        let str = '<?xml version="1.0" encoding="utf-8"?>'+
            '<root type="opentask">'+
            '<Content>'+
            '<Type>'+data.fileType+'</Type>'+
            '<BoxName>'+data.fileName+'</BoxName> '+
            '<QuNo>'+local.rd_region_num+'</QuNo>'+
            '<ColNo>'+local.col+'</ColNo>'+
            '<Le>'+local.lay+'</Le>'+
            '<Div>'+local.div+'</Div>'+
            '<LR>'+data.localtion+'</LR>'+
            ' </Content>'+
            '</root>';
        let b = new Base64();
        let xml = b.encode(str);

        $.ajax({
            url:local.ip+':8081/GDL',
            type:'POST',
            contentType:'application/xml',
            data:xml,
            dataType:'text',
            success:function (result) {
                console.log(result);
            },
            error:function (result) {
                console.log('oops!!');
            }
        });
    };

    $('#sendTask').click(function () {
        let checkStatus = table.checkStatus('table1');
        let fileData = checkStatus.data;
        let ids = [],ips=[];
        for (let i = 0; i < fileData.length; i++) {
            ids.push(fileData[i].id);
            for(let j = i+1;j<fileData.length;j++){
                if(fileData[i].ip===fileData[j].ip){
                    ips.push(fileData[i],fileData[j]);
                }
            }
        }
        let data = {ids: ids.join()};
        console.log(data);
        $.ajax({
            url: base + 'admin/areamodule/fileOptionFrame/update',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (result) {
                layer.msg(result.msg);
                showTable(href);
            }
        });


    });
    $('#sendTaskR').click(function () {
        let value = {ids: tableData.id};

        // $.ajax({
        //     url: base + 'admin/areamodule/fileOptionFrame/update',
        //     type: 'POST',
        //     contentType: 'application/json',
        //     data: JSON.stringify(value),
        //     success: function (result) {
        //         if (result.state === true) {
        //             layer.msg(result.msg);
        //             showTable(href);
        //         }
        //     }
        // });

    });
    table.on('tool(table)', function (obj) {
        let data = obj.data,
            layEvent = obj.event;
        if (layEvent === 'sendTask') {
            let value = {ids: data.id};
            $.ajax({
                url: base + 'admin/areamodule/fileOptionFrame/update',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(value),
                success: function (result) {
                    layer.msg(result.msg);
                    showTable(href);
                }
            });
        }
    });

});