  layui.use('form', function() {
        var form = layui.form;
        // 自定义验证规则
        //value：表单的值、item：表单的DOM对象
        form.verify({
            username: function(value, item) {
                if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                    return '用户名不能有特殊字符';
                }
                if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                    return '用户名首尾不能出现下划线\'_\'';
                }
                // if (!/^[\S]{6,12}$/.test(value)) {
                // }
                //     return '用户名必须6到12位，且不能出现空格';
                // if (/^\d+\d+\d$/.test(value)) {
                //     return '用户名不能全为数字';
                // }
            },
            //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
            password: function(value, item) {
                if (!/^[\S]{6,12}$/.test(value)) {
                    return '密码必须6到12位，且不能出现空格';
                }
                // if (/^\d+\d+\d$/.test(value)) {
                //     return '密码不能全为数字';
                // }
            }
        });
        //监听提交
        layui.use('form', function() {
            var form = layui.form;
            //监听提交
            form.on('submit(formDemo)', function(data) {
                // alert("登录成功");
                var userInfo = JSON.stringify(data.field);
                alert(userInfo);
                $.ajax({
                    url: 'http://192.168.2.128:8081/admin/authModule/authUser/login',
                    headers: { 'Content-Type': 'application/json' },
                    type: 'post',
                    data: userInfo,
                    success: function(data) {
                        data.msg=='操作成功'?window.location.href="index.html":alert("用户名或密码有误，请重新输入！");
                    }
                });
                return false;
            });
        });
    });