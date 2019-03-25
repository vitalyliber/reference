import Sequelize from 'sequelize';

const actionModel = sequelize =>
  sequelize.define('admin', {
    fullName: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    admin: {
      type: Sequelize.BOOLEAN
    },
  });

export default actionModel;
