var url="http://192.168.2.128:8081";
//根据档案盒条形码查询档案盒
var boxBarcode ="/admin/areaModule/FileBoxInfo/query";
//根据档案盒id查询档案盒内档案
var fkBoxId ="/admin/areaModule/FileArchivesInfo";
//借阅查询
var fkArchivesId = "/admin/areamodule/fileBorrow";
//查询模板
var template = "/admin/areaModule/FileArchivesTemplate";
//根据仓库ID,区ID,列,节,层,左右查询档案和档案盒
var araeStoreInfo ="/admin/areamodule/araeStoreInfo/selectArcAndBoxFromStroe_region";
//查询仓库区信息
var storeAndRegion = "/admin/areamodule/araeStoreInfo/getStoreAndRegion";
//添加借阅
var addbor = "/admin/areamodule/fileBorrow/add";