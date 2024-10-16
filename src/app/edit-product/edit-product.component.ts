import { Component, inject, OnInit } from "@angular/core";
import { CommonModule, IMAGE_CONFIG, NgOptimizedImage } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ProductService } from "../services/product.service";
import { Location } from "@angular/common";
import { AuthService } from "../services/auth.service";
import { animate, state, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent  {
  isOpen = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }
  

}
