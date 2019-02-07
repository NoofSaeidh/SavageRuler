import { Route, Routes } from '@angular/router';
import { ReadonlyScreenComponent } from './readonly-screen.component';
import { Type } from '@angular/core';

export function readonlyScreenRoute(basePath: string, component: Type<any>): Route {
  return {
    path: basePath + '/screen',
    children: [
      {path: '**', component: component}
    ]
      // { path: '', redirectTo: 'grid', pathMatch: 'full' },
      // { path: 'grid', component: component },
      // { path: 'item', component: component },
    // ],
  };
}

export function readonlyScreenRouteWithRedirect(baseUrl: string,  component: Type<any>): Routes {
  return [
    {path: baseUrl, redirectTo: baseUrl + '/screen'},
    readonlyScreenRoute(baseUrl, component)
  ];
}
