import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetAllApprovedServicesQuery } from '../../vendor/services/vendorApi';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Clock, 
  Shield, 
  Award,
  ChefHat,
  Utensils,
  PartyPopper,
  Sparkles,
  TrendingUp,
  Heart,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  ChevronRight,
  Filter,
  DollarSign
} from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const { data: services = [], isLoading } = useGetAllApprovedServicesQuery();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const categories = ['All', 'Wedding', 'Corporate', 'Birthday', 'Anniversary', 'Party'];
  
  const heroSlides = [
    {
      title: "Exceptional Catering for",
      highlight: "Every Occasion",
      subtitle: "Weddings • Corporate Events • Private Parties",
      description: "Experience culinary excellence with our curated selection of premium caterers. From intimate gatherings to grand celebrations.",
      cta: "Explore Menus",
      link: "/catering",
      bgGradient: "from-indigo-600 via-purple-600 to-pink-600",
      icon: <PartyPopper className="w-20 h-20 text-white/20" />,
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3"
    },
    {
      title: "Fresh Ingredients, ",
      highlight: "Masterful Preparation",
      subtitle: "Local • Seasonal • Sustainable",
      description: "Our partner chefs use only the finest ingredients to create unforgettable dining experiences.",
      cta: "Find Caterers",
      link: "/catering",
      bgGradient: "from-emerald-600 via-teal-600 to-cyan-600",
      icon: <ChefHat className="w-20 h-20 text-white/20" />,
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3"
    },
    {
      title: "Stress-Free Planning,",
      highlight: "Perfect Execution",
      subtitle: "Professional • Reliable • Seamless",
      description: "From menu planning to cleanup, we handle every detail so you can enjoy your special day.",
      cta: "Start Planning",
      link: "/catering",
      bgGradient: "from-orange-600 via-red-600 to-rose-600",
      icon: <Sparkles className="w-20 h-20 text-white/20" />,
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3"
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Utensils className="w-8 h-8" />,
      title: "Diverse Cuisines",
      description: "From traditional favorites to innovative fusion, find the perfect menu.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <ChefHat className="w-8 h-8" />,
      title: "Expert Chefs",
      description: "Experienced culinary professionals dedicated to exceptional quality.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Easy Booking",
      description: "Simple and flexible booking process for stress-free planning.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Reliable",
      description: "Verified caterers and secure payments for peace of mind.",
      color: "from-orange-500 to-red-500"
    },
  ];

  const stats = [
    { value: "1,200+", label: "Events Catered", icon: <PartyPopper className="w-6 h-6" /> },
    { value: "150+", label: "Expert Caterers", icon: <ChefHat className="w-6 h-6" /> },
    { value: "15,000+", label: "Happy Guests", icon: <Users className="w-6 h-6" /> },
    { value: "4.9/5", label: "Customer Rating", icon: <Star className="w-6 h-6" /> },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      event: "Wedding Reception",
      content: "The catering was absolutely phenomenal! Our guests couldn't stop raving about the food. The team was professional and made everything seamless.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=5",
      date: "2 weeks ago"
    },
    {
      name: "Rajesh Kumar",
      event: "Corporate Gala",
      content: "Exceptional service from start to finish. The menu was creative, presentation beautiful, and the staff was incredibly attentive.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=8",
      date: "1 month ago"
    },
    {
      name: "Meera Patel",
      event: "Birthday Party",
      content: "Found the perfect caterer for my daughter's birthday. The food was delicious, arrived on time, and the setup was beautiful.",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=9",
      date: "3 weeks ago"
    },
  ];

  const filteredServices = services.filter(service => 
    service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.vendorBusinessName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredServices = filteredServices.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Carousel */}
      <section className="relative h-[600px] lg:h-[700px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 transform ${
              currentSlide === index 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-full'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient}`}>
              <div className="absolute inset-0 bg-black/20"></div>
              
              {/* Decorative Elements */}
              <div className="absolute top-20 right-20 opacity-10">
                {slide.icon}
              </div>
              <div className="absolute bottom-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute top-40 right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
              
              {/* Content */}
              <div className="relative container mx-auto px-6 h-full flex items-center">
                <div className="max-w-4xl">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {slide.subtitle}
                  </div>
                  
                  <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                    {slide.title}
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                      {slide.highlight}
                    </span>
                  </h1>
                  
                  <p className="text-xl text-white/90 mb-8 max-w-2xl">
                    {slide.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => navigate(slide.link)}
                      className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl flex items-center"
                    >
                      {slide.cta}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-all backdrop-blur-sm"
                    >
                      Sign Up Free
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Search Bar Overlay */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by cuisine, caterer, or event type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => navigate('/catering')}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                    <div className="text-indigo-600">
                      {stat.icon}
                    </div>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600">
              We connect you with the best caterers and ensure every detail is perfect
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Catering Services
              </h2>
              <p className="text-gray-600">
                Discover our most popular caterers and their signature offerings
              </p>
            </div>
            <button
              onClick={() => navigate('/catering')}
              className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center group"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredServices.map((service) => (
                <div
                  key={service.serviceId}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                  onMouseEnter={() => setHoveredService(service.serviceId)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Utensils className="w-20 h-20 text-white/40" />
                    </div>
                    {service.rating && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                        {service.rating}
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                        {service.category || 'Catering'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {service.serviceName}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-indigo-600">
                          ₹{service.pricePerPlate}
                        </p>
                        <p className="text-xs text-gray-500">per plate</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Min {service.minOrderQuantity}
                        </p>
                        <p className="text-xs text-gray-500">guests</p>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/catering/${service.serviceId}`)}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to book your perfect catering experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Browse & Select",
                description: "Explore our curated list of caterers and find the perfect menu for your event.",
                icon: <Search className="w-8 h-8" />
              },
              {
                step: "02",
                title: "Customize & Book",
                description: "Customize your order with guest count, preferences, and event details.",
                icon: <Calendar className="w-8 h-8" />
              },
              {
                step: "03",
                title: "Enjoy the Event",
                description: "Relax while we handle everything from preparation to cleanup.",
                icon: <PartyPopper className="w-8 h-8" />
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                {index < 2 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent transform -translate-x-8"></div>
                )}
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl transform rotate-3 hover:rotate-0 transition-transform">
                      {item.icon}
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center font-bold text-indigo-600 border-2 border-indigo-100">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied customers who found their perfect caterer
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.event}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                
                <p className="text-sm text-gray-400">{testimonial.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 lg:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center text-white max-w-3xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Ready to Plan Your Perfect Event?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join thousands of satisfied customers and find your ideal caterer today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-white text-indigo-600 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl flex items-center"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button
                  onClick={() => navigate('/catering')}
                  className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition-all"
                >
                  Browse Caterers
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;