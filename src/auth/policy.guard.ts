import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';

export const POLICY_KEY = 'policy';

export enum PolicyAction {
  QUERY_WASTE_LOGS = 'QUERY_WASTE_LOGS',
  UPDATE_WASTE_LOGS = 'UPDATE_WASTE_LOGS',
  CREATE_WASTE_LOGS = 'CREATE_WASTE_LOGS',
  DELETE_WASTE_LOGS = 'DELETE_WASTE_LOGS',
}

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAction = this.reflector.get<PolicyAction>(
      POLICY_KEY,
      context.getHandler(),
    );

    if (!requiredAction) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Admin can do everything
    if (user.role === 'ADMIN') {
      return true;
    }

    switch (requiredAction) {
      case PolicyAction.QUERY_WASTE_LOGS:
        return this.canQueryWasteLogs(user, request);
      
      case PolicyAction.UPDATE_WASTE_LOGS:
        return this.canUpdateWasteLogs(user, request);
      
      case PolicyAction.CREATE_WASTE_LOGS:
        return this.canCreateWasteLogs(user, request);
      
      case PolicyAction.DELETE_WASTE_LOGS:
        return this.canDeleteWasteLogs(user, request);
      
      default:
        return false;
    }
  }

  private async canQueryWasteLogs(user: any, request: any): Promise<boolean> {
    // Residents can only query WasteLogs linked to their estateId
    if (user.role === 'RESIDENT') {
      // Add estateId filter to the query parameters
      request.query.estateId = user.estateId;
      return true;
    }
    
    // Riders can only query their own WasteLogs
    if (user.role === 'RIDER') {
      request.query.riderId = user.id;
      return true;
    }
    
    return false;
  }

  private async canUpdateWasteLogs(user: any, request: any): Promise<boolean> {
    const wasteLogId = request.params.id || request.body.id;
    
    if (!wasteLogId) {
      throw new ForbiddenException('WasteLog ID is required');
    }

    // Riders can only update WasteLogs where riderId matches their ID
    if (user.role === 'RIDER') {
      const wasteLog = await this.prisma.wasteLog.findUnique({
        where: { id: wasteLogId },
      });

      if (!wasteLog) {
        throw new ForbiddenException('WasteLog not found');
      }

      if (wasteLog.riderId !== user.id) {
        throw new ForbiddenException('You can only update your own waste logs');
      }

      return true;
    }
    
    // Residents cannot update waste logs
    if (user.role === 'RESIDENT') {
      throw new ForbiddenException('Residents cannot update waste logs');
    }
    
    return false;
  }

  private async canCreateWasteLogs(user: any, request: any): Promise<boolean> {
    // Only Admins and Riders can create waste logs
    if (user.role === 'ADMIN') {
      return true;
    }
    
    if (user.role === 'RIDER') {
      // Ensure the rider creates waste logs for themselves
      request.body.riderId = user.id;
      return true;
    }
    
    // Residents cannot create waste logs
    return false;
  }

  private async canDeleteWasteLogs(user: any, request: any): Promise<boolean> {
    // Only Admins can delete waste logs
    return user.role === 'ADMIN';
  }
}
