
//接口地址
let base = 'http://192.168.2.128:8081/';
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

//定义表头
let cols = [];
cols.push({field: 'xuhao', title: '序号', type: 'numbers', fixed: 'left'},
    {type: 'checkbox'},
    {field: 'rdTypeName', title: '文档类型'},
    {field: 'arcName', title: '档案名称'},
    {field: 'fileNum', title: '档号'},
    {field: 'docName', title: '题名'},
    {field: 'fkTemplateId', title: '模板编号'},
    {field: 'archivesNumber', title: '档案编号'},
    {field: 'duration', title: '保管期限'},
    {field: 'fkDictCodeSecurity',title: '密级'},
    {field: 'storeid', title: '库房ID'},
    {field: 'quNum', title: '区编号'},
    {field: 'div', title: '节号'},
    {field: 'col', title: '列号'},
    {field: 'lay', title: '层号'},
    {field: 'rdLocationAddr', title: '位置方向'},
    {field: 'rfid', title: 'RFID'},
    {field: 'updateOperator', title: '著录人'},
    {field: 'detailsstr', title: '备注'}
    );

layui.use('table',function () {
    let table = layui.table,
        $ = layui.$;
    getCheckedData = function () {
        let checkStatus = table.checkStatus('table');
        fileData = checkStatus.data;

    };
});