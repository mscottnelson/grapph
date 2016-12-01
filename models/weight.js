'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var Weight = sequelize.define('Weight', {
    username: {
      type: DataTypes.STRING,
    },
    weight: {
      type: DataTypes.FLOAT,
    },
    createdAt: {
      type: DataTypes.DATE,
    }
  }, {
    instanceMethods: {
      markForRemoval: function() {
        return this.destroy();
    },
  },
    classMethods: {
      associate: function(models) {
        Weight.belongsTo(models.User);
      }
    }
  });
  return Weight;
};
