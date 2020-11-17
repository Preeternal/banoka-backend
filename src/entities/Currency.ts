import { Field, Float, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Currency extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  name!: string;

  @Field(() => String, { nullable: true })
  @Column({ unique: true, nullable: true })
  nameEng?: string;

  @Field(() => Int)
  @Column()
  nominal!: number;

  @Field()
  @Column({
    unique: true,
    // nullable: true,
  })
  charCode!: string;

  @Field(() => Float)
  @Column({ type: 'float' })
  value!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
