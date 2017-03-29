import { Component, Input } from '@angular/core';
import { Style }            from '../../shared/model/style';
import { SettingsService }  from '../../services/settings.service';
import { ActivatedRoute }   from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'ak-search-results-filters',
  templateUrl: 'search-results-filters.html'
})

export class SearchResultsFiltersComponent {
  styles: Style[];
  routeParams: any;

  constructor(
    private settingsService: SettingsService,
    private route: ActivatedRoute
  )
  {}

  ngOnInit(): void {
    this.routeParams = this.route.snapshot.params;
    this.getStyles();
    this.deepLinked();
  }

  getStyles(): void {
    this.styles = this.settingsService.getStyles();
  }

  private deepLinked() {
    if(this.routeParams) {
      let selectedStyles = this.routeParams.styles;

      if(selectedStyles) {
        let selectedStylesIds = selectedStyles.split(',');

        for(let selectedStylesId of selectedStylesIds) {
          let selectedStyle = this.styles.filter(function( obj ) {
            return obj.id === +selectedStylesId;
          });
          selectedStyle[0].isSelected = true;
        }
      }
    }
  }

}
