var table;
var typedata;
$(function() {
	var layer;
	layui.use(['layer', 'form', 'table'], function() {
		layer = layui.layer;
		var form = layui.form;
		table = layui.table;

		table.on('tool(template)', function(obj) {
			var data = obj.data;
			console.log(data)
			typedata = data;
			$("#archivaltype").val(data.tempName);
		});
		//监听提交-档案类型
		form.on('submit(addifysave)', function(data) {
			var urls, data;
			if (modid) {
				urls = url + '/admin/areamodule/fileArchivesType/update';
				data = {
					id: nowid,
					typeName: $("#filetypename").val(),
					//			parentId: fid,
					typeDesc: 0
				};
			} else {
				urls = url + '/admin/areamodule/fileArchivesType/add';
				data = {
					typeName: $("#filetypename").val(),
					parentId: nowid,
					typeDesc: 0
				};
			}
			postclick(urls, data);
		});
		//监听提交-档案库
		form.on('submit(saveselect)', function(data) {
			var urls, data;
			if (modid) {
				if (typedata) {
					modtypedata = typedata;
				}
				urls = url + '/admin/areamodule/fileArchivesTemplate/update';
				data = {
					id: nowid,
					templateName: $("#archivalname").val(),
					templateDefinition: modtypedata,
					fkTypeId: fid,
					templateDesc: modtypedata.id,
					disabled: 0
				};
			} else {
				urls = url + '/admin/areamodule/fileArchivesTemplate/add';
				data = {
					templateName: $("#archivalname").val(),
					templateDefinition: typedata,
					fkTypeId: nowid,
					templateDesc: typedata.id,
				};
			}
			postclick(urls, data);
		});
	})
	sidescroll(-1);
	sessionStorage.clear();

})

function iframedis() {
	var childWindow = document.getElementById('menuframe').contentWindow;
	var iframeheight = childWindow.document.documentElement.scrollHeight - 60;
	childWindow.childMethod(iframeheight);
}
var child, jsons = [];

function sidescroll(id) {
	var setting = {
		view: {
			addHoverDom: false,
			removeHoverDom: false,
			selectedMulti: false
		},
		data: {
			simpleData: {
				enable: true
			}
		},
		async: {
			enable: true,
		},
		callback: {
			onClick: zTreeOnClick, //单击事件
			onRightClick: zTreeOnRightClick, //右键事件
		}
	};
	childclick(id)
	$(document).ready(function() {
		$.fn.zTree.init($("#treeDemo"), setting, child);
	});
}

function childclick(id) {
	$.ajax({
		type: 'get',
		url: url + '/admin/areamodule/fileArchivesType/selectMenu',
		async: false,
		data: {
			id: id,
			disabled: 0
		},
		cache: false,
		dataType: 'json',
		success: function(res) {
			//			console.log(res)
			jsons = [];
			if (res.list.length != 0) {
				for (var i = 0; i < res.list.length; i++) {
					jsons[i] = {
						name: res.list[i].name,
						id: res.list[i].id,
						type: res.list[i].type,
						desc: res.list[i].desc
					}
				}
				child = jsons;
			} else {
				child = "";
			}
		}
	});
}
var modalname;
var modtypedata;

function modalclick(fkTypeId) {
	$.ajax({
		type: 'get',
		url: url + '/admin/areaModule/FileArchivesTemplate?map[id]=' + fkTypeId,
		async: false,
		cache: false,
		dataType: 'json',
		success: function(res) {
			if (res.code == 1) {
				modalname = res.rows[0].templateName;
				modtypedata = JSON.parse(res.rows[0].templateDefinition);
				sessionStorage.setItem('temp', JSON.stringify(res.rows[0]));
			} else {
				layer.msg(res.error)
			}

		}
	});
}
//单击事件
function zTreeOnClick(event, treeId, treeNode) {
	childclick(treeNode.id);
	if (treeNode.type == 1) {
		//		console.log(event);
		//		console.log(treeId);
		//		console.log(treeNode);
		modalclick(treeNode.id);
		nowid = treeNode.id;
		fname = treeNode.name;
		var frm = document.getElementById('menuframe');
		frm.src = "lyr-createtem.html";
		$(frm).load(function() { //  等iframe加载完毕  
			iframedis();
		});
		return false;
	} else {
		var treeObj = $.fn.zTree.getZTreeObj(treeId);
		var nodes = treeObj.getSelectedNodes();
		if (nodes && nodes.length > 0) {
			treeObj.removeChildNodes(nodes[0]);
		}
		newNodes = treeObj.addNodes(treeNode, child);
	}
}
//右键事件
var forRight, fid, nowid, fname, ftype,fNode;

function zTreeOnRightClick(event, treeId, treeNode) {
	//	console.log(treeNode)
	if (forRight != null) {
		forRight.style.display = "none";
	}
	if (treeNode == null) {
		fid = 0;
		//获取我们自定义的右键菜单
		forRight = document.getElementById("right-one");
	} else {
		fNode=treeNode;
		nowid = treeNode.id;
		fid = treeNode.pId;
		fname = treeNode.name;
		ftype = treeNode.type;
		if (ftype != 0) {
			modalclick(nowid);
			forRight = document.getElementById("right-last");
		} else if (ftype == "0") {
			forRight = document.getElementById("right-menu");
		}
	}
	//显示菜单
	forRight.style.display = "block";
	var event = event || window.event;
	ele = event.srcElement || event.target;
	//根据事件对象中鼠标点击的位置，进行定位
	forRight.style.left = event.clientX + 'px';
	forRight.style.top = event.clientY + 'px';
	forRight.style.width = 80 + 'px';
	sessionStorage.setItem('tree', JSON.stringify(treeNode));
	return false;
}
//关闭右键菜单
window.onclick = function(e) {
	$(".right-menu").css("display", "none");
}

var modid = "";
//档案类型
function addify(value) {
	layer.open({
		type: 1,
		title: '档案类型',
		btn: false,
		shade: 0, //不显示遮罩
		content: $('#filetype'),
		success: function(layero, index) {
			if (value) {
				modid = nowid;
				$("#filetypename").val(fname);
			}
		},
		cancel: function(index, layero) {
			cance();
		}
	});
}
//禁用
function deletify(value) {
	var data = {
		id: nowid,
		disabled: 1
	};
	var urls;
	if (value) {
		urls = url + '/admin/areamodule/fileArchivesTemplate/disabled';
	} else {
		urls = url + '/admin/areamodule/fileArchivesType/disabled';
	}

	postclick(urls, data);
}
//档案库
function addfy(value) {
	layer.open({
		type: 1,
		title: '档案库',
		btn: false,
		area: ['460px', '605px'],
		shade: 0, //不显示遮罩
		content: $('#archival'),
		success: function(index, layero) {
			if (value) {
				modid = nowid;
				$("#archivalname").val(fname);
				$("#archivaltype").val(modtypedata.tempName);
			}
			$.ajax({
				type: 'get',
				url: url + '/admin/areamodule/fileTemplate/select',
				dataType: 'json',
				success: function(res) {
					table.render({
						elem: '#LAY_table_template',
						data: res.rows,
						height: 'full-505',
						limit: 7,
						page: true,
						cols: [
							[{
								field: 'tempName',
								title: '模版名称',
								event: 'setSign'
							}, {
								field: '',
								title: '模版属性',
								event: 'setSign'
							}, {
								field: '',
								title: '模版类型',
								event: 'setSign'
							}]
						],
						done: function(res, curr, count) {
							$('.layui-laypage-limits').css('display', 'none');
						}
					});
				}
			});
		},
		cancel: function(index, layero) {
			layer.close(index)
			$("#archival").css("display", "none");
		}
	});
}

function postclick(urls, data) {
	$.ajax({
		contentType: 'application/json;charset=utf-8',
		url: urls,
		type: 'post',
		data: JSON.stringify(data),
		success: function(data) {
			layer.msg(data.msg);
			if (data.code == "0") {
				cance();
//				var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
//var newNode = {name:$("#filetypename").val()};
//newNode = treeObj.addNodes(fNode, newNode);
				window.location.reload();
				return true;
			} else {
				return false;
			}
		}
	});
}

function cance() {
	layer.closeAll();
	$("#filetype").css("display", "none");
	$("#archival").css("display", "none");
}