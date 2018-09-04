var base = 'http://192.168.2.128:8081/';
layui.use(['tree', 'layer', 'table', 'form', 'layedit'], function () {
    let tree = layui.tree,
        layer = layui.layer,
        table = layui.table,
        form = layui.form,
        layedit = layui.layedit,
        $ = layui.$;

    let createStation = function (_node) {
        let station = '';
        if (_node.qu_num !== undefined) {
            for (let i = 0; i < _node.children.length; i++) {
                for (let j = 1; j <= _node.children[i].divs; j++) {
                    for (let h = 1; h <= _node.children[i].lays; h++) {
                        station += '<p value="1">' + _node.children[i].name + j + '节' + h + '层左</p>' +
                            '<p value="2">' + _node.children[i].name + j + '节' + h + '层右</p>';
                    }
                }
            }
        } else if (_node.divs !== undefined) {
            for (let i = 1; i <= _node.divs; i++) {
                // language=HTML
                for (let h = 1; h <= _node.lays; h++) {
                    station += '<p value="1">' + _node.name + i + '节' + h + '层左</p>' +
                        '<p value="2">' + _node.name + i + '节' + h + '层右</p>';
                }

            }
        } else if (_node.children === undefined) {
            for (let i = 1; i <= _node.parentDivs; i++) {
                for (let h = 1; h <= _node.parentLays; h++) {
                    if (_node.typeId === 1) {
                        station += '<p value="1">' + _node.parentName + i+'节' + h + '层' + _node.name + '</p>';
                    } else {
                        station += '<p value="2">' + _node.parentName +i+ '节' + h + '层' + _node.name + '</p>';
                    }
                }
            }
        }
        $('#station').append(station);
    };

    let createTree = function () {
            $.ajax({
                    url: base + 'admin/areamodule/araeStoreInfo/getStoreAndRegion',
                    type: 'GET',
                    success: function (result) {
                        let store = [],
                            cols = [],
                            qu = {},
                            region;
                        let storeData = result.list;
                        for (let i = 0; i < storeData.length; i++) {
                            region = storeData[i].region;
                            for (let q = 0; q < region.length; q++) {
                                region[q].storeId = storeData[i].id;
                                for (let j = 0; j < region[q].cols; j++) {
                                    let colsName = region[q].qu_num+'区' + j + '列';
                                    let child = {
                                        name: colsName,
                                        id: j,
                                        storeId:region[q].storeId,
                                        divs: region[q].divs,
                                        lays: region[q].lays,
                                        children: [
                                            {
                                                name: '左边',
                                                parentName: colsName,
                                                typeId: 1,
                                                storeId:region[q].storeId,
                                                parentLays: region[q].lays,
                                                parentDivs: region[q].divs
                                            },
                                            {
                                                name: '右边',
                                                parentName: colsName,
                                                typeId: 2,
                                                storeId:region[q].storeId,
                                                parentLays: region[q].lays,
                                                parentDivs: region[q].divs
                                            }
                                        ]
                                    };
                                    cols.push(child);
                                }
                                region[q].name = region[q].qu_num;
                                region[q].children = cols;
                                cols = [];

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
                            elem: '#stationTree',
                            nodes: nodes,
                            click: function (node) {
                                console.log(node);
                                $('#station').empty();
                                storeId = node.storeId;
                                createStation(node);
                            }
                        });
                    }
                }
            );
        }
    ;

    createTree();

    $('#station').on('click', 'p', function () {

        console.log($(this).html());
        $('p').css('background-color', '');
        $('p').css('color', '');
        $(this).css('background-color', 'gray');
        $(this).css('color', 'white');
        station = $(this).html();
    });
})
;