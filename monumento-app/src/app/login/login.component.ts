import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit{
  message= 'Vous êtes deconnecté. (admin / admin)'
  identifiant = ''
  password = ''

  constructor(
    public auth: AuthService,
    public router: Router
  ) {}

  ngOnInit() {}

  setMessage(): void {
    this.message = this.auth.isLoggedIn ? 'Vous êtes connecté' : 'Vous êtes déconnecté'
  }

  login(): void {
    this.auth.login(this.identifiant, this.password).subscribe({
      next: () => {
        this.router.navigateByUrl('/monuments')
        this.setMessage();
      },
      error: () => {
        this.message = 'Identifiants invalides';
        this.router.navigateByUrl('/login')
      }
    })
  }

  logout(): void {
    this.auth.logout();
    this.setMessage()
  }

}
