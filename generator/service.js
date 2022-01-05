module.exports = function (name) {
  const upperCaseName = name.replace(name[0],name[0].toUpperCase())
  const template = `
import { Service } from 'egg';

export default class ${upperCaseName}Service extends Service {
  async find(query, skip = 0, limit = 20) {
    const { ctx } = this;
    const result = await ctx.model.${upperCaseName}.findAll(query);
    return result;
  }

  async findOne(query) {
    const { ctx } = this;
    const result = await ctx.model.${upperCaseName}.findOne(query);
    return result;
  }

  async count(query) {
    const { ctx } = this;
    const count = await ctx.model.${upperCaseName}.count(query);
    return count;
  }

  async create(data) {
    const { ctx } = this;
    const result = await ctx.model.${upperCaseName}.create(data);
    return result;
  }

  async update(query, data) {
    const { ctx } = this;
    query = typeof query === 'object' ? query : { id: query };
    const result = await ctx.model.${upperCaseName}.update(data, { where: query });
    return result;
  }

  async destroy(query) {
    const { ctx } = this;
    query = typeof query === 'object' ? query : { id: query };
    const result = await ctx.model.${upperCaseName}.destroy({
      where: query
    });
    return result;
  }
}`;
  
    return { template, dir: "app/service", name: `${name}.ts` };
  };
  