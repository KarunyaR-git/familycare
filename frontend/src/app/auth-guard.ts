import { CanActivateFn } from "@angular/router";
import { AuthService } from "./core/services/auth.service";
import { inject } from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const token = auth.getToken();

    if (!token) {
        auth.logout();
        return false;
    }

    if (auth.isTokenExpired()) {
        auth.logout(true);
        return false;
    }

    return true;
};