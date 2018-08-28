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
			} else {
				sessionStorage.clear();
			}
		}
	});
}
//查询模版ajax
function templatequery() {
	table.render({
		url: url + '/admin/areamodule/fileTemplate',
		elem: '#LAY_table_template',
		height: 'full-38',
		limit: 19,
		request: {
			pageName: 'currentPage', //页码的参数名称，默认：page
			limitName: 'pageSize' //每页数据量的参数名，默认：limit
		},
		response: {
			statusName: 'code', //数据状态的字段名称，默认：code
			statusCode: 1, //成功的状态码，默认：0
			msgName: 'msg', //状态信息的字段名称，默认：msg
			countName: 'total', //数据总数的字段名称，默认：count
			dataName: 'rows' //数据列表的字段名称，默认：data
		},
		page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
			layout: ['count', 'first', 'prev', 'page', 'next', 'last', 'skip'], //自定义分页布局
			groups: 1 //只显示 1 个连续页码
		},
		cols: [
			[{
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
				style: 'display:none;'
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
		],
		done: function(res, curr, count) {
			//			var data = res.data;
			$('.layui-table-body tr').each(function(i) {
				var index = $(this).attr('data-index');
//				console.info(index);
				//console.info(res[index]);
				$(this).dblclick(function() { //双击事件
					create(res.rows[index]);
				});
				$(this).contextmenu(function(event) {
					console.log(res.rows[index]);
					layer.open({
						type: 1,
						title: false,
						area: ['100px', '50px'],
						shadeClose: true,
						closeBtn: 0,
						content: $('#myContextMenu'), //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
						offset: [event.clientY, event.clientX],
						success: function(layero, indexs) {
							$("#modMenu").click(function() {
								layer.close(indexs);
                                 create(res.rows[index]);
                                 return true;
							});
							$("#deleteMenu").click(function() {
								layer.close(indexs);
								var data = {
									id: res.rows[index].id
								};
								var urls = url + '/admin/areamodule/fileTemplate/delete';
								deleteclick(urls, data);
								return true;
							})
						}
					});

				});
			})
		}
	});
	$('table tr').find('th:eq(3),td:eq(3)').hide();
}
var table;
$(function() {
	layui.use(['element', 'layer', 'table', 'laypage'], function() {
		var element = layui.element;
		var layer = layui.layer;
		table = layui.table;
		var laypage = layui.laypage
		templatequery();
		document.getElementById("tableul").oncontextmenu = function(e) {　　
			return false;
		};

		//监听工具条
		table.on('tool(template)', function(obj) {
			if (obj.event === 'del') {
				layer.confirm('真的删除行么', function(index) {
					var data = {
						id: obj.data.id
					};
					var urls = url + '/admin/areamodule/fileTemplate/delete';
					deleteclick(urls, data, obj);
					return true;
				});
			} else if (obj.event === 'edit') {
				create(obj.data);
				return true;
			}
		});
	});
})

function deleteclick(urls, data, obj) {
	$.ajax({
		contentType: 'application/json;charset=utf-8',
		url: urls,
		type: 'post',
		data: JSON.stringify(data),
		success: function(data) {
			if (data.code == 0) {
//				if(obj){
//					obj.del();
//				}else{
					window.location.reload();
//				}
				layer.close();
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
}