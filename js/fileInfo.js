/**
 *
 * author: ys
 * time: 2018/8/13
 *
 **/

layui.use(['tree', 'layer', 'table', 'upload', 'form', 'laydate'], function () {
    let tree = layui.tree,
        layer = layui.layer,
        table = layui.table,
        upload = layui.upload,
        form = layui.form,
        laydate = layui.laydate,
        $ = layui.$;


    let base = 'http://192.168.2.128:8081/';
    let url = null;

    //定义空弹出面板
    let edit = null,
        search = null,
        box = null,
        borrow = null,
        uploadInst = null,
        uploadExcel = null;
    let nodes = [];
    // 创建树菜单
    let createTree = function () {
        $.ajax({
            url: 'http://192.168.2.11:83/mock/25/admin/areamodule/fileArchivesType/selectMenu',
            type: 'GET',
            success: function (result) {
                let fileInfoData = result.list;
                nodes = fileInfoData;
                //树形菜单
                tree({
                    elem: '#tree',
                    nodes: nodes,
                    click: function (node) {
                        showTable(node);
                        $('#entry').removeAttr('disabled');
                    }
                });
            }
        });
    };
    createTree();

    let createTable = function (data, cols) {
        table.render({
            elem: '#table',
            page: true,
            cols: [cols],
            data: [data.row]
        });
    };

    let showTable = function (_node) {
        let value = '';
        value = 'map[ip]=1,map[arcName-like]=123';
        $.ajax({
            url: base + '/admin/areaModule/FileArchivesInfo/query',
            // data: value,
            dataType: 'json',
            type: 'GET',
            success: function (result) {
                let cols = [
                    {field: 'xuhao', title: '序号', type: 'numbers', fixed: 'left'},
                    {type: 'checkbox'},
                    {field: 'rdTypeName', title: '文档类型'},
                    {field: 'arcName', title: '档案名称'},
                    {field: 'fkTemplateId', title: '模板编号'},
                    {field: 'archivesNumber', title: '档案编号'},
                    {field: 'storeid', title: '库房ID'},
                    {field: 'quNum', title: '区编号'},
                    {field: 'div', title: '节号'},
                    {field: 'col', title: '列号'},
                    {field: 'lay', title: '层号'},
                    {field: 'location', title: '位置方向'},
                    {field: 'rfid', title: 'RFID'},
                    {field: 'updateOperator', title: '著录人'}
                ];
                if ('araeRegion' in result.row) {
                    cols.push({field: 'name', title: '所属仓库'});
                }
                if ('fkBoxId' in result.row) cols.push({field: 'fkBoxId', title: '未知'});
                if ('archivesBarcode' in result.row) cols.push({field: 'archivesBarcode', title: '未知'});
                if ('archivesNumber' in result.row) cols.push({field: 'archivesNumber', title: '什么ID'});
                if ('createTime' in result.row) cols.push({field: 'createTime', title: '著录时间'});
                if ('fkTypeId' in result.row) cols.push({field: 'fkTypeId', title: 'ID'});
                result.row.name = result.row.araeRegion.name;
                createTable(result, cols);
                createForm(cols);
            }
        });

    };

    let createForm = function (data) {
        let items = '';
        for (let i = 2; i < data.length; i++) {
            if (data[i].field === 'createTime') {
                items += '<div class="layui-inline">' +
                    '<div class="layui-form-item">' +
                    '<label class="layui-form-label">' + data[i].title + '</label>' +
                    '<div class="layui-input-inline">' +
                    '<input type="date" name="' + data[i].field + '" id="date-time" lay-verify="date" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            } else {
                items += '<div class="layui-inline">' +
                    '<div class="layui-form-item">' +
                    '<label class="layui-form-label">' + data[i].title + '</label>' +
                    '<div class="layui-input-inline">' +
                    '<input type="text" name="' + data[i].field + '" autocomplete="off" class="layui-input">' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
        }

        let form = '<form id="fileEdit" class="layui-form" style="display: none;margin-top: 10px" action="" lay-filter="addFile">' + items +
            '<div class="layui-form-item">' +
            '<label class="layui-form-label">备注</label>' +
            '<div class="layui-input-block">' +
            '<textarea class="layui-textarea" placeholder="请输入："></textarea>' +
            '</div>' +
            '</div>' +
            '<hr/>' +
            `<div class="layui-form-item">
                <label class="layui-form-label">存放位置</label>
                <div class="layui-input-inline">
                    <input type="text" name="station" class="layui-input" disabled>
                </div>
                <button id="choose" class="layui-btn layui-btn-primary">选择</button>
             </div>
             <div class="layui-form-item">
                <label class="layui-form-label">档案条码</label>
                <div class="layui-input-inline">
                    <input type="text" name="RFID" class="layui-input">
                </div>
             </div>`
            +
            '<div class="layui-form-item">' +
            '<div class="layui-input-block">' +
            '<button class="layui-btn" lay-submit="" lay-filter="file-btn">确定</button>' +
            '<button type="reset" class="layui-btn layui-btn-primary">重置</button>' +
            '</div>' +
            '</div>' + '</form>';
        $('body').append(form);
    };

    //下拉按钮菜单
    $('#borrow').click(function () {
        $('#Excel-menu').hide();
        $('#borrow-menu').toggle();
    });
    $('#operating').click(function () {
        $('#borrow-menu').hide();
        $('#Excel-menu').toggle();
    });

    $('#search').click(function () {
        $('#Excel-menu').hide();
        $('#borrow-menu').hide();
        search = layer.open({
            type: 1,
            title: '档案查询',
            area: '365px',
            content: $('#search-box')
        });
    });

    $('#s-btn').click(function () {
        let info = document.getElementById('info'),
            infoIndex = info.selectedIndex,
            infoValue = info.options[infoIndex].value;
        let status = document.getElementById('status'),
            statusIndex = status.selectedIndex,
            statusValue = status.options[statusIndex];
        let value = document.getElementById('s-value').value;
        let timeStart = document.getElementById('time-start').value;
        let timeEnd = document.getElementById('time-end').value;
        if (statusValue === 0) {
            console.log("hello");
        } else if (statusValue === 1) {
            switch (infoValue) {
                case 0:
                    url = base + '/admin/areamodule/fileArchivesInfo?map[arcName-like]=' + value;
                    break;
                case 1:
                    url = base + '/admin/areamodule/fileArchivesInfo?map[archivesNumber-like]=' + value;
                    break;
                case 2:
                    url = base + '/admin/areamodule/fileArchivesInfo?map[archivesBarcode-like]=' + value;
                    break;
                case 3:
                    url = base + '/admin/areamodule/fileArchivesInfo?map[rdLocationAddr-like]=' + value;
                    break;
                case 4:
                    url = base + '/admin/areamodule/fileBoxInfo?map[boxBarcode-like]=' + value;
                    break;
                case 5:
                    url = base + '/admin/areaModule/fileArchivesInfo?pageSize=1&currentPage=2';
                    break;
                case 6:
                    url = base + '/admin/areamodule/fileArchivesInfo/selectTime?date=' + timeStart + '-' + timeEnd + '&page=1&pageSize=1';
                    break;
                default:
                    break;
            }
        }

        $.ajax({
            url: url,
            success: function (result) {
                createTable(result.rows);
            }
        });
    });
    //导入文档信息
    $('#entry').click(function () {
        $('#Excel-menu').hide();
        $('#borrow-menu').hide();
        edit = layer.open({
            type: 1,
            title: '编辑档案',
            area: ['700px', '450px'],
            content: $('#fileEdit')
        });
    });
    //日期
    laydate.render({
        elem: '#date-time'
    });

    //定义事件监听
    form.on('submit(file-btn)', function (data) {
        let value = data.field;
        $.ajax({
            url: base + '/admin/areamodule/fileArchivesInfo/add',
            type: 'POST',
            data: value,
            contentType: 'application/json',
            dataType: 'json',
            success: function (result) {
                layer.msg(result.msg);
            }

        })
    });


    $('#box').click(function () {
        $('#Excel-menu').hide();
        $('#borrow-menu').hide();
        box = layer.open({
            type: 2,
            title: '档案组盒',
            area: ['1400px', '600px'],
            offset: '100px',
            content: ['../html/table.html', 'no']
        });

    });

    $('#import').click(function () {
        $('#Excel-menu').hide();
    });
    uploadExcel = upload.render({
        elem: '#import',
        url: base + '/admin/areamodule/fileBoxInfo/execlImport',
        accept: 'file',
        done: function (result) {
            layer.msg(result.msg);
        },
        error: function () {
            console.log("erro")
        }
    });
    uploadInst = upload.render({
        elem: '#upload',
        url: base + '/admin/areamodule/fileBoxInfo/execlImport',
        done: function (result) {
            layer.msg(result.msg);
        }
    })


});