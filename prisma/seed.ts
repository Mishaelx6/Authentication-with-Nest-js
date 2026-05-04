import { PrismaClient, Role, WasteLogStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create Abuja Estate
  const abujaEstate = await prisma.estate.upsert({
    where: { id: 'abuja-estate-1' },
    update: {},
    create: {
      id: 'abuja-estate-1',
      name: 'Abuja Central Estate',
      location: 'Abuja, Nigeria',
    },
  });

  console.log('Created Abuja Estate:', abujaEstate);

  // Create Admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@abujaestate.com' },
    update: {},
    create: {
      id: 'admin-user-1',
      email: 'admin@abujaestate.com',
      password: adminPassword,
      role: Role.ADMIN,
      estateId: abujaEstate.id,
      clearanceLevel: 5,
    },
  });

  console.log('Created Admin user:', admin.email);

  // Create Resident user
  const residentPassword = await bcrypt.hash('resident123', 10);
  const resident = await prisma.user.upsert({
    where: { email: 'resident@abujaestate.com' },
    update: {},
    create: {
      id: 'resident-user-1',
      email: 'resident@abujaestate.com',
      password: residentPassword,
      role: Role.RESIDENT,
      estateId: abujaEstate.id,
      clearanceLevel: 2,
    },
  });

  console.log('Created Resident user:', resident.email);

  // Create Rider user
  const riderPassword = await bcrypt.hash('rider123', 10);
  const rider = await prisma.user.upsert({
    where: { email: 'rider@abujaestate.com' },
    update: {},
    create: {
      id: 'rider-user-1',
      email: 'rider@abujaestate.com',
      password: riderPassword,
      role: Role.RIDER,
      estateId: abujaEstate.id,
      clearanceLevel: 3,
    },
  });

  console.log('Created Rider user:', rider.email);

  // Create sample waste logs for the rider
  const wasteLog1 = await prisma.wasteLog.create({
    data: {
      id: 'waste-log-1',
      riderId: rider.id,
      status: WasteLogStatus.PENDING,
      timestamp: new Date(),
    },
  });

  const wasteLog2 = await prisma.wasteLog.create({
    data: {
      id: 'waste-log-2',
      riderId: rider.id,
      status: WasteLogStatus.IN_PROGRESS,
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    },
  });

  const wasteLog3 = await prisma.wasteLog.create({
    data: {
      id: 'waste-log-3',
      riderId: rider.id,
      status: WasteLogStatus.COMPLETED,
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    },
  });

  console.log('Created sample waste logs:', [wasteLog1.id, wasteLog2.id, wasteLog3.id]);

  console.log('Database seeding completed successfully!');
  console.log('\nLogin credentials:');
  console.log('Admin: admin@abujaestate.com / admin123');
  console.log('Resident: resident@abujaestate.com / resident123');
  console.log('Rider: rider@abujaestate.com / rider123');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
