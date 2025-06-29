import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { prisma } from '../../index';
import { ApiResponse } from '../../utils/apiResponse';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Create a new partnership
router.post('/', async (req, res) => {
  try {
    const {
      fullName,
      email,
      company,
      phone,
      country,
      expertise,
      businessType,
      message
    } = req.body;

    // Basic validation
    if (!fullName || !email || !company || !phone || !country || !expertise || !businessType) {
      return ApiResponse.error(res, 'Missing required fields', 400);
    }

    // Create the partnership
    const partnership = await prisma.partnershipApplication.create({
      data: {
        fullName,
        email,
        company,
        phone,
        country,
        expertise: Array.isArray(expertise) ? expertise : [expertise],
        businessType,
        message: message || null,
        userId: req.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Create initial status history
    await prisma.statusHistory.create({
      data: {
        status: 'NEW',
        notes: 'Partnership application created',
        changedById: req.user.id,
        partnershipApplicationId: partnership.id
      }
    });

    return ApiResponse.success(res, { partnership }, 201);
  } catch (error) {
    console.error('Create partnership error:', error);
    return ApiResponse.error(res, 'Failed to create partnership', 500, error);
  }
});

// Get all partnerships (with filtering, sorting, and pagination)
router.get('/', async (req, res) => {
  try {
    const { 
      page = '1', 
      limit = '10',
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    
    if (status) {
      where.status = status;
    }

    // If user is not admin, only show their partnerships
    if (req.user.role !== 'ADMIN') {
      where.userId = req.user.id;
    }

    const [partnerships, total] = await Promise.all([
      prisma.partnershipApplication.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          statusHistory: {
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          },
          _count: {
            select: { notes: true, attachments: true }
          }
        },
        orderBy: {
          [sortBy as string]: sortOrder
        },
        skip,
        take: limitNum
      }),
      prisma.partnershipApplication.count({ where })
    ]);

    return ApiResponse.success(res, {
      partnerships,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get partnerships error:', error);
    return ApiResponse.error(res, 'Failed to get partnerships', 500, error);
  }
});

// Get single partnership
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const partnership = await prisma.partnershipApplication.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        statusHistory: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        notes: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        attachments: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!partnership) {
      return ApiResponse.notFound(res, 'Partnership not found');
    }

    // Check if user has permission to view this partnership
    if (req.user.role !== 'ADMIN' && partnership.userId !== req.user.id) {
      return ApiResponse.forbidden(res, 'Not authorized to view this partnership');
    }

    return ApiResponse.success(res, { partnership });
  } catch (error) {
    console.error('Get partnership error:', error);
    return ApiResponse.error(res, 'Failed to get partnership', 500, error);
  }
});

// Create new partnership
router.post('/', async (req, res) => {
  try {
    const { 
      companyName,
      contactPerson,
      email,
      phone,
      website,
      partnershipType,
      description,
      status = 'PENDING'
    } = req.body;

    const partnership = await prisma.partnershipApplication.create({
      data: {
        companyName,
        contactPerson,
        email,
        phone,
        website,
        partnershipType,
        description,
        status,
        userId: req.user.id,
        statusHistory: {
          create: [
            {
              status,
              changedById: req.user.id,
              notes: 'Application submitted'
            }
          ]
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return ApiResponse.success(res, { partnership }, 201);
  } catch (error) {
    console.error('Create partnership error:', error);
    return ApiResponse.error(res, 'Failed to create partnership', 500, error);
  }
});

// Update partnership status
router.patch('/:id/status', authorize(['ADMIN', 'MODERATOR']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const partnership = await prisma.partnershipApplication.findUnique({
      where: { id }
    });

    if (!partnership) {
      return ApiResponse.notFound(res, 'Partnership not found');
    }

    const updatedPartnership = await prisma.$transaction([
      prisma.partnershipApplication.update({
        where: { id },
        data: { status },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.statusHistory.create({
        data: {
          status,
          notes: notes || `Status changed to ${status}`,
          changedById: req.user.id,
          partnershipApplicationId: id
        }
      })
    ]);

    return ApiResponse.success(res, { partnership: updatedPartnership[0] });
  } catch (error) {
    console.error('Update partnership status error:', error);
    return ApiResponse.error(res, 'Failed to update partnership status', 500, error);
  }
});

// Add note to partnership
router.post('/:id/notes', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Check if partnership exists and user has permission
    const partnership = await prisma.partnershipApplication.findUnique({
      where: { id }
    });

    if (!partnership) {
      return ApiResponse.notFound(res, 'Partnership not found');
    }

    if (req.user.role !== 'ADMIN' && partnership.userId !== req.user.id) {
      return ApiResponse.forbidden(res, 'Not authorized to add note to this partnership');
    }

    const note = await prisma.note.create({
      data: {
        content,
        userId: req.user.id,
        partnershipApplicationId: id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return ApiResponse.success(res, { note }, 201);
  } catch (error) {
    console.error('Add note error:', error);
    return ApiResponse.error(res, 'Failed to add note', 500, error);
  }
});

export default router;
