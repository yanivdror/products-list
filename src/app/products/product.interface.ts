export interface Product {
  creationDate: number;
  description: string;
  id: number;
  name: string;
  price: number;
  thumbnailUrl: string;
  url: string;
}



export interface AdvancedProduct extends Product{
  ups?:Product[];
  fedex?:Product;
}



