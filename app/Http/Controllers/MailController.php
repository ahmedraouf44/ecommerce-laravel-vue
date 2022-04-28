<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\OrderShipped;
use App\Models\Order;
use Illuminate\Support\Facades\Mail;
 
class MailController extends Controller
{
   public function sendMail($id)
   {   
        $order = Order::with('user','products')->where('transaction_id',$id)->get()->first();
        // dd($order,$order->products[0]->pivot->quantity);

        Mail::to($order->user->email)->send(new OrderShipped($order));

        
   }
}

