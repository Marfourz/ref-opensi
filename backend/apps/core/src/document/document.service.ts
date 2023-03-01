import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { OrderService } from '../order/order.service';
import { PagiationPayload } from '../../../../types/index';
import { Order } from '@prisma/client';
import { getPlainStatus } from 'helpers/getPlainStatus';

@Injectable()
export class DocumentService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService,
  ) {}

  async generateReceiptDocument(invoiceId: string) {
    const docContent = this.getTemplate('invoice0', {
      label: 'Facture KKIAPAY',
      description: 'Facture normalisée proForma',
      invoiceId: 'bjvhcgfdrtfy',
      receiveNumber: 'dfgvhbnjkjgyhf',
    });

    const response = this.httpService
      .post('/pdf/v2/template-content', {
        projectId: 'kkp-v1',
        document: docContent,
        options: JSON.stringify({
          format: 'A4',
        }),
      })
      .toPromise()
      .then(async (res) => {
        return res;
      })
      .catch((err) => {
        return {
          statusCode: err.response.status,
          message: err.response.statusText,
          data: err.response.data,
        };
      });
    return response;
  }

  private getTemplate(name: string, data: any): string {
    let result = '';

    try {
      const htmlContent = fs.readFileSync(
        path.join(__dirname, 'document/templates', `${name}.html`),
        'utf8',
      );

      const buffer = handlebars.compile(htmlContent);
      result = buffer(data);
    } catch (error) {
      console.error('GetTemplate.error', error);
      result = '';
    } finally {
      return result;
    }
  }

  private async getInvoiceData(id: string) {
    try {
      const invoice = await this.prisma.invoice.findUnique({
        where: { id },
        include: {
          transaction: true,
          order: true,
          receipt: true,
        },
      });
      return invoice;
    } catch (error) {
      throw error;
      return;
    }
  }

  async generateDocument(docContent: string) {
    const response = this.httpService
      .post('/pdf/v2/template-content', {
        projectId: 'kkp-v1',
        document: docContent,
        options: JSON.stringify({
          format: 'A4',
        }),
      })
      .toPromise()
      .then(async (res) => {
        return res.data;
      })
      .catch((err) => {
        return {
          statusCode: err.response.status,
          message: err.response.statusText,
          data: err.response.data,
        };
      });
    return response;
  }

  async downloadOrders(filterParams: any, id: string) {
    const data: PagiationPayload<Order[]> =
      await this.orderService.searchForOrdersOfOrganisation(filterParams, id);

    const payload: any = data;

    payload.data.map((element) => {
      element.createdAt = element.createdAt.toLocaleDateString();
      element.id = element.id.toString().slice(-8);
      element.status = getPlainStatus(element.status);
    });

    payload.label = 'Récapitulatif des commandes';

    const docContent = this.getTemplate('template-orders', payload);

    const document = await this.generateDocument(docContent);
    return document;
  }
}
