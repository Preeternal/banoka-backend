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
// import { getConnection } from 'typeorm';

// import {
//   Arg,
//   Ctx,
//   Field,
//   FieldResolver,
//   Mutation,
//   ObjectType,
//   Query,
//   Resolver,
//   Root,
// } from 'type-graphql';

import { Currency } from '../entities/Currency';

@InputType()
class CurrencyInput {
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
  @Column({
    unique: true,
  })
  charCode!: string;

  @Field(() => Float)
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
    @Arg('currency') currency: CurrencyInput
  ): Promise<Currency | null> {
    return await Currency.create({
      ...currency,
    }).save();
  }

  @Mutation(() => Currency, { nullable: true })
  async upsertCurrency(
    @Arg('currency') currency: CurrencyInput
  ): Promise<Currency | null> {
    const curr = await Currency.findOne({ charCode: currency.charCode });
    if (!curr) {
      return await Currency.create({
        ...currency,
      }).save();
    }
    // return await Currency.update({ id: curr?.id }, { value: currency.value });
    // console.log('curr', curr);
    return await Currency.save({
      id: curr?.id as number,
      ...currency,
    });
  }
}
