import { Component, OnInit } from '@angular/core';
import { Produto } from '../Models/produto.model';

import { ItensService } from '../_services/itens.service'

@Component({
  selector: 'app-plantas-ornamentais',
  templateUrl: './plantas-ornamentais.component.html',
  styleUrls: ['./plantas-ornamentais.component.css']
})
export class PlantasOrnamentaisComponent implements OnInit {

  produtos : Produto []

  constructor(    private itensService: ItensService,
  ) { 

    
  }

  productWasSelected(item: Produto): void {
    console.log('Product selecionado: ', item);
  }

  getItens() {
    this.produtos=this.itensService.listarItens();
  }

  ngOnInit(): void {
    this.getItens();
  }

}
