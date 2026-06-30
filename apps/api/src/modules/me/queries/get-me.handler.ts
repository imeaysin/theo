import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import type { JWTClaims } from "@workspace/auth/types"
import { GetMeQuery } from "./get-me.query"

@QueryHandler(GetMeQuery)
export class GetMeHandler implements IQueryHandler<GetMeQuery> {
  execute(query: GetMeQuery): Promise<JWTClaims> {
    return Promise.resolve(query.user)
  }
}
