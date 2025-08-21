import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countryByColor'
})
export class CountryByColorPipe implements PipeTransform {

  transform(country: string): string {
    let color: string

    switch (country){
      case 'France' : 
        color = 'fr-blue lighten-1'
        break
      case 'États-Unis' : 
        color = 'fr-bluered lighten-1'
        break
      case 'Italie' : 
        color = 'fr-green lighten-1'    
        break
      case 'Royaume-Uni' : 
        color = 'fr-red lighten-1'
        break
      case 'Taj Mahal' : 
        color = 'fr-brown lighten-1'
        break
      case 'Brésil' : 
        color = 'fr-greenyellow lighten-1'
        break
      case 'Égypte' : 
        color = 'fr-lightbrown lighten-1'
        break
      case 'Pérou' : 
        color = 'fr-redbrown lighten-1'
        break
      case 'Grèce' : 
        color = 'fr-bluewhite lighten-1'    
        break
      case 'Inde' : 
        color = 'fr-orange lighten-1'    
        break
      default: 
        color = 'grey'
        break
    }
    return "chip " + color

  }

}
