layui.use(['table', 'layer', 'form', 'laydate'], function () {
    let table = layui.table,
        layer = layui.layer,
        form = layui.form,
        laydate = layui.laydate,
        $ = layui.$;

    let search = null;
    let createTable = function () {
        $.ajax({
            type: 'GET',
            url: url,
            success: function (result) {
                // let data = [];
                // for (let i = 0; i < result.rows.length; i++) {
                //     if (result.rows[i].status === 3) {
                //         data.push(result.rows[i]);
                //     }
                // }
                // let data = [];
                // console.log(result);
                // for(let i = 0;i < result.rows.length;i ++){
                //     if(result.rows[i].delete === 0){
                //         data.push(result.rows[i]);
                //     }
                // }
                table.render({
                    elem: '#table',
                    page: true,
                    cols: [borrowingCols],
                    data: result.rows
                })
            }
        });
    };
    createTable();
    laydate.render({
        elem: '#startTime'
    });
    laydate.render({
        elem: '#endTime'
    });

    $('#search').click(function () {
        search = layer.open({
            type: 1,
            title: '查询文档信息',
            area: ['650px', '400px'],
            content: $('#search-box')
        })
    });

    form.on('submit(search)', function (data) {
        console.log(JSON.stringify(data.field));
        let searchData = data.field;
        if (searchData.factor !== '6') {
            $('#startTime').attr('disabled', true);
            $('#endTime').attr('disabled', true);
        } else {
            console.log(searchData.factor);
            $('#startTime').removeAttr('disabled');
            $('#endTime').removeAttr('disabled');
        }
        if (searchData.styles == 0) {
            console.log("hello");
        } else if (searchData.styles == 1) {
            switch (parseInt(searchData.factor)) {
                case 0:
                    url = base + '/admin/areamodule/fileArchivesInfo?mapmap[archivesNumber-like]=' + searchData.info;
                    break;
                case 1:
                    url = base + '/admin/areamodule/fileArchivesInfo?map[archivesBarcode-like]=' + searchData.info;
                    break;
                default:
                    break;
            }

        }
        $.ajax({
            url: url,
            success: function (result) {
                console.log(result);
                layer.msg(result.msg);
                table.render({
                    elem: '#table',
                    page: true,
                    cols: [borrowingCols],
                    data: result.rows
                })
            }
        });
        layer.close(search);
        return false;
    });

    /**
     *
     * 归还档案
     *
     */

    table.on('checkbox(table)', function (obj) {
        console.log(obj);
    });
    let returnFile = function () {
        let checkStatus = table.checkStatus('table'),
            objData = checkStatus.data;
        if(objData.length !== 0) {
            let array = [];
            for (let i = 0; i < objData.length; i++) {
                array.push(objData[i].id);
            }
            let value = array.join(),
                data = {ids: value};
            $.ajax({
                type: 'POST',
                url: returnFilesUrl,
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (result) {
                    if(result.state === true){
                        layer.msg("归还成功");
                        createTable();
                    }
                }
            })
        }else {
            layer.msg("没有选择数据，请选择！");
        }
    };
    $('#return').click(function () {
        returnFile();
    });

    table.on('tool(table)',function (obj) {
        let data = obj.data,
            layEvent = obj.event;
        let returnData = null;
        if(layEvent === 'returnFile'){
            returnData = {id: data.id};
            $.ajax({
                type: 'POST',
                url:returnFileUrl,
                data:JSON.stringify(returnData),
                contentType: 'application/json',
                success: function (result) {
                    layer.msg(result.msg);
                    if(result.state === true){
                        createTable();
                    }
                }
            });
        }else if(layEvent === 'del'){
            returnData = {id: data.id};
            $.ajax({
                type: 'POST',
                url: delFileUrl,
                data: JSON.stringify(returnData),
                contentType: 'application/json',
                success: function (result) {
                    layer.msg(result.msg);
                    if(result.state === true){
                        createTable();
                    }
                }
            });
        }
    });
});