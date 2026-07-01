import { type CanActivate, Injectable } from "@nestjs/common"

/** Allows all requests — used as an e2e override for global auth guards. */
@Injectable()
export class PermissiveGuard implements CanActivate {
  canActivate(): boolean {
    return true
  }
}
