const DataTypes = require('sequelize');
const connection = require('./connection.js');
const User = require('./user.js'); 

const Parking = connection.define(
    "Parking",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User, 
                key: 'id'
            }
        },
        vehicleNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cost : {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },{
        timestamps: false,
    }
)

Parking.belongsTo(User, {
    targetKey: 'id',
    foreignKey: 'userId',
});

module.exports = Parking;