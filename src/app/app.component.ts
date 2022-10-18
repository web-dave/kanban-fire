import { Component } from '@angular/core';
import { AuthProcessService, AuthProvider } from 'ngx-auth-firebaseui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  user$ = this.auth.user$;
  authProviders = [AuthProvider.Google];
  constructor(private auth: AuthProcessService) {}

  logout() {
    this.auth.signOut();
  }
  printUser(event: any) {
    console.log(event);
  }

  printError(event: any) {
    console.error(event);
  }
}
