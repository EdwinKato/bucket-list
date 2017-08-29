import {
	Component
} from '@angular/core';
import {
	Router
} from '@angular/router';
import {
	Idle,
	DEFAULT_INTERRUPTSOURCES
} from '@ng-idle/core';

@Component({
	selector: 'dashboard-cmp',
	templateUrl: 'dashboard.component.html'
})

export class DashboardComponent {
	public idleState = '';
	public timedOut = false;

	constructor(private idle: Idle, private router: Router) {
		idle.setIdle(600);
		idle.setTimeout(1800);
		idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

		idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
		idle.onTimeout.subscribe(() => {
			this.idleState = 'Timed out!';
			this.timedOut = true;
			router.navigateByUrl('/login');
		});
		idle.onIdleStart.subscribe(
			() => this.idleState = 'You\'ve gone idle!');
		idle.onTimeoutWarning.subscribe(
			(countdown) => this.idleState =
				'You will time out in ' + countdown + ' seconds!');

		this.reset();
	}

	public reset() {
		this.idle.watch();
		this.idleState = '';
		this.timedOut = false;
	}
}
