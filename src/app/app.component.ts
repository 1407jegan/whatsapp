import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TokenInterceptor } from './auth.interceptor';
import { EditProductComponent } from "./edit-product/edit-product.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, EditProductComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useValue: TokenInterceptor, multi: true }
  ],


  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'whatsapp';
}
