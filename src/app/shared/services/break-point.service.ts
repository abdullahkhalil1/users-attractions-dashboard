import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class BreakpointService {
    constructor(private breakpointObserver: BreakpointObserver) { }

    getCols(): Observable<number> {
        return this.breakpointObserver.observe([
            Breakpoints.XSmall,
            Breakpoints.Small,
            Breakpoints.Medium,
            Breakpoints.Large,
            Breakpoints.XLarge
        ]).pipe(
            map(result => {
                if (result.breakpoints[Breakpoints.XSmall]) {
                    return 1;
                } else if (result.breakpoints[Breakpoints.Small]) {
                    return 2;
                } else if (result.breakpoints[Breakpoints.Medium]) {
                    return 3;
                } else {
                    return 4;
                }
            })
        );
    }

    isMobile(): Observable<boolean> {
        return this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
            .pipe(
                map(result => result.matches)
            );
    }
}