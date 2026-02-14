import { Component, inject, Input, input, Self, signal } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatError, MatFormField, MatLabel } from '@angular/material/select';
import { Account } from '../../../core/services/account';
import { Router } from '@angular/router';
import { Snackbar } from '../../../core/services/snackbar';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-text-input',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError
  ],
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
})
export class TextInput implements ControlValueAccessor{
  @Input() label = '';
  @Input() type = 'text';

  constructor(@Self() public controlDir: NgControl){
    this.controlDir.valueAccessor = this;
  }
  writeValue(obj: any): void {
  
  }
  registerOnChange(fn: any): void {
    
  }
  registerOnTouched(fn: any): void {
    
  }
  get control(){
    return this.controlDir.control as FormControl;
  }
}
