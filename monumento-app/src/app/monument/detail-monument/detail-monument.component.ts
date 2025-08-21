import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MONUMENTS } from '../mock-monument-list';
import { Monument, MonumentData } from '../monument.model';
import { MonumentService } from '../monument.service';

@Component({
  selector: 'app-detail-monument',
  templateUrl: './detail-monument.component.html',
  styles: [
  ]
})
export class DetailMonumentComponent implements OnInit {
  monumentList: MonumentData[] = MONUMENTS
  monument: MonumentData|undefined

  constructor(private route: ActivatedRoute, private router: Router,private monumentService: MonumentService) {}

  ngOnInit(): void {

    const monumentId: string|null = this.route.snapshot.paramMap.get('id')
    if(monumentId){
      this.monumentService.getMonumentById(+monumentId).subscribe( monument => this.monument = monument)
    }

    console.log(monumentId);
  }

  goToMonumentList(){
    this.router.navigate(['/monuments']);
  }

  goToMonumentEdit(){
    this.router.navigate(['edit/monument', this.monument?.id]);
  }
}
