// src/components/Footer.jsx
const Footer = () => {
  return (
    <footer className="p-4 border-t border-gray-200 text-sm text-gray-500">
      <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0">
        <p>&copy; 2024 Airbnb clone. All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-gray-800">Privacy</a>
          <a href="#" className="hover:text-gray-800">Terms</a>
          <a href="#" className="hover:text-gray-800">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
