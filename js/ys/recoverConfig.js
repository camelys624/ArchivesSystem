url = base + 'admin/areaModule/FileArchivesInfo?map[deleted]=1';
let returnFileUrl = base + 'admin/areamodule/fileArchivesInfo/update',
    delFileUrl = base + 'admin/areamodule/fileArchivesInfo/delete';

let borrowingCols = [
    {field: 'xuhao', title: '序号', type: 'numbers', fixed: 'left'},
    {type: 'checkbox'},
    {field: 'xuhao', type: 'numbers', title: '序号'},
    {field: 'arcName', title: '档案名称'},
    {field: 'archivesNumber', title: '档案编号'},
    {field: 'name', title: '库房'},
    {field: 'rdLocationAddr', title: '位置'},
    {field: 'updateOperator', title: '著录人'},
    {field: 'create_time', title: '著录时间'},
    {field: 'right', title: '操作', width: 160, align: 'center', toolbar: '#toolbar', fixed: 'right'}
];
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
                let data = [];
                // for (let i = 0; i < result.rows.length; i++) {
                //     if (result.rows[i].status === 3) {
                //         data.push(result.rows[i]);
                //     }
                // }
                // let data = [];
                console.log(result);
                if (result.state !== false) {
                    table.render({
                        elem: '#table',
                        page: true,
                        height: 'full-10',
                        cols: [borrowingCols],
                        data: result.rows,
                        done: function (res, curr, count) {
                            $(document).bind('contextmenu', function (e) {
                                e.preventDefault();
                                return false;
                            });
                            let data = res.data;
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

                                        tableData = data[index];
                                        drindex = index;
                                    }
                                    if (e.which == 1) {
                                        $("#mousedown_right").hide();
                                    }

                                    console.log(JSON.stringify(tableData));
                                });

                            });
                        }
                    })
                }else{
                    layer.msg(result.msg);
                }
            }
        });
    };
    createTable();


    /**
     *
     * 还原档案
     *
     */

    table.on('checkbox(table)', function (obj) {
        console.log(obj);
    });

    table.on('tool(table)', function (obj) {
        let data = obj.data,
            layEvent = obj.event;
        let returnData = null;
        if (layEvent === 'returnFile') {
            returnData = {id: data.id,deleted:0};
            $.ajax({
                type: 'POST',
                url: returnFileUrl,
                data: JSON.stringify(returnData),
                contentType: 'application/json',
                success: function (result) {
                    console.log(result);
                    layer.msg(result.msg);
                    if (result.state === true) {
                        createTable();
                    }
                }
            });
        } else if (layEvent === 'del') {
            returnData = {id: data.id};
            $.ajax({
                type: 'POST',
                url: delFileUrl,
                data: JSON.stringify(returnData),
                contentType: 'application/json',
                success: function (result) {
                    layer.msg(result.msg);
                    if (result.state === true) {
                        createTable();
                    }
                }
            });
        }
    });

    $('#recover_right').click(function () {
        let data = {id: tableData.id, deleted: 0};
        // data.id = tableData.id;
        // data.deleted = 0;
        console.log(JSON.stringify(data));
        $.ajax({
            url: returnFileUrl,
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                if(result.state === true){
                    createTable();
                }
                layer.msg(result.msg);
            }
        });
    });
    $('#del_right').click(function () {
        let data = {id:tableData.id};
        $.ajax({
            type: 'POST',
            url: delFileUrl,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function (result) {
                layer.msg(result.msg);
                if (result.state === true) {
                    createTable();
                }
            }
        });
    })
});