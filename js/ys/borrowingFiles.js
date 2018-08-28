layui.use(['table', 'layer', 'form', 'laydate'], function () {
    let table = layui.table,
        layer = layui.layer,
        form = layui.form,
        laydate = layui.laydate,
        $ = layui.$;

    let search = null;
    let createTable = function () {
        table.render({
            elem: '#table',
            url: url,
            page: true,
            height: 'full-70',
            cols: [borrowingCols],
            request: {
                pageName: 'currentPage',
                limitName: 'pageSize'
            },
            response: {
                statusCode: 1,
                countName: 'total',
                dataName: 'rows'
            }
        })

    };
    createTable();
    laydate.render({
        elem: '#startTime'
    });
    laydate.render({
        elem: '#endTime'
    });

    $('#search').click(function () {
        search = layer.open({
            type: 1,
            title: '查询文档信息',
            area: ['650px', '400px'],
            content: $('#search-box')
        })
    });

    form.on('submit(search)', function (data) {
        let searchData = data.field;
        if (searchData.factor !== '6') {
            $('#startTime').attr('disabled', true);
            $('#endTime').attr('disabled', true);
        } else {
            console.log(searchData.factor);
            $('#startTime').removeAttr('disabled');
            $('#endTime').removeAttr('disabled');
        }
        if (searchData.styles == 0) {
            switch (parseInt(searchData.factor)) {
                case 0:
                    url = base + '/admin/areamodule/fileArchivesInfo?map[archivesNumber]=' + searchData.info;
                    break;
                case 1:
                    url = base + '/admin/areamodule/fileArchivesInfo?map[archivesBarcode]=' + searchData.info;
                    break;
                default:
                    break;
            }
        } else if (searchData.styles == 1) {
            switch (parseInt(searchData.factor)) {
                case 0:
                    url = base + '/admin/areamodule/fileArchivesInfo?map[archivesNumber-like]=' + searchData.info;
                    break;
                case 1:
                    url = base + '/admin/areamodule/fileArchivesInfo?map[archivesBarcode-like]=' + searchData.info;
                    break;
                default:
                    break;
            }

        }

        table.render({
            elem: '#table',
            url: url,
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

});