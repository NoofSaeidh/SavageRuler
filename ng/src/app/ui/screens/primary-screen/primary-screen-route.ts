import { Route, Routes } from '@angular/router';
import { Type } from '@angular/core';

export function primaryScreenRoute(basePath: string, component: Type<any>): Route {
  return { path: basePath + '/primary', component: component };
}

export function primaryScreenRouteWithRedirect(baseUrl: string,  component: Type<any>): Routes {
  return [
    {path: baseUrl, redirectTo: baseUrl + '/primary'},
    primaryScreenRoute(baseUrl, component),
  ];
}
