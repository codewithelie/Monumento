module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Monument', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate : {
        notNull: {
          msg: 'Le nom du monument est obligatoire.'
        },
        notEmpty: {
          msg: 'Le nom du monument est obligatoire.'
        },
        len: {
          args: [3, 50],
          msg: 'Le nom du monument doit contenir entre 3 et 50 caractères.'
        }
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    buildYear: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    createdAt: 'created',
    updatedAt: false
  });
};
