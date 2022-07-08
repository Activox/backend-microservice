const { DataTypes } = require("sequelize");

// Implementación con Sequelize para el repositorio de libros.
// Recibe la conexión con Sequelize externamente.

class SequelizeTrackingLogsRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    // Mapear la tabla TrackingLogs.
    // Si "test" es true, se le agrega un sufijo al nombre de la tabla,
    // para que las pruebas de integración no sobreescriban los datos existentes.

    let tableName = "TrackingLogs";

    if (test) {
      tableName += "_test";
    }

    const columns = {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      deliveryId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      date: {
        allowNull: false,
        defaultValue: sequelizeClient.sequelize.now,
        type: DataTypes.DATE,
        get() {
          const date = new Date(`${this.dataValues.created_at}`);
          return `${date.toISOString().split("T")[0]} ${date.toLocaleTimeString(
            [],
            { month: "2-digit", timeStyle: "medium", hour12: false }
          )}`;
        },
      },
    };

    const options = {
      tableName: tableName,
      timestamps: false,
    };

    this.trackingLogsModel = sequelizeClient.sequelize.define(
      "TrackingLogs",
      columns,
      options
    );
  }

  async getTrackingLogs() {
    const trackingLogs = await this.trackingLogsModel.findAll({
      raw: true,
    });

    return trackingLogs;
  }

  async getTrackingLogs(id) {
    return await this.trackingLogsModel.findByPk(id);
  }

  async createTrackingLogs(trackingLogs) {
    const data = await this.trackingLogsModel.create(trackingLogs);
    return data.id;
  }

  async updateTrackingLogs(trackingLogs) {
    const options = {
      where: {
        id: trackingLogs.id,
      },
    };

    await this.trackingLogsModel.update(trackingLogs, options);
  }

  async deleteTrackingLogs(id) {
    const options = {
      where: {
        id: id,
      },
    };

    await this.trackingLogsModel.destroy(options);
  }

  async deleteAllTrackingLogs() {
    if (this.test) {
      const options = {
        truncate: true,
      };

      await this.trackingLogsModel.destroy(options);
    }
  }

  async dropTrackingLogsTable() {
    if (this.test) {
      await this.trackingLogsModel.drop();
    }
  }
}

module.exports = SequelizeTrackingLogsRepository;
