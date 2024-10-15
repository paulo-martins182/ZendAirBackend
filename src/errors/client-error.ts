export class ClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClientError"; // Define o nome da classe de erro
    Object.setPrototypeOf(this, ClientError.prototype); // Garante a correção do prototype
  }
}
