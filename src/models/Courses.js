'use strict';

module.exports = (sequelizeDatabase, DataTypes) => {
    const course = sequelizeDatabase.define('course', {
        courseName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        credits: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        instructor: {
            type: DataTypes.STRING,
            allowNull: false,
        },

    });

    return course;
};
