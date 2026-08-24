module.exports = (sequelize, DataTypes) => {
    const ApiKey = sequelize.define("ApiKey", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nama: {
            type: DataTypes.STRING,
            allowNull: false
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        aktif: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        terakhir_dipakai: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'api_keys',
        timestamps: true
    });

    ApiKey.associate = (models) => {
        ApiKey.belongsTo(models.Pengembang, {
            foreignKey: 'pengembang_id',
            as: 'pengembang'
        });
    };

    return ApiKey;
};
