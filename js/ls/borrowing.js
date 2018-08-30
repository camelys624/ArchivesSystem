var list = '';
var table;
var form;
var table_id='';
var type='';
//var inittimer = window.setInterval(getqu(), 1000);

$(function () {

    layui.use(["form", "table",'laydate'], function () {
        form = layui.form;
        table = layui.table;
        const laydate = layui.laydate;
        getqu();
        getinfo('');

        //开启公历节日
        laydate.render({
            elem: '#return_time'
            ,calendar: true
        });
        //layer 弹出框提交
        form.on('submit(formtxt)',function (data) {
            if (type === 0) {
                data.field.fkBoxId = table_id;
            } else if (type === 1) {
                data.field.fkArchivesId = table_id;
            }
            addborrow(data.field);
            return false;
        });

        //綁定区名称
        form.on('select(business)', function (data) {
            //onsole.log(data.elem); //得到select原始DOM对象
            //console.log(data.value); //得到被选中的值
            const id = data.value;
            var html2 = '';
            for (let i = 0; i < list.length; i++) {
                const argument = list[i];
                const regions = list[i].region;
                const qu_id = argument.id;
                if (qu_id == id) {
                    $('#select2').empty();
                    for (let k = 0; k < regions.length; k++) {
                        const qu_name = regions[k].name;
                        const qu_id = regions[k].id;
                        html2 += '<option value=' + qu_id + '>' + qu_name + '<option>';
                    }
                } else {
                    $('#select2').empty();
                }
            }
            $("#select2").append(html2);
            form.render(); //更新全部
        });
        //监听工具条
        table.on('tool(table_btn)', function (obj) {
            var data = obj.data;
            table_id = data.id;
            type = data.type;
           if(obj.event==='lend'){
               layer.open({
                  area: ['1000px', '400px']
                   ,closeBtn: 0
                   ,type: 1
                   ,title: '添加借阅'
                   ,maxmin: false //允许全屏最小化
                   ,content: $('#get_form')
               });
           }
        });
        //选择库房区名称
        form.on('submit(search)', function (data) {
            if (data.field.storeId != null && data.field.storeId !== "" && data.field.regionId == null && data.field.regionId === "") {
                layer.msg('请选择区号！', {icon: 5});
                return false;
            } else if (data.field.regionId != null && data.field.regionId !== "" && data.field.storeId == null && data.field.storeId === "") {
                layer.msg('请选择库房名称！', {icon: 5});
                return false;
            } else if (data.field.barcode == null || data.field.barcode === "") {
                data.field.barcode = undefined;
            }
            getinfo(data.field);
            return false;
        });
    });
});

function cance() {
    layer.closeAll();
}

//获取档案信息
function getinfo(data) {
    //status  1未上架  2在架  3借出
    //type 0档案，1盒
        table.render({
            elem: '#borrow_id',
            method: 'get',
            url: url + araeStoreInfo,
            where: data,
            page: true,
            limit:13,
            limits : [10,11,12,13],
            height:'full-200',
            request: {
                pageName: 'page' //页码的参数名称，默认：page
                , limitName: 'pagesize' //每页数据量的参数名，默认：limit
            },
            response: {
                statusName: 'state' //数据状态的字段名称，默认：code
                , statusCode: true //成功的状态码，默认：0
                , msgName: 'msg' //状态信息的字段名称，默认：msg
                , countName: 'total' //数据总数的字段名称，默认：count
                , dataName: 'rows' //数据列表的字段名称，默认：data
            },
            cols: [[
                {field: 'name', title: '名称', align: "center", event: 'setSign'},
                {
                    field: 'type', title: '类型', align: "center", event: 'setSign', templet: function (d) {
                        if (d.type === 0) {
                            return '档案盒';
                        } else if (d.type === 1) {
                            return '档案';
                        }
                    }
                },
                {field: 'typeName', title: '类型名称', align: "center", event: 'setSign'},
                {
                    field: 'status', title: '借阅状态', align: "center", event: 'setSign', templet: function (d) {
                        if (d.status === 0) {
                            return '未上架';
                        } else if (d.status === 1) {
                            return '在架';
                        } else if (d.status === 2) {
                            return '借出';
                        }
                    }
                },
                {field: 'number', title: '编号', align: "center", event: 'setSign', sort: true},
                {field: 'barcode', title: '条码', align: "center", event: 'setSign', sort: true},
                {field: 'rdLocationAddr', title: '存放位置', align: "center", event: 'setSign'},
                {fixed: 'right', align: "center", toolbar: '#barDemo', width: 80, title: '操作'}
            ]],
            done: function (res, curr, count) {
                //如果是异步请求数据方式，res即为你接口返回的信息。
                console.log(res);
                //得到当前页码
                console.log(curr);
                //得到数据总量
                console.log(count);
            }
        });
}
// 执行代码获取库区名称
function getqu() {
        $.ajax({
            type: "GET",
            url: url + storeAndRegion,
            success: function (res) {
                var html = '';
                if (res != null) {
                    if (res.list.length > 0) {
                        list = res.list;
                        html = '<option value="">' + '请选择库房名称' + '</option>';
                        for (let i = 0; i < list.length; i++) {
                            var store_name = list[i].store_name;
                            var store_id = list[i].id;
                            html += '<option  value=' + store_id + '>' + store_name + '</option>';
                        }
                        $("#select1").append(html);
                        //  window.clearInterval(inittimer);
                        form.render('select');
                    }
                }
            }

        });

}

function addborrow(data) {
    $.ajax({
        type:"POST",
        url: url + addbor,
        data:JSON.stringify(data),
        headers: {
            'Content-Type':'application/json'
        },
        success:function (res) {
            $('#reset').trigger("click"); //重置表单
            layer.closeAll();
            if(res!=null){
                if(res.state){
                    layer.msg(res.msg,{icon: 1});
                    getqu();
                }else{
                    layer.msg(res.msg,{icon: 5});
                }
            }

        }
    })

}
