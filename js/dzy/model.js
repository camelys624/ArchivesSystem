layui.use(['form', 'upload', 'element', 'tree', 'table'], function () {
    var form = layui.form, //获取form模块
        upload = layui.upload, //获取upload模块
        element = layui.element,
        layer = layui.layer,
        tree = layui.tree,
        table = layui.table;
});
var token = localStorage.getItem("token");
var url = "http://192.168.2.128:8081";