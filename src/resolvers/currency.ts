import {
  Arg,
  Field,
  Float,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import { Column } from 'typeorm';

import { Currency } from '../entities/Currency';

@InputType()
class CurrencyCreateInput {
  @Field()
  @Column({ unique: true })
  name!: string;

  @Field(() => String, { nullable: true })
  @Column({ unique: true, nullable: true })
  nameEng: string;

  @Field(() => Int)
  @Column()
  nominal: number;

  @Field()
  @Column({ unique: true })
  charCode!: string;

  @Field(() => Float)
  @Column()
  value!: number;
}

@InputType()
class CurrencyWhereUniqueInput {
  @Field({ nullable: true })
  @Column({ unique: true })
  id: number;

  @Field({ nullable: true })
  @Column({ unique: true })
  name!: string;

  @Field(() => String, { nullable: true })
  @Column({ unique: true, nullable: true })
  nameEng: string;

  @Field({ nullable: true })
  @Column({ unique: true })
  charCode!: string;
}

@InputType()
class CurrencyUpdateInput {
  @Field({ nullable: true })
  @Column({ unique: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ unique: true, nullable: true })
  nameEng: string;

  @Field(() => Int, { nullable: true })
  @Column()
  nominal: number;

  @Field({ nullable: true })
  @Column({ unique: true })
  charCode!: string;

  @Field(() => Float, { nullable: true })
  @Column()
  value!: number;
}

@Resolver(Currency)
export class CurrencyResolver {
  @Query(() => [Currency])
  async currencies(): Promise<Currency[] | null> {
    return await Currency.find();
  }

  @Query(() => Currency, { nullable: true })
  async currency(
    @Arg('id', () => Int) id: number
  ): Promise<Currency | undefined> {
    return await Currency.findOne(id);
  }

  @Mutation(() => Boolean, { nullable: true })
  async deleteCurrency(@Arg('id') id: number): Promise<boolean> {
    try {
      await Currency.delete({ id });
    } catch {
      return false;
    }
    return true;
  }

  @Mutation(() => Currency, { nullable: true })
  async createCurrency(
    @Arg('data') data: CurrencyCreateInput
  ): Promise<Currency | null> {
    return await Currency.create({
      ...data,
    }).save();
  }

  @Mutation(() => Currency, { nullable: true })
  async upsertCurrency(
    @Arg('where') where: CurrencyWhereUniqueInput,
    @Arg('create', { nullable: true }) create: CurrencyCreateInput,
    @Arg('update', { nullable: true }) update: CurrencyUpdateInput
  ): Promise<Currency | undefined> {
    const currency = await Currency.findOne(where);
    if (!currency) {
      return await Currency.create({
        ...create,
      }).save();
    }
    await Currency.update(currency.id, update);
    const updated = await Currency.findOne(currency.id);
    return updated;
  }
}
