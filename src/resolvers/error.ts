import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql';
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
  @Field({ nullable: true })
  @Column({ unique: true })
  id: number;

  @Field(() => String, { nullable: true })
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

  @Mutation(() => Err, { nullable: true })
  async createCurrency(
    @Arg('data') data: ErrorCreateInput
  ): Promise<Err | null> {
    return await Err.create({
      ...data,
    }).save();
  }

  @Mutation(() => Boolean, { nullable: true })
  async deleteError(
    @Arg('where') where: ErrorWhereUniqueInput
  ): Promise<boolean> {
    try {
      await Err.delete(where);
    } catch {
      return false;
    }
    return true;
  }

  @Mutation(() => Err, { nullable: true })
  async updateError(
    @Arg('where') where: ErrorWhereUniqueInput,
    @Arg('data', { nullable: true }) data: ErrorUpdateInput
  ): Promise<Err | undefined> {
    const currency = await Err.findOne(where);
    if (!currency) return undefined;
    await Err.update(currency.id, data);
    return await Err.findOne(currency.id);
  }
}
