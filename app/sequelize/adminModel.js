import Sequelize from 'sequelize';

const actionModel = sequelize =>
  sequelize.define('admin', {
    fullName: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING,
      validate: {
        len: {
          args: [4, 8],
          msg: "Длина пароля должна быть от 4 до 8 символов"
        }
      }
    },
    admin: {
      type: Sequelize.BOOLEAN
    }
  });

export default actionModel;
