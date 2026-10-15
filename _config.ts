import lume from "lume/mod.ts";
import robots from "lume/plugins/robots.ts";
import slugify_urls from "lume/plugins/slugify_urls.ts";
import check_urls from "lume/plugins/check_urls.ts";
import og_images from "lume/plugins/og_images.ts";
import pagefind from "lume/plugins/pagefind.ts";
import picture from "lume/plugins/picture.ts";
import transform_images from "lume/plugins/transform_images.ts";
import image_size from "lume/plugins/image_size.ts";
import metas from "lume/plugins/metas.ts";
import validate_html from "lume/plugins/validate_html.ts";
import sitemap from "lume/plugins/sitemap.ts";
import svgo from "lume/plugins/svgo.ts";

const site = lume({
  location: new URL("https://pbmalerier.dk"),
});

site.use(robots());
site.use(slugify_urls());
site.use(check_urls());
site.use(pagefind({
  ui: {
    showImages: true,
  },
}));

site.use(picture());
site.use(transform_images());

site.use(image_size());
site.use(og_images());
site.use(metas());
site.use(validate_html());
site.use(sitemap());
site.use(svgo());

site.add([".svg"]);

site.add("/styles.css");

site.copy("paintings"); 

site.ignore("README.md");

export default site;
