import { ActivatedRouteSnapshot, RouteReuseStrategy } from '@angular/router';

export class AARouteReuseStrategy implements RouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }
  store(route: ActivatedRouteSnapshot, handle: {}): void {

  }
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }
  retrieve(route: ActivatedRouteSnapshot): {} {
    return null;
  }
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return false; // default is true if configuration of current and future route are the same
  }
}
