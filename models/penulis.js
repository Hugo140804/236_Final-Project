module.exports = (sequelize, DataTypes) => {
    const Penulis = sequelize.define("Penulis", {
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
        tableName: 'penulis',
        timestamps: false
    });

    Penulis.associate = (models) => {
        Penulis.hasMany(models.Komik, {
            foreignKey: 'penulis_id',
            as: 'komik'
        });
    };

    return Penulis; // WAJIB ADA: Biar gak undefined
};