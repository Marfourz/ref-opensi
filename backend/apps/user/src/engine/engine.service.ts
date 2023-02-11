import { Injectable } from '@nestjs/common';
import { Engine } from '@prisma/client';
import { PrismaService } from 'libs/prisma/src';
import { engineDto, updateEngineDto } from './engine.dto';

@Injectable()
export class EngineService {
  constructor(private prisma: PrismaService) {}

  async createEngine(engine: engineDto): Promise<Engine> {
    try {
      const newEngine = await this.prisma.engine.create({
        data: engine,
      });
      return newEngine;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getAllEngines(): Promise<Engine[]> {
    try {
      const engines = await this.prisma.engine.findMany();
      return engines;
    } catch (error) {
      throw error;
      return;
    }
  }

  async getSingleEngine(id: string): Promise<Engine> {
    try {
      const engine = await this.prisma.engine.findUnique({
        where: { id },
      });
      return engine;
    } catch (error) {
      throw error;
      return;
    }
  }

  async deleteSingleEngine(id: string): Promise<Engine> {
    try {
      const deletedEngine = await this.prisma.engine.delete({
        where: { id },
      });
      return deletedEngine;
    } catch (error) {
      throw error;
      return;
    }
  }

  async updateSingleEngine(
    id: string,
    update: updateEngineDto,
  ): Promise<Engine> {
    try {
      const updatedEngine = await this.prisma.engine.update({
        where: { id },
        data: update,
      });
      return updatedEngine;
    } catch (error) {
      throw error;
      return;
    }
  }
}
