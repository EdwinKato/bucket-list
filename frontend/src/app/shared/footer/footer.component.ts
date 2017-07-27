import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'footer-cmp',
    templateUrl: 'footer.component.html'
})

export class FooterComponent {
    private test: Date = new Date();
}
