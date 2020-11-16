import { Component, OnInit } from '@angular/core';
import {Produto } from '../Models/produto.model'

@Component({
  selector: 'app-pagina-inicial',
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.css']
})
export class PaginaInicialComponent implements OnInit {
  produtos : Produto []

  constructor() { 

    this.produtos = [
      new Produto(
        'N-01',
        "planta",
        'Mammillaria Plumosa',
        '../../assets/images/5.jpg',
        ['Planta', 'Cacti'],
        12,
        'Wallisia cyanea is a species of flowering plant in the bromeliad family, native to the rainforests of Ecuador. An epiphytic perennial growing to 50 cm high by 50 cm wide, it has stemless rosettes of thin, recurved leaves and paddle-shaped spikes of 20 pink bracts with violet flowers, in spring and autumn.',
        1
      ),
      new Produto(
        'N-01',
        'planta',
        'Mammillaria Prolifera',
        '../../assets/images/6.jpg',
        ['Planta', 'Cacti'],
        6,
        'Wallisia cyanea is a species of flowering plant in the bromeliad family, native to the rainforests of Ecuador. An epiphytic perennial growing to 50 cm high by 50 cm wide, it has stemless rosettes of thin, recurved leaves and paddle-shaped spikes of 20 pink bracts with violet flowers, in spring and autumn.',
        1
      ),
      new Produto(
        'N-01',
        'planta',
        'Lophophora Williamsii',
        '../../assets/images/7.jpg',
        ['Planta', 'Cacti'],
        160,
        'Wallisia cyanea is a species of flowering plant in the bromeliad family, native to the rainforests of Ecuador. An epiphytic perennial growing to 50 cm high by 50 cm wide, it has stemless rosettes of thin, recurved leaves and paddle-shaped spikes of 20 pink bracts with violet flowers, in spring and autumn.',
        1
      ),
      new Produto(
        'N-01',
        'planta',
        'Lobivia Arachnachanta',
        '../../assets/images/8.jpg',
        ['Planta', 'Cacti'],
        15,
        'Wallisia cyanea is a species of flowering plant in the bromeliad family, native to the rainforests of Ecuador. An epiphytic perennial growing to 50 cm high by 50 cm wide, it has stemless rosettes of thin, recurved leaves and paddle-shaped spikes of 20 pink bracts with violet flowers, in spring and autumn.',
        1
      ),
      new Produto(
        'N-01',
        'planta',
        'Mammillaria mazatlanensis',
        '../../assets/images/9.jpg',
        ['Men', 'Shoes', 'Running Shoes'],
        15,
        'Wallisia cyanea is a species of flowering plant in the bromeliad family, native to the rainforests of Ecuador. An epiphytic perennial growing to 50 cm high by 50 cm wide, it has stemless rosettes of thin, recurved leaves and paddle-shaped spikes of 20 pink bracts with violet flowers, in spring and autumn.',
        1
      ),
      new Produto(
        'N-01',
        'planta',
        'Echinopsis spp.',
        '../../assets/images/10.jpg',
        ['Plantas', 'Cactos'],
        22,
        'Wallisia cyanea is a species of flowering plant in the bromeliad family, native to the rainforests of Ecuador. An epiphytic perennial growing to 50 cm high by 50 cm wide, it has stemless rosettes of thin, recurved leaves and paddle-shaped spikes of 20 pink bracts with violet flowers, in spring and autumn.',
        1
      ),
      new Produto(
        'N-01',
        'planta',
        'Tagetes',
        '../../assets/images/11.jpg',
        ['Planta', 'Flores'],
        5,
        'Wallisia cyanea is a species of flowering plant in the bromeliad family, native to the rainforests of Ecuador. An epiphytic perennial growing to 50 cm high by 50 cm wide, it has stemless rosettes of thin, recurved leaves and paddle-shaped spikes of 20 pink bracts with violet flowers, in spring and autumn.',
        1
      ),
      new Produto(
        'N-01',
        'planta',
        'Falsa Érica',
        '../../assets/images/12.jpg',
        ['Planta', 'Forração'],
        15,
        'Wallisia cyanea is a species of flowering plant in the bromeliad family, native to the rainforests of Ecuador. An epiphytic perennial growing to 50 cm high by 50 cm wide, it has stemless rosettes of thin, recurved leaves and paddle-shaped spikes of 20 pink bracts with violet flowers, in spring and autumn.',
        1
      ),
      new Produto(
        'N-01',
        'planta',
        'Coleus',
        '../../assets/images/13.jpg',
        ['Planta', 'Folhagem'],
        5,
        'Wallisia cyanea is a species of flowering plant in the bromeliad family, native to the rainforests of Ecuador. An epiphytic perennial growing to 50 cm high by 50 cm wide, it has stemless rosettes of thin, recurved leaves and paddle-shaped spikes of 20 pink bracts with violet flowers, in spring and autumn.',
        1
      ),
      new Produto(
        'N-01',
        'planta',
        'Tagetes',
        '../../assets/images/14.jpg',
        ['Men', 'Shoes', 'Running Shoes'],
        5,
        'Wallisia cyanea is a species of flowering plant in the bromeliad family, native to the rainforests of Ecuador. An epiphytic perennial growing to 50 cm high by 50 cm wide, it has stemless rosettes of thin, recurved leaves and paddle-shaped spikes of 20 pink bracts with violet flowers, in spring and autumn.',
        1
      ),
    ]
  }

  productWasSelected(halo: Produto): void {
    console.log('Product clicked: ', halo);
  }
  
  ngOnInit(): void {
  }

}
