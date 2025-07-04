import { User } from '@prisma/client';
import { File as MulterFile } from 'multer';

declare global {
  namespace Express {
    interface Request {
      user?: (User & {
        role: string;
      }) | null;
      files?: {
        [fieldname: string]: MulterFile[];
      } | MulterFile[];
      file?: MulterFile;
      [key: string]: any;
    }
  }
}

export {}; // This file needs to be a module
