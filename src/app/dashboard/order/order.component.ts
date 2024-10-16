import { Component, Inject, inject, OnInit } from "@angular/core";
import { CommonModule, IMAGE_CONFIG, NgOptimizedImage } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { ProductService } from "../../services/product.service";

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {

  
  orderList : any[] = []; 
  orderListCopy : any[] = [];
  viewProduct : any[] = [];
  orderCustomer : any = [];

  searchTerm : string = ''
  activeTab: string = 'all';
  orderId : number = 0;
  searchData = {
    searchTerm: "",
    searchProduct: "",
  };
  prevPage : number = 0;
  currentPage: number = 1;
  nextPage : number = 2;
  prevClass = 'is-disable'
  nextClass = '';
  nextArrow = '';
  status = 'pending'
  isLoading = false
  view = false
  pagination = {
    next : '',
    prev : ''
  }

  private productService = inject(ProductService)

  ngOnInit(): void {
    this.loadOrderView()
  }


  setActiveTab(tab:string) {
    this.activeTab = tab;
   if(tab === 'all') {
    this.loadOrderView()
    this.currentPage = 1
    this.nextPage--;
    this.prevClass = 'is-disable'
   } else {
    this.orderListCopy = this.orderList.filter(each => each.payment_status === tab)
    console.log(this.orderListCopy, tab);
    
   }
  }

  orderView(id:number) {
    this.view = true
     this.productService.getOrderProduct(id).subscribe({
      next : (res:any) => {
        console.log(res)
        this.orderCustomer = [res.customer]
        this.viewProduct = res.data
        console.log(this.viewProduct)
      }
     })
  }

  closeModal() {
    this.view = false;
  }

  goToNextPage() {
    if (this.currentPage && this.pagination.next) {
      this.currentPage++;
      this.nextPage = this.currentPage + 1
      this.prevPage = this.currentPage - 1
      this.loadOrderView(this.pagination.next)
      this.prevClass = 'arrow-btn'
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1 && this.pagination.prev) {
      this.currentPage--;
      this.nextPage = this.currentPage + 1
      this.prevPage = this.currentPage - 1
      this.prevClass = 'arrow-btn'
      this.loadOrderView(this.pagination.prev)
    } if(this.currentPage === 1){
      this.prevClass = 'is-disable'
    }
  }
  thirdPage() {
    this.prevPage = 2
    this.currentPage = 3
    this.nextPage = 4
    this.prevClass = 'arrow-btn'
  }

  // productView(id:number) {
  
  //   this.viewProduct = this.orderList.filter(each => each.id === id)
  //   console.log(this.viewProduct)
  // }

  loadOrderView(url?:string) : void {
    this.isLoading = true
    this.productService.getOrder(url).subscribe(product => {
      console.log(product)
      this.orderList = product.results.data
      this.orderListCopy = this.orderList
      this.pagination.next = product.next
      this.pagination.prev = product.previous
      this.orderList.map((each, index) => {
        const orderOfDate = new Date(each.order_date).toISOString().substring(0, 10);
        if(this.orderListCopy[index]){
          this.orderListCopy[index]['order_of_date'] = orderOfDate
        }   
        console.log(this.status);
                    
      })
      if(this.pagination.next) {
        this.nextClass = 'next-page'
        this.nextArrow = 'arrow-btn'
      } else{
        this.nextClass = 'next-disable'
        this.nextArrow = 'is-disable'
      }
      
      console.log(this.orderList);
      
      
      this.isLoading = false
      
    })
    
  }
}
