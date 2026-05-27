import { Response } from 'express';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export class UserController {
  static async saveDesign(req: AuthRequest, res: Response) {
    try {
      const { name, headId, torsoId, legsId, accessoryId } = req.body;
      const userId = req.user?.id;

      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      await User.findByIdAndUpdate(userId, {
        $push: {
          savedDesigns: {
            name,
            head: headId,
            torso: torsoId,
            legs: legsId,
            accessory: accessoryId
          }
        }
      });

      res.status(200).json({ message: 'Design saved successfully' });
    } catch (error: any) {
      res.status(500).json({ message: 'Error saving design', error: error.message });
    }
  }

  static async getSavedDesigns(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const user = await User.findById(userId)
        .populate('savedDesigns.head')
        .populate('savedDesigns.torso')
        .populate('savedDesigns.legs')
        .populate('savedDesigns.accessory');

      res.status(200).json(user?.savedDesigns || []);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching designs', error: error.message });
    }
  }
}
迫