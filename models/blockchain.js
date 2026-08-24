module.exports = (sequelize, DataTypes) => {
    const Blockchain = sequelize.define("Blockchain", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nama: {
            type: DataTypes.STRING,
            allowNull: false
        },
        simbol: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        deskripsi: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        tahun_rilis: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        pengembang_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'blockchain',
        timestamps: false
    });

    Blockchain.associate = (models) => {
        Blockchain.belongsTo(models.Pengembang, {
            foreignKey: 'pengembang_id',
            as: 'pengembang'
        });

        Blockchain.belongsToMany(models.Kategori, {
            through: 'BlockchainKategori',
            foreignKey: 'blockchain_id',
            otherKey: 'kategori_id',
            as: 'kategori'
        });
    };

    return Blockchain; // WAJIB ADA: Biar gak undefined
};
