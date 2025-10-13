export class ResponseData<D> {
  data: D | D[];
  statusCode: number;
  message: string;

  constructor(
    data: D | D[],
    statusCode = 200,
    message = 'Server Response Success',
  ) {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message;

    return this;
  }
}
