import { Component,
         ElementRef,
         OnInit,
         Renderer2,
         ViewChild }             from '@angular/core';
import { ActivatedRoute,
         Params,
         Router }                from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'ak-listing-complete',
  templateUrl: 'listing-complete.component.html',
  styleUrls: ['listing-complete.component.css']
})

export class ListingCompleteComponent implements OnInit {
  @ViewChild('tickAnimation')
  public tickAnimationElementRef: ElementRef;

  private allowedParams = ['market'];
  private reference: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2
    )
  {}

  ngOnInit() {
    this.route.params.subscribe(
      params => this.reference = params['ref']
    );

    if(this.allowedParams.indexOf(this.reference) === -1) {
       this.router.navigate(['/']);
    }

    setTimeout(() => {
      this.renderer.addClass(this.tickAnimationElementRef.nativeElement, 'drawn');
    }, 300);
  }
}


