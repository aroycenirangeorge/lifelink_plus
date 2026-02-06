import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-red-500 to-pink-600 p-2 rounded-lg">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold">LifeLink+</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              One account to donate blood, money, volunteer, and help disaster relief. Let's save lives together
            </p>
            <div className="flex gap-3">
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => onNavigate("blood")} className="hover:text-white transition-colors text-left w-full">Blood Donation</button></li>
              <li><button onClick={() => onNavigate("donations")} className="hover:text-white transition-colors text-left w-full">Donations</button></li>
              <li><button onClick={() => onNavigate("disaster")} className="hover:text-white transition-colors text-left w-full">Disaster Relief</button></li>
              <li><button onClick={() => onNavigate("events")} className="hover:text-white transition-colors text-left w-full">Events</button></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><button onClick={() => onNavigate("blood")} className="hover:text-white transition-colors text-left w-full">Blood Donation</button></li>
              <li><button onClick={() => onNavigate("donations")} className="hover:text-white transition-colors text-left w-full">Monetary Donations</button></li>
              <li><button onClick={() => onNavigate("disaster")} className="hover:text-white transition-colors text-left w-full">Disaster Relief</button></li>
              <li><button onClick={() => onNavigate("events")} className="hover:text-white transition-colors text-left w-full">Volunteer Events</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>support@lifelinkplus.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>LIFELINK+ Helpline (24/7)</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Chennai, Tamilnadu, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 LifeLink+ | Made with ❤️ by HumanityOS </p>
        </div>
      </div>
    </footer>
  );
}
