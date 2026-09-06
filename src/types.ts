export type VanityTab = 'tocador' | 'marcas' | 'anadir' | 'deseos' | 'perfil';

export type ProductStatus = 'en_uso' | 'nuevo' | 'agotado' | 'por_reponer';

export interface ShadeSwatch {
  name: string;
  color: string;
}

export interface Product {
  id: string;
  userId: string;
  brandId: string;
  brandName: string;
  name: string;
  category: string;
  subCategory: string;
  shadeName: string;
  shadeColor: string;
  shadeDescription?: string;
  finish: string;
  reference: string;
  imageUrl: string;
  status: ProductStatus;
  size?: string;
  isFavorite: boolean;
  isViralFavorite?: boolean;
  paoMonths: number;
  purchaseDate: string;
  openedDate?: string;
  location: string;
  personalNotes: string;
  otherShades?: ShadeSwatch[];
  purchasePrice?: string;
  store?: string;
  finishedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  userId: string;
  name: string;
  creator?: string;
  quote?: string;
  logoUrl: string;
  bannerUrl: string;
  specialty?: string;
  isActiveCollection: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  photoURL: string;
  totalTesoros?: number;
}
