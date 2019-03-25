import Sequelize from 'sequelize';
import React from 'react';
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
Admin.findOrCreate({
  where: { fullName: 'admin', password: 'password', admin: true, email: 'admin@admin.com' }
}).then(([user, created]) => {
  console.log(user, created);
});
Admin.findOrCreate({
  where: { fullName: 'AstahovAV', password: '12345678', admin: true, email: 'admin@admin.com' }
}).then(([user, created]) => {
  console.log(user, created);
});
export default { sequelize, Action, Admin };
