'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('Weights', 'UserId', Sequelize.INTEGER);
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Weights', 'UserId');
  }
};
