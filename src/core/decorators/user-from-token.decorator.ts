import { SetMetadata } from '@nestjs/common';

export const UserFromToken = (...args: string[]) => SetMetadata('user-from-token', args);
