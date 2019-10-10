import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthLoginInfo } from 'app/exchange/model/login-info';
import { AuthService } from 'app/auth/auth.service';
import { TokenStorageService } from 'app/auth/token.storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  private loginInfo: AuthLoginInfo;

  constructor(private authService: AuthService,
     private tokenStorage: TokenStorageService,
     private router: Router) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getAuthorities();
      this.router.navigate(['/dashboard']);
    }

  }

  onSubmit() {

      console.log(this.form);

    this.loginInfo = new AuthLoginInfo(
      this.form.username,
      this.form.password);

    this.authService.attemptAuth(this.loginInfo).subscribe(
        (data: any) => {
          console.log(data);
          const jwt = (data).headers.get('Authorization');
          this.tokenStorage.saveToken(jwt);
          this.tokenStorage.parseJwt(jwt);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.tokenStorage.getAuthorities();
          this.router.navigate(['/dashboard']);
      },
      error => {
        console.log(error);
        this.errorMessage = error.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage() {
    window.location.reload();
  }


}
