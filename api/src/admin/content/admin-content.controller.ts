import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthTokenPayload } from '../../auth/token.service';
import { Roles, WRITE_ADMIN_ROLES } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { AdminContentService } from './admin-content.service';
import { PublishManifestDto } from './dto/admin-content.dto';

@Controller('v1/admin/content')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminContentController {
  constructor(private readonly content: AdminContentService) {}

  @Get('manifest')
  getManifest() {
    return this.content.getManifest();
  }

  @Post('manifest/publish')
  @Roles(...WRITE_ADMIN_ROLES)
  publish(
    @CurrentUser() actor: AuthTokenPayload,
    @Body() dto: PublishManifestDto,
    @Req() req: Request,
  ) {
    return this.content.publishManifest(actor.sub, dto, req.ip);
  }

  @Get(':domain')
  list(@Param('domain') domain: 'duas' | 'ziyarat' | 'calendar') {
    return this.content.listDomain(domain);
  }

  @Get(':domain/:id')
  getOne(
    @Param('domain') domain: 'duas' | 'ziyarat' | 'calendar',
    @Param('id') id: string,
  ) {
    return this.content.getDomainEntry(domain, id);
  }
}
