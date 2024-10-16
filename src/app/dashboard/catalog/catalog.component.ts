import { Component, inject, OnInit } from "@angular/core";
import { CommonModule, IMAGE_CONFIG, NgOptimizedImage } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { ProductService } from "../../services/product.service";

@Component({
  selector: "app-catalog",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./catalog.component.html",
  styleUrl: "./catalog.component.css",
})
export class CatalogComponent implements OnInit {

  private productService = inject(ProductService);
  private router = inject(Router);

  catalogProduct: any[] = [];
  filterProduct: any[] = [];
  editCatalog: any[] = [];

  prevPage : number = 0;
  currentPage: number = 1;
  nextPage : number = 2;
  isSlidePanelVisible = false;
  productView = true;
  isLoading = false;
  prevClass = 'is-disable'
  nextClass = 'next-disable'
  nextArrow = 'is-disable';
  status = '';

  searchData = {
    searchTerm: "",
    searchProduct: "",
  };
  pagination = {
    next : '',
    prev : ''
  }

  ngOnInit(): void {
    this.loadPageData();
  }

  options = [
    { value: "inr", label: "INR" }, 
    { value: "usd", label: "USD" },
    { value: "eur", label: "EUR" },
  ];
  availabilityOption = [
    { value: "in_stack", label: "in_stock" },
    { value: "out_of_stack", label: "out_of_stock" },
  ];
  statusOption = [
    { value: "active", label: "Active" },
    { value: "archive", label: "Archived" },
  ];
  catagoryList = [
    { value: "alltype", label: "AllType" },
    { value: "cake1", label: "CupCake" },
    { value: "cake2", label: "BirthdayCake" },
  ];
  // tabData: { catagoryTab: string | null } = {
  //   catagoryTab: null
  // };

  tabData = {
    catagoryTab: this.catagoryList[0].value,
  };


  onChangeCatagory(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.tabData.catagoryTab = value;
    console.log(value)

    if(value === 'alltype') {
      this.loadPageData()
    } else {
      this.catalogProduct = [this.filterProduct.find(each => 
        each.retailer_id.toLowerCase().includes(value)
      )]
    }
    console.log(this.catalogProduct)
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
    imageUrl : "",
    name: "",
    price: "",
    currency: "",
    brand: "", 
    status: this.statusOption[0].value,
  };
  availability: string = ""

  onChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.data.selectedOption = value;
    this.data.selectedOption = value;
    console.log(this.data.selectedOption);
  }

  onChangeAvailabilityInput(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.availability = value;
  }

  onChangeStatusInput(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.catalogData.status = value;
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  // onSearchProduct() {
  //   if (this.searchData.searchProduct.trim() === "") {
  //     this.loadPageData();
  //   } else {
  //     const searchProductData = this.catalogProduct.filter((product) => {
  //       return product.name.toLowerCase().includes(this.searchData.searchProduct.toLowerCase());
  //     });
  //     this.catalogProduct = searchProductData;
  //     console.log(searchProductData);
  //   }
  // }

  onSearch(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.productService.getCatalogSearchProduct(inputValue).subscribe({
      next: (res:any) => {
        console.log(res)
        this.catalogProduct = res.results.data
      }
    })
    //console.log(inputValue);
  }

  addProductBtn() {
    this.isSlidePanelVisible = true;
  }
  closePanel() {
    this.isSlidePanelVisible = false;
  }

  goToNextPage() {
    if (this.currentPage && this.pagination.next) {
      this.currentPage++;
      this.nextPage = this.currentPage + 1
      this.prevPage = this.currentPage - 1
      this.loadPageData(this.pagination.next)
      this.prevClass = 'arrow-btn'
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1 && this.pagination.prev) {
      this.currentPage--;
      this.nextPage = this.currentPage + 1
      this.prevPage = this.currentPage - 1
      this.prevClass = 'arrow-btn'
      this.loadPageData(this.pagination.prev)
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
    window.location.reload();
    //console.log(productData);
  }

  deleteCatalogProduct(id: number): void {
    console.log(id)
    this.productService.deleteDashboardProduct(id).subscribe((res) => {
      console.log(res)
      
    });
    //window.location.reload();
  }

  editCatalogProduct(id: number): void {
    this.productView = true;
  
    this.editCatalog = this.catalogProduct.filter(each => each.id === id);
    this.editCatalog.map(each => {
      this.catalogData.imageUrl = each.image_url;
      this.catalogData.name = each.name;
      this.catalogData.price = each.price;
      this.catalogData.currency = each.currency;
      this.catalogData.brand = each.brand;
      this.availability = each.availability;
      console.log(each.availability)
    });
  }

  editCancelBtn() {
    this.productView = false
  }

  updateBtn(id:number) {
    const data = {
      image_url : this.catalogData.imageUrl, name : this.catalogData.name, price : this.catalogData.price, currency : this.catalogData.currency,
      brand : this.catalogData.brand, availability : this.availability
    }

    this.productService.editCatalogProduct(id, data).subscribe(res => {
       console.log(res)
    })
    window.location.reload()
  }


  loadPageData(url? : string) {
    this.isLoading = true;
    this.productService.getDashboardProduct(url).subscribe((product) => {
      console.log(product)
      const productData = [product];
      this.pagination.next = product.next
      this.pagination.prev = product.previous
      productData.map((each) => {
        this.catalogProduct = each.results.data;
        this.filterProduct = this.catalogProduct
        //console.log(this.catalogProduct);
      });
      if(this.pagination.next) {
        this.nextClass = 'next-page'
        this.nextArrow = 'arrow-btn'
      } else{
        this.nextClass = 'next-disable'
        this.nextArrow = 'is-disable'
      }
      this.isLoading = false;
      
    });
  }
}
