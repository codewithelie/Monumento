import { Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  template: `
    <div class='center'>
      <h1>Hey, cette page n'existe pas !</h1>
      <a routerLink="/monuments" class="waves-effect waves-teal btn-flat">
        Retourner à l' accueil
      </a>
    </div>
  `,
  styles: [
  ]
})
export class PageNotFoundComponent {

}
