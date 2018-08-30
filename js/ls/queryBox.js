let details;
var table;
let Infobox;
let Borrowing;
let rdRegionNum, col, lay, div, localtion;//区列节层1左2右

$(function () {
    layui.use(["form", "table"], function () {
        var form = layui.form;
        table = layui.table;
        form.on('submit(open_frame)', function () {
            console.log(rdRegionNum + '' + col + '' + lay + '' + div + '' + localtion);
            return false;
        });
        //监听提交
        form.on('submit(search)', function (data) {
            $.ajax({
                type: "GET",
                url: url + boxBarcode,
                data: data.field,
                success: function (res) {
                    if (res.state) {
                        $(".quinfo").show();
                        $("#name").text(res.row.boxName);
                        $("#box").text(res.row.boxNum);
                        $("#time").text(res.row.endTime);
                        $("#position").text(res.row.rdLocationAddr);
                        var locations = res.row.araeLocation;
                        rdRegionNum = locations.rdRegionNum;
                        col = locations.col;
                        lay = locations.lay;
                        div = locations.div;
                        localtion = locations.localtion;
                        //根据档案盒id查询档案盒内档案
                        Infobox(res.row.id);
                    } else {
                        $(".quinfo").hide();
                        layer.msg(res.msg, {icon: 5});
                    }
                }
            });
            return false;
        });
        //table点击事件
        table.on('tool(table_list)', function (obj) {
            if (obj.data != null) {
                var id = obj.data.id;
                var fkTemplateId = obj.data.fkTemplateId;
                Borrowing(id);
                template_(fkTemplateId);
                details = obj.data.details;//获取模板的值
                console.log(details);
            }
        });
    });

    Infobox = function (id) {
        $.ajax({
            type: "GET",
            url: url + fkBoxId,
            data: "map[fkBoxId]=" + id,
            success: function (res) {
                console.log(res);
                table.render({
                    none: '暂无相关数据', //默认：无数据。注：该属性为 layui 2.2.5 开始新增
                    elem: '#list',
                    height: 277,
                    cols: [[
                        //标题栏
                        {field: 'rdTypeName', title: '题名', align: "center", event: 'setSign'}
                        , {field: 'rdLocationAddr', title: '存放位置', align: "center", event: 'setSign'}
                    ]],
                    data: res.rows,
                });
                if (res.state) {
                    data = res;
                } else {
                    layer.msg(res.msg, {icon: 5});
                    return false;
                }

                // if (res.rows != null&&res.rows.length>0) {
                //     $("#list").parent().on('click', '.layui-table-view table.layui-table tr', function () {
                //         var index = this.sectionRowIndex;//取tr在table里的索引位置
                //         var id = res.rows[index].id;
                //           details=res.rows[details];//获取模板的值
                //         Borrowing(id);
                //         template_(res.rows[index].fkTemplateId);
                //     });
                // }
            }
        })
    };
    //借阅查询
    Borrowing = (function (id) {
        $.ajax({
            type: "GET",
            url: url + fkArchivesId,
            data: "map[fkArchivesId]=" + id,
            success: function (res) {
                if (res.state) {
                    //状态：1.未上架，2.在架，3借出
                    if (res.rows.length > 0 && res.rows != null) {
                        $("#state_").text(res.rows[0].filestatus);
                        $("#datetime_").text(res.rows[0].createTime);
                        $("#people").text(res.rows[0].userName);
                    }
                } else {
                    layer.msg(res.msg, {icon: 5});
                    return false;
                }
            }
        })
    });
    //查询模板
    var template_;
    template_ = (function (id) {
        $.ajax({
            type: "GET",
            url: url + template,
            data: "map[id]=" + id,
            success: function (res) {
                const detnum = [];
                const detailnum = JSON.parse(details);
                for (var key in detailnum) {
                    detnum.push(key);
                }
                console.log(detnum);
                if (res.state) {
                    const tem = JSON.parse(res.rows[0].templateDefinition);
                    for (let i = 0; i < tem.length; i++) {
                        const templateElement = tem[i];
                        for (let j = 0; j < detnum.length; j++) {
                            const re = detnum[j];//获取key值
                            if (templateElement.ATI_Name === re) {
                                console.log(detailnum[key]); //获取对应的value值
                                //1 文本框 2 下拉框 3 时间控件
                                var input;
                                var div = $('<div style="top:' + templateElement.ATI_X + 'px;left:' + templateElement.ATI_Y + 'px;"></div>');
                                switch (templateElement.ATI_TypeId) {
                                    case 1:
                                        input = $('<label>' + templateElement.ATI_Name + '</label>' + '<input disabled value="' + detailnum[key] + '" type="text" style="height:' + templateElement.ATI_Height + 'px;width:' + templateElement.ATI_Width + 'px" />');
                                        break;
                                    case 2:
                                        input = $('<select style="height:' + templateElement.ATI_Height + 'px;width:' + templateElement.ATI_Width + 'px"><option>' + templateElement.ATI_Name + '</option></select>');
                                        break;
                                    case 3:
                                        input = $('<label>' + templateElement.ATI_Name + '</label>' + '<input class="layui-icon layui-icon-date" disabled value="' + detailnum[key] + '" type="text" style="height:' + templateElement.ATI_Height + 'px;width:' + templateElement.ATI_Width + 'px;" />' + '<i class="layui-icon layui-icon-date"></i>');
                                        break;
                                }
                                div.append(input);
                                $("#fileInfo").append(div);
                            }
                        }
                    }
                } else {
                    layer.msg(res.msg, {icon: 5});
                    return false;
                }
            }
        })
    });
    //鼠标移动改变背景颜色
    $(document).ready(function () {
        $(".shu_txt").hover(function () {
            $(this).css("background-color", "#33ABA0")
        }, function () {
            $(this).css("background-color", "#009688");
        });
    });

    // $("#search_btn").click(function(){
    //     var content= $("#search_content").val();
    //     $.ajax({
    //       type: "GET",
    //       url:url+"/admin/areaModule/FileBoxInfo/query?map[boxBarcode]="+content,
    //       // data:",
    //      success:function(res) {
    //       // alert(1);
    //
    //          alert(res);
    //      }
    //   })
    // });

});