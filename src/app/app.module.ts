import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ItensService } from './_services/itens.service';
import { HeaderComponent } from './header/header.component';
import { PromocaoBanerComponent } from './promocao-baner/promocao-baner.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PaginaInicialComponent } from './pagina-inicial/pagina-inicial.component';
import { CardProdutoComponent } from './card-produto/card-produto.component';
import { ListaProdutosComponent } from './lista-produtos/lista-produtos.component';
import { PlantasOrnamentaisComponent } from './plantas-ornamentais/plantas-ornamentais.component';
import { CachacasComponent } from './cachacas/cachacas.component';
import { FiltroComponent } from './filtro/filtro.component';
import { RodapeComponent } from './rodape/rodape.component';
import { ContatosComponent } from './contatos/contatos.component';
import { AdmComponent } from './adm/adm.component';

const routes: Routes = [
  {path: 'adm', component: AdmComponent, pathMatch: 'full'},
  {path: 'ornamentais', component: PlantasOrnamentaisComponent, pathMatch: 'full'},
  {path: 'cachacas', component: CachacasComponent},
  {path: 'contato', component: ContatosComponent},
  {path: '', component: PaginaInicialComponent, pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent},
];

const childRouts: Routes = [
];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PromocaoBanerComponent,
    PageNotFoundComponent,
    PaginaInicialComponent,
    CardProdutoComponent,
    ListaProdutosComponent,
    PlantasOrnamentaisComponent,
    CachacasComponent,
    FiltroComponent,
    RodapeComponent,
    ContatosComponent,
    AdmComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    RouterModule.forChild(childRouts),
  ],
  providers: [ItensService,],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
