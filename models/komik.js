module.exports = (sequelize, DataTypes) => {
    const Komik = sequelize.define("Komik", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        judul: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sinopsis: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        tahun_terbit: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        penulis_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'komik',
        timestamps: false
    });

    Komik.associate = (models) => {
        Komik.belongsTo(models.Penulis, {
            foreignKey: 'penulis_id',
            as: 'penulis'
        });

        Komik.belongsToMany(models.Genre, {
            through: 'KomikGenre',
            foreignKey: 'komik_id',
            otherKey: 'genre_id',
            as: 'genre'
        });
    };

    return Komik; // WAJIB ADA: Biar gak undefined
};