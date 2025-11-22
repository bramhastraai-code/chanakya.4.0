import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from 'src/role/entity/role.entity';
import { Status } from 'src/common/enum/status.enum';

export type UserDocument = User & Document;

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})
export class User {
  @Prop()
  userId: string;

  @Prop()
  userImage: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  name: string;

  @Prop()
  contactNumber: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  country: string;

  @Prop()
  pinCode: string;

  @Prop({ type: Types.ObjectId, ref: 'Role' })
  role: Role ;

  @Prop({ type: String, enum: Status, default: Status.ACTIVE })
  status: Status;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: User;
}

export const UserSchema = SchemaFactory.createForClass(User);
