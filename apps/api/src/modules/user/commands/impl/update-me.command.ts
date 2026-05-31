import { UpdateProfileInput } from '@repo/contracts';

export class UpdateMeCommand {
  constructor(
    public readonly userId: string,
    public readonly data: UpdateProfileInput,
  ) {}
}
