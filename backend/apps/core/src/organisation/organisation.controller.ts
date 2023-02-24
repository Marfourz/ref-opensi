import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { Organisation, User, OrganisationStatusEnum } from '@prisma/client';
import { organisationDto, updateOrganisationDto } from './organisation.dto';
import { PagiationPayload } from 'types';
import { Roles } from 'guards/roles.decorator';
import { Role } from 'guards/roles.enum';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';
import { OrderTypeEnum } from 'guards/order.type.enum';

@ApiTags('organisations')
@Controller('organisations')
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

  @Post()
  @Roles(Role.SUPER_USER)
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

  @Get(':id')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  getSingleOrganisation(@Param() params): Promise<Organisation> {
    return this.organisationService.getSingleOrganisation(params.id);
  }

  @Get('partners/search')
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'perPage', type: Number, required: false })
  @ApiQuery({ name: 'q', type: String, required: false })
  searchForOrdersOfOrganisation(
    @Query() filterParams: any,
  ): Promise<PagiationPayload<Organisation[]>> {
    return this.organisationService.searchForPartners(filterParams);
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
  getDeliveryMenOfOrganisation(@Param() params): Promise<User[]> {
    return this.organisationService.getDeliveryMenOfOrganisation(params.id);
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
  @Roles(Role.SUPER_USER, Role.ADMINISTRATOR)
  @ApiHeader({
    name: 'x-auth-token',
    description: 'Contain auth token',
  })
  @ApiParam({ name: 'id' })
  deleteSingleOrganisation(@Param() params): Promise<Organisation> {
    return this.organisationService.deleteSingleOrganisation(params.id);
  }
}
