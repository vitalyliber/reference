import Sequelize from 'sequelize';

const actionModel = sequelize =>
  sequelize.define('action', {
    action: {
      type: Sequelize.STRING
    }
  });

export default actionModel;
