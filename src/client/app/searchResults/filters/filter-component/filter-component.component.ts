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
  text: string;

  @Input()
  title: string;

  @Input()
  records: Array<any>;

  @Input()
  icon: string;

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

  //queryParams possible keys: styles, dietreq, bustype, busset(TODO: add rest as developed)
  private updateRouteParams(elementId: string, isSelected: boolean) {
    let currentParams = this.route.snapshot.params,
        queryParams: { [key: string] : string } = { };

    if(this.text in currentParams && isSelected) {
      queryParams[this.text] = elementId;
      queryParams[this.text] = [currentParams[this.text], queryParams[this.text]].join(',');
      this.copyRestOfCurrentParams(currentParams, queryParams);
    }
    else if(isSelected) {
      queryParams[this.text] = elementId;
      Object.assign(queryParams, currentParams);
    }
    else if(this.text in currentParams && !isSelected) {
      let currentParamsArray = currentParams[this.text].split(','),
          index = currentParamsArray.indexOf(elementId);

      if (index > -1) {
        currentParamsArray.splice(index, 1);
      }

      queryParams[this.text] = currentParamsArray.join(',');

      if(!queryParams[this.text]) {
        delete queryParams[this.text];
      }
      this.copyRestOfCurrentParams(currentParams, queryParams);
    }

    this.router.navigate(['/search-results', queryParams ]);
  }

  private  copyRestOfCurrentParams(currentParams: { [key: string] : string }, queryParams: { [key: string] : string }): void {
     for(let key in currentParams) {
        if(key !== this.text) queryParams[key] = currentParams[key];
      }
  }

}


