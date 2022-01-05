# 安装

## 简介
 一个创建node mvc模板和web模板的cli
## 全局安装
```
 npm install -g charles-create
```
## 项目安装
```
 npm install --save-dev charles-create
```
## 快速开始
 ### 本地安装
   package.json scripts 添加命令
   ```
    "create": "t-create"
   ```
 ### 全局安装 
    终端运行
    t-create mvc {name} // 创建node mvc模板文件 
    t-create web {name} // 创建web模板文件
## 默认配置
 mvc 文件生成路径  

 + controller:app/controller/{name}.ts 
 + service:app/service/{name}.ts
 + model:app/model/{name}.ts  

 web 文件生成路径  
 + web: app/web/{name}/index.ts 

## 配置文件

读取项目目录 create.config.js 文件，文件导出参数
```
const controller = require('./template/controller')
module.exports = {
  mvc: {
    controller, // controller文件个性化配置
    model,  // model文件个性化配置
    service, // service文件个性化配置
  },
  web // web文件个性化配置
};
```

controller 例子
```
// example
module.exports = function (name) {
  const upperCaseName = name.replace(name[0], name[0].toUpperCase());
  const lowerCaseName = name.replace(name[0], name[0].toLowerCase());
  const template = `
import Controller from './base';
import * as sequelize from 'sequelize';
export default class ${upperCaseName}Controller extends Controller {
  async index() {
    const { ctx, service } = this;
    const { query } = ctx;
    const pageIndex = (query.pageIndex && parseInt(query.pageIndex, 10)) || 0;
    const pageSize = (query.pageSize && parseInt(query.pageSize, 10)) || 0;
    const where = {};
    const order = [['id', 'DESC']];
    const result: any = await service.${lowerCaseName}.find({
      where,
      order,
      attributes: ['id'],
      limit: pageSize,
      offset:pageSize ? (pageIndex - 1) * pageSize : 0
    });

    this.success(result, ctx.__('FetchSuccess'));
  }
  async show() {
    const { ctx, service } = this;
    const { params } = ctx;
    const { id } = params;
    let conditions = {};
    if (typeof id === 'number') {
      conditions = { id };
    } else {
      conditions = { code: id };
    }
    const result = await service.${lowerCaseName}.findOne({ where: conditions });
    this.success(result, ctx.__('FetchSuccess'));
  }

  async create() {
    const { ctx, service } = this;
    const { body } = ctx.request;
    const result = await service.${lowerCaseName}.create(body);
    this.success(result, ctx.__('CreateSuccess'));
  }

  async update() {
    const { ctx, service } = this;
    const { id } = ctx.params;
    const updateData = { ...ctx.request.body };
    const result = await service.${lowerCaseName}.update(id, updateData);
    this.success(result, ctx.__('UpdateSuccess'));
  }

    // DELETE	/xxxx/:id
    async destroy() {}
}
      `;

  return { template, dir: "app/controller", name: `${name}.ts` }; 
  // template:模板字符串;
  // dir:生成文件路径;
  // name:生成文件名;
};

```

