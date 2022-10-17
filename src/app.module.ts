import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismamModule } from './prismam/prismam.module';

@Module({
  imports: [AuthModule, UserModule, BookmarkModule, PrismamModule],
})
export class AppModule {}
