/**
 *
 * author: ys
 * time: 2018/8/13
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
    let edit = null;
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
                    }
                });
            }
        });
    };
    createTree();

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
                        {field: 'right', title: '操作', width: 180, align: 'center', toolbar: '#barDemo', fixed: 'right'}
                    ]],
                    data: result.rows

                });
            }
        });

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

    $('#entry').click(function () {
        edit = layer.open({
           type: 1,
            title: '编辑档案',
            area: '800px',
           content: ('#editFile')
        });
    })
});