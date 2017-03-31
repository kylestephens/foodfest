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
  rating: number;

  @Input()
  icon: string;

  constructor(
    private render: Renderer2,
    private route: ActivatedRoute,
    private router: Router
  )
  {}

  onClickRecord(event: any, record: any) {
    record.isSelected = !record.isSelected;
    this.updateRouteParams(''+record.id, record.isSelected);
  }

  onClickRating(event: any, rating: number) {
    if(+this.rating === +rating) {
      this.rating = 0;
    }
    else {
       this.rating = rating;
    }
    this.updateRouteParamRating();
  }

  //queryParams possible keys: styles, dietreq, bustype, busset, rating
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

  private updateRouteParamRating() {
    let currentParams = this.route.snapshot.params,
         queryParams: { [key: string] : number } = { };

    Object.assign(queryParams, currentParams);
    queryParams[this.text] = this.rating;

    if(this.rating === 0) {
      delete queryParams[this.text];
    }
    this.router.navigate(['/search-results', queryParams);
  }

  private  copyRestOfCurrentParams(currentParams: { [key: string] : string }, queryParams: { [key: string] : string }): void {
     for(let key in currentParams) {
        if(key !== this.text) queryParams[key] = currentParams[key];
      }
  }

}


