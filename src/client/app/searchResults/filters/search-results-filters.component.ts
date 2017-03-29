import { Component, Input } from '@angular/core';
import { ActivatedRoute }   from '@angular/router';
import { Style }            from '../../shared/model/style';
import { DietRequirement }  from '../../shared/model/dietRequirement';
import { BusinessType }     from '../../shared/model/businessType';
import { SettingsService }  from '../../services/settings.service';

@Component({
  moduleId: module.id,
  selector: 'ak-search-results-filters',
  templateUrl: 'search-results-filters.html'
})

export class SearchResultsFiltersComponent {
  styles: Style[];
  dietRequirements: DietRequirement[];
  businessTypes: BusinessType[];
  routeParams: any;

  constructor(
    private settingsService: SettingsService,
    private route: ActivatedRoute
  )
  {}

  ngOnInit(): void {
    this.routeParams = this.route.snapshot.params;
    this.getStyles();
    this.getDietRequirements();
    this.getBusinessTypes();
    this.deepLinked();
  }

  getStyles(): void {
    this.styles = this.settingsService.getStyles();
  }

  getDietRequirements(): void {
    this.dietRequirements = this.settingsService.getDietRequirements();
  }

  getBusinessTypes(): void {
    this.businessTypes = this.settingsService.getBusinessTypes();
  }

  private deepLinked() {
    if(this.routeParams) {
      let selectedStyles = this.routeParams.styles,
          selectedDietRequirements = this.routeParams.dietreq,
          selectedBusinessTypes = this.routeParams.bustype;

      if(selectedStyles) {
        this.updateSelectedItems(selectedStyles, this.styles);
      }
      if(selectedDietRequirements) {
        this.updateSelectedItems(selectedDietRequirements, this.dietRequirements);
      }
      if(selectedBusinessTypes) {
        this.updateSelectedItems(selectedBusinessTypes, this.businessTypes);
      }
    }
  }

  private updateSelectedItems(selectedItems: string, items: Array<any>) {
    let selectedItemsIds = selectedItems.split(',');
    for(let selectedItemsId of selectedItemsIds) {
      let selectedItem = items.filter(function( obj ) {
        return obj.id === +selectedItemsId;
      });
      selectedItem[0].isSelected = true;
    }
  }
}
