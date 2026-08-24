module.exports = (sequelize, DataTypes) => {
    const Pengembang = sequelize.define("Pengembang", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nama: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'pengembang',
        timestamps: false
    });

    Pengembang.associate = (models) => {
        Pengembang.hasMany(models.Blockchain, {
            foreignKey: 'pengembang_id',
            as: 'blockchain'
        });

        Pengembang.hasMany(models.ApiKey, {
            foreignKey: 'pengembang_id',
            as: 'apiKeys'
        });
    };

    return Pengembang; // WAJIB ADA: Biar gak undefined
};
