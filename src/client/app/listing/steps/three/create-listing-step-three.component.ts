import { Component, EventEmitter, Output } from '@angular/core';
import { SelectModule }                    from 'ng2-select';
import { CreateListingService }            from '../../create-listing.service';
import { CONSTANT }                        from '../../../core/constant';

/**
 * This class represents the lazy loaded CreateListingComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'ak-create-listing-step-three',
  templateUrl: 'create-listing-step-three.component.html'
})

export class CreateListingStepThreeComponent {

  constructor(private createListingService: CreateListingService) {}

  // Dummy data for select / multiselect
  public items:Array<string> = ['Amsterdam', 'Antwerp', 'Athens', 'Barcelona',
    'Berlin', 'Birmingham', 'Bradford', 'Bremen', 'Brussels', 'Bucharest',
    'Budapest', 'Cologne', 'Copenhagen', 'Dortmund', 'Dresden', 'Dublin',
    'Düsseldorf', 'Essen', 'Frankfurt', 'Genoa', 'Glasgow', 'Gothenburg',
    'Hamburg', 'Hannover', 'Helsinki', 'Kraków', 'Leeds', 'Leipzig', 'Lisbon',
    'London', 'Madrid', 'Manchester', 'Marseille', 'Milan', 'Munich', 'Málaga',
    'Naples', 'Palermo', 'Paris', 'Poznań', 'Prague', 'Riga', 'Rome',
    'Rotterdam', 'Seville', 'Sheffield', 'Sofia', 'Stockholm', 'Stuttgart',
    'The Hague', 'Turin', 'Valencia', 'Vienna', 'Vilnius', 'Warsaw', 'Wrocław',
    'Zagreb', 'Zaragoza', 'Łódź'];

  private value:any = {};

  public nextStep() {
    this.createListingService.nextStep();
  };

  public previousStep() {
    this.createListingService.previousStep();
  };

  // Handlers for select / multiselect
  public selected(value:any):void {
    console.log('Selected value is: ', value);
  };

  public removed(value:any):void {
    console.log('Removed value is: ', value);
  };

  public typed(value:any):void {
    console.log('New search input: ', value);
  };

  public refreshValue(value:any):void {
    this.value = value;
  };

};
