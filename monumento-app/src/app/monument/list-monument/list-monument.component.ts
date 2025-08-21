import { Component } from '@angular/core';
import { Monument, MonumentData } from '../monument.model';
import { Router } from '@angular/router';
import { MonumentService } from '../monument.service';

@Component({
  selector: 'app-list-monument',
  templateUrl: './list-monument.component.html',
  styles: [
  ]
})
export class ListMonumentComponent {
  monumentList: MonumentData[] = []
  monumentSelected: MonumentData|undefined

  constructor(private router: Router, private monumentService: MonumentService) {}

  ngOnInit(): void {
    this.monumentService.getAllMonuments().subscribe( monumentList => this.monumentList = monumentList)
  }

  selectMonument(monumentId: string) {

    const searchMonument: MonumentData|undefined = this.monumentList.find( monument => monument.id == +monumentId)
    if(searchMonument) {
      this.monumentSelected = searchMonument
    }
    console.log(`Le monument n'existe pas`);
  }

  goToMonument(monument: MonumentData) {
    this.router.navigate(['/monument', monument.id])
  }
}
