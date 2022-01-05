module.exports = function (name) {
  const underscoreString = name.split('').map((value,index) => {
    if(/[A-Z]/.test(value) && index !== 0) {
      return value.replace(value, `_${value.toLowerCase()}`)
    } else {
      return value.replace(value, `${value.toLowerCase()}`)
    }
  })
  const template = `
import { config } from '../lib/baseModel';

export default app => {
  const { STRING, INTEGER, BIGINT } = app.Sequelize;
  return app.model.define(
    '${underscoreString.join('')}',
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    },
    { ...config }
  );
};`;

  return { template, dir: "app/model", name: `${name}.ts` };
};
