//添加模版弹出框
function create(modeldata) {
	layer.open({
		title: '添加',
		type: 2,
		area: ['1000px', '700px'],
		fixed: false, //不固定
		maxmin: true,
		content: 'lyr-createtem.html',
		success: function(layero, index) {
			if (modeldata) {
				console.log(modeldata)
				var body = layer.getChildFrame('body', index);
				var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
				body.contents().find("#atName").val(modeldata.tempName);
//				body.contents().find("#type").val(modeldata.atAttrid);
//				body.contents().find("#mark").val(modeldata.atRemark);
				sessionStorage.setItem('temp', JSON.stringify(modeldata));
			}else{
				sessionStorage.clear();
			}
		}
	});
}
//查询模版ajax
function templatequery() {
	$.ajax({
		type: 'get',
		url: url + '/admin/areamodule/fileTemplate/select?pageSize=10000',
		dataType: 'json',
		success: function(res) {
			table.render({
				elem: '#LAY_table_template',
				data: res.rows,
				height: 'full-45',
				limit:20,
				page: true,
				cols: [
					[ {
						field: '',
						title: '操作',
						width: 200,
						align: 'center',
						toolbar: '#barDemo'
					}, {
						field: 'id',
						title: '序号'
					}, {
						field: 'tempName',
						title: '模版名称'
					}, {
						field: 'tempContent',
						title: '模版内容',
						style:'display:none;'
					}, {
						field: '',
						title: '模版属性'
					}, {
						field: '',
						title: '模版类型'
					}, {
						field: '',
						title: '备注'
					}]
				]
			});
			$('table tr').find('th:eq(3),td:eq(3)').hide();
		}
	});
}
var table;
$(function() {
	layui.use(['element', 'layer', 'table'], function() {
		var element = layui.element;
		var layer = layui.layer;
		table = layui.table;
		templatequery();

		//监听工具条
		table.on('tool(template)', function(obj) {
			if (obj.event === 'del') {
				layer.confirm('真的删除行么', function(index) {
					
					var data={
							id: obj.data.id
					};
					$.ajax({
						contentType: 'application/json;charset=utf-8',
						url: url + '/admin/areamodule/fileTemplate/delete',
						type: 'post',
						data: JSON.stringify(data),
						success: function(data) {
							if (data.code == 0) {
								obj.del();
								layer.close(index);
								layer.msg(data.msg, {
									icon: 6
								});
								return true;
							} else {
								layer.msg(data.msg, {
									icon: 5
								});
								return false;
							}
						}

					});
				});
			} else if (obj.event === 'edit') {
				create(obj.data);
			}
		});
	});
})

//function postclick(urls, data) {
//	$.ajax({
//		contentType: 'application/json;charset=utf-8',
//		url: urls,
//		type: 'post',
//		data: JSON.stringify(data),
//		success: function(data) {
//			layer.msg(data.msg);
//			if (data.code == "0") {
//				cance();
//				window.location.reload();
//				return true;
//			} else {
//				return false;
//			}
//		}
//	});
//}