import { NgModule }                     from '@angular/core';
import { RouterModule }                 from '@angular/router';
import { CreateMarketComponent }        from './create-market.component';
import { CreateMarketStepOneComponent } from './steps/one/create-market-step-one.component';
import { CreateMarketStepTwoComponent } from './steps/two/create-market-step-two.component';
import { AuthGuard }                    from '../../auth-guard.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: CreateMarketComponent,
          canActivate: [AuthGuard],
          children: [
            { path: '', redirectTo: 'step-1', pathMatch: 'full' },
            { path: 'step-1', component: CreateMarketStepOneComponent },
            { path: 'step-2', component: CreateMarketStepTwoComponent }
          ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class CreateMarketRoutingModule { }
