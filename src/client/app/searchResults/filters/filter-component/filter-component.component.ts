import { Component, Input, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute }      from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'ak-search-results-filter-component',
  templateUrl: 'filter-component.html',
  styleUrls: ['filter-component.css']
})

export class FilterComponent {
  @Input()
  name: string;

  @Input()
  title: string;

  @Input()
  records: Array<any>;

  constructor(
    private render: Renderer2,
    private route: ActivatedRoute,
    private router: Router
  )
  {}

  onClick(event: any, element: any) {
    element.isSelected = !element.isSelected;
    this.updateRouteParams(''+element.id, element.isSelected);
  }

  //queryParams possible keys: styles,(TODO: add rest as developed)
  private updateRouteParams(elementId: string, isSelected: boolean) {
    let currentParams = this.route.snapshot.params,
        queryParams: { [key: string] : string } = { };

    if(this.name in currentParams && isSelected) {
      queryParams[this.name] = elementId;
      queryParams[this.name] = [currentParams[this.name], queryParams[this.name]].join(',');
    }
    else if(isSelected) {
      queryParams[this.name] = elementId;
      Object.assign(queryParams, currentParams);
    }
    else if(this.name in currentParams && !isSelected) {
      let currentParamsArray = currentParams[this.name].split(','),
          index = currentParamsArray.indexOf(elementId);

      if (index > -1) {
        currentParamsArray.splice(index, 1);
      }

      queryParams[this.name] = currentParamsArray.join(',');

      if(!queryParams[this.name]) {
        delete queryParams[this.name];
      }
    }

    this.router.navigate(['/search-results', queryParams ]);
  }

}


