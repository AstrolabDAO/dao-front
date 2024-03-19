import { theme } from "../constants";
import { themedBgGradient, themedFgGradient } from "../utils/rendering";
import { UpdatableSlugged } from "./Updatable";
import { Resource } from "./enums";
import { IDescriptionSlide } from "./types";

export class Brand extends UpdatableSlugged {

  static resource: Resource = "brand";
  // basic information
  shortDescription="";
  description="";
  descriptionSlides: IDescriptionSlide[]=[];
  // design / UI related
  logo="";
  color1="";
  color2="";
  // external resources (links)
  landing="";
  docs="";
  codebase="";
  app="";
  twitter="";
  blog="";
  discord="";
  email="";
  telegram="";
  contract="";
  token="";

  constructor() {
    super();
  }

  public async init(o: Partial<Brand>={}): Promise<Brand> {

    await super.init(o as UpdatableSlugged);
    this.landing = o.landing ?? "";
    this.docs = o.docs ?? "";
    this.codebase = o.codebase ?? "";
    this.app = o.app ?? "";
    this.twitter = o.twitter ?? "";
    this.discord = o.discord ?? "";
    this.blog = o.blog ?? "";
    this.email = o.email ?? "";
    this.telegram = o.telegram ?? "";
    this.contract = o.contract ?? "";
    this.token = o.token ?? "";
    this.description = o.description ?? "";
    this.shortDescription = o.shortDescription ?? "";
    this.descriptionSlides = o.descriptionSlides ?? [];
    this.logo = `/svgs/brands/${this.slug}`;
    this.color1 = o.color1 ?? "#bbbbbb";
    this.color2 = o.color2 ?? "#444444";
    this.populateSearchIndex?.();
    return this;
  }

  public themedGradient(fg=false, degree=-90): any {
    const gradient = (fg ? themedFgGradient : themedBgGradient)(theme, this.color1 ?? theme!.primary, degree); // this.color1
    return {
      backgroundImage: `linear-gradient${gradient}`,
    };
  }

  public themedBgGradient(degree=-90): any {
    return this.themedGradient(false, degree);
  }

  public themedFgGradient(degree=-90): any {
    return this.themedGradient(true, degree);
  }

  protected override populateSearchIndex?() {
    this.updateSearchIndex([
      this.name,
      this.slug,
      this.landing,
      this.token,
    ]);
  }
}
