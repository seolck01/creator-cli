module.exports = function (name) {
  const upperCaseName = name.replace(name[0], name[0].toUpperCase());
  const lowerCaseName = name.replace(name[0], name[0].toLowerCase());
  const template = `
import Controller from './base';
import * as sequelize from 'sequelize';

// 测试

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
};
