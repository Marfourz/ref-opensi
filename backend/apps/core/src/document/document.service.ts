import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { OrderService } from '../order/order.service';
import { PagiationPayload } from '../../../../types/index';
import { Order, User, Stock } from '@prisma/client';
import { getPlainStatus } from 'helpers/getPlainStatus';
import { StockService } from '../stock/stock.service';
import { UserService } from '../user/user.service';
import { getPlainRole } from 'helpers/getPlainRole';
import { ProductsService } from '../product/product.service';

@Injectable()
export class DocumentService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService,
    private readonly stockService: StockService,
    private readonly userService: UserService,
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

  async downloadUsers(filterParams: any, id: any) {
    const data: PagiationPayload<User[]> =
      await this.userService.searchForUsersOfOrganisation(filterParams, id);

    const payload: any = data;

    payload.data.map((element) => {
      element.role = getPlainRole(element.role);
    });

    payload.label = 'Récapitulatif des utilisateurs';

    const docContent = this.getTemplate('template-users', payload);

    const document = await this.generateDocument(docContent);
    return document;
  }

  async downloadStocks(filterParams: any, id: string) {
    const data: PagiationPayload<Stock[]> =
      await this.stockService.searchForStocksOfOrganisation(filterParams, id);

    const stocks = [];
    const payload: any = data.data;

    payload.forEach((element, i) => {
      if (element.stocks.length >= 1) {
        stocks.push(element.stocks[0]);
        stocks[i].name = element.name;
        stocks[i].bulkPrice = element.bulkPrice;
        stocks[i].total = element.bulkPrice * element.unitPrice;
      }
    });

    stocks.forEach((element) => {
      element.createdAt = element.createdAt.toLocaleDateString();
      element.id = element.id.toString().slice(-8);
    });

    /*return {
      data: stocks,
      label: 'Récapitulatif des stocks',
    };*/

    const docContent = this.getTemplate('template-stocks', {
      data: stocks,
      label: 'Récapitulatif des stocks',
    });

    const document = await this.generateDocument(docContent);
    return document;
  }
}
