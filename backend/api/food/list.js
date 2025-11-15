import { listFood } from '../../controllers/foodController.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await listFood(req, res);
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}