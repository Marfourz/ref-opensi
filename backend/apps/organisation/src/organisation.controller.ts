import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { OrganisationService } from './organisation.service';
import { Organisation, User, Stock } from '@prisma/client';
import { organisationDto, updateOrganisationDto } from './organisation.dto';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('organisations')
@Controller('organisations')
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

  @Post()
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
  getAllOrganisations(): Promise<Organisation[]> {
    return this.organisationService.getAllOrganisations();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  getSingleOrganisation(@Param() params): Promise<Organisation> {
    return this.organisationService.getSingleOrganisation(params.id);
  }

  @Get(':id/users')
  @ApiParam({ name: 'id' })
  getUsersOfOrganisation(@Param() params): Promise<User[]> {
    return this.organisationService.getUsersOfOrganisation(params.id);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  updateSingleOrganisation(
    @Param() params,
    @Body() body: updateOrganisationDto,
  ): Promise<Organisation> {
    return this.organisationService.updateSingleOrganisation(params.id, body);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  deleteSingleOrganisation(@Param() params): Promise<Organisation> {
    return this.organisationService.deleteSingleOrganisation(params.id);
  }
}
