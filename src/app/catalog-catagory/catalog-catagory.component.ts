import { Component, inject, OnInit } from "@angular/core";
import { CommonModule, IMAGE_CONFIG, NgOptimizedImage } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { ProductService } from "../services/product.service";
import { Location } from "@angular/common";
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-catalog-catagory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './catalog-catagory.component.html',
  styleUrl: './catalog-catagory.component.css'
})
export class CatalogCatagoryComponent implements OnInit {

  private productService = inject(ProductService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadPageData()
  }

  catalogProduct: any[] = [];

  currentPage: number = 1;
  totalPages: number = 10;
  isSlidePanelVisible = false;
  productView = true
 
 
  searchData = {
    searchTerm: "",
    searchProduct: "",
  };
 
  options = [
    { value: "inr", label: "INR" },
    { value: "usd", label: "USD" },
    { value: "eur", label: "EUR" },
  ];

  availabilityOption = [
    { value: "in Stack", label: "in stock" },
    { value: "out OfStack", label: "out of stock" },
  ]

  statusOption = [
    { value: "active", label: "Active" },
    { value: "archive", label: "Archived" },
  ]

  catagoryList = [
    { value: "all type", label: "AllType" },
    { value: "cup cake", label: "CupCake" },
    { value: "birthday cake", label: "BirthdayCake" },
  ];

  tabData = {
    catagoryTab: this.catagoryList[0].label,
  };

  onChangeCatagory(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.tabData.catagoryTab = value;
    this.router.navigate(['/catalog-catagory'])
  }

  activeTab: number = 5;

  setActiveTab(index: number) {
    this.activeTab = index;
  }

 

  data = {
    url: "",
    itemType: "PRODUCT",
    name: "",
    price: "",
    currency: "",
    description: "",
    imageUrl: "",
    retailerId: "",
    gtin: "",
    mpn: "",
    brand: "",
    selectedOption: "INR",
  };

  catalogData = {
    imageUrl : '',
    name : '',
    price : '',
    currency : '',
    brand : '',
    available : this.availabilityOption[0].value,
    status : this.statusOption[0].label,
  }

  

  onChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.data.selectedOption = value;
    this.data.selectedOption = value;
    console.log(this.data.selectedOption);
  }

  onChangeAvailabilityInput(event : Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.catalogData.available = value
  }

  onChangeStatusInput(event : Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.catalogData.status = value
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  

  onSearchProduct() {
    if(this.searchData.searchProduct.trim() === ''){
      this.loadPageData()
    } else {
      const searchProductData = this.catalogProduct.filter((product) => {
        return product.name.toLowerCase().includes(this.searchData.searchProduct.toLowerCase())
      })
      this.catalogProduct = searchProductData
      console.log(searchProductData)
    }
  }

  addProductBtn() {
    this.isSlidePanelVisible = true;
  }
  closePanel() {
    this.isSlidePanelVisible = false;
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPageData();
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPageData();
    }
  }

  cancelBtn() {
    this.isSlidePanelVisible = false;
  }

  submitBtn() {
    const productData = {
      url: this.data.url,
      item_type: this.data.itemType,
      name: this.data.name,
      price: this.data.price,
      currency: this.data.selectedOption,
      description: this.data.description,
      image_url: this.data.imageUrl,
      retailer_id: this.data.retailerId,
      gtin: this.data.gtin,
      mpn: this.data.mpn,
      brand: this.data.brand,
    };
    this.isSlidePanelVisible = false;
    this.productService.postDashboardProduct(productData).subscribe((res) => {
      console.log(res);
    });
    window.location.reload()
    //console.log(productData);
  }

  deleteCatalogProduct(id:number) : void {
    this.productService.deleteDashboardProduct(id).subscribe(() => {
      this.catalogProduct.filter(each => {
        each.id !== id
      })
    })
    window.location.reload()
  }

  editCatalogProduct(id: number): void {
    this.productView = false;
    this.catalogProduct = this.catalogProduct.filter((each) => each.id === id);
    this.catalogProduct.forEach(each => {
      this.catalogData.imageUrl = each.image_url
      this.catalogData.name = each.name
      this.catalogData.price = each.price
      this.catalogData.currency = each.currency
      this.catalogData.brand = each.brand
      this.catalogData.available = each.availability
      this.catalogData.status = each.status
   })
  
    console.log(this.catalogProduct);  
  }
  

  updateBtn(id:number) {
    const data = {
      image_url : this.catalogData.imageUrl, name : this.catalogData.name, price : this.catalogData.price, currency : this.catalogData.currency,
      brand : this.catalogData.brand, availability : this.catalogData.available, visibility : this.catalogData.status
    }
    this.productService.editCatalogProduct(id, data).subscribe(product => {
      console.log(product)
    })
    window.location.reload()
  }

  loadPageData() {
    this.productService.getDashboardProduct().subscribe((product) => {
      //console.log(product)
      const productData = [product];
      productData.map((each) => {
        this.catalogProduct = each.results.data
        //console.log(this.catalogProduct);
      });
      //console.log(this.catalogProduct)
     
    });
    
  }

}
