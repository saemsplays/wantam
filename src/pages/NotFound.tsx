
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Construction, Home, ArrowLeft, Clock, Wrench } from "lucide-react";
import LetterGlitch from "@/components/LetterGlitch";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Letter Glitch Background */}
      <div className="absolute inset-0">
        <LetterGlitch 
          glitchSpeed={80}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
          glitchColors={['#ff4444', '#44ff44', '#4444ff']}
        />
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Animated Construction Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-full p-8 border border-gray-700 shadow-2xl">
            <Construction className="h-24 w-24 text-green-400 mx-auto animate-bounce" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Page Under Construction
            </h2>
          </div>

          <div className="space-y-4 max-w-lg mx-auto">
            <p className="text-lg text-gray-300 leading-relaxed">
              In an era of rapid digital transformation, we're building something revolutionary. 
              This page is currently under development and will be available soon with cutting-edge civic engagement tools.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-green-400">
              <Clock className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Developing Digital Democracy</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="bg-gray-700/50 backdrop-blur-sm rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-green-400 to-blue-400 h-full rounded-full animate-pulse w-3/4"></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Development Progress: 75%</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link to="/">
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Return Home</span>
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Go Back</span>
            </Button>
          </div>

          {/* Footer Message */}
          <div className="pt-8 border-t border-gray-700/50">
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <Wrench className="h-4 w-4" />
              <span className="text-sm">
                Building the future of civic engagement with advanced digital tools!
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              For immediate assistance, please visit our{" "}
              <Link to="/" className="text-green-400 hover:text-green-300 underline">
                homepage
              </Link>
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        </div>
        <div className="absolute top-40 right-20 opacity-20">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-32 left-20 opacity-20">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
