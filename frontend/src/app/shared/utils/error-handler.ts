import { HttpErrorResponse } from '@angular/common/http';

export function getErrorMessage(error: HttpErrorResponse): string {

  switch (error.status) {
    case 0:
        return 'Unable to connect to the server.';
    case 400:
        return 'Please check the entered details.';
    case 401:
        return 'Invalid credentials.';
    case 403:
        return 'You are not authorized to perform this action.';
    case 404:
        return 'Requested resource not found.';
    case 500:
        return 'Something went wrong. Please try again later.';
    default:
        return 'An unexpected error occurred.';
    }

}