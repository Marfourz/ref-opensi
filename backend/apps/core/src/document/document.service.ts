import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { OrderService } from '../order/order.service';
import { PagiationPayload, Payload } from '../../../../types/index';
import { Order, User, Stock, Product } from '@prisma/client';
import { getPlainPackagingType, getPlainStatus } from 'helpers/getPlainStatus';
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
    private readonly productService: ProductsService,
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

  async generateInvoiceDocument(ordId: string) {
    const orderData: any = await this.getOrderData(ordId);

    orderData.createdAt = orderData.createdAt.toLocaleDateString();

    orderData.items.map((element) => {
      element.total = element.quantity * element.product.bulkPrice;
      element.product.packagingType = getPlainPackagingType(
        element.product.packagingType,
      );
    });

    const docContent = this.getTemplate('template-invoice-proforma', orderData);

    const document = await this.generateDocument(docContent);
    return document;
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

  private async getOrderData(id: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: {
          transaction: true,
          items: {
            include: {
              product: true,
            },
          },
          invoice: true,
        },
      });
      return order;
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
      stocks.push(element);
      stocks[i].name = element.product.name;
      stocks[i].bulkPrice = element.product.bulkPrice;
      stocks[i].total = element.product.bulkPrice * element.product.unitPrice;
    });

    stocks.forEach((element) => {
      element.createdAt = element.createdAt.toLocaleDateString();
      element.id = element.id.toString().slice(-8);
    });

    const docContent = this.getTemplate('template-stocks', {
      data: stocks,
      label: 'Récapitulatif des stocks',
    });

    const document = await this.generateDocument(docContent);
    return document;
  }

  async downloadProducts(filterParams: any) {
    const data: PagiationPayload<Product[]> =
      await this.productService.searchForProducts(filterParams);

    const payload: any = data.data;

    payload.map((element) => {
      element.createdAt = element.createdAt.toLocaleDateString();
      element.id = element.id.toString().slice(-8);
      //element.status = getPlainStatus(element.status);
    });

    const docContent = this.getTemplate('template-products', {
      data: payload,
      label: 'Récapitulatif des produits',
    });

    const document = await this.generateDocument(docContent);
    return document;
  }
}
