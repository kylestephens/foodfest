import { Component, Input } from '@angular/core';
import { ActivatedRoute }   from '@angular/router';
import { Style }            from '../../shared/model/style';
import { DietRequirement }  from '../../shared/model/dietRequirement';
import { BusinessType }     from '../../shared/model/businessType';
import { BusinessSetup }     from '../../shared/model/businessSetup';
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
  businessSetups: BusinessSetup[];
  rating: number = 0;
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
    this.getBusinessSetup()
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

  getBusinessSetup(): void {
    this.businessSetups = this.settingsService.getBusinessSetups();
  }

  private deepLinked() {
    if(this.routeParams) {
      let selectedStyles = this.routeParams.styles,
          selectedDietRequirements = this.routeParams.dietreq,
          selectedBusinessTypes = this.routeParams.bustype,
          selectedBusinessSetups = this.routeParams.busset,
          selectedRating = this.routeParams.rating;

      if(selectedStyles) {
        this.updateSelectedItems(selectedStyles, this.styles);
      }
      if(selectedDietRequirements) {
        this.updateSelectedItems(selectedDietRequirements, this.dietRequirements);
      }
      if(selectedBusinessTypes) {
        this.updateSelectedItems(selectedBusinessTypes, this.businessTypes);
      }
      if(selectedBusinessSetups) {
        this.updateSelectedItems(selectedBusinessSetups, this.businessSetups);
      }
      if(selectedRating) {
        this.rating = selectedRating;
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
