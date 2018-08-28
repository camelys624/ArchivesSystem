var form, table;
$(function() {
	layui.use(['form', 'layer', 'laydate', 'table'], function() {
		form = layui.form;
		var layer = layui.layer;
		table = layui.table;
		var userJsontemp = sessionStorage.getItem('temp');
		//		console.log(userJsontemp)
		var tempEntity;
		if (userJsontemp != null) {
			//重新转换为对象
			tempEntity = JSON.parse(userJsontemp);
			var tempcontent;
			if (tempEntity.tempContent) {
				tempcontent = JSON.parse(tempEntity.tempContent);
			} else {
				tempcontent = JSON.parse(tempEntity.templateDefinition).tempContent;
			}

			for (var i = 0; i < tempcontent.length; i++) {
				var jsondata = new Object();
				if (tempcontent[i].ATI_TypeId == 2) {
					jsondata.selectname = tempcontent[i].ATI_Name;
					jsondata.selecttype = tempcontent[i].ATI_ID;
				} else if (tempcontent[i].ATI_TypeId == 1) {
					jsondata.labelname = tempcontent[i].ATI_Name;
				} else if (tempcontent[i].ATI_TypeId == 3) {
					jsondata.datename = tempcontent[i].ATI_Name;
				}
				creatediv(jsondata, tempcontent[i], i);
			}
		} else {
			var tempContent = [];
			tempContent[0] = {
				ATI_TypeId: 1,
				ATI_Name: "题名",
				ATI_Height: "38px",
				ATI_Width: "200px",
				ATI_X: "0px",
				ATI_Y: "0px",
				ATI_ID: "",
			};
			tempContent[1] = {
				ATI_TypeId: 1,
				ATI_Name: "档号",
				ATI_Height: "38px",
				ATI_Width: "200px",
				ATI_X: "220px",
				ATI_Y: "0px",
				ATI_ID: "",
			}
			for (var i = 0; i < tempContent.length; i++) {
				var jsondata = new Object();
				jsondata.labelname = tempContent[i].ATI_Name;
				creatediv(jsondata, tempContent[i], i);
			}
		}
		//下拉框-下拉框改变
		form.on('select(changeoption)', function(data) {
			id = data.value;
			selecttable(id);
		});
		//监听提交
		form.on('submit(formDemo)', function(data) {
			creatediv(data.field);
			layer.closeAll();
			return false;
		});
		form.on('submit(save)', function(data) {
			var fromcontent = $(".drag");
			var fromjson = new Object();
			fromjson.tempName = data.field.atName;

			var fromarr = [];
			for (var i = 0; i < fromcontent.length; i++) {
				if (fromcontent[i].attributes[4].textContent == 2) {
					var jsona = fromcontent[i].attributes[1].textContent.split(",")[0];
					var selectdata = fromcontent[i].attributes[1].textContent.split(",")[1];
				} else {
					var jsona = fromcontent[i].attributes[1].textContent;
					var selectdata = "";
				}
				fromarr[i] = {
					ATI_TypeId: fromcontent[i].attributes[4].textContent,
					ATI_Name: jsona,
					ATI_Height: fromcontent[i].children[1].children[0].style.height,
					ATI_Width: fromcontent[i].children[1].children[0].style.width,
					ATI_X: fromcontent[i].style.left,
					ATI_Y: fromcontent[i].style.top,
					ATI_ID: selectdata,
					//					ATI_MaxLength:,ATI_DataTypeID:,ATI_SignID:,ATI_IsNull:,ATI_Scale:,ATI_Format:,
				}
			}
			fromjson.tempContentstr = fromarr;
			if (userJsontemp != null) {
				fromjson.id = tempEntity.id;
				var urls = url + '/admin/areamodule/fileTemplate/update';
				postclick(urls, fromjson);
			} else {
				var urls = url + '/admin/areamodule/fileTemplate/add';
				postclick(urls, fromjson);
			}
		});
	});
})

function selecttable(id, optiondiv) {
	$.ajax({
		type: 'get',
		url: url + '/admin/basicsModule/sysDictCode/selectByParentId?parentId=' + id,
		dataType: 'json',
		success: function(res) {
			if (optiondiv) {
				$("." + optiondiv).html('')
				for (var t = 0; t < res.length; t++) {
					$("." + optiondiv).append("<option value='" + res[t].id + "'>" + res[t].svalue + "</option>");
				}
				form.render();
			} else {
				table.render({
					elem: '#lay_table_user',
					data: res,
					height: '300px',
					cols: [
						[{
							field: 'svalue',
							title: '名称'
						}]
					]
				});
			}
		}
	});
}
//弹出框
function appendText(type, layertype) {
	layer.open({
		title: '属性值',
		type: 1,
		content: $('#layer' + type),
		success: function(layero, index) {
			if (layertype) {
				var data;
				if (type == 1) {
					type = "label";
					data = $('#' + modid).attr("jsondata");
					$("#labelname").val(data);
				} else if (type == 2) {
					type = "select";
					$.ajax({
						type: 'get',
						url: url + '/admin/basicsModule/sysDictCode/selectByParentId?parentId=0',
						dataType: 'json',
						success: function(res) {
							$("#selecttype").html('');
							for (var i = 0; i < res.length; i++) {
								$("#selecttype").append("<option value='" + res[i].id + "'>" + res[i].svalue + "</option>");
							}
							selecttable(res[0].id)
							form.render();
						}
					});
				} else if (type == 3) {
					type = "date";
					$("#datename").val("caption");
				}
				//				if(type==2){
				//					data = JSON.parse($('#' + modid).attr("jsondata"));
				//					$("#labelname").val(data.labelname);
				//				}				

			} else {
				modid = "";
				if (type == "label") {
					$("#labelname").val("caption");
				} else if (type == "select") {
					$.ajax({
						type: 'get',
						url: url + '/admin/basicsModule/sysDictCode/selectByParentId?parentId=0',
						dataType: 'json',
						success: function(res) {
							$("#selecttype").html('');
							for (var i = 0; i < res.length; i++) {
								$("#selecttype").append("<option value='" + res[i].id + "'>" + res[i].svalue + "</option>");
							}
							selecttable(res[0].id)
							form.render();
						}
					});
				} else if (type == "date") {
					$("#datename").val("caption");
				}
			}
			return true;
			form.render();

		}
	});

}
//创建div
function creatediv(data, jsontype, jsoni) {
	var valueArr = [];
	for (var key in data) {
		valueArr.push(data[key]);
	}
	if (modid) {
		$("#" + modid).attr('jsondata', valueArr);
		$(".label" + modid).html(data.labelname + "：");
		if (data.selecttype != null) {
			selecttable(data.selecttype, 'option' + modid);
		}
	} else {
		var cmain = document.getElementById("fromcontent");
		var cdiv = document.createElement("div");
		var clabel = document.createElement("label");
		var divinput = document.createElement("div");
		if (data.selectname) {
			var cinput = document.createElement("select"); //建立标签
		} else {
			var cinput = document.createElement("input");
		}
		cdiv.setAttribute('class', 'layui-inline drag');
		cdiv.setAttribute('jsondata', valueArr);

		if (jsontype) {
			cdiv.id = 'div' + jsoni;
			clabel.setAttribute('class', 'layui-form-lable labeldiv' + jsoni);
			clabel.id = 'div' + jsoni;
			divinput.id = 'div' + jsoni;
			cinput.id = 'div' + jsoni;
		} else {
			for (var i = 0; i < $(".drag").length + 1; i++) {
				cdiv.id = 'div' + i;
				clabel.setAttribute('class', 'layui-form-lable labeldiv' + i);
				clabel.id = 'div' + i;
				divinput.id = 'div' + i;
				cinput.id = 'div' + i;
			}
		}
		cdiv.setAttribute('oncontextmenu', 'contextmenu()'); //div右击事件
		divinput.setAttribute('class', 'layui-input-inline');
		//		clabel.style="margin-top:7px";
		divinput.style = "position:absolute"; //;margin-top:-7px
		cinput.style = "width:200px";
		//		if (data.labelname) {
		//			cdiv.setAttribute('textstyle', '1');
		//			clabel.innerHTML = data.labelname + "："; // 通过 DOM 来创建文本
		//			cinput.setAttribute('class', 'layui-input resizable');
		//		} else if (data.selectname) {
		//			cdiv.setAttribute('textstyle', '2');
		//			clabel.innerHTML = data.selectname + "："; // 通过 DOM 来创建文本
		//			cinput.setAttribute('class', 'layui-input layui-unselect  optiondiv' + i);
		//			selecttable(data.selecttype, 'optiondiv' + i);
		//		} else if (data.datename) {
		//			cdiv.setAttribute('textstyle', '3');
		//			clabel.innerHTML = data.datename + "："; // 通过 DOM 来创建文本
		//			cinput.setAttribute('class', 'layui-input  datediv' + i);
		//		}
		cmain.appendChild(cdiv);
		cdiv.appendChild(clabel);
		cdiv.appendChild(divinput);
		divinput.appendChild(cinput);
		if (jsontype) {
			cdiv.style = "left:" + jsontype.ATI_X + ";top:" + jsontype.ATI_Y + "";
			cinput.style = "width:" + jsontype.ATI_Width + ";height:" + jsontype.ATI_Height + "";
		}
		if (data.labelname) {
			cdiv.setAttribute('textstyle', '1');
			clabel.innerHTML = data.labelname + "："; // 通过 DOM 来创建文本
			cinput.setAttribute('class', 'layui-input resizable');
			$(".resizable").resizable({
				containment: "#fromcontent",
				handles: "se"
			});
		} else if (data.selectname) {
			cdiv.setAttribute('textstyle', '2');
			clabel.innerHTML = data.selectname + "："; // 通过 DOM 来创建文本
			cinput.setAttribute('class', 'layui-input layui-unselect  optiondiv' + i);
			selecttable(data.selecttype, 'optiondiv' + i);
			$(".optiondiv" + i).resizable({
				containment: "#fromcontent",
				handles: "e"
			});
		} else if (data.datename) {
			cdiv.setAttribute('textstyle', '3');
			clabel.innerHTML = data.datename + "："; // 通过 DOM 来创建文本
			cinput.setAttribute('class', 'layui-input  datediv' + i);
			var laydate = layui.laydate;
			laydate.render({
				elem: '.datediv' + i
			});
			$(".datediv" + i).resizable({
				containment: "#fromcontent",
				handles: "e"
			});
		}
		$(".drag").draggable({
			containment: '#fromcontent',
			scroll: false
		});
	}
}
//右击事件
var eventdata;
document.oncontextmenu = function() {
	return false;
}

function contextmenu(event) {
	var event = event || window.event;
	eventdata = event.srcElement || event.target;
	if (eventdata.id == "div0") {
		layer.msg("题名不能修改删除！")
	} else if (eventdata.id == "div1") {
		layer.msg("档号不能修改删除！")
	} else {
		//获取我们自定义的右键菜单
		var forRight = document.getElementById("right-menu");
		//显示菜单
		forRight.style.display = "block";
		//根据事件对象中鼠标点击的位置，进行定位
		forRight.style.left = event.clientX + 'px';
		forRight.style.top = event.clientY + 'px';
		forRight.style.width = 60 + 'px';
	}
	return false;
}
//关闭右键菜单，很简单
window.onclick = function(e) {
		$("#right-menu").css("display", "none");
	}
	//div修改删除
var modid;

function modify() {
	$("#right-menu").css("display", "none");
	modid = eventdata.id;
	var textstyle = $('#' + modid).attr("textstyle");
	appendText(textstyle, "modify");
}

function delet() {
	var del = eventdata.id;
	$("#" + del).remove();
}
//档案库编辑
function childMethod(iframeheight) {
	$("#editform").css("display", "none");
	$("#fromcontent").css("height", iframeheight + "px");
}

function postclick(urls, data) {
	$.ajax({
		contentType: 'application/json;charset=utf-8',
		url: urls,
		type: 'post',
		data: JSON.stringify(data),
		success: function(data) {
			console.log(data);
			layer.msg(data.msg);
			if (data.code == "0") {
				window.close();
				window.parent.location.reload();
				return true;
			} else {
				return false;
			}
		}
	});
}

function cance() {
	layer.closeAll();
	$("#layerlabel").css("display", "none");
	$("#layerselect").css("display", "none");
	$("#layerdate").css("display", "none");
}