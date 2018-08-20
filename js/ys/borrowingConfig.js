
url = base + 'admin/areamodule/fileBorrow';
let returnFilesUrl = base + 'admin/areamodule/fileBorrow/listBack',
    returnFileUrl = base + 'admin/areamodule/fileBorrow/grounding',
    delFileUrl = base + 'admin/areamodule/fileBorrow/delete?';

let borrowingCols = [
    {field: 'xuhao', title: '序号', type: 'numbers', fixed: 'left'},
    {type: 'checkbox'},
    {field: 'fkArchivesId ', title: '档案ID'},
    {field: 'filetype', title: '文档类型'},
    {field: 'fkTemplateId', title: '模板编号'},
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
    {field: 'right', title: '操作', align: 'center', toolbar: '#toolbar', fixed: 'right'}
];
