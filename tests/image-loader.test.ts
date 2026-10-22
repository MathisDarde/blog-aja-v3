import { describe, expect, it } from "vitest";
import imageLoader from "@/lib/image-loader";

describe("loader des images", () => {
  it("redimensionne les images Cloudinary chez Cloudinary", () => {
    expect(
      imageLoader({ src: "https://res.cloudinary.com/demo/image/upload/v1792/clubs/leeds.jpg", width: 640, quality: 75 }),
    ).toBe("https://res.cloudinary.com/demo/image/upload/f_auto,q_75,w_640,c_limit/v1792/clubs/leeds.jpg");
    expect(imageLoader({ src: "https://res.cloudinary.com/demo/image/upload/a.png", width: 96 })).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_96,c_limit/a.png",
    );
  });

  it("laisse les autres images et les adresses Cloudinary déjà transformées", () => {
    const transformed = "https://res.cloudinary.com/demo/image/upload/c_fill,w_1200,h_630/v1/a.jpg";
    expect(imageLoader({ src: transformed, width: 640 })).toBe(`${transformed}#w=640`);
    expect(imageLoader({ src: "/_assets/img/pdpdebase.png", width: 640 })).toBe("/_assets/img/pdpdebase.png#w=640");
    expect(imageLoader({ src: "https://upload.wikimedia.org/x.svg", width: 64 })).toBe("https://upload.wikimedia.org/x.svg#w=64");
  });
});
