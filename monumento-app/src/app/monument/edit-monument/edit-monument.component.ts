import { Component, OnInit } from '@angular/core';
import { Monument, MonumentData } from '../monument.model';
import { ActivatedRoute } from '@angular/router';
import { MonumentService } from '../monument.service';

@Component({
  selector: 'app-edit-monument',
  template: `
    <h2>Editer {{ monument?.name }}</h2>
    <p *ngIf="monument" class="center">
      <img [src]="monument.picture">
    </p>
    <app-monument-form *ngIf="monument" [monument]="monument"></app-monument-form>
  `,
  styles: [
  ]
})
export class EditMonumentComponent implements OnInit {
  monument: MonumentData|undefined

  constructor(private route: ActivatedRoute, private monumentService: MonumentService) {}
  
  ngOnInit(): void {
    const monumentId: string|null = this.route.snapshot.paramMap.get('id')
    if(monumentId){
      this.monumentService.getMonumentById(+monumentId).subscribe( monument => this.monument = monument)
    }
  }
}
