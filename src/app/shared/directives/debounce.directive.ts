import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, NgControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Directive({
    selector: '[appDebounce]'
})
export class DebounceDirective implements OnInit, OnDestroy {
    @Input() debounceTime = 300;
    @Output() debouncedValue = new EventEmitter<any>();

    private valueChangesSubscription!: Subscription;

    constructor(private control: NgControl) { }

    ngOnInit() {
        const control = this.control.control as AbstractControl;
        this.valueChangesSubscription = control.valueChanges
            .pipe(
                debounceTime(this.debounceTime),
                distinctUntilChanged()
            )
            .subscribe(value => this.debouncedValue.emit(value));
    }

    ngOnDestroy() {
        if (this.valueChangesSubscription) {
            this.valueChangesSubscription.unsubscribe();
        }
    }
}
