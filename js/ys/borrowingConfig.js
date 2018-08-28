
url = base + 'admin/areamodule/fileBorrow';
let returnFilesUrl = base + 'admin/areamodule/fileBorrow/listBack',
    returnFileUrl = base + 'admin/areamodule/fileBorrow/grounding',
    delFileUrl = base + 'admin/areamodule/fileBorrow/delete?';

let borrowingCols = [
    {field: 'xuhao', title: '序号', type: 'numbers',width: 80,sort:true, fixed: 'left'},
    {type: 'checkbox'},
    {field: 'fkArchivesId ', title: '档案ID',width:120},
    {field: 'filetype', title: '文档类型',width:120},
    {field: 'fkTemplateId', title: '模板编号',width:180},
    {field: 'company', title: '公司'},
    {field: 'userName', title: '借阅人'},
    {field: 'depart', title: '借阅部门'},
    {field: 'useIntention', title: '借阅目的'},
    {field: 'userPhone', title: '手机号'},
    {field: 'userTel', title: '电话'},
    {field: 'userEmail', title: 'E-Mail'},
    {field: 'createTime', title: '创建时间'},
    {field: 'expreturnTime', title: '预计归还时间'},
    {field: 'status', title: '状态'},
    {field: 'fkBoxId', title: '档案盒ID'},
    {field: 'creater', title: '办理人'},
    {field: 'filestatus', title: '状态(中文标识)'},
    {field: 'borrowing_days', title: '借阅天数'},
];
let testCOls = [
    {field: 'id', title: 'ID', width:80, sort: true, fixed: 'left'}
    ,{field: 'username', title: '用户名', width:80}
    ,{field: 'sex', title: '性别', width:80, sort: true}
    ,{field: 'city', title: '城市', width:80}
    ,{field: 'sign', title: '签名', width: 177}
    ,{field: 'experience', title: '积分', width: 80, sort: true}
    ,{field: 'score', title: '评分', width: 80, sort: true}
    ,{field: 'classify', title: '职业', width: 80}
    ,{field: 'wealth', title: '财富', width: 135, sort: true}
];
