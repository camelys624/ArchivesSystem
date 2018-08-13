
/**
 *
 * author: ys
 * time: 2018/8/9
 *
 **/

layui.use(['tree', 'layer', 'table'], function () {
    let tree = layui.tree,
        layer = layui.layer,
        table = layui.table,
        $ = layui.$;


    let base = 'http://192.168.2.128:8081/';
    let url = null;

    //定义空弹出面板
    let index = null,
        shelf = null;
    let store_id = null,
        store_name = null;
    let nodes = [];
    let createTree = function () {
        $.ajax({
            url: base + '/admin/areamodule/araeStoreInfo/getStoreAndRegion',
            type: 'GET',
            success: function (result) {
                let store = [],
                    region;
                let storeData = result.list;
                for (let i = 0; i < storeData.length; i++) {
                    region = storeData[i].region;
                    for (let j = 0; j < region.length; j++) {
                        region[j].name = region[j].qu_num;

                    }
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
                            showTable(node);
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
        value = 'map[ip]=' + _node.ip;
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
        let storeData = {id:store_id};
        console.log(JSON.stringify(storeData));
        index = layer.open({
            type: 0,
            content: '确认删除该仓库?!',
            yes: function () {
                $.ajax({
                    type: 'POST',
                    url: base + '/admin/areamodule/araeStoreInfo/delete',
                    data: storeData,
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
        store_id = document.getElementById('s-id').value;
        store_name = document.getElementById('s-name').value;
        let reg = /^[0-9a-zA-Z]+$/;
        let barcode = new Date();
        let storeAddData = {
            name: store_name,
            quantuty: 1024,
            capacity: 10240,
            borrowNum: 512,
            barcode: barcode.toLocaleDateString()
        };
        let storeEditData = {
            id: store_id,
            name: store_name + '修改',
            quantuty: 1024,
            disabled: 1,
            capacity: 10240,
            borrowNum: 512,
            barcode: barcode.toLocaleDateString()
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
                    data: storeData,
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
            url = base + '/admin/areamodule/araeRegion/update';
        } else if (layEvent === 'del') {
            layer.confirm('真的删除该密集架信息吗？', function (index) {
                let quData = {id: obj.data.id};
                $.ajax({
                    url: base + '/admin/areamodule/araeRegion/delete',
                    type: 'POST',
                    data: quData,
                    contentType: 'application/json',
                    dataType: 'json'
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
            url = base + '/admin/areamodule/araeRegion/add';
        }


    });

    /**
     *
     * 密集架相应面板点击事件函数
     *
     **/

    let data = '';

    let gdlSelect = document.getElementById('g-position');
    gdlSelect.onclick = function () {
        let gdlIndex = gdlSelect.selectedIndex,
            gValue = gdlSelect.options[gdlIndex].value;
        if (gValue == 3) {
            $('#g-setting').removeAttr("disabled");
            $('#col-r').removeAttr("disabled");
        } else {
            $('#g-setting').attr('disabled', true);
            $('#col-r').attr('disabled', true);
        }
    };
    let getValue = function () {
        let qName = document.getElementById('q-name').value;

        let gdlSelect = document.getElementById('g-position'),
            gdlIndex = gdlSelect.selectedIndex,
            gValue = gdlSelect.options[gdlIndex].value;

        let cols = document.getElementById('cols'),
            colsIndex = cols.selectedIndex,
            colsValue = cols.options[colsIndex].text;

        let gSetting = document.getElementById('g-setting'),
            gSettingIndex = gSetting.selectedIndex,
            gSettingValue = gSetting.options[gSettingIndex].text;

        let rCol = document.getElementById('col-r'),
            rColIndex = rCol.selectedIndex,
            rColValue = rCol.options[rColIndex].text;


        let col = document.getElementById('col'),
            colIndex = col.selectedIndex,
            colValue = col.options[colIndex].text;

        let divs = document.getElementById('divs'),
            divsIndex = divs.selectedIndex,
            divsValue = divs.options[divsIndex].text;

        let lays = document.getElementById('lays'),
            laysIndex = lays.selectedIndex,
            laysValue = lays.options[laysIndex].text;

        let capacity = document.getElementById('capacity'),
            capIndex = capacity.selectedIndex,
            capValue = capacity.options[capIndex].text;

        let ventgaps = document.getElementById('ventgaps'),
            vgIndex = ventgaps.selectedIndex,
            vgValue = ventgaps.options[vgIndex].text;

        let width = document.getElementById('width'),
            wIndex = width.selectedIndex,
            wValue = width.options[wIndex].text;

        let speed = document.getElementById('speed'),
            sIndex = speed.selectedIndex,
            sValue = speed.options[sIndex].text;

        let videoIp = document.getElementById('videoIp'),
            vIpIndex = videoIp.selectedIndex,
            vIpValue = videoIp.options[vIpIndex].text;

        let IP = document.getElementById('IP').value;

        let port2 = document.getElementById('port2').value;

        let port1 = document.getElementById('port1').value;

        data = {
            quNumLeft: colValue,
            name: qName,
            capacity: capValue,
            speed: sValue,
            width: wValue,
            ip: IP,
            httpPort: port1,
            tcpPort: port2,
            videoIps: vIpValue,
            tempture: 1,
            humi: 1,
            fkStoreId: store_id,
            rdStoreName: store_name,
            quNumRigth: rColValue,
            gdlType: gValue,
            cols: colsValue,
            divs: divsValue,
            lays: laysValue,
            staticCol: gSettingValue,
            ventgaps: vgValue
        };
    };


    $('#save').click(function () {
        getValue();
        console.log(data);
        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: data,
            success: function (result) {
                layer.msg(result.msg);
                layer.close(shelf);
            },
            error: function (result) {
                layer.msg(result.msg);
            }
        })
    });
    $('#cancel-shelf').click(function () {
        layer.close(shelf);
    });

});
