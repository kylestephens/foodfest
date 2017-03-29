import { Component, Input } from '@angular/core';
import { Style }            from '../../shared/model/style';
import { StylesService }    from '../../services/styles.service';
import { ActivatedRoute }   from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'ak-search-results-filters',
  templateUrl: 'search-results-filters.html',
  styleUrls: ['search-results-filters.css']
})

export class SearchResultsFiltersComponent {
  styles: Style[];
  routeParams: any;

  constructor(
    private stylesService: StylesService,
    private route: ActivatedRoute
  )
  {}

  ngOnInit(): void {
    this.routeParams = this.route.snapshot.params;
    this.getStyles();
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

  getStyles(): void {
      this.stylesService.getStyles().then(styles => {
        this.styles = styles;
        this.deepLinked();
      });
  }

}
