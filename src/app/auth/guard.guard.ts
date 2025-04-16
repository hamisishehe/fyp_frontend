import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token'); // Check if auth token exists

  if (token) {
    return true; // Allow navigation if authenticated
    console.log(token);
  } else {
    const router = inject(Router); // Use Router to handle navigation
    router.navigate(['/auth/login']); // Redirect to login page if not authenticated
    return false; // Block access to the route
  }
};
