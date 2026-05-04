import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WasteLogStatus } from '@prisma/client';

@Injectable()
export class WasteLogService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any, user: any) {
    const where: any = {};

    // Apply security filters based on user role and PolicyGuard modifications
    if (query.estateId) {
      // For residents - only show logs from their estate
      where.rider = {
        estateId: query.estateId,
      };
    }

    if (query.riderId) {
      // For riders - only show their own logs
      where.riderId = query.riderId;
    }

    // Status filter if provided
    if (query.status) {
      where.status = query.status;
    }

    return this.prisma.wasteLog.findMany({
      where,
      include: {
        rider: {
          include: {
            estate: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  async findOne(id: string, user: any) {
    const wasteLog = await this.prisma.wasteLog.findUnique({
      where: { id },
      include: {
        rider: {
          include: {
            estate: true,
          },
        },
      },
    });

    if (!wasteLog) {
      throw new Error('WasteLog not found');
    }

    // Additional security check - ensure user has access to this log
    if (user.role === 'RESIDENT' && wasteLog.rider.estateId !== user.estateId) {
      throw new Error('Access denied');
    }

    if (user.role === 'RIDER' && wasteLog.riderId !== user.id) {
      throw new Error('Access denied');
    }

    return wasteLog;
  }

  async create(createWasteLogDto: any, user: any) {
    return this.prisma.wasteLog.create({
      data: {
        riderId: createWasteLogDto.riderId,
        status: createWasteLogDto.status || WasteLogStatus.PENDING,
        timestamp: createWasteLogDto.timestamp || new Date(),
      },
      include: {
        rider: {
          include: {
            estate: true,
          },
        },
      },
    });
  }

  async update(id: string, updateWasteLogDto: any, user: any) {
    return this.prisma.wasteLog.update({
      where: { id },
      data: {
        status: updateWasteLogDto.status,
        timestamp: updateWasteLogDto.timestamp,
      },
      include: {
        rider: {
          include: {
            estate: true,
          },
        },
      },
    });
  }

  async remove(id: string, user: any) {
    return this.prisma.wasteLog.delete({
      where: { id },
      include: {
        rider: {
          include: {
            estate: true,
          },
        },
      },
    });
  }

  async getStats(user: any) {
    let where: any = {};

    // Apply role-based filters for statistics
    if (user.role === 'RESIDENT') {
      where.rider = {
        estateId: user.estateId,
      };
    }

    if (user.role === 'RIDER') {
      where.riderId = user.id;
    }

    const [
      totalLogs,
      pendingLogs,
      inProgressLogs,
      completedLogs,
    ] = await Promise.all([
      this.prisma.wasteLog.count({ where }),
      this.prisma.wasteLog.count({ where: { ...where, status: WasteLogStatus.PENDING } }),
      this.prisma.wasteLog.count({ where: { ...where, status: WasteLogStatus.IN_PROGRESS } }),
      this.prisma.wasteLog.count({ where: { ...where, status: WasteLogStatus.COMPLETED } }),
    ]);

    return {
      total: totalLogs,
      pending: pendingLogs,
      inProgress: inProgressLogs,
      completed: completedLogs,
    };
  }
}
