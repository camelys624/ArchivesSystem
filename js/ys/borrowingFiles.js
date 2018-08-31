layui.use(['table', 'layer', 'form', 'laydate','element'], function () {
    let table = layui.table,
        layer = layui.layer,
        form = layui.form,
        laydate = layui.laydate,
        $ = layui.$;

    let search = null;
    excelUrl = url;
    let createTable = function () {
        table.render({
            elem: '#table',
            url: url,
            page: true,
            height: 'full-50',
            cols: [borrowingCols],
            request: {
                pageName: 'currentPage',
                limitName: 'pageSize'
            },
            response: {
                statusCode: 1,
                countName: 'total',
                dataName: 'rows'
            },
            done:function (res) {
                excelData = res.rows;
            }
        })

    };
    createTable();

    $('#search').click(function () {
        search = layer.open({
            type: 1,
            title: '在借查询',
            area: ['330px', '380px'],
            content: $('#search-box')
        });

    });

    //查询弹窗
    form.on('select(factor)', function (options) {
        if (options.value == 7||options.value == 8||options.value == 9) {
            $('#date').removeAttr('disabled')
                .removeClass('layui-disabled');
            layui.form.render();
            layui.element.init();
        } else {
            $('#date').attr('disabled', true)
                .addClass('layui-disabled')
                .val('');
            layui.form.render();
            layui.element.init();
        }
    });
    laydate.render({
        elem: '#date',
        type:'datetime'
    });

    form.on('submit(search)', function (data) {
        let searchData = data.field;
        if (searchData.styles == 0) {
            switch (parseInt(searchData.factor)) {
                case 0:
                    url = base + 'admin/areamodule/fileBorrow?map[id]=' + searchData.info;
                    excelUrl = url;
                    break;
                case 1:
                    url = base + 'admin/areamodule/fileBorrow?map[userName]=' + searchData.info;
                    excelUrl = url;
                    break;
                case 2:
                    url = base + 'admin/areamodule/fileBorrow?map[company]=' + searchData.info;
                    excelUrl = url;
                    break;
                case 3:
                    url = base + 'admin/areamodule/fileBorrow?map[depart]=' + searchData.info;
                    excelUrl = url;
                    break;
                case 4:
                    url = base + 'admin/areamodule/fileBorrow?map[fkArchivesId]=' + searchData.info;
                    excelUrl = url;
                    break;
                case 5:
                    url = base + 'admin/areamodule/fileBorrow?map[fkBoxId]=' + searchData.info;
                    excelUrl = url;
                    break;
                case 6:
                    url = base + 'admin/areamodule/fileBorrow?map[status]=' + searchData.info;
                    excelUrl = url;
                    break;
                case 7:
                    url = base + 'admin/areamodule/fileBorrow?map[createTime-gt]=' + searchData.date;
                    excelUrl = url;
                    break;
                case 8:
                    url = base + 'admin/areamodule/fileBorrow?map[userPhone]=' + searchData.info;
                    excelUrl = url;
                    break;
                default:
                    break;
            }
        } else if (searchData.styles == 1) {
            switch (parseInt(searchData.factor)) {
                case 0:
                    url = base + 'admin/areamodule/fileBorrow?map[id-like]=' + searchData.info;
                    excelUrl = url;
                    break;
                case 1:
                    url = base + 'admin/areamodule/fileBorrow?map[userName-like]=' + searchData.info;
                    excelUrl = url;
                    break;
                case 2:
                    url = base + 'admin/areamodule/fileBorrow?map[company-like]=' + searchData.info;
                    excelUrl = url;
                    break;
                case 3:
                    url = base + 'admin/areamodule/fileBorrow?map[depart-like]=' + searchData.info;
                    excelUrl = url;
                    break;
                case 4:
                    url = base + 'admin/areamodule/fileBorrow?map[fkArchivesId-like]=' + searchData.info;
                    excelUrl = url;
                    break;
                case 5:
                    url = base + 'admin/areamodule/fileBorrow?map[fkBoxId-like]=' + searchData.info;
                    excelUrl = url;
                    break;
                case 6:
                    url = base + 'admin/areamodule/fileBorrow?map[status-like]-like=' + searchData.info;
                    excelUrl = url;
                    break;
                case 7:
                    url = base + 'admin/areamodule/fileBorrow?map[createTime-gt-like]=' + searchData.date;
                    excelUrl = url;
                    break;
                case 8:
                    url = base + 'admin/areamodule/fileBorrow?map[userPhone-like]=' + searchData.info;
                    excelUrl = url;
                    break;
                default:
                    break;
            }

        }

        table.render({
            elem: '#table',
            url: url,
            height:'full-50',
            page: true,
            cols: [borrowingCols],
            request: {
                pageName: 'currentPage',
                limitName: 'pageSize'
            },
            response: {
                statusCode: 1,
                countName: 'total',
                dataName: 'rows'
            },
            done:function (res) {
                console.log(res);
            }
        });
        layer.close(search);
        return false;
    });

    /**
     *
     * 归还档案
     *
     */

    table.on('checkbox(table)', function (obj) {
        console.log(obj);
    });
    let returnFile = function () {
        let checkStatus = table.checkStatus('table'),
            objData = checkStatus.data;
        if (objData.length !== 0) {
            let array = [];
            for (let i = 0; i < objData.length; i++) {
                array.push(objData[i].id);
            }
            let value = array.join(),
                data = {ids: value};
            $.ajax({
                type: 'POST',
                url: returnFilesUrl,
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function (result) {
                    console.log(result);
                    if (result.state === true) {
                        layer.msg("归还成功");
                        createTable();
                    }
                }
            })
        } else {
            layer.msg("没有选择数据，请选择！");
        }
    };
    $('#return').click(function () {
        returnFile();
    });

    //excel导出
    let exportExcel = function (jsonData){
        let col = [], data = jsonData;
        col.push({
            "xuhao": "序号",
            "fkArchivesId": "档案id",
            "fkBoxId":"档案盒id",
            "filetype": "文档类型",
            "fkTemplateId": "模板编号",
            "company": "公司",
            "userName": "借阅人",
            "depart": "借阅部门",
            "useIntention": "借阅目的",
            "userPhone": "手机号",
            "userTel": "电话",
            "userEmail": "邮箱",
            "createTime": "创建时间",
            "expreturnTime": "预计归还时间",
            "creater": "办理人",
            "filestatus": "状态",
            "borrowing_days": "借阅天数"
        });
        for (let index = 0; index !== data.length; ++index) {
            data[index].xuhao = index + 1;
            delete data[index].LAY_TABLE_INDEX;
        }
        let newExcel = col.concat(data);
        downloadExcel(newExcel);
    };

    $('#export').click(function () {
        exportExcel(excelData);
    });
    $('#exportAll').click(function () {
        $.ajax({
            type:'GET',
            url:excelUrl+'&pageSize=1000',
            success: function (result) {
                if(result.state === true){
                    exportExcel(result.rows);
                }else {
                    layer.msg('服务器异常，请稍后再试');
                }
            }
        })
    });
});