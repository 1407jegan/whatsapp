import { Component, Injectable, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root",
})

@Component({
  selector: 'app-login',
  standalone: true, 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule] 
})
export class LoginComponent implements OnInit {

  persion = {
    email: '',
    password: ''
  }
  error= '';

  constructor(private auth: AuthService, private route: Router) {}

  ngOnInit(): void {}

  login() {
    this.auth.login(this.persion.email, this.persion.password).subscribe({
      next : (res:any) => {
        if (res.result === 'success') {
          this.route.navigate(['/dashboard']);
        } else {
          alert('Invalid Email or Password')
          this.error = res.error
          console.log(res)
        }
      }
    })
    
  }
}
