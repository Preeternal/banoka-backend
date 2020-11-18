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
  @Query(() => Currency, { nullable: true })
  async currency(
    @Arg('where') where: CurrencyWhereUniqueInput
  ): Promise<Currency | undefined> {
    return await Currency.findOne(where);
  }

  @Query(() => [Currency])
  async currencies(): Promise<Currency[] | null> {
    return await Currency.find();
  }

  @Mutation(() => Currency, { nullable: true })
  async createCurrency(
    @Arg('data') data: CurrencyCreateInput
  ): Promise<Currency | null> {
    return await Currency.create({
      ...data,
    }).save();
  }

  @Mutation(() => Boolean, { nullable: true })
  async deleteCurrency(
    @Arg('where') where: CurrencyWhereUniqueInput
  ): Promise<boolean> {
    try {
      await Currency.delete(where);
    } catch {
      return false;
    }
    return true;
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

  @Mutation(() => Currency, { nullable: true })
  async updateCurrency(
    @Arg('where') where: CurrencyWhereUniqueInput,
    @Arg('data', { nullable: true }) data: CurrencyUpdateInput
  ): Promise<Currency | undefined> {
    const currency = await Currency.findOne(where);
    if (!currency) return undefined;
    await Currency.update(currency.id, data);
    return await Currency.findOne(currency.id);
  }
}
