const TrackingLogs = require("../entities/trackingLog");

// Casos de uso para el manejo de libros.
// Acá va la lógica de negocio agnóstica a los frameworks,
// recibiendo como parámetros las dependencias necesarias.

class ManageTrackingLogsUsecase {
  constructor(trackingLogsRepository) {
    this.trackingLogsRepository = trackingLogsRepository;
  }

  async getTrackingLogs() {
    return await this.trackingLogsRepository.getTrackingLogs();
  }

  async getTrackingLogs(id) {
    return await this.trackingLogsRepository.getTrackingLogs(id);
  }

  async createTrackingLogs(data) {
    const trackingLogs = new TrackingLogs(
      undefined,
      data.deliveryId,
      data.status,
      data.date
    );
    const id = await this.trackingLogsRepository.createTrackingLogs(
      trackingLogs
    );
    trackingLogs.id = id;

    return trackingLogs;
  }

  async updateTrackingLogs(id, data) {
    const trackingLogs = new TrackingLogs(
      id,
      data.deliveryId,
      data.status,
      data.date
    );
    await this.trackingLogsRepository.updateTrackingLogs(trackingLogs);

    return trackingLogs;
  }

  async deleteTrackingLogs(id) {
    await this.trackingLogsRepository.deleteTrackingLogs(id);
  }
}

module.exports = ManageTrackingLogsUsecase;
