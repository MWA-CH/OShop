
export interface Product {
    [x: string]: any;
    $key: string;
    title: string;
    price: number;
    category: string;
    imageUrl: string;
}