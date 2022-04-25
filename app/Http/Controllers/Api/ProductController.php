<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['categories' => function ($query) {
            $query->select('id', 'name');
        }])->get();
        // dd($products);
        return $products;
    }

    public function show(Product $product)
    {
        $product->load('categories:id,name');

        return $product;
    }
}
