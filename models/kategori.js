module.exports = (sequelize, DataTypes) => {
    const Kategori = sequelize.define("Kategori", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nama: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        deskripsi: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'kategori',
        timestamps: false
    });

    Kategori.associate = (models) => {
        Kategori.belongsToMany(models.Blockchain, {
            through: 'BlockchainKategori',
            foreignKey: 'kategori_id',
            otherKey: 'blockchain_id',
            as: 'blockchain'
        });
    };

    return Kategori;
};
