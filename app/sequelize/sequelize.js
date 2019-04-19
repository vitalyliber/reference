import Sequelize from 'sequelize';
import getUserDataPath from '../utils/userDataPath';

import actionModel from './actionModel';
import adminModel from './adminModel';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: `${getUserDataPath()}/database.sqlite`
});

const Action = actionModel(sequelize);
const Admin = adminModel(sequelize);
Admin.hasMany(Action);
Action.belongsTo(Admin);
sequelize.sync();
const beforeStart = async () => {
  await Admin.findOrCreate({
    where: {
      fullName: 'admin',
      password: 'password',
      admin: true
    }
  });
  await Admin.findOrCreate({
    where: {
      fullName: 'AstahovAV',
      password: '12345678',
      admin: true
    }
  });
  // need to remove in the future
  // await Action.destroy({
  //   where: {},
  //   truncate: true
  // })
};
beforeStart();

export default { sequelize, Action, Admin };
