//接口地址
let base = 'http://192.168.2.128:8081/';
let url = null;


//定义一些弹出面板
let index = null,
    shelfA = null;
let store_id = null,
    store_name = null,
    barcode;
let nodes = [];
let getCheckedData;
let fileData;
let station = null;
let tableData = null;
let storeId = null;

//定义文档信息表头
let cols = [];
cols.push({field: 'xuhao', title: '序号', type: 'numbers', width: 80, fixed: 'left'},
    {type: 'checkbox'},
    {field: 'rdTypeName', title: '文档类型', width: 120},
    {field: 'arcName', title: '档案名称', width: 100},
    {field: 'fileNum', title: '档号', width: 120,
        templet: function (d) {
            let details = JSON.parse(d.details);
            if(details.档号 === undefined){
                details = JSON.parse(details);
                return details.档号
            }else {
                return details.档号;
            }
            // return details.档号;
        }
    },
    {
        field: 'docName', title: '题名', width: 120,
        templet: function (d) {
            let details = JSON.parse(d.details);
            if(details.题名 === undefined){
                details = JSON.parse(details);
                return details.题名
            }else {
                return details.题名;
            }
        }
    },
    {field: 'fkTemplateId', title: '模板编号', width: 180},
    {field: 'archivesNumber', title: '档案编号', width: 100},
    {field: 'duration', title: '保管期限', width: 100},
    {field: 'fkDictCodeSecurity', title: '密级'},
    {
        field: 'storeid', title: '库房ID', width: 120,
        templet: function (d) {
            return d.araeLocation.fkStoreId;
        }
    },
    {
        field: 'quNum', title: '区编号', width: 80,
        templet: function (d) {
            return d.araeLocation.rdRegionNum;
        }
    },
    {
        field: 'col', title: '列号',
        templet: function (d) {
            return d.araeLocation.col;
        }
    },
    {
        field: 'div', title: '节号',
        templet: function (d) {
            return d.araeLocation.div;
        }
    },
    {
        field: 'lay', title: '层号',
        templet: function (d) {
            return d.araeLocation.lay;
        }
    },
    {field: 'fkBoxId', title: '归属档案盒id', width: 200},
    {field: 'archivesBarcode', title: '档案条形码',width:120},
    {field: 'rfid', title: 'RFID', width: 200},
    {field: 'rdLocationAddr', title: '存放位置', width: 180},
    {field: 'createTime', title: '著录时间', width: 180},
    {
        field: 'status', title: '状态', width: 100,
        templet: function (d) {
            let status = '';
            if (d.status == 1) {
                status = '未上架';
                return status;
            } else if (d.status == 2) {
                status = '在架';
                return status;
            } else if (d.status == 3) {
                status = '在借';
                return status;
            }
        }
    },
    {field: 'detailsstr', title: '备注', width: 180},
    {field: 'right', title: '操作', width: 180, align: 'center', toolbar: '#toolbar', fixed: 'right'}
);

layui.use('table', function () {
    let table = layui.table,
        $ = layui.$;
    getCheckedData = function () {
        let checkStatus = table.checkStatus('table');
        fileData = checkStatus.data;

    };
});