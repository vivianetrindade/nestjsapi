import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor() {}

  createBookmark(userId: number, dto: CreateBookmarkDto) {}

  getBookmarks(userId: number) {}

  getBookmarkById(userId: number, bookmarkId: number) {}

  editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {}

  deleteBookmark(userId: number, bookmarkId: number) {}
}
