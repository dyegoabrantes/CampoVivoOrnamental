export class Produto {
    constructor(
      public id: string,
      public tipo: string,
      public nome: string,
      public imageUrl: string,
      public categoria: string[],
      public preco: number,
      public descricao: string,
      public visitas: number,
      ) 
    {}
  }