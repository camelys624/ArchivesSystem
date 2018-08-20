let details;
let table;
let Infobox;
let Borrowing;

$(function () {
    var fkRegionId,col,lay,div,localtion;
    layui.use(["form","table"],function () {
        var form = layui.form;
        table = layui.table;
        //监听提交
        form.on('submit(search)',function (data) {
            $.ajax({
                type: "GET",
                 url:url+boxBarcode,
                 data:data.field,
                success:function(res) {
                    if (res.state) {
                        $(".quinfo").show();
                        $("#name").text(res.row.boxName);
                        $("#box").text(res.row.boxNum);
                        $("#time").text(res.row.endTime);
                        $("#position").text(res.row.rdLocationAddr);
                        var locations = res.row.araeLocation;
                        fkRegionId = locations.fkRegionId;
                        col = locations.col;
                        lay = locations.lay;
                        div = locations.div;
                        localtion = locations.localtion;
                        //根据档案盒id查询档案盒内档案
                        Infobox(res.row.id);
                    } else {
                        $(".quinfo").hide();
                        layer.msg(res.msg);
                    }
                }
            });
            return false;
        });
        //table点击事件
        table.on('tool(table_list)', function(obj){
            if(obj.data != null){
                var id = obj.data.id;
                var fkTemplateId=obj.data.fkTemplateId;
                        Borrowing(id);
                        template_(fkTemplateId);
                details=obj.data.details;//获取模板的值
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
                if (res.state) {
                        table.render({
                            none: '暂无相关数据', //默认：无数据。注：该属性为 layui 2.2.5 开始新增
                            elem: '#list',
                            height: 330,
                            cols: [[
                                //标题栏
                                {field: 'rdTypeName', title: '题名',align:"center",event: 'setSign'}
                                , {field: 'rdLocationAddr', title: '存放位置',align:"center",event: 'setSign'}
                            ]],
                            data: res.rows,
                        });
                    data = res;
                } else {
                    layer.msg(res.msg);
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
    Borrowing=(function (id) {
        $.ajax({
            type:"GET",
            url:url+fkArchivesId,
            data:"map[fkArchivesId]="+id,
            success:function (res) {
                if(res.state){
                    //状态：1.未上架，2.在架，3借出
                    if(res.rows.length>0&&res.rows!=null){
                        $("#state_").text(res.rows[0].filestatus);
                        $("#datetime_").text(res.rows[0].createTime);
                        $("#people").text(res.rows[0].userName);
                }
                }else{
                    layer.msg(res.msg);
                }
            }
        })
    });
    //查询模板
    var template_;
    template_ = (function (id) {
        $.ajax({
            type:"GET",
            url:url+template,
            data:"map[id]="+id,
            success:function (res) {
                console.log(res.rows[0].templateDefinition);
                const temp = details.split(",");
                for (let i = 0; i < temp.length; i++) {
                    const divElement = temp[0];
             //   var jsonObj = eval('('+divElement+')');// eval();方法
                    var jsonObj = JSON.parse(divElement);  // JSON.parse(); 方法
                 //const div = divElement.split(":");
                    console.log(jsonObj);
                }
                if(res.state){

                }else{
                    layer.msg(res.msg);
                }
            }
        })
    });
    //鼠标移动改变背景颜色
    $(document).ready(function(){
        $(".shu_txt").hover(function(){
          $(this).css("background-color","#33ABA0")
        },function(){
            $(this).css("background-color","#009688");
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