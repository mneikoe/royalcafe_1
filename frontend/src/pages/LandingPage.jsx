/*import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  // Fetch menu items from backend
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/menu`);
        setMenuItems(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load menu items");
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  // Images for the slideshow
  const slideshowImages = [
    {
      src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1470&auto=format&fit=crop",
      alt: "Elegant restaurant setting",
      title: "Fine Dining Experience",
    },
    {
      src: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=1374&auto=format&fit=crop",
      alt: "Traditional Indian thali",
      title: "Authentic Jain Cuisine",
    },
    {
      src: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1470&auto=format&fit=crop",
      alt: "Modern restaurant interior",
      title: "Contemporary Atmosphere",
    },
  ];

  // Auto-rotate slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  // Manual slideshow navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const generateWhatsAppLink = (item) => {
    const phoneNumber = "9142459858"; // Replace with your WhatsApp business number
    const message = `Hi Demo Team! I'd like to order:
    
  *${item.name}*
  ${item.description}
  Price: ₹${item.price}`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };
  const handleWhatsApp = () => {
    const phoneNumber = "9142459858"; // Replace with your WhatsApp business number
    const message = `Name: ${formData.name}%0APhone: ${formData.phone}%0AMessage: ${formData.message}
    I want to subscribe for the meal plans.`;

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const FeaturedMenuSection = () => {
    if (loading)
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      );

    if (error)
      return (
        <div className="text-center text-red-500 py-8 bg-red-50 rounded-lg border border-red-200 px-6">
          <svg
            className="w-12 h-12 mx-auto text-red-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="font-medium text-lg">{error}</p>
          <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md">
            Try Again
          </button>
        </div>
      );

    if (!menuItems.length)
      return (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200 px-6">
          <p className="text-gray-600 font-medium">
            No menu items available at the moment.
          </p>
          <p className="text-gray-500 mt-2">
            Please check back later or contact us directly.
          </p>
        </div>
      );

    return (
      <div id="menu" className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3 text-gray-800 relative inline-block">
            Our Featured Menu
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-orange-500 rounded-full"></span>
          </h2>
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            Explore our handcrafted dishes prepared with authentic ingredients
            and traditional recipes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl border border-gray-100 group"
            >
              {item.image && (
                <div className="relative overflow-hidden h-64">
                  <img
                    src={`data:${item.image.contentType};base64,${item.image.data}`}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {item.offer && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white font-bold py-1 px-3 rounded-full text-sm shadow-md">
                      {item.offer}
                    </div>
                  )}
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 min-h-[40px]">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-orange-600 text-xl font-bold">
                    ₹{item.price}
                  </span>
                  <a
                    href={generateWhatsAppLink(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors flex items-center shadow-md"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Order Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors shadow-md font-medium">
            View Full Menu
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
    
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              className="h-10 w-10 rounded-full shadow-sm"
              src=""
              alt="logo"
            />
            <span className="font-bold text-2xl text-gray-800">
              Demo<span className="text-orange-500">Restro</span>
            </span>
          </div>

          
          <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
            >
              Home
            </a>
            <a
              href="#menu"
              className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
            >
              Menu
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
            >
              Contact
            </a>
          </nav>

        
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors shadow-md font-medium"
            >
              Sign In
            </Link>

          
          </div>
        </div>
      </header>

    
      <main className="container mx-auto px-4 py-10">
        
        <div className="text-center mb-16 pt-8">
          <div className="inline-block bg-orange-100 text-orange-700 rounded-full px-4 py-1 mb-6 font-medium text-sm">
            Pure Vegetarian • Authentic Food • Fresh Daily
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Authentic <span className="text-orange-500">Demo Cuisine</span>
            <br />
            <span className="text-3xl md:text-4xl text-gray-600">
              Delivered Fresh Daily
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Experience the finest vegetarian dining with our meticulously
            prepared meals, delivered fresh daily or available through monthly
            subscriptions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <a
              href="#menu"
              className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors shadow-md font-medium text-lg"
            >
              Explore Menu
            </a>
            <a
              href="#contact"
              className="px-8 py-3 border-2 border-gray-800 text-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition-colors font-medium text-lg"
            >
              Subscribe Monthly
            </a>
          </div>
        </div>

        
        <div className="relative mb-20 rounded-2xl overflow-hidden shadow-2xl h-96 md:h-[500px]">
          {slideshowImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentSlide === index
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-8 text-white max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-bold mb-3">
                    {image.title}
                  </h2>
                  <p className="text-lg max-w-md">
                    Enjoy the perfect blend of tradition and taste with our
                    exceptional Jain culinary offerings.
                  </p>
                  <button className="mt-6 px-6 py-2.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors shadow-md">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}

        
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {slideshowImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all transform ${
                  currentSlide === index
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          
          <button
            onClick={() =>
              goToSlide(
                (currentSlide - 1 + slideshowImages.length) %
                  slideshowImages.length
              )
            }
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() =>
              goToSlide((currentSlide + 1) % slideshowImages.length)
            }
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

      
        <div className="mb-20 py-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3 text-gray-800 relative inline-block">
              Why Choose Demo
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-orange-500 rounded-full"></span>
            </h2>
            <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
              We take pride in our authentic approach to Jain cuisine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-orange-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                100% Authentic Ingredients
              </h3>
              <p className="text-gray-600">
                Our cuisine is prepared strictly following Demo principles,
                without root vegetables or impure ingredients.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-orange-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Daily Fresh Delivery
              </h3>
              <p className="text-gray-600">
                We prepare and deliver fresh meals daily, ensuring the highest
                quality and taste for our customers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-orange-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Simple Monthly Plans
              </h3>
              <p className="text-gray-600">
                Subscribe to our monthly meal plans for convenient,
                cost-effective dining every day.
              </p>
            </div>
          </div>
        </div>

      
        <FeaturedMenuSection />

      
        <div className="mb-20 bg-gradient-to-br from-orange-50 to-amber-50 py-16 px-6 rounded-2xl shadow-md">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3 text-gray-800 relative inline-block">
              What Our Customers Say
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-orange-500 rounded-full"></span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg relative">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <div className="flex justify-center mb-6 pt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-6 h-6 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 italic text-xl mb-8 leading-relaxed">
                "Demo has transformed my daily meals. The food is consistently
                fresh, delicious, and prepared exactly according to Jain
                principles. The monthly subscription has made my life so much
                easier!"
              </p>
              <div className="mb-2">
                <img
                  src="/api/placeholder/60/60"
                  alt="Customer"
                  className="w-16 h-16 rounded-full mx-auto border-4 border-orange-100 object-cover"
                />
              </div>
              <p className="font-bold text-gray-800 text-lg">Aman Raj</p>
              <p className="text-orange-500 text-sm font-medium">
                Loyal Customer • Bhopal
              </p>
            </div>
          </div>
        </div>

      
        <div className="mb-20 bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-10 md:p-12 lg:p-16 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready for delicious Jain food?
              </h2>
              <p className="text-gray-300 mb-8">
                Start your subscription today and enjoy authentic Jain cuisine
                delivered fresh to your doorstep every day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors font-medium text-center shadow-md"
                >
                  Subscribe Now
                </a>
                <a
                  href="#menu"
                  className="px-6 py-3 border border-white text-white rounded-full hover:bg-white hover:text-gray-800 transition-colors font-medium text-center"
                >
                  View Our Menu
                </a>
              </div>
            </div>
            <div className="hidden md:block relative h-96 md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=1374&auto=format&fit=crop"
                alt="Delicious Jain Food"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

      
        <div
          id="about"
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20"
        >
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                About Demo
              </h2>
              <div className="w-16 h-1 bg-orange-500 rounded-full mb-6"></div>
            </div>
            <p className="text-gray-600 mb-4">
              Founded in 2015, This has been serving the authentic taste of
              traditional Jain cuisine to our customers with dedication and
              passion.
            </p>
            <p className="text-gray-600 mb-4">
              We understand the importance of following strict dietary
              principles, which is why all our meals are prepared without root
              vegetables and with the utmost attention to purity.
            </p>
            <p className="text-gray-600 mb-4">
              Our expert chefs combine traditional recipes with modern culinary
              techniques to create delicious meals that retain their authentic
              flavor while meeting contemporary tastes.
            </p>
            <div className="mt-8">
              <a
                href="#"
                className="text-orange-500 font-medium hover:text-orange-600 flex items-center"
              >
                Learn more about our story
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div id="contact" className="bg-white p-8 rounded-xl shadow-md">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Contact Us
              </h2>
              <div className="w-16 h-1 bg-orange-500 rounded-full mb-6"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <svg
                      className="w-6 h-6 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Our Location
                    </h3>
                    <p className="text-gray-600">
                      123 Temple Street
                      <br />
                      Jaipur, Rajasthan 302001
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <svg
                      className="w-6 h-6 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Contact Number
                    </h3>
                    <p className="text-gray-600">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <svg
                      className="w-6 h-6 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Email Address
                    </h3>
                    <p className="text-gray-600">contact@demo.com</p>
                  </div>
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="your phone number"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2"
                  disabled={!formData.message}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Send via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

    
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8">
            
          </div>
          <div className="pt-8 text-center text-gray-400">
            <p>© 2023 Demo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}*/
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";

import {
  FiUser,
  FiPhone,
  FiMessageSquare,
  FiShoppingCart,
  FiClock,
  FiMapPin,
  FiMail,
  FiPhoneCall,
} from "react-icons/fi";
import { GiCook, GiForkKnifeSpoon } from "react-icons/gi";
import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import FeaturedMenuSection from "./FeaturedMenuSection";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  // Animated sections
  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [featuresRef, featuresInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [contactRef, contactInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Particle animation config
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Slideshow images
  const slideshowImages = [
    {
      src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1470&auto=format&fit=crop",
      alt: "Elegant restaurant setting",
      title: "Pure Vegetarian Excellence",
      subtitle:
        "Experience culinary perfection with our authentic Jain recipes",
    },
    {
      src: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=1374&auto=format&fit=crop",
      alt: "Traditional Indian thali",
      title: "Traditional Recipes",
      subtitle: "Handed down through generations of Jain chefs",
    },
    {
      src: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1470&auto=format&fit=crop",
      alt: "Modern restaurant interior",
      title: "Modern Dining Experience",
      subtitle: "Where tradition meets contemporary comfort",
    },
  ];

  // Auto-rotate slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  const handleWhatsApp = () => {
    const phoneNumber = "7999243907";
    const message = `Name: ${formData.name}\nPhone: ${formData.phone}\nMessage: ${formData.message}\n\nI want to subscribe for the meal plans.`;
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white overflow-x-hidden">
      {/* Animated Particles Background */}
      <div className="fixed inset-0 -z-10">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            particles: {
              number: { value: 80, density: { enable: true, value_area: 800 } },
              color: { value: "#f97316" },
              shape: { type: "circle" },
              opacity: { value: 0.5, random: true },
              size: { value: 3, random: true },
              line_linked: {
                enable: true,
                distance: 150,
                color: "#f97316",
                opacity: 0.4,
                width: 1,
              },
              move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
              },
            },
            interactivity: {
              detect_on: "canvas",
              events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
              },
            },
          }}
        />
      </div>

      {/* Floating WhatsApp Button */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <a
          href="https://wa.me/7999243907"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full shadow-xl hover:bg-green-600 transition-all"
        >
          <FaWhatsapp className="text-2xl" />
        </a>
      </motion.div>

      {/* Sticky Navbar with Glass Morphism */}
      <header
        ref={menuRef}
        className={`fixed w-full z-40 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto py-3 px-6 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <img
              className="h-10 w-10 rounded-full shadow-sm"
              src="food_16224908.png"
              alt=" Logo"
            />
            <span className="font-bold text-2xl text-gray-800">
              Royal<span className="text-orange-500">Cafe</span>
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {["Home", "Menu", "About", "Contact"].map((item, index) => (
              <motion.a
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                href={`#${item.toLowerCase()}`}
                className="text-gray-700 hover:text-orange-500 transition-colors font-medium relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
              </motion.a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </motion.button>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block"
          >
            <Link
              to="/login"
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full hover:shadow-lg transition-all shadow-md font-medium"
            >
              Sign In
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white shadow-lg"
            >
              <div className="container mx-auto px-6 py-4 space-y-4">
                {["Home", "Menu", "About", "Contact"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-orange-500 transition-colors"
                  >
                    {item}
                  </a>
                ))}
                <Link
                  to="/login"
                  className="block w-full text-center py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-md"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section with Parallax Effect */}
        <section
          id="home"
          ref={heroRef}
          className="relative h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Parallax Background */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence>
              {slideshowImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: currentSlide === index ? 1 : 0,
                    scale: currentSlide === index ? 1 : 1.1,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-block bg-white/20 backdrop-blur-sm text-white rounded-full px-6 py-2 mb-6 font-medium text-sm border border-white/30"
            >
              Pure Vegetarian • Authentic Food • Fresh Daily
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Authentic <span className="text-amber-300">Indian Cuisine</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/90 max-w-2xl mx-auto mb-8"
            >
              Experience the finest vegetarian dining with our meticulously
              prepared meals, following strict dietary principles.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <a
                href="#menu"
                className="px-8 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-all shadow-lg font-medium text-lg"
              >
                Explore Menu
              </a>
              <a
                href="#contact"
                className="px-8 py-3 bg-white/20 backdrop-blur-sm border-2 border-white text-white rounded-full hover:bg-white hover:text-gray-800 transition-all font-medium text-lg"
              >
                Subscribe Monthly
              </a>
            </motion.div>
          </div>

          {/* Slideshow Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
            {slideshowImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index
                    ? "bg-white w-6"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Scroll Down Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 1, 0], y: [20, 0, -20] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </section>

        {/* Features Section with Animated Cards */}
        <section
          id="about"
          ref={featuresRef}
          className="py-20 bg-gradient-to-b from-white to-amber-50"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-4 text-gray-800"
              >
                Why Choose <span className="text-orange-500">Royal Cafe</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-gray-600 text-lg max-w-2xl mx-auto"
              >
                We take pride in our authentic approach to traditional cuisine
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <GiCook className="text-4xl" />,
                  title: "100% Natural Ingredients",
                  description:
                    "Prepared strictly following Authentic principles, without root vegetables or impure ingredients.",
                },
                {
                  icon: <FiClock className="text-4xl" />,
                  title: "Daily Fresh Delivery",
                  description:
                    "We prepare and deliver fresh meals daily, ensuring the highest quality and taste.",
                },
                {
                  icon: <GiForkKnifeSpoon className="text-4xl" />,
                  title: "Traditional Recipes",
                  description:
                    "Handed down through generations of chefs, preserving authentic flavors.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 * index }}
                  whileHover={{ y: -10 }}
                  className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:shadow-xl"
                >
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <FeaturedMenuSection />

        {/* CTA Section with Animated Gradient */}
        <section className="py-20 bg-gradient-to-r from-orange-500 to-amber-500">
          <div className="container mx-auto px-6 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              Ready to Experience Authentic Cuisine?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/90 text-xl mb-10 max-w-2xl mx-auto"
            >
              Join hundreds of satisfied customers enjoying our meals every day
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <a
                href="#contact"
                className="px-8 py-3 bg-white text-orange-600 rounded-full hover:bg-gray-100 transition-all shadow-lg font-medium text-lg"
              >
                Get Started
              </a>
              <a
                href="#menu"
                className="px-8 py-3 border-2 border-white text-white rounded-full hover:bg-white/10 transition-all font-medium text-lg"
              >
                View Menu
              </a>
            </motion.div>
          </div>
        </section>

        {/* Contact Section with Interactive Form */}
        <section id="contact" ref={contactRef} className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={contactInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  Get In Touch
                </h2>
                <div className="w-16 h-1 bg-orange-500 rounded-full mb-8"></div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <FiMapPin className="text-orange-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Our Location
                      </h3>
                      <p className="text-gray-600">
                        Sector C, Indrapuri
                        <br />
                        Bhopal, MadhyaPradesh 462022
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <FiPhoneCall className="text-orange-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Call Us
                      </h3>
                      <p className="text-gray-600">+91 7999243907</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <FiMail className="text-orange-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Email Us
                      </h3>
                      <p className="text-gray-600">raj117557@gmail.com</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Opening Hours
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-medium">9:00 AM - 11:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday</span>
                      <span className="font-medium">9:00 AM - 10:00 PM</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={contactInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Send Us a Message
                </h3>
                <form className="space-y-5">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Message
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3">
                        <FiMessageSquare className="text-gray-400" />
                      </div>
                      <textarea
                        rows="5"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="How can we help you?"
                      ></textarea>
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleWhatsApp}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={
                      !formData.name || !formData.phone || !formData.message
                    }
                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                      !formData.name || !formData.phone || !formData.message
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    <FaWhatsapp className="text-xl" />
                    Send via WhatsApp
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with Wave Animation */}
      <footer className="relative bg-gray-900 text-white pt-20 pb-10 overflow-hidden">
        {/* Animated Wave */}
        <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden">
          <svg
            className="absolute top-0 left-0 w-full h-20"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="fill-current text-gray-800"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="fill-current text-gray-800"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="fill-current text-orange-500"
            ></path>
          </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10 ">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-4 flex flex-col items-center">
              <img
                className="h-10 w-10 rounded-full shadow-sm"
                src="food_16224908.png"
                alt=" Logo"
              />
              <span className="font-bold text-2xl text-white-800">
                Royal<span className="text-orange-500">Cafe</span>
              </span>
              <p className="text-gray-400">
                Authentic Traditional cuisine prepared with traditional recipes
                and modern culinary techniques.
              </p>
            </div>

            <div className="space-y-4 ">
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {["Home", "Menu", "About", "Contact"].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-gray-400 hover:text-orange-400 transition-colors "
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start">
                  <FiMapPin className="mr-2 mt-1 text-orange-400" />
                  <span>Sector C, Indrapuri, Bhopal</span>
                </li>
                <li className="flex items-center">
                  <FiPhoneCall className="mr-2 text-orange-400" />
                  <span>+91 987654321</span>
                </li>
                <li className="flex items-center">
                  <FiMail className="mr-2 text-orange-400" />
                  <span>xyz@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Thali.Com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
