import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { LocationResponse } from '@models/responses/location-response.model';
import { Location } from '@models/location.model';

@Injectable({
  providedIn: 'root',
})
export class FetchLocations {

  private readonly baseUrl:string = environment.api.url + environment.api.locations;

  locations = signal<Location[]>([]);
  private readonly http = inject(HttpClient);

  constructor(){
    this.loadLocations();
  }

  private loadLocations():void {
    this.http.get<LocationResponse[]>(this.baseUrl).subscribe({
      next: res => {
        this.locations.set(
          res.map((loc) => this.mapToLocation(loc))
        )
      },
      error: (error) => { console.log(error) }
    })
  }

  private mapToLocation(location:LocationResponse): Location{
    return ({
      id: location.id,
      name: location.name,
      type: location.type,
      childs: location.childs
        ? location.childs.map(locChild => this.mapToLocation(locChild))
        : undefined
    })
  }
}
