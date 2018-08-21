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
        boxTable = layui.table,
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
        setStation = null,
        uploadInst = null,
        uploadExcel = null;
    let nodes = [];


    // 创建树菜单
    let createTree = function () {
        $.ajax({
            url: base + 'admin/areamodule/fileArchivesType/selectMenu_all',
            type: 'GET',
            data: 'disabled=0',
            success: function (result) {
                let fileInfoData = result.list;
                let parent = [], child = [], children = [];
                for (let i = 0; i < fileInfoData.length; i++) {
                    if (fileInfoData[i].parentId == -1) {
                        parent.push(fileInfoData[i]);
                    } else {
                        child.push(fileInfoData[i])
                    }
                }

                for (let i = 0; i < parent.length; i++) {
                    for (let j = 0; j < child.length; j++) {
                        if (parent[i].id == child[j].parentId) {
                            children.push(child[j]);
                            parent[i].children = children;
                        }
                    }
                    children = [];

                }
                nodes = parent;
                //树形菜单
                tree({
                    elem: '#tree',
                    nodes: nodes,
                    click: function (node) {
                        if (node.type === 1) {
                            url = base + 'admin/areaModule/FileArchivesInfo?map[fkTemplateId]=' + node.id;
                            showTable(node);
                            $('#entry').removeAttr('disabled');
                        }
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
            data: data
        });
    };

    let showTable = function (_node) {

        value = 'map[id]=' + _node.id;
        $.ajax({
            url: url,

            type: 'GET',
            success: function (result) {
                console.log(JSON.stringify(result.rows));
                let data = result.rows;
                if (data.length !== 0) {
                    if ('araeRegion' in data) {
                        cols.push({field: 'name', title: '所属仓库'});
                    }
                    if ('fkBoxId' in data) cols.push({field: 'fkBoxId', title: '未知'});
                    if ('archivesBarcode' in data) cols.push({field: 'archivesBarcode', title: '未知'});
                    if ('createTime' in data) cols.push({field: 'createTime', title: '著录时间'});
                    if ('fkTypeId' in data) cols.push({field: 'fkTypeId', title: 'ID'});
                    if (cols[cols.length - 1].toolbar === undefined) {
                        cols.push({
                            field: 'right',
                            title: '操作',
                            width: 180,
                            align: 'center',
                            toolbar: '#toolbar',
                            fixed: 'right'
                        });
                    }
                    for (let i = 0; i < data.length; i++) {
                        data[i].name = data[i].araeRegion.name;
                        data[i].col = data[i].araeLocation.col;
                        data[i].div = data[i].araeLocation.div;
                        data[i].lay = data[i].araeLocation.lay;
                        data[i].fileNum = JSON.parse(data[i].details).档号;
                        data[i].docName = JSON.parse(data[i].details).题名;
                    }
                    createTable(data, cols);
                    createForm(cols);
                } else {
                    layer.msg(result.msg);
                }


            }
        });

    };

    let createForm = function (data) {
        let items = '';
        for (let i = 2; i < data.length - 1; i++) {
            if (data[i].field === 'createTime') {
                items += '<div class="layui-inline">' +
                    '<div class="layui-form-item">' +
                    '<label class="layui-form-label">' + data[i].title + '</label>' +
                    '<div class="layui-input-inline">' +
                    '<input type="date" name="' + data[i].field + '" id="date-time" lay-verify="date" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
            else if (data[i].field === 'fkDictCodeSecurity' ||data[i].field ===  'duration') {
                let options = '';
                if (data[i].field === 'fkDictCodeSecurity') {
                    options = '<option>无</option>' +
                        '<option>秘密级</option>' +
                        '<option>机密级</option>' +
                        '<option>绝密级</option>';
                } else if (data[i].field === 'duration') {
                    options = '<option>永久</option>' +
                        '<option>定期30年</option>';
                }
                items += '<div class="layui-inline">' +
                    '<div class="layui-form-item">' +
                    '<label class="layui-form-label">' + data[i].title + '</label>' +
                    '<div class="layui-input-inline">' +
                    '<select name="' + data[i].field + '" class="layui-input" lay-ignore>' + options + '</select>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            } else if (data[i].field === 'div' || data[i].field === 'col' ||data[i].field === 'quNum'||
                data[i].field === 'lay' || data[i].field === 'detailsstr'||data[i].field==='rdLocationAddr') {
                items += '';
            }
            else {
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

        let form = '<form id="fileEdit" class="layui-form" style="display: none;margin-top: 10px" action="" lay-filter="fileEdit">' + items +
            '<div class="layui-form-item">' +
            '<label class="layui-form-label">备注</label>' +
            '<div class="layui-input-block">' +
            '<textarea class="layui-textarea" name="detailsstr" placeholder="请输入："></textarea>' +
            '</div>' +
            '</div>' +
            '<hr/>' +
            `<div class="layui-form-item">
                <label class="layui-form-label">存放位置</label>
                <div class="layui-input-inline">
                    <input type="text" id="stationInput" name="station" class="layui-input" disabled>
                </div>
                <a id="setStation" class="layui-btn layui-btn-primary" data-method="setStation">选择</a>
             </div>
             <div class="layui-form-item">
                <label class="layui-form-label">档案条码</label>
                <div class="layui-input-inline">
                    <input type="text" name="archivesBarcode" class="layui-input">
                </div>
                <a id="archivesBarcode" class="layui-btn layui-btn-primary">打印条码</a>
                <button class="layui-btn" lay-submit="" lay-filter="fileBtn">确定</button>
                <button type="reset" class="layui-btn layui-btn-primary">重置</button>
             </div> 
            </div>` + '</form>';
        $('body').append(form);
    };


    //导入文档信息
    $('#entry').click(function () {
        edit = layer.open({
            type: 1,
            title: '编辑档案',
            area: ['700px', '450px'],
            content: $('#fileEdit'),
        });

        $('#setStation').click(
            function () {
                setStation = layer.open({
                    type: 1,
                    title: '选择位置',
                    area: ['650px', '500px'],
                    content: $('#stationBox'),
                    btn: '确定',
                    yes: function () {
                        $('#stationInput').val(station);
                        layer.close(setStation);
                    },
                    zIndex: layer.zIndex,
                });
            });

    });


    //定义事件监听
    form.on('submit(fileBtn)', function (data) {
        let value = data.field;
        let station = value.station;
        let stationStr1 = station.split(/区/);
        value.quNum=stationStr1[0];
        let stationStr2 = stationStr1[1].split(/列/);
        value.col = stationStr2[0];
        let stationStr3 = stationStr2[1].split(/节/);
        value.div = stationStr3[0];
        let stationStr4 = stationStr3[1].split(/层/);
        value.lay = stationStr4[0];
        if ('左' !== stationStr4[1]) {
            value.localtion = 2;
        } else {
            value.localtion = 1;
        }
        console.log(JSON.stringify(value));
        $.ajax({
            url: base + 'admin/areamodule/fileArchivesInfo/add',
            type: 'POST',
            data: JSON.stringify(value),
            contentType: 'application/json',
            dataType: 'json',
            success: function (result) {
                layer.msg(result.msg);
            }
        });
        return false;
    });

    $('#search').click(function () {
        search = layer.open({
            type: 1,
            title: '档案查询',
            area: ['650px', '400px'],
            content: $('#search-box')
        });

    });

    $('.layui-anim').on('click', 'dd', function () {
        console.log($(this).html());
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
                    url = base + '/admin/areamodule/fileArchivesInfo?map[arcName-like]=' + searchData.info;
                    break;
                case 1:
                    url = base + '/admin/areamodule/fileArchivesInfo?map[archivesNumber-like]=' + searchData.info;
                    break;
                case 2:
                    url = base + '/admin/areamodule/fileArchivesInfo?map[archivesBarcode-like]=' + searchData.info;
                    break;
                case 3:
                    url = base + '/admin/areamodule/fileArchivesInfo?map[rdLocationAddr-like]=' + searchData.info;
                    break;
                case 4:
                    url = base + '/admin/areamodule/fileBoxInfo?map[boxBarcode-like]=' + searchData.info;
                    break;
                case 5:
                    url = base + '/admin/areaModule/fileArchivesInfo?pageSize=1&currentPage=2';
                    break;
                case 6:
                    url = base + '/admin/areamodule/fileArchivesInfo/selectTime?date=' + searchData.startTime + '-' + searchData.endTime + '&page=1&pageSize=1';
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
                if ('araeRegion' in result.rows) {
                    cols.push({field: 'name', title: '所属仓库'});
                }
                if ('fkBoxId' in result.rows) cols.push({field: 'fkBoxId', title: '未知'});
                if ('archivesBarcode' in result.rows) cols.push({field: 'archivesBarcode', title: '未知'});
                if ('createTime' in result.rows) cols.push({field: 'createTime', title: '著录时间'});
                if ('fkTypeId' in result.rows) cols.push({field: 'fkTypeId', title: 'ID'});
                for (let i = 0; i < result.rows.length; i++) {
                    result.rows[i].name = result.rows[i].araeRegion.name;
                }

                createTable(result.rows, cols);
            }
        });
        layer.close(search);
        return false;
    });

    laydate.render({
        elem: '#startTime'
    });
    laydate.render({
        elem: '#endTime'
    });

    laydate.render({
        elem: '#borrowTime'
    });
    laydate.render({
        elem: '#borrowDay'
    });


    $('#box').click(function () {
        getCheckedData();
        let fileID = [];
        console.log(fileID);
        if (fileData.length !== 0) {
            box = layer.open({
                type: 1,
                title: '档案组盒',
                area: ['1400px', '600px'],
                offset: '100px',
                content: $('#box-table')
            });
            url = base + '/admin/areamodule/fileBoxInfo';
            $.ajax({
                url: url,
                success: function (result) {
                    boxTable.render({
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
                            {
                                field: 'right',
                                title: '操作',
                                width: 120,
                                align: 'center',
                                toolbar: '#group-box',
                                fixed: 'right'
                            }
                        ]],
                        data: result.rows

                    });


                }
            });

            for (let i = 0; i < fileData.length; i++) {
                fileID.push(fileData[i].id);
            }
            boxTable.on('tool(table)', function (obj) {
                let data = obj.data,
                    layEvent = obj.event;
                console.log(fileID);
                let value = {id: data.id, arcIds: fileID.join()};
                console.log(JSON.stringify(value));
                if (layEvent === 'group') {
                    $.ajax({
                        type: 'POST',
                        url: base + '/admin/areamodule/fileBoxInfo/groupBox',
                        contentType: 'application/json',
                        data: JSON.stringify(value),
                        success: function (result) {
                            layer.msg(result.msg);
                        },
                        error: function (result) {
                            console.log(result.msg);
                        }
                    });
                }

            });
        } else {
            layer.msg("没有选择数据，请选择数据！");
        }
    });

    /**
     * 档案借阅
     */

    table.on('checkbox(table)', function (obj) {
        console.log(obj);
    });

    $('#directBorrow').click(function () {
        getCheckedData();
        if (fileData.length !== 0) {
            table.render({
                elem: '#borrowFile',
                page: false,
                cols: [[
                    {field: 'xuhao', type: 'numbers', title: '序号'},
                    {field: 'arcName', title: '档案名称'},
                    {field: 'archivesNumber', title: '档案编号'},
                    {field: 'name', title: '库房'},
                    {field: 'rdLocationAddr', title: '位置'},
                    {field: 'updateOperator', title: '著录人'}
                ]],
                data: fileData
            });

            layer.open({
                type: 1,
                title: '借阅',
                area: '950px',
                content: $('#borrowForm')
            });
        } else {
            layer.msg('没有选择数据，请选择数据!');
        }
    });


    let borrowFile = table.on('tool(table)', function (obj) {
        let data = obj.data,
            layEvent = obj.event;
        if (layEvent === 'edit') {
            edit = layer.open({
                type: 1,
                title: '编辑档案',
                area: ['700px', '450px'],
                content: $('#fileEdit')
            });

            // form.val('fileEdit', {
            //     "rdTypeName": data.rdStoreName,
            //     "arcName": data.arcName,
            //     "fkTemplateId": data.fkTemplateId,
            //     "archivesNumber": data.archivesNumber,
            //     "storeid": data.storeid,
            //     "quNum": data.quNum,
            //     "div": data.div,
            //     "col": data.col,
            //     "lay": data.lay,
            //     "location": data.location,
            //     "rfid": data.rfid,
            //     "updateOperator": data.updateOperator,
            //     "fkBoxId": data.fkBoxId,
            //     "createTime": data.createTime,
            //     "fkTypeId": data.fkTypeId
            // });
        } else if (layEvent === 'del') {
            layer.confirm('真的删除该档案信息吗？', function (index) {
                let fileID = {id: obj.data.id};
                $.ajax({
                    url: base + 'admin/areamodule/fileArchivesInfo/delete',
                    type: 'POST',
                    data: JSON.stringify(fileID),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function (result) {
                        layer.msg(result.msg);
                    }
                });
                obj.del();
                layer.close(index);
            });
        } else if (layEvent === 'station') {
            setStation = layer.open({
                type: 1,
                title: '选择位置',
                area: ['650px', '500px'],
                content: $('#stationBox'),
                btn: '确定',
                yes: function () {
                    let value = data;
                    let stationStr1 = station.split(/区/);
                    value.quNum=stationStr1[0];
                    let stationStr2 = stationStr1[1].split(/列/);
                    value.col = stationStr2[0];
                    let stationStr3 = stationStr2[1].split(/节/);
                    value.div = stationStr3[0];
                    let stationStr4 = stationStr3[1].split(/层/);
                    value.lay = stationStr4[0];
                    if ('左' !== stationStr4[1]) {
                        value.localtion = 2;
                    } else {
                        value.localtion = 1;
                    }
                    console.log(value);
                    $.ajax({
                        url:base + 'admin/areamodule/fileArchivesInfo/update',
                        type:'POST',
                        contentType:'application/json',
                        data:value,
                        success:function (reusult) {

                            layer.msg(reusult.msg);
                        }
                    });
                    layer.close(setStation);
                },
                zIndex: layer.zIndex,
            });
        } else if (layEvent === 'open') {
            layer.confirm('确定打开架体？', function (num) {
                console.log(num);
                // $.ajax({
                //     url: base + 'admin/areamodule/fileOptionFrame/update',
                // })
            });
        }

    });

    $('#import').click(function () {
        $('#Excel-menu').hide();
    });
    uploadExcel = upload.render({
        elem: '#import',
        url: base + '/admin/areamodule/fileBoxInfo/execlImport',
        accept: 'file',
        auto: true,
        done: function (result) {
            console.log(result);
            layer.msg(result.msg);
        },
        error: function () {
            console.log("error");
        }
    });
    uploadInst = upload.render({
        elem: '#upload',
        url: base + 'admin/areamodule/fileBoxInfo/execlImport',
        done: function (result) {
            layer.msg(result.msg);
        }
    });

    $('#export').click(function () {
        // let url = base + 'admin/areaModule/FileBoxInfo/selectll?page='+ page + '&pageSize=' +pageSize;
        $.ajax({
            url: base + 'admin/areaModule/FileBoxInfo/selectll?page=1&pageSize=5',
            type: 'GET',
            success: function (result) {
                console.log(JSON.stringify(result));
                layer.msg(result.msg);
            }
        })
    });


});