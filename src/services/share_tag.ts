import { Lifetime } from "awilix";
import { MedusaContainer, TransactionBaseService } from "@medusajs/medusa";
import { MedusaError } from "@medusajs/utils";
import { ShareTag } from "../models/share_tags";
import { Store } from "../models/store";
import { EntityManager, Repository } from "typeorm";

class ShareTagService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly _loggedInUserStore: Store | null;
  protected shareRepository_: Repository<ShareTag>;

  constructor(container: MedusaContainer) {
    super(container);

    try {
      // @ts-ignore
      this._loggedInUserStore = container.loggedInStore;
      // @ts-ignore
      this.shareRepository_ = container;
    } catch (e) {
      // avoid errors when backend first runs
    }
  }

  async create(tag: string): Promise<ShareTag> {
    console.log(`Test`, this._loggedInUserStore);
    const shareTagRepo = this.activeManager_.withRepository(
      this.shareRepository_
    );

    if (tag.length < 12 || tag.length > 13)
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "tag should be between 12 and 13 characters long"
      );

    // Create tag
    const newTag = shareTagRepo.create({
      tag,
      store_id: this._loggedInUserStore.id,
    });

    await shareTagRepo.save(newTag);

    return newTag;
  }
}

export default ShareTagService;
