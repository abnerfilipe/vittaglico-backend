export class ListaUsuarioDTO {
  constructor(
    readonly id: string,
    readonly nome: string,
    readonly email: string,
    readonly username: string,
    readonly dataDeNascimento: string,
    readonly createdAt: string,
    readonly updatedAt: string,
    readonly deletedAt: string | null,
  ) {}
}