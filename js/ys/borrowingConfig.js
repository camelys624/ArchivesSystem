
url = base + 'admin/areamodule/fileBorrow?map[status]=3';
let returnFilesUrl = base + 'admin/areamodule/fileBorrow/listBack',
    returnFileUrl = base + 'admin/areamodule/fileBorrow/grounding',
    delFileUrl = base + 'admin/areamodule/fileBorrow/delete?';

let borrowingCols = [
    {field: 'xuhao', title: '序号', type: 'numbers',width: 80,sort:true, fixed: 'left'},
    {type: 'checkbox'},
    {field: 'fkArchivesId ', title: '档案ID',width:120},
    {field: 'filetype', title: '文档类型',width:120},
    {field: 'fkTemplateId', title: '模板编号',width:180},
    {field: 'company', title: '公司',width:100},
    {field: 'userName', title: '借阅人',width:80},
    {field: 'depart', title: '借阅部门',width:100},
    {field: 'useIntention', title: '借阅目的',width:100},
    {field: 'userPhone', title: '手机号',width:120},
    {field: 'userTel', title: '电话',width:120},
    {field: 'userEmail', title: 'E-Mail',width:120},
    {field: 'createTime', title: '创建时间',width:180},
    {field: 'expreturnTime', title: '预计归还时间',width:180},
    {field: 'fkBoxId', title: '档案盒ID',width:180},
    {field: 'creater', title: '办理人',width:80},
    {field: 'filestatus', title: '状态',width:100},
    {field: 'borrowing_days', title: '借阅天数',width:200},
];