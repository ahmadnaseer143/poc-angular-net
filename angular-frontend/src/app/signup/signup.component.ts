import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { usersData } from '../shared/users-data';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  formValue!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: [''],
      password: ['', Validators.required],
    });
  }

  signup() {
    // console.log(this.formValue.value);
    if (this.formValue.valid) {
      const newUser = {
        name: this.formValue.value.name,
        email: this.formValue.value.email,
        mobile: this.formValue.value.mobile,
        password: this.formValue.value.password,
      };

      usersData.push(newUser);

      this.formValue.reset();
      this.router.navigate(['login']);
      // this.http
      //   .post('http://localhost:3000/signupusers', this.formValue.value)
      //   .subscribe(
      //     (res) => {
      //       // console.log(res);
      //       this.formValue.reset();
      //       this.router.navigate(['login']);
      //     },
      //     (err) => {
      //       console.log(err);
      //     }
      //   );
    } else {
      this.formValue.markAllAsTouched();
    }
  }
}
