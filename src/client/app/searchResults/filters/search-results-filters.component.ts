import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute }   from '@angular/router';
import { Style }            from '../../shared/model/style';
import { DietRequirement }  from '../../shared/model/dietRequirement';
import { BusinessType }     from '../../shared/model/businessType';
import { BusinessSetup }    from '../../shared/model/businessSetup';
import { EventType }        from '../../shared/model/eventType';
import { SettingsService }  from '../../services/settings.service';
import { FilterService }    from '../filter.service';
import { SearchFilter }     from '../searchFilter';
import { Subscription }     from 'rxjs/Subscription';

/**
 * This class represents whole filter component on search results page.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-search-results-filters',
  templateUrl: 'search-results-filters.html'
})

export class SearchResultsFiltersComponent {

  /*
  * Emit padding to be set on parent in phone mode
  */
  @Output()
  notify: EventEmitter<number> = new EventEmitter<number>();

  private subscription: Subscription;
  styles: Style[];
  dietRequirements: DietRequirement[];
  businessTypes: BusinessType[];
  businessSetups: BusinessSetup[];
  eventTypes: EventType[];
  rating: number = 0;
  routeParams: any;

  constructor(
    private settingsService: SettingsService,
    private filterService: FilterService,
    private route: ActivatedRoute
  )
  {}

  ngOnInit(): void {
    this.routeParams = this.route.snapshot.params;
    if(this.settingsService.getIsSettingsCallDone()) {
      this.initComponent();
    }
    this.subscription = this.settingsService.settingsRetrived.subscribe(
      () => {
        this.initComponent();
        //unsubscribe now because we got the data
        this.subscription.unsubscribe();
      }
    );
  }

  initComponent(): void {
    this.getStyles();
    this.getDietRequirements();
    this.getBusinessTypes();
    this.getBusinessSetup();
    this.getEventTypes();
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

  getEventTypes(): void {
    this.eventTypes = this.settingsService.getEventTypes();
  }

  private deepLinked() {
    if(this.routeParams) {
      let selectedStyles = this.routeParams.styles,
          selectedDietRequirements = this.routeParams.dietreq,
          selectedBusinessTypes = this.routeParams.bustype,
          selectedBusinessSetups = this.routeParams.busset,
          selectedEventTypes = this.routeParams.evetype,
          selectedRating = this.routeParams.rating;

      if(selectedStyles) {
        this.updateSelectedItems('styles', selectedStyles, this.styles);
      }
      if(selectedDietRequirements) {
        this.updateSelectedItems('dietreq', selectedDietRequirements, this.dietRequirements);
      }
      if(selectedBusinessTypes) {
        this.updateSelectedItems('bustype', selectedBusinessTypes, this.businessTypes);
      }
      if(selectedBusinessSetups) {
        this.updateSelectedItems('busset', selectedBusinessSetups, this.businessSetups);
      }
      if(selectedEventTypes) {
        this.updateSelectedItems('evetype', selectedEventTypes, this.eventTypes);
      }
      if(selectedRating) {
        this.rating = selectedRating;
        this.filterService.addFilter(new SearchFilter('rating', null, +this.rating));
      }
    }
  }

  private updateSelectedItems(name:string, selectedItems: string, items: Array<any>) {
    let selectedItemsIds = selectedItems.split(',');
    for(let selectedItemsId of selectedItemsIds) {
      let selectedItem = items.filter(function( obj ) {
        return obj.id === +selectedItemsId;
      });
      selectedItem[0].isSelected = true;
      let searchFilter = new SearchFilter(name, selectedItem[0]);
      this.filterService.addFilter(searchFilter);
    }
  }

  /**
  * Set padding of parent to height emitted from child in phone mode
  */
  onNotify(paddingBottom: number):void {
    this.notify.emit(paddingBottom);
  }
}
