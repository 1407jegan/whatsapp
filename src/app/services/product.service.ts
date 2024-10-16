import { inject, Injectable, Injector } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { environment } from "../../environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.apiUrl;
  private demoUrl = environment.productUrl

  private http = inject(HttpClient)
  private authService = inject(AuthService)

  postDashboardProduct(data:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}${'product'}/`,data, {headers: this.getHeaders()})
  }

  getDashboardProduct(url?:any):Observable<any>{
    return this.http.get<any>(url || `${this.baseUrl}${'get-product'}/`, {headers: this.getHeaders()})
  }

  getCatalogSearchProduct(searchTerm:any):Observable<any>{
    return this.http.get<any>(`${this.demoUrl}product-list/?search=${searchTerm}`, {headers: this.getHeaders()})
  }

  deleteDashboardProduct(id:any):Observable<any>{
    return this.http.delete<any>(`${this.baseUrl}${'delete-product'}/${id}/`, {headers: this.getHeaders()})
  }
                  
  editCatalogProduct(id:any, data:any):Observable<any>{
    console.log(id, data)
    return this.http.patch<any>(`${this.baseUrl}${'update-product'}/${id}/`, data, {headers: this.getHeaders()})
  }

  getOrder(url?:any):Observable<any>{
    return this.http.get<any>(url || `${this.demoUrl}${'get-orderdetail'}/`, {headers: this.getHeaders()})
  }

  getOrderProduct(id:number):Observable<any>{
    return this.http.get<any>(`${this.demoUrl}${'get-orderitem'}/${id}`, {headers: this.getHeaders()})
  }
  
  
                              
  getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  

}
