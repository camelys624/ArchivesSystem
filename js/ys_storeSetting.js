layui.use(['tree', 'layer','table'], function () {
    let tree = layui.tree,
        layer = layui.layer,
        table = layui.table,
        $ = layui.$;

    let index = null,
        shelf = null;
    let nodes = [
        {
            name: '测试库房1',
            children: [
                {name: '密集架1-1'},
                {name: '密集架1-2'}
            ]
        }, {
            name: '测试库房2',
            children: [
                {name: '密集架2-1'}
            ]
        }
    ];
    $('#add').click(function () {
        index = layer.open({
            type: 1,
            title: '添加仓库',
            area:'500px',
            content: $('#storeAdd'),
        });
    });
    $('#yes').click(function () {
        let reg = /^[0-9a-zA-Z]+$/;
        let store_id = document.getElementById('s-id').value;
        let store_name = document.getElementById('s-name').value;
        let store = [{
            name: store_name,
            children:[
                {name: '密集架3-1'}
            ]
        }];
        tree({
            elem: '#tree',
            nodes: store
        });
        layer.close(index);
        // let url = 'http://192.168.2.11:83/mock/25/admin/areamodule/araeStoreInfo/add?name='+store_name+
        //     '&quantuty=1024&capacity=10240&borrowNum=512&barcode='+ store_id;
        // if (store_id === ''){
        //     document.getElementById('warnMsg').innerHTML = '请输入ID！！';
        // }else{
        //     if (!reg.test(store_id)){
        //         document.getElementById('warnMsg').innerHTML = '只能输入数字和字母！！';
        //     }else {
        //         document.getElementById('warnMsg').innerHTML = '';
        //
        //         $.ajax({
        //             type:'POST',
        //             url:'http://192.168.2.11:83/mock/25/admin/areamodule/araeRegion',
        //             contentType:'application/json',
        //             dataType:'json',
        //             success: function (result) {
        //                 tree({
        //                     elem: '#tree',
        //                     nodes: store
        //                 });
        //                 layer.close(index);
        //             },
        //             error: function () {
        //                 console.log("错误");
        //             }
        //         });
        //
        //     }
        // }

    });
    $('#cancel').click(function () {
        layer.close(index);
    });


    //树形菜单
    tree({
        elem: '#tree',
        nodes: nodes,
        click: function (node) {
            table.render({
                elem: '#table',
                url: '../data/data.json',
                page:true,
                request:{
                    pageName: 'currentPage',
                    limitName: 'pageSize',
                },
                response:{
                    statusName:'state',
                    state:0,
                    countName: 'total',
                    dataName: 'rows'
                },
                cols:[[
                    {field:'xuhao',title:'序号',type:'numbers',fixed:'left'},
                    {field:'rdStoreName',title:'所属库房'},
                    {field:'name',title:'区名称'},
                    {field:'quNumRight',title:'区号'},
                    {field:'cols',title:'列数'},
                    {field:'divs',title:'节数'},
                    {field:'lays',title:'层数'},
                    {field:'staticCol',title:'固定列号'},
                    {field:'gdlType',title:'固定列位置'},
                    {field:'width',title:'密集架宽度'},
                    {field:'speed',title:'运行速度'},
                    {field:'ventgaps',title:'通风间隔'},
                    {field:'ip',title:'主机名',width:200},
                    {field:'right',title:'操作',width: 120, align:'center', toolbar: '#barDemo'}
                ]]
            });

            //监听工具条
            table.on('tool(table)',function (obj) {
                let data = obj.data,
                    layEvent = obj.event;
                if(layEvent === 'edit'){
                    shelf = layer.open({
                        type: 1,
                        title: '修改密集架信息',
                        area:'800px',
                        content: $('#shelfEdit')
                    });
                }else if(layEvent === 'del'){
                    layer.confirm('真的删除该密集架信息吗？',function (index) {
                        obj.del();
                        layer.close(index);
                    });
                }
            });
        }
    });


    //创建表格
    
});
