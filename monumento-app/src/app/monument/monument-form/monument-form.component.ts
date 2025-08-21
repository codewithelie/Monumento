import { Component, Input, OnInit } from '@angular/core';
import { Monument, MonumentData } from '../monument.model';
import { MonumentService } from '../monument.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-monument-form',
  templateUrl: './monument-form.component.html',
  styles: [
  ]
})
export class MonumentFormComponent implements OnInit {
  @Input() monument: MonumentData|undefined
  countries: string[] = []
  isAddForm: boolean = false
  
  constructor (private monumentService: MonumentService, private router: Router) {}

  ngOnInit(): void {
    this.countries = this.monumentService.getAllCountry();
    this.isAddForm = this.router.url.includes("add")
  }
  onSubmit(){
    if(!this.isAddForm && this.monument){
      this.monumentService.editMonument(this.monument).subscribe(
        () => this.router.navigate(['/monument', this.monument?.id ])
      )
    }
    
  }
}
