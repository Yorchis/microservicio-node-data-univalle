'use strict';

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: "users"
  });

  User.associate = function(models) {
    User.hasMany(models.Post, { as: "posts", foreignKey: "userId" });
    User.belongsToMany(models.Role, { as: "roles", through: "user_role", foreignKey: "user_id" });
  };

  // Comprueba que el usuario es administrador
  User.isAdmin = function(roles) {
    let tmpArray = [];
    roles.forEach(role => tmpArray.push(role.role));

    return tmpArray.includes('admin');
  }

  return User;
};