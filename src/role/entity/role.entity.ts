import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Permission {
  @Prop({ required: true })
  resource: string;

  @Prop({ default: false })
  create: boolean;

  @Prop({ default: false })
  read: boolean;

  @Prop({ default: false })
  update: boolean;

  @Prop({ default: false })
  delete: boolean;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

@Schema()
export class Role extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: [PermissionSchema], default: [] })
  permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
