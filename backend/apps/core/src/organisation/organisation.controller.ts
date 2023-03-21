import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { Organisation, User, OrganisationTypeEnum } from '@prisma/client';
import { organisationDto, updateOrganisationDto } from './organisation.dto';
import { PagiationPayload } from 'types';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';
import { NonSnbOrganisations } from 'types';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Organisations - Partenaires')
@Controller('organisations')
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

  @Post()
  //@Roles(Role.SUPER_USER)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiBody({ type: organisationDto })
  @ApiCreatedResponse({
    description: 'The organisation has been successfully created.',
  })
  createOrganisation(
    @Body() organisation: organisationDto,
  ): Promise<Organisation> {
    return this.organisationService.createOrganisation(organisation);
  }

  @Get()
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  getAllOrganisations(): Promise<Organisation[]> {
    return this.organisationService.getAllOrganisations();
  }

  @Get('top-partners')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiQuery({ name: 'type', enum: NonSnbOrganisations, required: true })
  getTopPartners(@Query('type') type: NonSnbOrganisations): any {
    return this.organisationService.getTopPartners(type);
  }

  @Get('turnover-chart/:id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  getTurnoverEvolution(@Param() params): any {
    return this.organisationService.getTurnoverEvolution(params.id);
  }

  @Get(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  getSingleOrganisation(@Param() params): Promise<Organisation> {
    return this.organisationService.getSingleOrganisation(params.id);
  }

  @Get('partners/search/:parentOrganisationId')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'parentOrganisationId' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'q', type: String, required: false })
  @ApiQuery({ name: 'type', enum: OrganisationTypeEnum, required: false })
  searchForOrdersOfOrganisation(
    @Query() filterParams: any,
    @Param() params,
  ): Promise<PagiationPayload<Organisation[]>> {
    return this.organisationService.searchForPartners(
      params.parentOrganisationId,
      filterParams,
    );
  }

  @Get('snb/infos/:orgId')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'orgId' })
  getOrganisationDashboardInfos(@Param() params): any {
    return this.organisationService.getOrganisationDashboardInfos(params.orgId);
  }

  @Get(':id/users')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  getUsersOfOrganisation(@Param() params): Promise<User[]> {
    return this.organisationService.getUsersOfOrganisation(params.id);
  }

  @Get(':id/deliveryMen')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'q', type: String, required: false })
  getDeliveryMenOfOrganisation(
    @Param() params,
    @Query() filterParams: any,
  ): Promise<PagiationPayload<User[]>> {
    return this.organisationService.getDeliveryMenOfOrganisation(
      params.id,
      filterParams,
    );
  }

  @Put(':id')
  @Roles(Role.SUPER_USER, Role.ADMINISTRATOR)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  updateSingleOrganisation(
    @Param() params,
    @Body() body: updateOrganisationDto,
  ): Promise<Organisation> {
    return this.organisationService.updateSingleOrganisation(params.id, body);
  }

  @Delete(':id')
  //@Roles(Role.SUPER_USER, Role.ADMINISTRATOR)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  deleteSingleOrganisation(@Param() params): Promise<Organisation> {
    return this.organisationService.deleteSingleOrganisation(params.id);
  }
}
