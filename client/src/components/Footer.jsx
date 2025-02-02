import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6 border-t border-gray-700">
      <div className="container mx-auto flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between">
        
        {/* Copyright Text */}
        <p className="text-sm tracking-wide uppercase text-gray-300">
          © 2024 All Rights Reserved.
        </p>

        {/* Social Media Icons */}
        <div className="flex items-center gap-5 text-xl">
          <a
            href="#"
            className="hover:text-blue-400 transition-all duration-300 transform hover:scale-110"
          >
            <FaFacebook />
          </a>
          <a
            href="#"
            className="hover:text-pink-400 transition-all duration-300 transform hover:scale-110"
          >
            <FaInstagram />
          </a>
          <a
            href="#"
            className="hover:text-blue-500 transition-all duration-300 transform hover:scale-110"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
