import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatInput } from '@angular/material/input';
import { MatError, MatFormField, MatLabel } from '@angular/material/select';
import { Account } from '../../../core/services/account';
import { Router } from '@angular/router';
import { Snackbar } from '../../../core/services/snackbar';
import { JsonPipe } from '@angular/common';
import { TextInput } from "../../../shared/components/text-input/text-input";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatButton,
    TextInput
],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  private accountService = inject(Account);
  private router = inject(Router);
  private snack = inject(Snackbar);
  validationErrors = signal<string[]>([]);

  
  registerForm = this.fb.group({
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(){
    this.accountService.register(this.registerForm.value).subscribe({
      next: () =>{
        this.snack.success("Registration successful - you can now login");
        this.router.navigateByUrl('/account/login');
      },
      error: (errors) =>{
         this.validationErrors.set(errors)
      }
    })
  }
}
