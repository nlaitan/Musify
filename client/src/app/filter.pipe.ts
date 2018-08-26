import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(entities: any, term: any): any {
    // check if search is undefined
    if (term === undefined) return entities;
    
    //ARTISTAS
    
    return entities.filter(function(entity){
      
      if(entities[0].name && entities[0].description) {
        return (
          entity.name.toLowerCase().includes(term.toLowerCase()) ||
          entity.description.toLowerCase().includes(term.toLowerCase())
        );
      } else {
        if(entities[0].title && entities[0].description) {
          return (
            entity.title.toLowerCase().includes(term.toLowerCase()) ||
            entity.description.toLowerCase().includes(term.toLowerCase()) ||
            entity.artist.name.toLowerCase().includes(term.toLowerCase())
          );
        } else {
          if(entities[0].file) {
            return ( 
              entity.name.toLowerCase().includes(term.toLowerCase()) ||
              entity.album.artist.name.toLowerCase().includes(term.toLowerCase())
            );
          }
        }
      }

    }
  }

}
