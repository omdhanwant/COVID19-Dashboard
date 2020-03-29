import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'appFilter'
})
export class FilterPipe implements PipeTransform {
   transform(items: any[], field1: string, field2:string, value: string): any[] {
    if (!items) return [];
    if(!value) return items;
    // return items.filter(it => it[field1].includes(value));
    return items.filter(it =>
        {
            if(it[field1] && it[field1].toLowerCase().includes(value.toLowerCase()) != ''){
                return it[field1].toLowerCase().includes(value.toLowerCase())
            }
            if(it[field2] && it[field2].toLowerCase().includes(value.toLowerCase()) != ''){
                return it[field2].toLowerCase().includes(value.toLowerCase())
            }
            
        }
        
    );
  }
}