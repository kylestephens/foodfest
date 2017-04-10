import { Injectable }       from '@angular/core';
import { Router }           from '@angular/router';
import { Observable }       from 'rxjs';
import { Subject }          from 'rxjs/Subject';
import { CONSTANT }         from '../core/constant';
import { Style }            from '../shared/model/style';
import { DietRequirement }  from '../shared/model/dietRequirement';
import { BusinessType }     from '../shared/model/businessType';
import { BusinessSetup }    from '../shared/model/businessSetup';
import { SearchFilter }     from './searchFilter';

@Injectable()
export class FilterService {
  private filterAddedSubject = new Subject<any>();
  private filterRemovedSubject = new Subject<any>();
  private filterRemovedFromActiveSubject = new Subject<any>();
  private filterShownSubject = new Subject<any>();

  constructor(
    private router: Router
  )
  {}

  filterAdded = this.filterAddedSubject.asObservable();
  filterRemoved = this.filterRemovedSubject.asObservable();
  filterRemovedFromActive = this.filterRemovedFromActiveSubject.asObservable();
  filterShown = this.filterShownSubject.asObservable();

  addFilter(searchFilter: SearchFilter) {
    this.filterAddedSubject.next(searchFilter);
  }

  removeFilter(searchFilter: SearchFilter) {
    this.filterRemovedSubject.next(searchFilter);
  }

  removeFilterFromActive(searchFilter: SearchFilter) {
    this.filterRemovedFromActiveSubject.next(searchFilter);
  }

  showFilter(name: string) {
    this.filterShownSubject.next(name);
  }

  //queryParams possible keys: styles, dietreq, bustype, busset
  updateRouteParamsBySelected(currentParams: { [key: string]: string }, name: string, record: any) {
    let elementId = ''+record.id,
        isSelected = record.isSelected,
        queryParams: { [key: string]: string } = { };

    if(name in currentParams && isSelected) {
      queryParams[name] = elementId;
      queryParams[name] = [currentParams[name], queryParams[name]].join(',');
      this.copyRestOfCurrentParams(name, currentParams, queryParams);
    }
    else if(isSelected) {
      queryParams[name] = elementId;
      Object.assign(queryParams, currentParams);
    }
    else if(name in currentParams && !isSelected) {
      let currentParamsArray = currentParams[name].split(','),
          index = currentParamsArray.indexOf(elementId);

      if (index > -1) {
        currentParamsArray.splice(index, 1);
      }

      queryParams[name] = currentParamsArray.join(',');

      if(!queryParams[name]) {
        delete queryParams[name];
      }
      this.copyRestOfCurrentParams(name, currentParams, queryParams);
    }

    this.router.navigate(['/search-results', queryParams]);
  }

  //queryParams possible keys: rating, sort
  updateRouteParam(currentParams: { [key: string]: string }, text: string, value: string) {
    let queryParams: { [key: string]: string } = { };

    Object.assign(queryParams, currentParams);
    queryParams[text] = value;

    if(text === 'rating' && value === '0' || text === 'sort' && value ===  CONSTANT.vendor.DEFAULT_SORT) {
      delete queryParams[text];
    }

    this.router.navigate(['/search-results', queryParams]);
  }

  private copyRestOfCurrentParams(text: string, currentParams: { [key: string]: string }, queryParams: { [key: string]: string }): void {
     for(let key in currentParams) {
        if(key !== text) queryParams[key] = currentParams[key];
      }
  }

}
