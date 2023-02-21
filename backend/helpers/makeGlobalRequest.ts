import { HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios';

export type RequestMethod = 'get' | 'post' | 'put' | 'delete';

export async function makeGlobalRequest<T, V>(
  appUrl: string,
  path: string,
  method: RequestMethod = 'get',
  args: V,
  options,
) {
  try {
    const response: AxiosResponse<T> = await axios[method](
      appUrl + path,
      args,
      { headers: options },
    );
    return response.data;
  } catch (error) {
    console.log('Error', error.message);
    throw new HttpException(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: error.message,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
