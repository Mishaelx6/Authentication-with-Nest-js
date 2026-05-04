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
import { WasteLogService } from './waste-log.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { PolicyGuard } from '../auth/policy.guard';
import { Roles } from '../auth/roles.decorator';
import { Policy } from '../auth/policy.decorator';
import { PolicyAction } from '../auth/policy.guard';
import { Role } from '@prisma/client';

@Controller('waste-logs')
@UseGuards(JwtAuthGuard, RolesGuard, PolicyGuard)
export class WasteLogController {
  constructor(private readonly wasteLogService: WasteLogService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RIDER)
  @Policy(PolicyAction.CREATE_WASTE_LOGS)
  create(@Body() createWasteLogDto: any, @Request() req) {
    return this.wasteLogService.create(createWasteLogDto, req.user);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RESIDENT, Role.RIDER)
  @Policy(PolicyAction.QUERY_WASTE_LOGS)
  findAll(@Query() query: any, @Request() req) {
    return this.wasteLogService.findAll(query, req.user);
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.RESIDENT, Role.RIDER)
  async getStats(@Request() req) {
    return this.wasteLogService.getStats(req.user);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RESIDENT, Role.RIDER)
  async findOne(@Param('id') id: string, @Request() req) {
    return this.wasteLogService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.RIDER)
  @Policy(PolicyAction.UPDATE_WASTE_LOGS)
  update(@Param('id') id: string, @Body() updateWasteLogDto: any, @Request() req) {
    return this.wasteLogService.update(id, updateWasteLogDto, req.user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @Policy(PolicyAction.DELETE_WASTE_LOGS)
  remove(@Param('id') id: string, @Request() req) {
    return this.wasteLogService.remove(id, req.user);
  }
}
