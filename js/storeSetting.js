/**
 *
 * author: ys
 * time: 2018/8/9
 *
 **/

layui.use(['tree', 'layer', 'table','form','layedit'], function () {
    let tree = layui.tree,
        layer = layui.layer,
        table = layui.table,
        form = layui.form,
        layedit = layui.layedit,
        $ = layui.$;


    let base = 'http://192.168.2.128:8081/';
    let url = null;

    //定义空弹出面板
    let index = null,
        shelf = null;
    let store_id = null,
        store_name = null,
        barcode;
    let nodes = [];
    let createTree = function () {
        $.ajax({
            url: base + 'admin/areamodule/araeStoreInfo/getStoreAndRegion',
            type: 'GET',
            success: function (result) {
                let store = [],
                    region;
                let storeData = result.list;
                for (let i = 0; i < storeData.length; i++) {
                    region = storeData[i].region;
                    storeData[i].name = storeData[i].store_name;
                    store.push({
                        name: storeData[i].name,
                        fkStoreId: storeData[i].id,
                        children: region
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
                        } else {
                            showTable(node.ip);
                        }
                    }
                });
            }
        });
    };

    createTree();

    /**
     *
     * 先创建table，方便后面调用
     *
     **/
    let showTable = function (_node) {
        let value = '';
        value = 'map[ip]=' + _node;
        $.ajax({
            url: base + '/admin/areamodule/araeRegion',
            data: value,
            dataType: 'json',
            type: 'GET',
            success: function (result) {
                table.render({
                    elem: '#table',
                    page: true,
                    cols: [[
                        {field: 'xuhao', title: '序号', type: 'numbers', fixed: 'left'},
                        {field: 'rdStoreName', title: '所属库房'},
                        {field: 'name', title: '区名称'},
                        {field: 'quNumLeft', title: '区号'},
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
                    data: result.rows

                });
            }
        });

    };


    //添加仓库面板，点击触发相应函数

    let status = null;
    $('#add').click(function () {
        index = layer.open({
            type: 1,
            title: '添加仓库',
            area: '500px',
            content: $('#storeAdd'),
        });


        url = base + '/admin/areamodule/araeStoreInfo/add';
        status = 1;
    });

    $('#edit').click(function () {
        index = layer.open({
            type: 1,
            title: '修改仓库信息',
            area: '500px',
            content: $('#storeAdd')
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
    $('#yes').click(function () {
        barcode = document.getElementById('s-id').value;
        store_name = document.getElementById('s-name').value;
        let reg = /^[0-9a-zA-Z]+$/;
        let storeAddData = {
            name: store_name,
            img: "E:\\image.pig",
            quantuty: 1024,
            capacity: 10240,
            borrowNum: 512,
            barcode: barcode,
            disabled: 0,
            tempture: 35,
            humi: 50,
            storeNum: 100
        };
        let storeEditData = {
            id: store_id,
            name: store_name + '修改',
            quantuty: 1024,
            disabled: 1,
            capacity: 10240,
            borrowNum: 512,
            barcode: barcode
        };
        let storeData = null;
        if (status === 1) {
            storeData = storeAddData;
        } else if (status === 0) {
            storeData = storeEditData;
        }
        if (store_id === '') {
            document.getElementById('warnMsg').innerHTML = '请输入ID！！';
        } else {
            if (!reg.test(store_id)) {
                document.getElementById('warnMsg').innerHTML = '只能输入数字和字母！！';
            } else {
                document.getElementById('warnMsg').innerHTML = '';
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: JSON.stringify(storeData),
                    contentType:'application/json',
                    dataType:'json',
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
        }

    });
    $('#cancel').click(function () {
        layer.close(index);
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

            form.val('shelfEdit',{
                "rdStoreName":data.rdStoreName,
                "name":data.name,
                "gdlType":data.gdlType,
                "cols": data.cols,
                "staticCol":data.staticCol,
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

            // form.on('select(gPosition)', function (options) {
            //     if (options.value == 3) {
            //         $('#g-setting').removeAttr("disabled");
            //         $('#col-r').removeAttr("disabled");
            //     } else {
            //         $('#g-setting').attr('disabled', true);
            //         $('#col-r').attr('disabled', true);
            //     }

                form.on('submit(save2)', function (value) {
                    let dataList = value.field;
                    dataList.id = data.id;
                    dataList.fkStoreId = shelf.fkStoreId;
                    dataList.quNumLeft = dataList.col;
                    dataList.videoIps = {ip:Math.round(10*Math.random()),name:value.field.videoIps};
                    console.log(JSON.stringify(dataList));
                    $.ajax({
                        url: url,
                        type: 'POST',
                        data: JSON.stringify(dataList),
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function (result) {
                            $('#tree').find('li').remove();
                            layer.msg(result.msg);
                            createTree();
                            layer.close(index);
                        },
                        error: function () {
                            console.log("error")
                        }
                    });
                    return false;
                })
            // });

            // createShelf(data);
        } else if (layEvent === 'del') {
            layer.confirm('真的删除该密集架信息吗？', function (index) {
                let quData = {id: obj.data.id};
                console.log(quData);
                $.ajax({
                    url: base + '/admin/areamodule/araeRegion/delete',
                    type: 'POST',
                    data: JSON.stringify(quData),
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function (result) {
                        $('#tree').find('li').remove();
                        layer.msg(result.msg);
                        createTree();
                    }
                });
                obj.del();
                layer.close(index);
            });
        } else if (layEvent === 'add') {
            shelf = layer.open({
                type: 1,
                title: '添加密集架信息',
                area: '800px',
                content: $('#shelfEdit')
            });
            $('#save2').hide();
            $('#save').show();
            form.val('shelfEdit',{
                "rdStoreName":data.rdStoreName
            });

            url = base + 'admin/areamodule/araeRegion/add';
            createShelf(data);
        }


    });

    /**
     *
     * 密集架相应面板点击事件函数
     *
     **/

    //判断固定列位置
    //首先监听select的值
    let createShelf = function (shelf) {
            form.on('select(gPosition)', function (options) {
                if (options.value == 3) {
                    $('#g-setting').removeAttr("disabled");
                    $('#col-r').removeAttr("disabled");
                } else {
                    $('#g-setting').attr('disabled', true);
                    $('#col-r').attr('disabled', true);
                }

                form.on('submit(save)', function (data) {
                    let dataList = data.field;
                    dataList.fkStoreId = shelf.fkStoreId;
                    dataList.quNumLeft = dataList.col;
                    dataList.videoIps = {ip:Math.round(10*Math.random()),name:data.field.videoIps};
                    $.ajax({
                        url: url,
                        type: 'POST',
                        data: JSON.stringify(dataList),
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function (result) {
                            $('#tree').find('li').remove();
                            layer.msg(result.msg);
                            createTree();
                            layer.close(index);
                        },
                        error: function () {
                            console.log("error")
                        }
                    });
                })
            });
        }

});
