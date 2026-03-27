import { Link } from "react-router-dom";
import { Sparkles, Users, Shirt, MessageCircle } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-[85vh] bg-gray-100 px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-lg bg-gray-50 rounded-3xl shadow-xl p-8 md:p-10 flex flex-col">
        <div className="flex flex-col items-center w-full mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mt-10">
            <span className="text-3xl ">🐝</span>
          </div>
        </div>
      <div className="text-center mt-10 ">
        <h2 className="text-3xl font-bold text-yellow-500 mb-4">
          DRSSED
        </h2>
        <h3 className="text-textSecondary text-lg font-semibold mb-12">
          Where fashion Meets Art
        </h3>
        <p className="text-textSecondary mb-10 max-w-md mx-auto">
          Your gateway to Ghana's finest custom fashion designers and tailors.
           Perfect fit, beautiful designs, delivered to your door.
        </p>
      </div>
      
      
      <div className="grid grid-cols-2 gap-6 mb-10">


       <div className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition shadow-sm">
         <Sparkles className="text-yellow-500 mb-3" size={20}/>
         <h3 className="font-semibold text-sm">Custom Designs</h3>
         <p className="text-gray-500 text-xs">
           Get unique, tailor-made clothing that fits your style
         </p>
       </div>


       <div className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition shadow-sm">
         <Users className="text-yellow-500 mb-3" size={20} />
         <h3 className="font-semibold text-sm">Expert Tailors</h3>
         <p className="text-gray-500 text-xs">
           Connect with Ghana's finest designers and tailors
         </p>
       </div>

  
       <div className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition shadow-sm">
         <Shirt className="text-yellow-500 mb-3" size={20} />
         <h3 className="font-semibold text-sm">Perfect Fit</h3>
         <p className="text-gray-500 text-xs">
           Upload measurements for garments that fit perfectly
         </p>
       </div>

  
       <div className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition shadow-sm">
         <MessageCircle className="text-primary-500 mb-3" size={20} />
         <h3 className="font-semibold text-sm">Direct Chat</h3>
         <p className="text-gray-500 text-xs">
           Communicate directly with your designer
         </p>
       </div>

     </div>
    
    

      <div className="space-y-4">
        <Link to="/signup">
          <button className="w-full bg-primary text-black py-4 rounded-full font-semibold mb-4">
            Get started
          </button>
        </Link>

        <Link to="/login">
          <button className="w-full border-2 border-primary text-primary py-4 rounded-full font-semibold">
            Login
          </button>
        </Link>
      </div>

    </div>
    </div>
  );
}