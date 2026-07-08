export interface IReadRepository<TEntity, TId, TListScope = void> {
  // Returns null when not found — never throws. Caller decides if a miss is an error.
  findById(id: TId): Promise<TEntity | null>
  findMany(scope: TListScope): Promise<TEntity[]>
}

export interface IWriteRepository<
  TEntity,
  TNewEntity,
  TId,
  TUpdateInput,
  TScope = TId,
> {
  insert(data: TNewEntity): Promise<TEntity>
  // Returns null when no document matched
  update(scope: TScope, data: TUpdateInput): Promise<TEntity | null>
  // Returns false when no document matched
  delete(scope: TScope): Promise<boolean>
}
