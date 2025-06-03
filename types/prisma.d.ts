import { Prisma } from '@prisma/client'

// Extend the Prisma namespace to add the missing fields
declare global {
  namespace PrismaJson {
    type UserExtended = {
      active: boolean;
      lastLogin?: Date | null;
    }
  }
}

// Extend the User model to include the missing fields
declare module '@prisma/client' {
  interface User {
    active: boolean;
    lastLogin?: Date | null;
  }

  // Extend the UserSelect type to include the missing fields
  interface UserSelect<ExtArgs extends Prisma.ExtArgs = Prisma.ExtArgs> {
    active?: boolean;
    lastLogin?: boolean;
  }

  // Extend the UserUpdateInput type to include the missing fields
  interface UserUpdateInput {
    active?: boolean | Prisma.BooleanFieldUpdateOperationsInput;
    lastLogin?: Date | string | Prisma.DateTimeFieldUpdateOperationsInput | null;
  }

  // Extend the UserUncheckedUpdateInput type to include the missing fields
  interface UserUncheckedUpdateInput {
    active?: boolean | Prisma.BooleanFieldUpdateOperationsInput;
    lastLogin?: Date | string | Prisma.DateTimeFieldUpdateOperationsInput | null;
  }

  // Extend the UserCreateInput type to include the missing fields
  interface UserCreateInput {
    active?: boolean;
    lastLogin?: Date | string | null;
  }

  // Extend the UserUncheckedCreateInput type to include the missing fields
  interface UserUncheckedCreateInput {
    active?: boolean;
    lastLogin?: Date | string | null;
  }
  
  // Add AuditLog to PrismaClient
  interface PrismaClient {
    auditLog: Prisma.AuditLogDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
  }
}

export {}
