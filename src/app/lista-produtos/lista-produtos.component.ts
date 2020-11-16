import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Produto } from '../Models/produto.model'

@Component({
  selector: 'app-lista-produtos',
  templateUrl: './lista-produtos.component.html',
  styleUrls: ['./lista-produtos.component.css']
})

export class ListaProdutosComponent {
  @Input() listaProdutos: Produto[]
  @Output() onProductSelected: EventEmitter<Produto>
  private currentProduct: Produto

  constructor() { 

    this.onProductSelected = new EventEmitter()

  }

  clicked(produto: Produto): void {
    this.currentProduct = produto
    this.onProductSelected.emit(produto)
    // document.getElementById('modalProduto')["style"].display = "block";
  }

  isSelected(produto: Produto): boolean {
    if (!produto || !this.currentProduct) {
      return false
    }
    return produto.id === this.currentProduct.id
  }

  ngOnInit(): void {
  }

}
