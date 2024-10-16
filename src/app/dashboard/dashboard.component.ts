import { Component, inject, AfterViewInit , } from "@angular/core";
import { CommonModule} from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { Chart, registerables } from 'chart.js';
import { CatalogComponent } from "./catalog/catalog.component";
import { OrderComponent } from "./order/order.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CatalogComponent, OrderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements AfterViewInit {

  searchTerm : string = ''
  activeSlide : string = 'dashboard'
  showPopup = false;
  activeRevenue : string = 'day'
  dateRevenue = 'Daily'

  private router = inject(Router)

  constructor() {
   
  }

  ngOnInit() : void {
    const saveSlide = localStorage.getItem('activeSlide');
    this.activeSlide = saveSlide ?? 'dashboard';
    console.log(saveSlide);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.router.url === '/dashboard') {
          window.location.reload()
          this.createRevenueChart();
        }
      }
    }); 
    Chart.register(...registerables); 
  }

  ngAfterViewInit(): void {
    this.createRevenueChart(); 
  }

  setActiveSlide(slide : string) {
     this.activeSlide = slide
     localStorage.setItem('activeSlide', slide)
  }

  logout() {
    this.showPopup = true;
  }

  confirmLogout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.setItem('activeSlide', 'dashboard')
    window.location.reload()
    this.showPopup = false; 
  }

  cancelLogout() {
    this.showPopup = false; 
  }

  onSearch() {}

  clickRevenue(date:string) {
    this.activeRevenue = date
    if(date === 'day'){
      this.dateRevenue = 'Daily'
    } else if(date === 'week'){
      this.dateRevenue = 'Weekly'
    } else if(date === 'month') {
      this.dateRevenue = 'Monthly'
    } else {
      this.dateRevenue = 'Yearly'
    }
  }

  createRevenueChart() {
    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (ctx) {
      const revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: '2024 Revenue',
              data: [85, 80, 75, 90, 95, 80, 85, 90, 85, 80, 85, 90], 
              backgroundColor: 'rgba(54, 162, 235, 0.8)',    
            },
            {
              label: '2023 Revenue',
              data: [60, 65, 70, 60, 65, 70, 65, 60, 65, 70, 65, 60], 
              backgroundColor: 'rgba(255, 159, 64, 0.8)',  
            }
          ]
        },
        options: {
          responsive: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
}
