layui.use(['tree', 'layer', 'table', 'form', 'layedit'], function () {
    let tree = layui.tree,
        layer = layui.layer,
        table = layui.table,
        form = layui.form,
        layedit = layui.layedit,
        $ = layui.$;

    let createStation = function (_node) {
        let station = '';
        for(let i = 0;i < _node.divs; i++){
            // language=HTML
            station += `<p value="1">{{node.name}}{{i}}层左</p>
                        <p value="2">{{node.name}}{{i}}层右</p>`;
        }
        $('#station').innerHTML = station;
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
                console.log(JSON.stringify(storeData));
                for (let i = 0; i < storeData.length; i++) {
                    region = storeData[i].region;

                    for (let q = 0;q < region.length; q++){
                        (function (num) {
                            for(let j = 0; j < region[num].cols; j++){
                                let colsName = region[num].name + j + '列';
                                let child = {
                                    name: colsName,
                                    id:j,
                                    divs:region.divs
                                };
                                cols.push(child);
                                region[num].children = cols;
                            }
                        }(q))

                        // for(let h = 0;h < cols.length;h++){

                        // }
                    }
                    storeData[i].name = storeData[i].store_name;
                    store.push({
                        name: storeData[i].name,
                        fkStoreId: storeData[i].id,
                        children: region
                    });

                }
                nodes = store;
                console.log(nodes);
                //树形菜单
                tree({
                    elem: '#tree',
                    nodes: nodes,
                    click: function (node) {
                        createStation(node);
                    }
                });
            }
        });
    };

    createTree();
});