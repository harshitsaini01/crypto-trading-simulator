import { TrendingUp, Search, Bell, User, Settings } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-[#1a1a1a] border-b border-gray-800 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-green-400 to-blue-500 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              CryptoChart
            </span>
            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">PRO</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-300 hover:text-white transition font-medium">Markets</a>
            <a href="#" className="text-gray-300 hover:text-white transition font-medium">Trade</a>
            <a href="#" className="text-gray-300 hover:text-white transition font-medium">Charts</a>
            <a href="#" className="text-gray-300 hover:text-white transition font-medium">Watchlist</a>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search crypto..."
              className="bg-[#0f0f0f] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 w-64 transition-all"
            />
          </div>
          
          <button className="p-2 hover:bg-[#252525] rounded-lg transition relative">
            <Bell className="w-5 h-5 text-gray-400 hover:text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
          </button>
          
          <button className="p-2 hover:bg-[#252525] rounded-lg transition">
            <Settings className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
          
          <button className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-4 py-2 rounded-lg transition">
            <User className="w-4 h-4 text-white" />
            <span className="text-white font-medium text-sm">Sign In</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
