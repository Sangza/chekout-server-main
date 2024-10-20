import { Lifetime } from "awilix";
import {
  RegionService as MedusaRegionService,
  setMetadata,
} from "@medusajs/medusa";
import { CreateRegionInput } from "@medusajs/medusa/dist/types/region";
import { DeepPartial, EntityManager, Repository } from "typeorm";
import TaxInclusivePricingFeatureFlag from "@medusajs/medusa/dist/loaders/feature-flags/tax-inclusive-pricing";
import { MedusaError } from "@medusajs/utils";
import { Region } from "../models/region";

class RegionService extends MedusaRegionService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected regionRepository_: Repository<Region>;

  // constructor(container) {
  //   // @ts-expect-error prefer-rest-params
  //   super(...arguments);

  //   try {
  //     const manager: EntityManager = container.manager;
  //     this.regionRepository_ = manager.getRepository(Region);
  //   } catch (err) {
  //     // Do nothing
  //   }
  // }

  // async create(data: CreateRegionInput): Promise<Region> {
  //   return await this.atomicPhase_(async manager => {
  //     const regionRepository = manager.withRepository(this.regionRepository_);
  //     const currencyRepository = manager.withRepository(
  //       this.currencyRepository_
  //     );

  //     const regionObject = { ...data } as DeepPartial<Region>;
  //     const { metadata, currency_code, includes_tax, ...toValidate } = data;

  //     const validated = await this.validateFields(toValidate);

  //     if (
  //       this.featureFlagRouter_.isFeatureEnabled(
  //         TaxInclusivePricingFeatureFlag.key
  //       )
  //     ) {
  //       if (typeof includes_tax !== "undefined") {
  //         regionObject.includes_tax = includes_tax;
  //       }
  //     }

  //     if (currency_code) {
  //       // will throw if currency is not added to store currencies
  //       await this.validateCurrency(currency_code);
  //       const currency = await currencyRepository.findOne({
  //         where: { code: currency_code.toLowerCase() },
  //       });

  //       if (!currency) {
  //         throw new MedusaError(
  //           MedusaError.Types.INVALID_DATA,
  //           `Could not find currency with code ${currency_code}`
  //         );
  //       }

  //       regionObject.currency = currency;
  //       regionObject.currency_code = currency_code.toLowerCase();
  //     }

  //     if (metadata) {
  //       regionObject.metadata = setMetadata(
  //         { metadata: regionObject.metadata ?? null },
  //         metadata
  //       );
  //     }

  //     for (const [key, value] of Object.entries(validated)) {
  //       regionObject[key] = value;
  //     }

  //     regionObject.region_countries = regionObject.countries;
  //     regionObject.countries = [];

  //     const created = regionRepository.create(regionObject) as Region;
  //     const result = await regionRepository.save(created);

  //     await this.eventBus_
  //       .withTransaction(manager)
  //       .emit(RegionService.Events.CREATED, {
  //         id: result.id,
  //       });

  //     return result;
  //   });
  // }
}

export default RegionService;
