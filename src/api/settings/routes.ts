import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { prisma } from '../../index';
import { ApiResponse } from '../../utils/apiResponse';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all settings (admin only)
router.get('/', authorize(['ADMIN']), async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    return ApiResponse.success(res, { settings });
  } catch (error) {
    console.error('Get settings error:', error);
    return ApiResponse.error(res, 'Failed to get settings', 500, error);
  }
});

// Get setting by key
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await prisma.setting.findUnique({
      where: { key }
    });

    if (!setting) {
      return ApiResponse.notFound(res, 'Setting not found');
    }

    // Only admins can access sensitive settings
    if (setting.isSensitive && req.user.role !== 'ADMIN') {
      return ApiResponse.forbidden(res, 'Not authorized to view this setting');
    }

    return ApiResponse.success(res, { setting });
  } catch (error) {
    console.error('Get setting error:', error);
    return ApiResponse.error(res, 'Failed to get setting', 500, error);
  }
});

// Update setting (admin only)
router.put('/:key', authorize(['ADMIN']), async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const setting = await prisma.setting.update({
      where: { key },
      data: { value },
    });

    return ApiResponse.success(res, { setting });
  } catch (error) {
    console.error('Update setting error:', error);
    return ApiResponse.error(res, 'Failed to update setting', 500, error);
  }
});

export default router;
