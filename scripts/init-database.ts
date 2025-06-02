import { PrismaClient } from '@prisma/client';

// Define role constants to match the Prisma schema
const Role = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
} as const;

// Define status constants to match the Prisma schema
const Status = {
  NEW: 'NEW',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ONBOARDING: 'ONBOARDING'
} as const;

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔄 Starting database initialization...');

    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@theram.plc' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@theram.plc',
        password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm', // "password" hashed
        role: Role.ADMIN,
      },
    });

    console.log('✅ Admin user created:', adminUser.email);

    // Create system user
    const systemUser = await prisma.user.upsert({
      where: { email: 'system@theram.plc' },
      update: {},
      create: {
        name: 'System',
        email: 'system@theram.plc',
        role: Role.ADMIN,
      },
    });

    console.log('✅ System user created:', systemUser.email);

    // Create sample partnership applications
    const sampleApplications = [
      {
        fullName: 'John Smith',
        email: 'john.smith@example.com',
        company: 'Tech Solutions Ltd',
        phone: '+44 7700 900123',
        country: 'United Kingdom',
        expertise: ['Software Development', 'Cloud Infrastructure'],
        businessType: 'Technology Provider',
        message: 'We would like to partner with the.RAM.plc to provide custom software solutions.',
        status: Status.NEW,
      },
      {
        fullName: 'Maria Garcia',
        email: 'maria.garcia@example.com',
        company: 'Global Consulting Group',
        phone: '+34 612 345 678',
        country: 'Spain',
        expertise: ['Business Strategy', 'Market Research'],
        businessType: 'Consulting Firm',
        message: 'Interested in becoming a strategic partner for European market expansion.',
        status: Status.UNDER_REVIEW,
      },
      {
        fullName: 'Akira Tanaka',
        email: 'akira.tanaka@example.com',
        company: 'Innovative Solutions Inc.',
        phone: '+81 3 1234 5678',
        country: 'Japan',
        expertise: ['Hardware Manufacturing', 'IoT'],
        businessType: 'Manufacturer',
        message: 'Looking to collaborate on IoT hardware solutions for smart cities.',
        status: Status.APPROVED,
      },
      {
        fullName: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        company: 'Digital Marketing Experts',
        phone: '+1 415 555 7890',
        country: 'United States',
        expertise: ['Digital Marketing', 'Social Media'],
        businessType: 'Marketing Agency',
        message: 'We specialize in tech marketing and would like to discuss partnership opportunities.',
        status: Status.REJECTED,
      },
      {
        fullName: 'Mohammed Al-Farsi',
        email: 'mohammed.alfarsi@example.com',
        company: 'Gulf Tech Distributors',
        phone: '+971 50 123 4567',
        country: 'United Arab Emirates',
        expertise: ['Distribution', 'Sales'],
        businessType: 'Distributor',
        message: 'Interested in becoming an authorized distributor in the Middle East region.',
        status: Status.ONBOARDING,
      },
    ];

    for (const appData of sampleApplications) {
      const app = await prisma.partnershipApplication.create({
        data: {
          fullName: appData.fullName,
          email: appData.email,
          company: appData.company,
          phone: appData.phone,
          country: appData.country,
          expertise: appData.expertise,
          businessType: appData.businessType,
          message: appData.message,
          status: appData.status,
          statusHistory: {
            create: {
              newStatus: appData.status,
              notes: 'Initial status',
              userId: systemUser.id,
            },
          },
        },
      });

      console.log(`✅ Created application for ${app.company}`);

      // Add a note for each application
      await prisma.note.create({
        data: {
          content: `Initial review of ${appData.company}'s application.`,
          applicationId: app.id,
          userId: adminUser.id,
        },
      });

      // Add a sample attachment for each application
      await prisma.attachment.create({
        data: {
          fileName: 'company_profile.pdf',
          fileType: 'application/pdf',
          fileSize: 1024 * 1024, // 1MB
          description: 'Company profile document',
          filePath: `/uploads/sample/${app.id}/company_profile.pdf`,
          applicationId: app.id,
          userId: adminUser.id,
        },
      });
    }

    console.log('✅ Sample data created successfully');
    console.log('✅ Database initialization completed');
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
