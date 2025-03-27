import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiTag } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useInView } from "react-intersection-observer";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const FeaturedMenuSection = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { ref, inView: menuInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/menu`);
        setMenuItems(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load menu items. Please try again later.");
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
    hover: { y: -10, scale: 1.02 },
  };

  const generateWhatsAppLink = (item) => {
    const phoneNumber = "7999243907";
    const message = `Hi Thali.Com! I want to order:%0A%0A*${item.name}*%0A${
      item.description || ""
    }%0APrice: ₹${item.price}${item.offer ? ` (${item.offer}% OFF)` : ""}`;
    return `https://wa.me/${phoneNumber}?text=${message}`;
  };

  return (
    <section id="menu" className="relative py-20 overflow-hidden" ref={ref}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={menuInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Divine Delicacies
          </h2>
          <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
            Experience the soul of tradition in every bite
          </p>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-dashed border-orange-100"
              >
                <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
                <div className="mt-4 space-y-3">
                  <div className="h-5 bg-gray-100 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
                  <div className="h-10 bg-gray-100 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-8 bg-red-50 rounded-2xl border-2 border-red-100"
          >
            <div className="text-red-600 font-medium">{error}</div>
          </motion.div>
        )}

        {/* Menu items grid */}
        {!loading && !error && menuItems.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={menuInView ? "show" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {menuItems.map((item) => (
              <motion.div
                key={item._id}
                variants={itemVariants}
                whileHover="hover"
                className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Image container */}
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={`data:${item.image.contentType};base64,${item.image.data}`}
                    alt={item.name}
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = "/placeholder-food.jpg";
                    }}
                  />

                  {/* Offer badge */}
                  {item.offer && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                      <FiTag className="mr-2" />
                      {item.offer}% OFF
                    </div>
                  )}
                </div>

                {/* Content container */}
                <div className="p-6 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-amber-400" />

                  <h3 className="text-xl font-extrabold text-gray-800 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 italic min-h-[4rem]">
                    {item.description ||
                      "Traditional Jain recipe passed down through generations"}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-orange-600">
                        ₹{item.price}
                      </span>
                      {item.offer && (
                        <span className="text-gray-400 line-through text-sm">
                          ₹{Math.round(item.price / (1 - item.offer / 100))}
                        </span>
                      )}
                    </div>

                    <motion.a
                      href={generateWhatsAppLink(item)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                    >
                      <FaWhatsapp className="text-xl" />
                      <span className="font-semibold">Order</span>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && !error && menuItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-8 bg-amber-50 rounded-2xl border-2 border-amber-100"
          >
            <div className="text-amber-600 font-medium">
              Our chefs are preparing new delicacies. Check back soon!
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedMenuSection;
