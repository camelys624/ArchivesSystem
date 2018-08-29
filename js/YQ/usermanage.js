var url = 'http://192.168.2.128:8081';
//定义一个对象存储右键点击item的数据（json格式，所以定义对象，可以将其.出来）
var rightData = new Object;
//表头
var tableHead = [
    [
        { field: 'tourPlayerId', title: 'ID', width: 120, align: 'center', type: 'numbers' },
        { field: 'identity', title: '登录名', align: 'center', width: 265 },
        { field: 'position', title: '职位', align: 'center', width: 230 },
        { field: 'visitTime', title: '记录时间', align: 'center', width: 300 },
        {
            field: 'isLock',
            title: '是否冻结',
            align: 'center',
            width: 300,
            //只是表格中显示为已冻结和未冻结，下面获取的数据还是1和0
            templet: function(d) {
                // console.log(d.isLock);
                return d.isLock ? '已冻结' : '未冻结';
            }
        },
        { field: 'right', title: '操作', width: 680, align: 'center', toolbar: '#barDemo', style: 'cursor: pointer;' }

    ]
];
// 进行修改、冻结、删除操作时，发送的内容存储在以下变量中
var itemId, sendLockInfo;
//区分是哪一个弹出层;监听工具条时获取的数据
var flag;
//两个弹出层的URL2不同，提交按钮的ID也不同，绑定的表单不同
var url2;
layui.use(['table', 'layer', 'laypage', 'form'], function() {
    var table = layui.table;
    var laypage = layui.laypage;
    var layer = layui.layer;
    var form = layui.form;
    //表格渲染
    onLoadTable();
    // 添加用户按钮的点击事件
    $("#addUser").on("click", function() {
        //清除修改时input中被赋予的值
        $('#Userform')[0].reset();
        $("#pwd").css('display', 'block');
        if ($("#token").attr("name") == "") {
            $("#token").setAttribute('name', 'token');
        }
        layer.open({
            type: 1, //层的类型为页面层
            btnAlign: 'c', //按钮的位置居左
            moveOut: false, //不允许借阅查询弹出层被拖动到该界面之外的地方
            title: ['用户注册', 'font-size:18px'], //借阅查询弹出层的标题及样式
            area: ['400px', '360px'], //借阅弹出层的大小
            resize: false,
            content: $('#editUser'), //绑定借阅弹出层的显示内容
            //点击右上角的x时，取消并隐藏查询div
            cancel: function(index, layero) {
                $('#editUser').hide();
                layer.close(index);
            }
        });
        flag = $('.layui-layer-title').text();
        console.log(flag);
    });
    //加载表格
    function onLoadTable() {
        table.render({
            elem: '#userInfo', //渲染该id的表格
            height: 'full-52', //高度
            page: true, //开启分页
            cols: tableHead, //表头
            // data: dataList, //表格中的数据
            url: url + "/admin/authModule/authUser",
            method: 'get',
            request: {
                pageName: 'currentPage', //页码的参数名称，默认：page
                limitName: 'pageSize' //每页数据量的参数名，默认：limit
            },
            response: {
                statusName: 'code', //数据状态的字段名称，默认：code
                statusCode: 1, //成功的状态码，默认：0
                msgName: 'msg', //状态信息的字段名称，默认：msg
                countName: 'total', //数据总数的字段名称，默认：count
                dataName: 'rows', //数据列表的字段名称，默认：data
            },
            done: function(res, curr, count) { //表格数据渲染完的回调
                var data = res.rows;
                console.log(data);
                // 给表格的每行绑定右键菜单事件
                $('.layui-table-body tr').each(function(e) {
                    //表单鼠标右键操作
                    $(this).mousedown(function(e) {
                        var index = $(this).attr('data-index');
                        if (e.which == 3) {
                            $("#menu").show();
                            //不包括滚动条的宽、高
                            var x = e.originalEvent.x + 'px';
                            var y = e.originalEvent.y + 'px';
                            $("#menu").css({
                                top: y,
                                left: x
                            });
                            rightData = data[index];
                            //存储冻结标志（0 or 1）
                            var rightLockValue = rightData.isLock;
                            //0解锁1锁定
                            rightLockValue = rightLockValue == 0 ? 1 : 0;
                            //修改用户时发送的数据
                            sendLockInfo = {
                                isLock: rightLockValue,
                                id: rightData.id
                            };
                            //进行删除操作时，发送的是被点击的条目的id
                            itemId = { id: rightData.id };
                            rightMenu();
                        } else {
                            $("#menu").hide();
                        }
                    });
                });
            }
        });
    }

    // 监听工具条进行修改、冻结|解冻、删除操作
    table.on('tool(showUsers)', function(obj) {
        // 获取对象的数据
        data = obj.data;
        //存储冻结标志（0 or 1）
        var lockValue = data.isLock;
        //0解锁1锁定
        lockValue = lockValue == 0 ? 1 : 0;
        //进行删除操作时，发送的是被点击的条目的id
        itemId = {
            id: data.id
        };
        // 冻结 or 解冻用户时需要发送的数据
        sendLockInfo = {
            isLock: lockValue,
            id: data.id
        };
        tableAction(obj.event);
    });
    //禁用浏览器鼠标右键菜单
    $(document).contextmenu(function() {
        return false;
    });
    // 对表格数据的操作
    function tableAction(value) {
        // 操作动作的值
        var action = value;
        //将右键菜单事件的值转换为toolbar点击事件的值，绑定同一事件。
        switch (action) {
            case 1:
                action = 'change';
                break;
            case 2:
                action = 'lock';
                break;
            case 3:
                action = 'del';
                break;
            case 4:
                action = 'changePwd';
                break;
        }
        //根据不同的操作进行数据通信
        switch (action) {
            case 'change':
                //给表格赋值
                form.val("formTest", {
                    'identity': data.identity,
                    'phone': data.phone,
                    'email': data.email,
                    // 'headImg': data.headImg,
                    'username': data.username
                });
                $("#pwd").css('display', 'none');
                $("#token").removeAttr('lay-verify');
                $("#token").removeAttr('name');
                layer.open({
                    type: 1, //层的类型为页面层
                    btnAlign: 'c', //按钮的位置居左
                    moveOut: false, //不允许借阅查询弹出层被拖动到该界面之外的地方
                    title: ['用户修改', 'font-size:18px'], //借阅查询弹出层的标题及样式
                    area: ['400px', '300px'], //借阅弹出层的大小
                    resize: false,
                    content: $('#editUser'), //绑定借阅弹出层的显示内容
                    //点击右上角的x时，取消并隐藏查询div
                    cancel: function(index, layero) {
                        $('#editUser').hide();
                        layer.close(index);
                    }
                });
                flag = $('.layui-layer-title').text();
                // $('#Userform')[0].reset();
                console.log(flag);
                break;
            case 'lock':
                $.ajax({
                    url: url + '/admin/authModule/authUser/lock',
                    type: 'post',
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(sendLockInfo),
                    success: function(data) {
                        layer.closeAll();
                        window.location.reload();
                    }
                });
                break;
            case 'del':
                layer.confirm('确定要删除该账号吗？', function() {
                    $.ajax({
                        url: url + "/admin/authModule/authUser/delete",
                        type: "post",
                        contentType: "application/json",
                        data: JSON.stringify(itemId),
                        //数据请求成功
                        success: function(data) {
                            // alert(data.msg);
                            layer.closeAll();
                            window.location.reload();
                        }
                    });
                });
                break;
            case 'changePwd':
                layer.open({
                    type: 1, //层的类型为页面层
                    btnAlign: 'c', //按钮的位置居左
                    moveOut: false, //不允许借阅查询弹出层被拖动到该界面之外的地方
                    title: ['用户修改', 'font-size:18px'], //借阅查询弹出层的标题及样式
                    area: ['370px', '210px'], //借阅弹出层的大小
                    resize: false,
                    content: $('#changePassword'), //绑定借阅弹出层的显示内容
                    btn: '确定',
                    btn1: function(index, layero) {
                        var oldPwd = $(layero).find("#oldPwd").val();
                        var newPwd = $(layero).find("#newPwd").val();
                        var pwdInfo = {
                            id: itemId.id,
                            oldPassword: oldPwd,
                            token: newPwd
                        };
                        console.log(JSON.stringify(pwdInfo));
                        layer.close(index);
                        $.ajax({
                            url: url + '/admin/authModule/authUser/updateToken',
                            type: 'post',
                            headers: { 'Content-Type': 'application/json' },
                            data: JSON.stringify(pwdInfo),
                            success: function(data) {
                                alert(data.msg);
                            }
                        });
                    },
                    //点击右上角的x时，取消并隐藏查询div
                    cancel: function(index, layero) {
                        $('#changePassword').hide();
                        layer.close(index);
                    }
                });

                $('#oldPwd').val("");
                $('#newPwd').val("");
        }
    }
    //表单提交事件:添加用户和修改用户
    form.on('submit(editUserForm)', function(data) {
        // 將填寫的表單信息轉換成JSON格式
        var formInfo;
        if (flag == '用户注册') {
            url2 = '/admin/authModule/authUser/add';
            formInfo = data.field;
        } else if (flag == '用户修改') {
            url2 = '/admin/authModule/authUser/update';
            data.field.id = itemId.id;
            formInfo = data.field;
            console.log(data.field);
        }
        console.log(url2);
        $.ajax({
            url: url + url2,
            type: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(formInfo),
            success: function(data) {
                alert(data.msg);
            }
        });
        layer.closeAll();
        //清空表單填寫的信息,在后边加[0]转换为js
        $('#Userform')[0].reset();
        // 阻止表单的默认提交
        return false;
    });
    // 右键菜单点击事件
    function rightMenu() {
        // 菜单选项被选中的事件
        $("li").click(function() {
            //1--->代表修改；2--->代表冻结|解冻；2--->删除；
            var liValue = $(this).val();
            tableAction(liValue);
            $("#menu").hide();
        });
    }

});