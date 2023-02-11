import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'libs/prisma/src/prisma.service';
import { catchError, map } from 'rxjs';

@Injectable()
export class DocumentService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async generateDocument(invoiceId: string) {
    //const invoiceData: any = await this.getInvoiceData(invoiceId);

    //invoiceData.label = 'Facture SNB';

    const docContent = this.getTemplate('invoice0', {
      label: 'Facture KKIAPAY',
      description: 'Facture normalisée proForma',
      invoiceId: 'bjvhcgfdrtf,y',
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
      .pipe(map((res) => res.data))
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );
    return response;
  }

  private getTemplate(name: string, data: any): string {
    let result = '';

    try {
      const htmlContent = fs.readFileSync(
        path.join(__dirname, 'templates', `${name}.html`),
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
}
