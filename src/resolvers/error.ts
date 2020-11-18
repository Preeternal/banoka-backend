import { Arg, Field, InputType, Query, Resolver } from 'type-graphql';
import { Column, UpdateDateColumn } from 'typeorm';
import { Err } from '../entities/Error';

@InputType()
class ErrorCreateInput {
  @Field()
  @Column()
  type!: string;

  @Field()
  @Column()
  message!: string;
}

@InputType()
class ErrorWhereUniqueInput {
  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

@InputType()
class ErrorUpdateInput {
  @Field({ nullable: true })
  @Column()
  type!: string;

  @Field({ nullable: true })
  @Column()
  message!: string;
}

@Resolver()
export class ErrorResolver {
  @Query(() => Err, { nullable: true })
  async error(
    @Arg('where') where: ErrorWhereUniqueInput
  ): Promise<Err | undefined> {
    return await Err.findOne(where);
  }

  @Query(() => [Err])
  async errors(): Promise<Err[] | null> {
    return await Err.find();
  }
}
