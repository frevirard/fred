import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding">
      <a [routerLink]="['/']">
        <img style="width: 150px;"
          src="https://www.lendys.fr/wp-content/uploads/2015/12/LogoLendys-Large.png"
          class="align-middle m-2"
          alt="logo"
        />
      </a>
    </div>
  `,
})
export class BrandingComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService) {}
}
