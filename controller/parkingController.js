const Parking = require("../model/parking.js");

class ParkingController {
  static async createParking(req, res) {
    try {
      const { vehicleNumber } = req.body;
      const userId = req.user.userId;

      if (!userId || !vehicleNumber) {
        return res
          .status(400)
          .json({ error: "userId and vehicleNumber are required" });
      }

      const startTime = new Date();
      const parking = await Parking.create({
        userId,
        vehicleNumber,
        startTime,
        endTime: null,
      });

      res.status(201).json(parking);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create parking record" });
    }
  }

  static async getParking(req, res) {
    try {
      const { id } = req.user.id;

      const parkingRecord = await Parking.findOne({ where: { userId } });
      if (!parkingRecord) {
        return res.status(404).json({ message: "Parking record not found" });
      }

      res.status(200).json(parkingRecord);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to retrieve parking record" });
    }
  }

  static async updateParking(req, res) {
    try {
      const userId = req.user.userId;
      const { cost, endTime } = req.body;

      const parking = await Parking.findOne({
        where: { userId, endTime: null },
      });

      if (!parking) {
        return res
          .status(404)
          .json({ message: "No active parking found for this user" });
      }

      const now = endTime ? new Date(endTime) : new Date();
      parking.endTime = now;

      const durationInMinutes =
        (now - new Date(parking.startTime)) / (1000 * 60);
      const parking_cost = Math.ceil(durationInMinutes / 60) * 2000;

      parking.cost = parking_cost;

      await parking.save();

      if (cost && cost > parking_cost) {
        const returnedCost = cost - parking_cost;
        return res
          .status(200)
          .json({
            message: "Parking payment successfully",
            parking,
            returnedCost,
          });
      }

      res
        .status(200)
        .json({ message: "Parking updated successfully", parking });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update parking record" });
    }
  }
}

module.exports = ParkingController;
