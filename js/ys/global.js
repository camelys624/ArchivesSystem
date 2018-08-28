
//接口地址
let base = 'http://192.168.2.130:8081/';
let url = null;


//定义一些弹出面板
let index = null,
    shelf = null;
let store_id = null,
    store_name = null,
    barcode;
let nodes = [];
let getCheckedData;
let fileData;
let station = null;
let tableData = null;
let storeId=null;

//定义表头
let cols = [];
cols.push({field: 'xuhao', title: '序号', type: 'numbers', width: 80, fixed: 'left'},
    {type: 'checkbox'},
    {field: 'rdTypeName', title: '文档类型',width:120},
    {field: 'arcName', title: '档案名称',width:100},
    {field: 'fileNum', title: '档号',width:120},
    {field: 'docName', title: '题名',width:120},
    {field: 'fkTemplateId', title: '模板编号',width:180},
    {field: 'archivesNumber', title: '档案编号',width:100},
    {field: 'duration', title: '保管期限',width:100},
    {field: 'fkDictCodeSecurity',title: '密级'},
    {field: 'storeid', title: '库房ID',width:120},
    {field: 'quNum', title: '区编号',width:80},
    {field: 'div', title: '节号'},
    {field: 'col', title: '列号'},
    {field: 'lay', title: '层号'},
    {field: 'rdLocationAddr', title: '位置方向',width:180},
    {field: 'rfid', title: 'RFID',width:200},
    {field: 'updateOperator', title: '著录人',width:100},
    {field: 'detailsstr', title: '备注',width:180}
    );

layui.use('table',function () {
    let table = layui.table,
        $ = layui.$;
    getCheckedData = function () {
        let checkStatus = table.checkStatus('table');
        fileData = checkStatus.data;

    };
});