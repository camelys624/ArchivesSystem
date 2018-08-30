/**
 *
 * author: ys
 * time: 2018/8/13
 *
 **/

layui.use(['tree', 'layer', 'table', 'upload', 'form', 'laydate', 'layedit', 'element'], function () {
    let tree = layui.tree,
        layer = layui.layer,
        table = layui.table,
        boxTable = layui.table,
        upload = layui.upload,
        form = layui.form,
        laydate = layui.laydate,
        $ = layui.$;


    let url = null;

    //定义空弹出面板
    let edit = null,
        search = null,
        box = null,
        setStation = null,
        uploadExcel = null,
        uploadInst = null,
        borrowBox = null,
        fkTemplateId = null;
    let nodes = [];

    let showTable = function (cols) {
        table.render({
            elem: '#table',
            url: url,
            page: true,
            height: 'full-78',
            limit: 20,
            limits: [20, 30, 40, 50],
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
                $('#export').click(function () {
                    let col = [];
                    col.push({
                        "rdTypeName": "档案类型",
                        "arcName": "档案名称",
                        "fkLocationId": "位置编号",
                        "rdLocationAddr": "存放位置",
                        "araeRegion": {
                            "id": 0,
                            "quNumLeft": 1,
                            "name": null,
                            "capacity": null,
                            "speed": 100,
                            "width": 45,
                            "ip": "192.168.1.1",
                            "httpPort": 8081,
                            "tcpPort": 0,
                            "videoIp": null,
                            "tempture": null,
                            "humi": null,
                            "createTime": "2018-08-20 10:36:39",
                            "updateTime": "2018-08-28 00:00:00",
                            "fkStoreId": 0,
                            "rdStoreName": null,
                            "quNumRigth": 0,
                            "gdlType": 2,
                            "cols": 7,
                            "divs": 5,
                            "lays": 7,
                            "staticCol": 7,
                            "ventgaps": null
                        },
                        "fkBoxId": "归属档案盒id",
                        "updateTime": "更新时间",
                        "archivesBarcode": "档案条形码",
                        "araeLocation": {
                            "id": 0,
                            "fkRegionId": 0,
                            "col": 0,
                            "lay": 0,
                            "div": 0,
                            "rfid": "456",
                            "localtion": 0,
                            "fkStoreId": 0,
                            "rdRegionNum": 0
                        },
                        "fkTemplateId": "模板id",
                        "deleted": "删除标志",
                        "archivesNumber": "档案编号",
                        "createTime": "档案创建时间",
                        "details": "{\"3\": \"2018年8月20日\", \"57852\": \"456\", \"档号\": \"456\", \"题名\": \"4156\"}",
                        "rfid": "RFID",
                        "id": "档案编号",
                        "fkTypeId": "档案类型编号",
                        "status": "状态(1.上架，2.未上架，3.在借)",
                        "LAY_TABLE_INDEX": 0
                    });
                    let newExcel = col.concat(res.rows);
                    downloadExcel(newExcel);
                });
                let data = res.rows;
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
                    });

                });

            }
        });
    };

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
                        $('.btn-group-div').show();
                        if (node.type === 1) {
                            fkTemplateId = node.id;
                            url = base + 'admin/areaModule/FileArchivesInfo?map[fkTemplateId]=' + node.id;
                            showTable(cols);
                            $('#entry').removeAttr('disabled');
                        } else {
                            url = base + 'admin/areaModule/FileArchivesInfo?map[fkTemplateId]=' + node.id;
                            showTable(cols);
                            $('#entry').attr('disabled', 'disabled');
                        }
                    }
                });
            }
        });
    };
    createTree();

    $(function () {
        $('.btn-group').hover(function () {
            $(this).find('.menu').show();
        }, function () {
            $('.menu').hide();
        })
    });

    let createForm = function (data) {
        let items = '';
        for (let i = 0; i < data.length; i++) {
            if (data[i].ATI_TypeId === 1) {
                items += '<div style="position:relative;display:inline-block;top:' + data[i].ATI_Y + 'px;left:' + data[i].ATI_X + 'px">' +
                    '<label>' + data[i].ATI_Name + ':</label>' +
                    '<input type="text" name="' + data[i].ATI_Name + '" style="width: ' + data[i].ATI_Width + 'px;height: ' + data[i].ATI_Height + 'px" autocomplete="off">' +
                    '</div>'
            } else if (data[i].ATI_TypeId === 2) {
                // for(let j = 0;j<details.length;j++){
                //
                // }
                items += '<div style="position: relative;display:inline-block;top:' + data[i].ATI_Y + 'px;left:' + data[i].ATI_X + 'px">' +
                    '<label>' + data[i].ATI_Name + ':</label>' +
                    '<select name="' + data[i].ATI_Name + '"style="width: ' + data[i].ATI_Width + 'px;height: ' + data[i].ATI_Height + 'px">' +
                    +'<option>请选择数据</option>' +
                    '</select>' +
                    '</div>'
            } else if (data[i].ATI_TypeId === 3) {
                items += '<div style="position:relative;display:inline-block;top:' + data[i].ATI_Y + 'px;left:' + data[i].ATI_X + 'px">' +
                    '<label>' + data[i].ATI_Name + ':</label>' +
                    '<input type="date" name="createDate" style="width: ' + data[i].ATI_Width + 'px;height: ' + data[i].ATI_Height + 'px" autocomplete="off">' +
                    '</div>'
            }
        }

        let formBox = '<form id="fileEdit" class="layui-form" style="display: none;margin-top: 10px" action="" lay-filter="fileEdit">' +
            items +
            '<div style="position: absolute;bottom: 0;width: 100%">' +
            '<hr/>' +
            `<div class="layui-form-item">
                <label class="layui-form-label">存放位置</label>
                <div class="layui-input-inline">
                    <input type="text" id="stationInput" name="station" class="layui-input layui-disabled" disabled>
                </div>
                <a id="setStation" class="layui-btn layui-btn-primary">选择</a>
             </div>
             <div class="layui-form-item">
                <label class="layui-form-label">档案条码</label>
                <div class="layui-input-inline">
                    <input type="text" name="archivesBarcode" class="layui-input" autocomplete="off">
                </div>
                <label class="layui-form-label">rfid</label>
                <div class="layui-input-inline">
                    <input type="text" name="rfid" class="layui-input" autocomplete="off">
                </div>
                <a id="archivesBarcode" class="layui-btn layui-btn-primary">打印条码</a>
                <button class="layui-btn" lay-submit="" lay-filter="fileBtn">确定</button>
                <button type="reset" id="reset" class="layui-btn layui-btn-primary">重置</button>
             </div> 
             </div>
             </div>` + '</form>';
        $('body').append(formBox);
    };


    //定义事件监听
    form.on('submit(fileBtn)', function (data) {
        let value = data.field;
        value.arcName = value.题名;
        value.archivesNumber = value.档号;
        value.detailsstr = {'题名': value.题名, '档号': value.档号};
        value.storeid = storeId;
        value.fkTemplateId = fkTemplateId;
        value.status = 2;
        console.log(JSON.stringify(value));
        if (value.station !== '') {
            let station = value.station;
            let stationStr1 = station.split(/区/);
            value.quNum = stationStr1[0];
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
        } else {
            console.log('位置为空，请选择位置！')
        }
        $.ajax({
            url: base + 'admin/areamodule/fileArchivesInfo/add',
            type: 'POST',
            data: JSON.stringify(value),
            contentType: 'application/json',
            dataType: 'json',
            success: function (result) {
                layer.msg(result.msg);
                if (result.state === true) {
                    layer.close(edit);
                }
            }
        });
        return false;
    });
    let editFile = function (data) {
        url = base + 'admin/areaModule/FileArchivesTemplate?map[id]=' + fkTemplateId;
        $.ajax({
            url: url,
            type: 'GET',
            success: function (result) {
                let template = result.rows[0];
                let templateDefinition = JSON.parse(template.templateDefinition);
                createForm(templateDefinition);
                edit = layer.open({
                    type: 1,
                    title: '编辑档案',
                    area: ['1400px', '650px'],
                    content: $('#fileEdit'),
                });

                formVal(data);
                //
                $('#setStation').click(
                    function () {
                        setStation = layer.open({
                            type: 1,
                            title: '选择位置',
                            area: ['650px', '600px'],
                            content: $('#stationBox'),
                            shade: false,
                            scrollbar: false,
                            btn: '确定',
                            yes: function () {
                                $('#stationInput').val(station);
                                layer.close(setStation);
                            },
                            zIndex: layer.zIndex,
                        });
                    });

                $('#archivesBarcode').click(function () {
                    let href = 'http://192.168.2.128:8081/admin/areamodule/brcode/img?code=' + $('input[name="archivesBarcode"]').val();
                    $('#myIframe').attr('src', href);
                    $('#myIframe').print();
                });
            }
        });
    };

    //导入文档信息
    $('#entry').click(function () {
        let data = {
            rdTypeName: '',
            arcName: '',
            fileNum: '',
            docName: '',
            fkTemplateId: '',
            archivesNumber: '',
            rdLocationAddr: '',
            araeRegion: {fkStoreId: ''},
            rfid: '',
            creater: 'admin',
            fkBoxId: '',
            createTime: ''
        };
        // $('#reset').trigger('click');
        editFile(data);
    });


    $('#add_right').click(function () {
        $('#entry').trigger('click');
    });

    let formVal = function (data) {
        $('input[name="题名"]').val(data.arcName);
        $('input[name="档号"]').val(data.archivesNumber);
        $('input[name="station"]').val(data.rdLocationAddr);
        $('input[name="rfid"]').val(data.rfid);
        $('input[name="archivesBarcode"]').val(data.archivesBarcode);
        $('input[name="createTime"]').val(data.createTime);
    };

    $('#edit_right').click(function () {
        editFile(tableData);
    });

    $('#setStation_right').click(function () {
        setStation = layer.open({
            type: 1,
            title: '选择位置',
            area: ['650px', '500px'],
            content: $('#stationBox'),
            btn: '确定',
            yes: function () {
                let value = {};
                value.storeid = storeId;
                value.id = tableData.id;
                let stationStr1 = station.split(/区/);
                value.quNum = stationStr1[0];
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
                    url: base + 'admin/areamodule/fileArchivesInfo/update',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(value),
                    success: function (reusult) {
                        showTable(cols);
                        layer.msg(reusult.msg);
                    }
                });
                layer.close(setStation);
            },
            zIndex: layer.zIndex,
        });
    });

    $('#del_right').click(function () {
        layer.confirm('真的删除该档案信息吗？', function (index) {
            let fileID = {id: tableData.id};
            $.ajax({
                url: base + 'admin/areamodule/fileArchivesInfo/delete',
                type: 'POST',
                data: JSON.stringify(fileID),
                contentType: 'application/json',
                dataType: 'json',
                success: function (result) {
                    let data = {};
                    data.id = tableData.fkTemplateId;
                    showTable(cols);
                    layer.msg(result.msg);
                }
            });
            layer.close(index);
        });
    });

    $('#search').click(function () {
        search = layer.open({
            type: 1,
            title: '档案查询',
            area: ['330px', '350px'],
            content: $('#search-box')
        });

    });

    //查询弹窗
    form.on('select(factor)', function (options) {
        if (options.value == 6) {
            $('#date').removeAttr('disabled')
                .removeClass('layui-disabled');
            layui.form.render();
            layui.element.init();
        } else {
            $('#date').attr('disabled', true)
                .addClass('layui-disabled')
                .val('');
            layui.form.render();
            layui.element.init();
        }
    });
    laydate.render({
        elem: '#date',
        type: 'date',
        range: '-'
    });

    form.on('submit(search)', function (data) {
        let searchData = data.field;
        if (searchData.styles == 0) {
            switch (parseInt(searchData.factor)) {
                case 0:
                    url = base + '/admin/areamodule/fileArchivesInfo?map[arcName]=' + searchData.info;
                    break;
                case 1:
                    url = base + '/admin/areamodule/fileArchivesInfo?map[archivesNumber]=' + searchData.info;
                    break;
                case 2:
                    url = base + '/admin/areamodule/fileArchivesInfo?map[archivesBarcode]=' + searchData.info;
                    break;
                case 3:
                    url = base + '/admin/areamodule/fileArchivesInfo?map[rdLocationAddr]=' + searchData.info;
                    break;
                case 4:
                    url = base + '/admin/areamodule/fileBoxInfo?map[boxBarcode]=' + searchData.info;
                    break;
                case 5:
                    url = base + '/admin/areaModule/fileArchivesInfo?pageSize=1&currentPage=2';
                    break;
                case 6:
                    url = base + 'admin/areamodule/fileArchivesInfo/selectTime?date=' + searchData.date+'&page=1&pageSize=1';
                    break;
                default:
                    break;
            }
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
                    url = base + 'admin/areamodule/fileArchivesInfo/selectTime?date=' + searchData.date;
                    break;
                default:
                    break;
            }

        }
        let colsSearch = [
            {field: 'xuhao', title: '序号', type: 'numbers', width: 80, fixed: 'left'},
            {type: 'checkbox'},
            {field: 'rdTypeName', title: '文档类型', width: 120},
            {field: 'fkTemplateId', title: '模板ID', width: 120},
            {field: 'arcName', title: '档案名称', width: 100},
            {field: 'arcNumber', title: '档案编号', width: 120},
            {field: 'rdTypeName', title: '档案类型', width: 100},
            {field: 'archivesBarcode', title: '档案条码', width: 180},
            {field: 'rdLocationAddr', title: '档案位置', width: 180},
            {field: 'fkBoxId', title: '档案盒id', width: 120},
            {field: 'duration', title: '档案期限', width: 80},
            {field: 'createFounder', title: '著录者', width: 80},
            {field: 'updateOperator', title: '操作者', width: 80},
            {field: 'rfid', title: 'rfid', width: 120},
            {field: 'fkDictCodeSecurity', title: '密级', width: 80},
            {
                field: 'status', title: '状态', width: 80, templet: function (d) {
                    let status = '';
                    if (d.status === 1) {
                        status = '未上架';
                        return status;
                    } else if (d.status === 2) {
                        status = '在架';
                        return status;
                    } else if (d.status === 3) {
                        status = '在借';
                        return status;
                    }
                }
            },
            {field: 'details', title: '档案详情', width: 200},
        ];
        showTable(colsSearch);

        layer.close(search);
        return false;
    });


    laydate.render({
        elem: '#borrowTime'
    });


    $('#box').click(function () {
        getCheckedData();
        let fileID = [];
        if (fileData.length !== 0) {
            box = layer.open({
                type: 1,
                title: '档案组盒',
                area: ['1400px', '600px'],
                offset: '100px',
                content: $('#table-box')
            });
            url = base + '/admin/areamodule/fileBoxInfo?map[deleted]=0';
            $.ajax({
                url: url,
                success: function (result) {
                    console.log(JSON.stringify(result.rows));
                    boxTable.render({
                        elem: '#box-table',
                        page: true,
                        cols: [[
                            {field: 'xuhao', title: '序号', type: 'numbers', fixed: 'left'},
                            {field: 'storeName', title: '仓库名', width: 80},
                            {field: 'boxName', title: "档案盒名称", width: 180},
                            {field: 'boxNum', title: '档案盒编号', width: 180},
                            {field: 'fkTypeId', title: '档案盒类型id', width: 120},
                            {field: 'rdLocationAddr', title: '存放位置', width: 180},
                            {field: 'createFounder', title: '创建者', width: 100},
                            {field: 'updateTime', title: '著录时间', width: 180},
                            {field: 'duration', title: '保管期限', width: 100},
                            {field: 'boxBarcode', title: '条形码', width: 120},
                            {field: 'endTime', title: '保管截止时间', width: 180},
                            {field: 'statu', title: '状态'},
                            {field: 'security', title: '密级'},
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
                if (layEvent === 'group') {
                    $.ajax({
                        type: 'POST',
                        url: base + '/admin/areamodule/fileBoxInfo/groupBox',
                        contentType: 'application/json',
                        data: JSON.stringify(value),
                        success: function (result) {
                            layer.msg(result.msg);
                        },
                        error: function () {
                            console.log('出错');
                        }
                    });
                }

            });
        } else {
            layer.msg("没有选择数据，请选择数据！");
        }
    });


    /**
     *
     *
     *      档案借阅
     *
     *
     *
     */

    table.on('checkbox(table)', function (obj) {
        console.log(obj);
    });

    let borrowFileInfo = function (Data) {
        form.on('submit(borrow)', function (data) {
            let value = data.field;
            value.fkArchivesId = Data.id;
            $.ajax({
                url: base + 'admin/areamodule/fileBorrow/add',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(value),
                success: function (result) {
                    layer.msg(result.msg);
                    layer.close(borrowBox);
                }
            });
            return false;
        });
    };
    $('#directBorrow').click(function () {
        getCheckedData();
        let fileInfo = fileData[0];
        if (fileData.length !== 0) {
            if (fileData.length > 1) {
                layer.msg('一次只能借阅一份档案，如果要借阅多份档案请组盒后借阅！！');
            } else {
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

                borrowBox = layer.open({
                    type: 1,
                    title: '借阅',
                    area: '950px',
                    content: $('#borrowForm')
                });
                borrowFileInfo(fileInfo);
            }
        } else {
            layer.msg('没有选择数据，请选择数据!');
        }
    });

    //右键点击借阅
    $('#borrow_right').click(function () {
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
            data: [tableData]
        });

        borrowBox = layer.open({
            type: 1,
            title: '借阅',
            area: '950px',
            content: $('#borrowForm')
        });
        borrowFileInfo(tableData);
    });

    let borrowFile = table.on('tool(table)', function (obj) {
        let data = obj.data,
            layEvent = obj.event;
        if (layEvent === 'edit') {
            editFile(data);

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
                    let value = {};
                    value.id = data.id;
                    value.storeid = storeId;
                    let stationStr1 = station.split(/区/);
                    value.quNum = stationStr1[0];
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
                        url: base + 'admin/areamodule/fileArchivesInfo/update',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(value),
                        success: function (reusult) {
                            showTable();
                            layer.msg(reusult.msg);
                        }
                    });
                    layer.close(setStation);
                },
                zIndex: layer.zIndex,
            });
        } else if (layEvent === 'open') {
            layer.confirm('确定打开架体？', function () {

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
        url: base + 'admin/areamodule/fileOition/uploadArchivesinfo',
        done: function (result) {
            layer.msg(result.msg);
        }
    });

    //鼠标右键点击

});