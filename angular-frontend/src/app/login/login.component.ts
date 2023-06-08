import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { usersData } from '../shared/users-data';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  users = usersData;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    if (this.loginForm.valid) {
      let user = this.users.find(
        (u: any) =>
          u.email == this.loginForm.value.email &&
          u.password == this.loginForm.value.password
      );
      if (user) {
        this.loginForm.reset();
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['dashboard']);
      } else {
        alert('User not found');
      }
      // this.http.get('http://localhost:3000/signupusers').subscribe(
      //   (res: any) => {
      //     // console.log(res);
      //     let user = res.find(
      //       (u: any) =>
      //         u.email == this.loginForm.value.email &&
      //         u.password == this.loginForm.value.password
      //     );
      //     if (user) {
      //       this.loginForm.reset();
      //       localStorage.setItem('token', 'token');
      //       this.router.navigate(['dashboard']);
      //     } else {
      //       alert('User not found');
      //     }
      //   },
      //   (err) => console.log(err)
      // );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
