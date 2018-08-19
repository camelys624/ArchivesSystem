layui.use(['tree', 'layer', 'table', 'form', 'layedit'], function () {
    let tree = layui.tree,
        layer = layui.layer,
        table = layui.table,
        form = layui.form,
        layedit = layui.layedit,
        $ = layui.$;

    let createStation = function () {
        
    }
    
    let createTree = function () {
        $.ajax({
            url: base + 'admin/areamodule/araeStoreInfo/getStoreAndRegion',
            type: 'GET',
            success: function (result) {
                let store = [],cols = [],
                    region;
                let storeData = result.list;
                console.log(JSON.stringify(storeData));
                for (let i = 0; i < storeData.length; i++) {
                    region = storeData[i].region;
                    for (let j = 0; j < region.divs; j++){
                        let colsName = region.quNumLeft + '区' + j + '列';
                        let child = {name: colsName};
                        cols.push(child)
                    }
                    storeData[i].name = storeData[i].store_name;
                    store.push({
                        name: storeData[i].name,
                        fkStoreId: storeData[i].id,
                        children: {
                            name:region.name,
                            children:cols
                        }
                    });

                }
                nodes = store;
                //树形菜单
                tree({
                    elem: '#tree',
                    nodes: nodes,
                    click: function (node) {
                        
                    }
                });
            }
        });
    };

    createTree();
});