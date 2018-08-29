/**
 *
 * author: ys
 * time: 2018/8/9
 *
 **/

layui.use(['tree', 'layer', 'table', 'form', 'layedit', 'element'], function () {
    let tree = layui.tree,
        layer = layui.layer,
        table = layui.table,
        form = layui.form,
        layedit = layui.layedit,
        $ = layui.$;

    let tableE = null;
    /**
     *
     * 先创建table，方便后面调用
     *
     **/
    let showTable = function (id) {
        let href = base + 'admin/areamodule/araeRegion?map[fkStoreId]=' + id;
        console.log(href);
        tableE = table.render({
            elem: '#table',
            url: href,
            height: 'full-20',
            page: true,
            cols: [[
                {field: 'xuhao', title: '序号', type: 'numbers', fixed: 'left'},
                {field: 'rdStoreName', title: '所属库房'},
                {field: 'name', title: '区名称'},
                {
                    field: 'quNum', title: '区号', templet: function (d) {
                        if (d.quNumLeft === undefined) {
                            return d.quNumRigth;
                        } else if (d.quNumRigth === undefined) {
                            return d.quNumLeft;
                        } else {
                            return d.quNumLeft;
                        }
                    }
                },
                {field: 'cols', title: '列数'},
                {field: 'divs', title: '节数'},
                {field: 'lays', title: '层数'},
                {field: 'staticCol', title: '固定列号'},
                {field: 'gdlType', title: '固定列位置'},
                {field: 'width', title: '密集架宽度'},
                {field: 'speed', title: '运行速度'},
                {field: 'ventgaps', title: '通风间隔'},
                {field: 'ip', title: '主机名', width: 200},
                {field: 'right', title: '操作', width: 180, align: 'center', toolbar: '#barDemo', fixed: 'right'}
            ]],
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
                console.log(res);
                $(document).bind('contextmenu', function (e) {
                    e.preventDefault();
                    return false;
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
    let createTree = function () {
        $.ajax({
            url: base + 'admin/areamodule/araeStoreInfo/getStoreAndRegion',
            type: 'GET',
            success: function (result) {
                let store = [],
                    region;
                let storeData = result.list;
                console.log(result);
                for (let i = 0; i < storeData.length; i++) {
                    region = storeData[i].region;
                    let child = {};
                    child.name = '密集架';
                    child.parentFkStoreId = storeData[i].id;
                    child.parentName = storeData[i].store_name;
                    storeData[i].name = storeData[i].store_name;
                    store.push({
                        name: storeData[i].name,
                        fkStoreId: storeData[i].id,
                        children: [child]
                    });

                }
                nodes = store;
                //树形菜单
                tree({
                    elem: '#tree',
                    nodes: nodes,
                    click: function (node) {
                        if (node.fkStoreId != null) {
                            store_id = node.fkStoreId;
                            store_name = node.name;
                            $('#edit').removeAttr('disabled');
                            $('#delete').removeAttr('disabled');
                        } else {
                            store_id = node.parentFkStoreId;
                            store_name = node.parentName;
                            showTable(node.parentFkStoreId);
                        }
                    }
                });
            }
        });
    };

    createTree();

    //添加仓库面板，点击触发相应函数

    +function () {
        let cols = '', staticCol = '', ventgaps = '',
            quNum = '', divs = '', quNumRigth = '',
            lays = '', capacity = '', width = '', speed = '';
        for (let i = 0; i < 100; i++) {
            staticCol += '<option>' + i + '</option>';
        }
        for (let j = 1; j < 100; j++) {
            cols += '<option>' + j + '</option>';
        }
        quNum = staticCol;
        quNumRigth = staticCol;
        capacity = staticCol;
        divs = cols;
        lays = cols;
        for (let v = 1; v <= 30; v++) {
            ventgaps += '<option>' + v + '</option>';
        }
        for (let w = 20; w < 200; w++) {
            width += '<option>' + w + '</option>';
        }
        for (let s = 10; s < 200; s++) {
            speed += '<option>' + s + '</option>';
        }
        $('#cols').append(cols);
        $('#g-setting').append(staticCol);
        $('#quNum').append(quNum);
        $('#quNumR').append(quNumRigth);
        $('#divs').append(divs);
        $('#lays').append(lays);
        $('#capacity').append(capacity);
        $('#width').append(width);
        $('#ventgaps').append(ventgaps);
        $('#speed').append(speed);
    }();

    let status = null;
    $('#add').click(function () {
        index = layer.open({
            type: 1,
            title: '添加仓库',
            area: '400px',
            content: $('#storeAdd'),
        });
        $('#s-id').val('');
        $('#s-name').val('');
        url = base + '/admin/areamodule/araeStoreInfo/add';
        status = 1;
    });

    $('#edit').click(function () {
        index = layer.open({
            type: 1,
            title: '修改仓库信息',
            area: '400px',
            content: $('#storeAdd')
        });

        form.val('store', {
            name: store_name
        });
        url = base + '/admin/areamodule/araeStoreInfo/update';
        status = 0;
    });

    $('#delete').click(function () {
        let storeData = {id: store_id};
        index = layer.open({
            type: 0,
            content: '确认删除该仓库?!',
            yes: function () {
                $.ajax({
                    type: 'POST',
                    url: base + '/admin/areamodule/araeStoreInfo/delete',
                    data: JSON.stringify(storeData),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function (result) {
                        $('#tree').find('li').remove();
                        layer.msg(result.msg);
                        createTree();
                        layer.close(index);
                    },
                    error: function () {
                        console.log("错误");
                    }
                });
            }
        });
    });
    form.on('submit(yes)', function (data) {
        let editData = data.field;
        let reg = /^[0-9a-zA-Z]+$/;
        editData.img = "E:\\image.pig";
        editData.quantuty = 1024;
        editData.capacity = 10240;
        editData.borrowNum = 512;
        if (status === 1) {
            editData.tempture = 35;
            editData.humi = 50;
            editData.storeNum = 100;
        } else {
            editData.id = store_id;
            editData.name = data.name + '修改';
        }
        if (editData.barcode === '') {
            document.getElementById('warnMsg').innerHTML = '请输入ID！！';
        } else {
            if (!reg.test(barcode)) {
                document.getElementById('warnMsg').innerHTML = '只能输入数字和字母！！';
            } else {
                document.getElementById('warnMsg').innerHTML = '';
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: JSON.stringify(editData),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function (result) {
                        console.log(result);
                        if (result.state === true) {
                            $('#tree').find('li').remove();
                            layer.msg(result.msg);
                            createTree();
                            layer.close(index);
                        } else {
                            layer.msg(result.msg);
                        }
                    },
                    error: function () {
                        console.log("错误");
                    }
                });

            }
        }
        return false;
    });

//添加区信息
    $('#shelfAdd').click(function () {
        let data = {rdStoreName: store_name, fkStoreId: store_id};
        shelfA = layer.open({
            type: 1,
            title: '添加密集架信息',
            area: '800px',
            content: $('#shelfEdit')
        });
        $('#save2').hide();
        $('#save').show();
        form.val('shelfEdit', {
            "rdStoreName": data.rdStoreName
        });

        url = base + 'admin/areamodule/araeRegion/add';
        createShelf(data);
    });

//监听工具条
    let tool = table.on('tool(table)', function (obj) {
        let data = obj.data,
            layEvent = obj.event;

        if (layEvent === 'edit') {
            shelf = layer.open({
                type: 1,
                title: '修改密集架信息',
                area: '800px',
                content: $('#shelfEdit')
            });
            $('#save').hide();
            $('#save2').show();

            form.val('shelfEdit', {
                "rdStoreName": data.rdStoreName,
                "name": data.name,
                "gdlType": data.gdlType,
                "cols": data.cols,
                "staticCol": data.staticCol,
                "col": data.col,
                "divs": data.divs,
                "quNumRigth": data.quNumRigth,
                "lays": data.lays,
                "capacity": data.capacity,
                "width": data.width,
                "ventgaps": data.ventgaps,
                "speed": data.speed,
                "tempture": data.tempture,
                "ip": data.ip,
                "tcpPort": data.tcpPort,
                "httpPort": data.httpPort
            });
            url = base + '/admin/areamodule/araeRegion/update';

            form.on('submit(save2)', function (value) {
                let dataList = value.field;
                dataList.id = data.id;
                dataList.fkStoreId = data.fkStoreId;
                if (dataList.gdlType == 1) {
                    dataList.quNumRigth = dataList.quNum;
                    delete dataList.quNumLeft;
                } else if (dataList.gdlType == 2) {
                    dataList.quNumLeft = dataList.quNum;
                    delete dataList.quNumRigth;
                } else {
                    dataList.quNumLeft = dataList.quNum;
                }
                dataList.videoIps = {ip: Math.round(10 * Math.random()), name: value.field.videoIps};
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: JSON.stringify(dataList),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function (result) {
                        layer.msg(result.msg);
                        showTable(store_id);
                        layer.close(index);
                    },
                    error: function () {
                        console.log("error");
                    }
                });
                return false;
            })
            // });

            // createShelf(data);
        } else if (layEvent === 'del') {
            layer.confirm('真的删除该密集架信息吗？', function (index) {
                console.log(data);
                let quData = {"id": obj.data.id};
                console.log(JSON.stringify(quData));
                $.ajax({
                    url: base + 'admin/areamodule/araeRegion/delete',
                    type: 'POST',
                    data: JSON.stringify(quData),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function (result) {
                        console.log(result);
                        layer.msg(result.msg);
                    }
                });
                obj.del();
                layer.close(index);
            });
        }


    });

    /**
     *
     * 密集架相应面板点击事件函数
     *
     */

//判断固定列位置
//首先监听select的值
    form.on('select(gPosition)', function (options) {
        if (options.value == 3) {
            $('#g-setting').removeAttr('disabled');
            $('#quNumR').removeAttr('disabled');
            layui.form.render();
            layui.element.init();
        } else {
            $('#g-setting').attr('disabled', true);
            $('#quNumR').attr('disabled', true);
            layui.form.render();
            layui.element.init();
        }
    });
    let createShelf = function (shelf) {
        form.val('shelfEdit', {
            "name": "",
            "gdlType": "",
            "cols": "",
            "staticCol": "",
            "col": "",
            "divs": "",
            "quNumRigth": "",
            "lays": "",
            "capacity": "",
            "width": "",
            "ventgaps": "",
            "speed": "",
            "tempture": "",
            "ip": "",
            "tcpPort": "",
            "httpPort": ""
        });
        form.on('submit(save)', function (data) {
            let dataList = data.field;
            dataList.fkStoreId = shelf.fkStoreId;
            if (dataList.gdlType == 1) {
                dataList.quNumRigth = dataList.quNum;
                dataList.staticCol = 0;
                delete dataList.quNumLeft;
            } else if (dataList.gdlType == 2) {
                dataList.quNumLeft = dataList.quNum;
                dataList.staticCol = dataList.cols;
                delete dataList.quNumRigth;
            } else {
                dataList.quNumLeft = dataList.quNum;
            }
            dataList.videoIps = {ip: Math.round(10 * Math.random()), name: data.field.videoIps};
            $.ajax({
                url: url,
                type: 'POST',
                data: JSON.stringify(dataList),
                contentType: 'application/json',
                dataType: 'json',
                success: function (result) {
                    layer.msg(result.msg);
                    if (result.state === true) {
                        showTable(store_id);
                        layer.close(shelfA);
                    }
                },
                error: function () {
                    console.log("error");
                }
            });
            return false;
        })

    };

    $('#add_right').click(function () {
        shelf = layer.open({
            type: 1,
            title: '添加密集架信息',
            area: '800px',
            content: $('#shelfEdit')
        });
        $('#save2').hide();
        $('#save').show();
        form.val('shelfEdit', {
            "rdStoreName": tableData.rdStoreName
        });

        url = base + 'admin/areamodule/araeRegion/add';
        createShelf(tableData);
    });
    $('#edit_right').click(function () {
        shelf = layer.open({
            type: 1,
            title: '修改密集架信息',
            area: '800px',
            content: $('#shelfEdit')
        });
        $('#save').hide();
        $('#save2').show();

        form.val('shelfEdit', {
            "rdStoreName": tableData.rdStoreName,
            "name": tableData.name,
            "gdlType": tableData.gdlType,
            "cols": tableData.cols,
            "staticCol": tableData.staticCol,
            "col": tableData.col,
            "divs": tableData.divs,
            "quNumRigth": tableData.quNumRigth,
            "lays": tableData.lays,
            "capacity": tableData.capacity,
            "width": tableData.width,
            "ventgaps": tableData.ventgaps,
            "speed": tableData.speed,
            "tempture": tableData.tempture,
            "ip": tableData.ip,
            "tcpPort": tableData.tcpPort,
            "httpPort": tableData.httpPort
        });
        url = base + '/admin/areamodule/araeRegion/update';

        form.on('select(gPosition)', function (options) {
            if (options.value == 3) {
                $('#g-setting').removeAttr("disabled");
                $('#col-r').removeAttr("disabled");
            } else {
                $('#g-setting').attr('disabled', true);
                $('#col-r').attr('disabled', true);
            }
        });

        form.on('submit(save2)', function (value) {
            let dataList = value.field;
            dataList.id = tableData.id;
            dataList.fkStoreId = tableData.fkStoreId;
            if (dataList.gdlType == 1) {
                dataList.quNumRigth = dataList.quNum;
                delete dataList.quNumLeft;
            } else if (dataList.gdlType == 2) {
                dataList.quNumLeft = dataList.quNum;
                delete dataList.quNumRigth;
            } else {
                dataList.quNumLeft = dataList.quNum;
            }
            dataList.videoIps = {ip: Math.round(10 * Math.random()), name: value.field.videoIps};
            console.log(dataList);
            $.ajax({
                url: url,
                type: 'POST',
                data: JSON.stringify(dataList),
                contentType: 'application/json',
                dataType: 'json',
                success: function (result) {
                    layer.msg(result.msg);
                    showTable(store_id);
                    layer.close(index);
                },
                error: function () {
                    console.log("error");
                }
            });
            return false;
        })
    });
    $('#del_right').click(function () {
        layer.confirm('真的删除该密集架信息吗？', function (index) {
            let quData = {"id": tableData.id};
            console.log(JSON.stringify(quData));
            $.ajax({
                url: base + 'admin/areamodule/araeRegion/delete',
                type: 'POST',
                data: JSON.stringify(quData),
                contentType: 'application/json',
                dataType: 'json',
                success: function (result) {
                    console.log(result);
                    layer.msg(result.msg);
                }
            });
            layer.close(index);
        });
    });
})
;
