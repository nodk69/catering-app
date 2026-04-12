import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  ChefHat, 
  Users, 
  Calendar, 
  TrendingUp, 
  Shield, 
  Clock,
  Award,
  Star,
  ArrowRight,
  CheckCircle,
  Menu,
  Truck,
  BarChart3,
  Settings
} from 'lucide-react';

const VendorHome: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);

  const features = [
    {
      icon: <Menu className="w-6 h-6" />,
      title: 'Menu Management',
      description: 'Create and manage your catering menu with ease. Add items, set prices, and update availability.',
      link: '/vendor/menu',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Order Management',
      description: 'Track orders, manage deliveries, and communicate with customers in real-time.',
      link: '/vendor/orders',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Analytics & Insights',
      description: 'Get detailed insights about your business performance, revenue, and customer preferences.',
      link: '/vendor/analytics',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'Business Settings',
      description: 'Configure your business profile, payment methods, and notification preferences.',
      link: '/vendor/settings',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Grow Your Business',
      description: 'Reach thousands of customers looking for catering services'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Secure Payments',
      description: 'Get paid securely and on time with our payment protection'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Flexible Schedule',
      description: 'Set your own availability and manage orders on your terms'
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: 'Build Reputation',
      description: 'Earn ratings and reviews to establish your brand'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Owner, Gourmet Catering',
      content: 'This platform has transformed our business. We\'ve seen a 200% increase in orders since joining.',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=1'
    },
    {
      name: 'Michael Chen',
      role: 'Chef, Asian Fusion',
      content: 'The best platform for caterers. Easy to use, great support, and amazing customer reach.',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=2'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Owner, Sweet Treats Bakery',
      content: 'Managing orders and menu has never been easier. Highly recommended for any catering business.',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=3'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full transform translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-5 rounded-full transform -translate-x-40 translate-y-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-sm font-medium mb-6">
                <Star className="w-4 h-4 mr-2 fill-current" />
                Trusted by 1000+ caterers
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Grow Your Catering
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                  Business With Us
                </span>
              </h1>
              
              <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
                Join thousands of successful caterers who use our platform to manage orders, 
                reach more customers, and grow their business.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/vendor/dashboard')}
                  className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-lg"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 inline-block" />
                </button>
                <button
                  onClick={() => navigate('/vendor/catering-services')}
                  className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-all"
                >
                  Create Service
                </button>
              </div>

              <div className="mt-8 flex items-center space-x-6 text-indigo-100">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>No monthly fees</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl transform rotate-6"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <div>
                        <p className="text-sm text-gray-600">Welcome back</p>
                        <p className="font-semibold text-gray-900">{user?.name || 'Vendor'}</p>
                      </div>
                      <ChefHat className="w-8 h-8 text-indigo-600" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Today's Orders</p>
                        <p className="text-2xl font-bold text-gray-900">8</p>
                        <p className="text-xs text-green-600">↑ 12% from yesterday</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Monthly Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">₹1,25,000</p>
                        <p className="text-xs text-blue-600">↑ 23% from last month</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Customer Rating</p>
                        <div className="flex items-center">
                          <p className="text-2xl font-bold text-gray-900 mr-2">4.8</p>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful tools designed specifically for catering businesses to help you manage and grow
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <span className="inline-flex items-center text-indigo-600 font-medium group-hover:text-indigo-700">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We provide everything you need to run a successful catering business online.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <div className="text-indigo-600">
                        {benefit.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl shadow-xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">1,200+</p>
                      <p className="text-gray-600">Active Vendors</p>
                    </div>
                    <Users className="w-10 h-10 text-indigo-600" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">50,000+</p>
                      <p className="text-gray-600">Orders Delivered</p>
                    </div>
                    <Truck className="w-10 h-10 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">4.8/5</p>
                      <p className="text-gray-600">Average Rating</p>
                    </div>
                    <Star className="w-10 h-10 text-yellow-500" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">₹25Cr+</p>
                      <p className="text-gray-600">Revenue Generated</p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Successful Caterers
            </h2>
            <p className="text-xl text-gray-600">
              See what our vendors have to say about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Grow Your Catering Business?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of successful caterers and start reaching more customers today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/vendor/dashboard')}
              className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all transform hover:scale-105"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2 inline-block" />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-all"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VendorHome;