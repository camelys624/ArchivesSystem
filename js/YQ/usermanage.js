var url = 'http://192.168.2.128:8081';
var tableHead = [
    [
        //表头
        { field: 'tourPlayerId', title: 'ID', width: 80, align: 'center', type: 'numbers' },
        { field: 'username', title: '登录名', align: 'center', width: 163 },
        { field: 'position', title: '职位', align: 'center', width: 150 },
        { field: 'visitTime', title: '记录时间', align: 'center', width: 200 },
        { field: 'isLock', title: '是否冻结', align: 'center', width: 200 },
        { field: 'right', title: '操作', width: 200, align: 'center', toolbar: '#barDemo', style: 'cursor: pointer;' }
    ]
];
layui.use(['table', 'layer', 'laypage', 'form'], function() {

    var table = layui.table;
    var laypage = layui.laypage;
    var layer = layui.layer;
    var form = layui.form;
      form.verify({
                loginname: [/(.+){6,16}$/, '账号必须6到16位']
            });
    
    // $(function() {
        var setting = {
            view: {
                showLine: true, //设置是否显示节点与节点之间的连线
                showTitle: true, //设置是否显示节点的title提示信息
            },
            data: {
                simpleData: {
                    enable: true, //设置是否启用简单数据格式
                    idKey: "id", //设置启用简单数据格式时id对应的属性名称
                    pidKey: "pId" //设置启用简单数据格式时parentId对应的属性名称
                }
            },
            callback: {
                onClick: onclick, //回调函数，点击事件
            }
        };
        var zNodes = [
            { id: 1, pId: 0, name: "用户管理" }, //节点1
            { id: 2, pId: 0, name: "权限模板" } //节点2
        ];
        //初始化树
        var zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
        // 节点点击事件
        function onclick(event, treeId, treeNode) {
            //被选择的节点
            var selectedNode = zTreeObj.getSelectedNodes(true)[0];
            //节点id值
            var nodeId = selectedNode.id;
            // 点击用户管理（1）和权限模板（2）
            if (nodeId == 1) {
                onLoadTable();
                $("#userManagement").css("display", "block");
                $("#accessTemplate").css("display", "none");
            } else {
                $("#accessTemplate").css("display", "block");
                $("#userManagement").css("display", "none");
            }
        }
    // });
    // 添加用户按钮的点击事件
    $("#addUser").on("click", function() {
        layer.open({
            type: 1, //层的类型为页面层
            btnAlign: 'c', //按钮的位置居左
            moveOut: false, //不允许借阅查询弹出层被拖动到该界面之外的地方
            title: ['用户注册', 'font-size:18px'], //借阅查询弹出层的标题及样式
            area: ['550px', '380px'], //借阅弹出层的大小
            content: $('#editUser'), //绑定借阅弹出层的显示内容
            //点击右上角的x时，取消并隐藏查询div
            cancel: function(index, layero) {
                $('#editUser').hide();
                layer.close(index);
            }
        });

    });
  
    //监听提交
    form.on('submit(editUserForm)', function(data) {
        // 將填寫的表單信息轉換成JSON格式
        var registerInfo = JSON.stringify(data.field);
        console.log(registerInfo);
        $.ajax({
            url: url + '/admin/authModule/authUser/add',
            type: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: registerInfo,
            success: function(data) {
                layer.msg(data.msg);
            }
        });
        layer.closeAll();
        //清空表單填寫的信息
        $('#Userform')[0].reset();
        // 阻止表单的默认提交
        return false;
    });
    // 监听工具条
    table.on('tool(showUsers)', function(obj) {
        // 进行编辑、冻结、删除操作时，发送的内容存储在以下变量中
        var sendChangeInfo, sendLockInfo, itemId;
        // 获取对象的数据
        var data = obj.data;
        // console.log(obj);
        //存储冻结标志（0 or 1）
        var lockValue = data.isLock;
        //0解锁1锁定
        lockValue = lockValue == '未冻结' ? 1 : 0;
        //修改用户时发送的数据
        sendChangeInfo = {
            identity: data.identity,
            token: data.token,
            phone: data.phone,
            email: data.email,
            headImg: data.headImg,
            username: data.username
        };

        // 冻结 or 解冻用户时需要发送的数据
        sendLockInfo = {
            isLock: lockValue,
            id: data.id
        };
        //进行删除操作时，发送的是被点击的条目的id
        itemId = {
            id: data.id
        };
        //根据不同的操作进行数据通信
        switch (obj.event) {
            case 'change':
                //  $.ajax({
                //     url: url + '/admin/authModule/authUser/getLoginUserinfo',
                //     type: 'post',
                //     dataType: "json",
                //     headers: { 'authorization': '' },
                //     // data: JSON.stringify(sendChangeInfo),
                //     success: function(data) {
                //         console.log(data);
                //     }
                // });
                form.val("formTest",{
                   'identity': data.identity,
                    'token': data.token,
                    'phone': data.phone,
                    'email': data.email,
                    'headImg': data.headImg,
                    'username': data.username
                });
                // // form.val("formTest",JSON.stringify(sendChangeInfo));
                // layer.open({
                //     type: 1, //层的类型为页面层
                //     btnAlign: 'c', //按钮的位置居左
                //     moveOut: false, //不允许借阅查询弹出层被拖动到该界面之外的地方
                //     title: ['用户编辑', 'font-size:18px'], //借阅查询弹出层的标题及样式
                //     area: ['550px', '380px'], //借阅弹出层的大小
                //     content: $('#editUser'), //绑定借阅弹出层的显示内容
                //     //点击右上角的x时，取消并隐藏查询div
                //     cancel: function(index, layero) {
                //         $('#editUser').hide();
                //         layer.close(index);
                //     }
                // });
                // $.ajax({
                //     url: url + '/admin/authModule/authUser/update',
                //     type: 'post',
                //     dataType: "json",
                //     contentType: "application/json",
                //     data: JSON.stringify(sendChangeInfo),
                //     success: function(data) {
                //         onLoadTable();
                //         layer.closeAll();
                //     }
                // });
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
                        onLoadTable();

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
                            alert(data.msg);
                            layer.closeAll();
                            onLoadTable();
                        }
                    });
                });
                break;
        }
    });
    //加载表格
    function onLoadTable() {
        $.ajax({
            url: url + "/admin/authModule/authUser",
            type: "get",
            headers: { 'authorization': '' },
            success: function(data) {
                // 存储冻结或未冻结的标志0与1
                var isLockList = {};
                // 通过遍历将0和1分别转换为汉字“未冻结”和“已冻结”显示
                for (var i = 0; i < data.rows.length; i++) {
                    //0 or 1
                    isLockList[i] = data.rows[i].isLock;
                    //0---->“未冻结”;1---->“已冻结”
                    isLockList[i] = isLockList[i] ? '已冻结' : '未冻结';
                    //再将汉字赋回去
                    data.rows[i].isLock = isLockList[i];
                }
                //获取需要渲染到表格中的数据
                var dataList = data.rows;
                console.log(dataList);
                table.render({
                    elem: '#userInfo', //渲染该id的表格
                    height: 700, //高度
                    page: true, //开启分页
                    cols: tableHead, //表头
                    data: dataList, //表格中的数据
                });
            }
        });
    }
     
});