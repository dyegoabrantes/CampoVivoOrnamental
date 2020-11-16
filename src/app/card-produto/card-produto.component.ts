import { Component, Input, Output, HostBinding, OnInit} from '@angular/core';
import { Produto } from '../Models/produto.model'
import { Router } from '@angular/router'

@Component({
  selector: 'app-card-produto',
  templateUrl: './card-produto.component.html',
  styleUrls: ['./card-produto.component.css']
})


export class CardProdutoComponent{
  @Input() produto: Produto
  @HostBinding('attr.class') cssCLass = 'item'

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  clickado(categoria){
    // this._router.navigate(['/categoria'+categoria]);
  }

}
