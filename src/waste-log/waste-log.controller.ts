import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { WasteLogService } from './waste-log.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { PolicyGuard } from '../auth/policy.guard';
import { Roles } from '../auth/roles.decorator';
import { Policy } from '../auth/policy.decorator';
import { PolicyAction } from '../auth/policy.guard';
import { Role } from '@prisma/client';
import { CreateWasteLogDto } from './dto/create-waste-log.dto';
import { UpdateWasteLogDto } from './dto/update-waste-log.dto';

@ApiTags('waste-logs')
@Controller('waste-logs')
@UseGuards(JwtAuthGuard, RolesGuard, PolicyGuard)
@ApiBearerAuth('JWT-auth')
export class WasteLogController {
  constructor(private readonly wasteLogService: WasteLogService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RIDER)
  @Policy(PolicyAction.CREATE_WASTE_LOGS)
  @ApiOperation({ summary: 'Create a new waste log' })
  @ApiResponse({ status: 201, description: 'Waste log created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  create(@Body() createWasteLogDto: CreateWasteLogDto, @Request() req) {
    return this.wasteLogService.create(createWasteLogDto, req.user);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RESIDENT, Role.RIDER)
  @Policy(PolicyAction.QUERY_WASTE_LOGS)
  @ApiOperation({ summary: 'Get all waste logs (filtered by user role)' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'], description: 'Filter by status' })
  @ApiQuery({ name: 'estateId', required: false, description: 'Filter by estate (for residents)' })
  @ApiQuery({ name: 'riderId', required: false, description: 'Filter by rider (for riders)' })
  @ApiResponse({ status: 200, description: 'Waste logs retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() query: any, @Request() req) {
    return this.wasteLogService.findAll(query, req.user);
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.RESIDENT, Role.RIDER)
  @ApiOperation({ summary: 'Get waste management statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStats(@Request() req) {
    return this.wasteLogService.getStats(req.user);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RESIDENT, Role.RIDER)
  @ApiOperation({ summary: 'Get a specific waste log by ID' })
  @ApiParam({ name: 'id', description: 'Waste log ID' })
  @ApiResponse({ status: 200, description: 'Waste log retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Access denied' })
  @ApiResponse({ status: 404, description: 'Waste log not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.wasteLogService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.RIDER)
  @Policy(PolicyAction.UPDATE_WASTE_LOGS)
  @ApiOperation({ summary: 'Update a waste log' })
  @ApiParam({ name: 'id', description: 'Waste log ID' })
  @ApiResponse({ status: 200, description: 'Waste log updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Cannot update other users logs' })
  @ApiResponse({ status: 404, description: 'Waste log not found' })
  update(@Param('id') id: string, @Body() updateWasteLogDto: UpdateWasteLogDto, @Request() req) {
    return this.wasteLogService.update(id, updateWasteLogDto, req.user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @Policy(PolicyAction.DELETE_WASTE_LOGS)
  @ApiOperation({ summary: 'Delete a waste log (Admin only)' })
  @ApiParam({ name: 'id', description: 'Waste log ID' })
  @ApiResponse({ status: 200, description: 'Waste log deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Waste log not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.wasteLogService.remove(id, req.user);
  }
}
