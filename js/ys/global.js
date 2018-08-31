//接口地址
let base = 'http://192.168.2.128:8081/';
let url = null;


//定义一些弹出面板
let index = null,
    shelfA = null;
let store_id = null,
    store_name = null,
    barcode;
let nodes = [];
let getCheckedData;  //获取table行数据函数
let fileData;  //存放获取到的table行数据信息
let station = null;  //存放档案物理位置信息
let tableData = null;  //鼠标右键点击行数据
let storeId = null;  //库房id
let excelData = null; //存放excel数据，方便导出
let excelUrl = null;  //存放导出所有查询到的excel数据的接口
//定义文档信息表头
let cols = [];
cols.push({field: 'xuhao', title: '序号', type: 'numbers', width: 80, fixed: 'left'},
    {type: 'checkbox'},
    {field: 'rdTypeName', title: '文档类型', width: 120},
    {field: 'arcName', title: '档案名称', width: 100},
    {field: 'fileNum', title: '档号', width: 120,
        templet: function (d) {
            let details = JSON.parse(d.details);
            if(details.档号 === undefined){
                details = JSON.parse(details);
                return details.档号
            }else {
                return details.档号;
            }
            // return details.档号;
        }
    },
    {
        field: 'docName', title: '题名', width: 120,
        templet: function (d) {
            let details = JSON.parse(d.details);
            if(details.题名 === undefined){
                details = JSON.parse(details);
                return details.题名
            }else {
                return details.题名;
            }
        }
    },
    {field: 'fkTemplateId', title: '模板编号', width: 180},
    {field: 'archivesNumber', title: '档案编号', width: 100},
    {field: 'duration', title: '保管期限', width: 100},
    {field: 'fkDictCodeSecurity', title: '密级'},
    {
        field: 'storeid', title: '库房ID', width: 120,
        templet: function (d) {
            return d.araeLocation.fkStoreId;

        }
    },
    {
        field: 'quNum', title: '区编号', width: 80,
        templet: function (d) {
            return d.araeLocation.rdRegionNum;
        }
    },
    {
        field: 'col', title: '列号',
        templet: function (d) {
            return d.araeLocation.col;
        }
    },
    {
        field: 'div', title: '节号',
        templet: function (d) {
            return d.araeLocation.div;
        }
    },
    {
        field: 'lay', title: '层号',
        templet: function (d) {
            return d.araeLocation.lay;
        }
    },
    {field: 'fkBoxId', title: '归属档案盒id', width: 200},
    {field: 'archivesBarcode', title: '档案条形码',width:120},
    {field: 'rfid', title: 'RFID', width: 200},
    {field: 'rdLocationAddr', title: '存放位置', width: 180},
    {field: 'createTime', title: '著录时间', width: 180},
    {
        field: 'status', title: '状态', width: 100,
        templet: function (d) {
            let status = '';
            if (d.status === 1) {
                status = '未上架';
                return status;
            } else if (d.status === 2) {
                status = '在架';
                return status;
            } else if (d.status === 3) {
                status = '在借';
                return status;
            }
        }
    },
    {field: 'detailsstr', title: '备注', width: 180},
    {field: 'right', title: '操作', width: 180, align: 'center', toolbar: '#toolbar', fixed: 'right'}
);

layui.use('table', function () {
    let table = layui.table,
        $ = layui.$;
    getCheckedData = function () {
        let checkStatus = table.checkStatus('table');
        fileData = checkStatus.data;

    };
});

//导出Excel文件
let downloadExcel = function (json,type) {
    let tmpDown;
    let keyMap = [];//获取key值
    for(let k in json[0]){
        keyMap.push(k);
    }
    let tmpdata = [];//用来保存转换好的json
    json.map((v,i) => keyMap.map((k,j) => Object.assign({},{
        v:v[k],
        position: (j > 25 ? getCharCol(j):String.fromCharCode(65 + j)) + (i + 1)
    }))).reduce((prev,next) => prev.concat(next)).forEach((v,j) => tmpdata[v.position] = {
        v:v.v
    });
    let outputPos = Object.keys(tmpdata);//设置区域
    let cols = [];
    for(let i = 0;i !== keyMap.length;++i){
        if(i<5){
            cols.push({wpx:80});
        }else{
            cols.push({wpx:160})
        }
        tmpdata[outputPos[i]].s = {font:{sz:14,bold:true}};

    }
    let tmpWB = {
        SheetNames: ['mySheet'], //保存的表标题
        Sheets: {
            'mySheet':Object.assign({'!cols':cols},
                tmpdata,//内容
                {
                    '!ref':outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
                }
            )
        }
    };
    tmpDown = new Blob([s2ab(XLSX.write(tmpWB,{
        bookType:(type == undefined ? 'xlsx' : type),
        bookSST : false,
        type: 'binary'
    } //这里的数据是用来定义导出的格式类型
    ))],{
        type:""
    }); //创建二进制对象写入转换好的字节流
    let href = URL.createObjectURL(tmpDown); //创建对象超链接
    document.getElementById("data").href = href; //绑定a标签
    document.getElementById("data").click(); //模拟点击事件
    URL.revokeObjectURL(tmpDown); //用URL.revokeObjectURL()来释放这个obeject URL
};
function s2ab(s) { //字符串转字符流
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for(let i = 0;i != s.length;++i){
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
}
// 将制定的自然数转换为26进制表示。映射关系:[0-25] -> [A-Z]。
function getCharCol(n) {
    let temCol = '',
        s='',
        m = '';
    while(n > 0){
        m = n%26 + 1;
        s = String.fromCharCode((m + 64) + s);
        n = (n - m) / 26;
    }
    return s;
}