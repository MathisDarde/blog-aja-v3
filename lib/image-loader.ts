// Loader des balises <Image> : aucune image ne passe par l'optimisation de Vercel (quota
// gratuit de 5 000 transformations par mois, vite atteint avec les logos des clubs).
// Les images Cloudinary sont redimensionnées et compressées par Cloudinary lui-même ;
// les autres (fichiers du site, logos Wikimedia et des scrapers) sont servies telles quelles.

const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/;
// Premier segment déjà transformé (« c_fill,w_1200/… ») : l'adresse est laissée telle quelle
const TRANSFORMED = /^[a-z]{1,3}_[^/]*\//;

export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const match = src.match(CLOUDINARY_UPLOAD);
  if (!match || TRANSFORMED.test(match[2])) return src;
  return `${match[1]}f_auto,q_${quality ?? "auto"},w_${width},c_limit/${match[2]}`;
}
