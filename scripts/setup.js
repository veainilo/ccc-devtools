/*
 * @Author: joshua joshua@forevernine.com
 * @Date: 2023-05-17 09:21:06
 * @LastEditors: joshua joshua@forevernine.com
 * @LastEditTime: 2023-05-22 09:36:29
 * @FilePath: \ccc-devtools\scripts\setup.js
 * @Description: 有问题找joshua
 */
const fse = require('fs-extra');
const path = require('path');

const localTemplatePath = path.join(__dirname, '../release/');
const projectTemplatePath = 'C:\\work\\client';

if (!fse.existsSync(projectTemplatePath)) {
    console.error('project path not exist');
    return;
}
fse.copy(localTemplatePath, projectTemplatePath).then(() => {
    console.log('更新预览模板成功');
}).catch(err => {
    console.error('更新预览模板失败', err);
});