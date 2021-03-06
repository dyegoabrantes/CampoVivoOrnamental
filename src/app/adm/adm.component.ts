import { Component, OnInit } from '@angular/core';
import { Produto } from '../Models/produto.model'

@Component({
  selector: 'app-adm',
  templateUrl: './adm.component.html',
  styleUrls: ['./adm.component.css']
})
export class AdmComponent implements OnInit {

  produtos : Produto []

  constructor() {
    this.produtos = [
      new Produto(
        'N-01',
        "planta",
        'Nike Air Max',
        'https://ugc.nikeid.com/is/image/nike/ugc/287164203.tif',
        ['Men', 'Shoes', 'Running Shoes'],
        270,
        'Wallisia cyanea is a species of flowering plant in the bromeliad family, native to the rainforests of Ecuador. An epiphytic perennial growing to 50 cm high by 50 cm wide, it has stemless rosettes of thin, recurved leaves and paddle-shaped spikes of 20 pink bracts with violet flowers, in spring and autumn.',
        1
      ),
      new Produto(
        'N-01',
        'cachaca',
        'Nike Air Max',
        'https://ugc.nikeid.com/is/image/nike/ugc/287164203.tif',
        ['Men', 'Shoes', 'Running Shoes'],
        270,
        'Wallisia cyanea is a species of flowering plant in the bromeliad family, native to the rainforests of Ecuador. An epiphytic perennial growing to 50 cm high by 50 cm wide, it has stemless rosettes of thin, recurved leaves and paddle-shaped spikes of 20 pink bracts with violet flowers, in spring and autumn.',
        1
      ),
      new Produto(
        'N-01',
        'mel',
        'Nike Air Max',
        'https://ugc.nikeid.com/is/image/nike/ugc/287164203.tif',
        ['Men', 'Shoes', 'Running Shoes'],
        270,
        'Wallisia cyanea is a species of flowering plant in the bromeliad family, native to the rainforests of Ecuador. An epiphytic perennial growing to 50 cm high by 50 cm wide, it has stemless rosettes of thin, recurved leaves and paddle-shaped spikes of 20 pink bracts with violet flowers, in spring and autumn.',
        1
      ),
      new Produto(
        'N-01',
        'pacoca',
        'Nike Air Max',
        'https://ugc.nikeid.com/is/image/nike/ugc/287164203.tif',
        ['Men', 'Shoes', 'Running Shoes'],
        270,
        'Wallisia cyanea is a species of flowering plant in the bromeliad family, native to the rainforests of Ecuador. An epiphytic perennial growing to 50 cm high by 50 cm wide, it has stemless rosettes of thin, recurved leaves and paddle-shaped spikes of 20 pink bracts with violet flowers, in spring and autumn.',
        1
      ),
      new Produto(
        'N-01',
        'geleia',
        'Nike Air Max',
        'https://ugc.nikeid.com/is/image/nike/ugc/287164203.tif',
        ['Men', 'Shoes', 'Running Shoes'],
        270,
        'Wallisia cyanea is a species of flowering plant in the bromeliad family, native to the rainforests of Ecuador. An epiphytic perennial growing to 50 cm high by 50 cm wide, it has stemless rosettes of thin, recurved leaves and paddle-shaped spikes of 20 pink bracts with violet flowers, in spring and autumn.',
        1
      ),
      new Produto(
        'N-01',
        'planta',
        'Nike Air Max',
        'https://ugc.nikeid.com/is/image/nike/ugc/287164203.tif',
        ['Men', 'Shoes', 'Running Shoes'],
        270,
        'Wallisia cyanea is a species of flowering plant in the bromeliad family, native to the rainforests of Ecuador. An epiphytic perennial growing to 50 cm high by 50 cm wide, it has stemless rosettes of thin, recurved leaves and paddle-shaped spikes of 20 pink bracts with violet flowers, in spring and autumn.',
        1
      ),
      new Produto(
        'N-01',
        'cachaca',
        'Nike Air Max',
        'https://ugc.nikeid.com/is/image/nike/ugc/287164203.tif',
        ['Men', 'Shoes', 'Running Shoes'],
        270,
        'Wallisia cyanea is a species of flowering plant in the bromeliad family, native to the rainforests of Ecuador. An epiphytic perennial growing to 50 cm high by 50 cm wide, it has stemless rosettes of thin, recurved leaves and paddle-shaped spikes of 20 pink bracts with violet flowers, in spring and autumn.',
        1
      ),
      new Produto(
        'N-01',
        'pacoca',
        'Nike Air Max',
        'https://ugc.nikeid.com/is/image/nike/ugc/287164203.tif',
        ['Men', 'Shoes', 'Running Shoes'],
        270,
        'Wallisia cyanea is a species of flowering plant in the bromeliad family, native to the rainforests of Ecuador. An epiphytic perennial growing to 50 cm high by 50 cm wide, it has stemless rosettes of thin, recurved leaves and paddle-shaped spikes of 20 pink bracts with violet flowers, in spring and autumn.',
        1
      ),
    ]
  }

  productWasSelected(halo: Produto): void {
    console.log('Product clicked: ', halo);
  }

  ngOnInit(): void {
    let header = document.getElementsByTagName('app-header');
    let rodape = document.getElementsByTagName('app-rodape');
    header[0]["style"].display='none';
    rodape[0]["style"].display='none';
  }

  mudaTipo(value){
    if (value == "planta") {
      document.getElementById('tipoProduto').style.display = 'block';
      document.getElementById('tipoProdutoLabel').style.display = 'block';
    } else{
      document.getElementById('tipoProdutoLabel').style.display = 'none';
      document.getElementById('tipoProduto').style.display = 'none';
    }
  }
}
