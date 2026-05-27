import { Request, Response } from 'express';
import { LegoPart } from '../models/LegoPart.js';

export class AdminController {
  static async addLegoPart(req: Request, res: Response) {
    try {
      const { name, type, price } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: 'Image is required' });
      }

      const imageUrl = `/uploads/lego-parts/${file.filename}`;

      const newPart = new LegoPart({
        name,
        type,
        price: parseFloat(price),
        imageUrl
      });

      await newPart.save();
      res.status(201).json(newPart);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getPartStats(req: Request, res: Response) {
    try {
      const stats = await LegoPart.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
迫