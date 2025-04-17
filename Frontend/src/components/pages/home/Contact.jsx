import React from "react";
import Navbar from "../../globals/Navbar";

const ContactUs = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50 py-12 px-6 pt-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          {/* Contact Information */}
          <div className="bg-gradient-to-br from-emerald-100 to-white p-6 rounded-2xl shadow-xl transition duration-300 hover:shadow-2xl hover:scale-[1.01] max-w-md mx-auto mt-10">
            <h2 className="text-3xl font-extrabold text-emerald-700 mb-6 border-b-2 border-emerald-400 pb-2">
              📬 Contact Us
            </h2>
            <p className="text-gray-800 mb-4 flex items-center">
              <span className="font-semibold w-32">📘 Company:</span> BookStore
              Name
            </p>
            <p className="text-gray-800 mb-4 flex items-center">
              <span className="font-semibold w-32">✉️ Email:</span>
              <a
                href="mailto:contact@bookstore.com"
                className="text-emerald-600 hover:underline"
              >
                contact@bookstore.com
              </a>
            </p>
            <p className="text-gray-800 mb-4 flex items-center">
              <span className="font-semibold w-32">📞 Contact No:</span>{" "}
              +977-1234567890
            </p>
            <p className="text-gray-800 mb-4 flex items-center">
              <span className="font-semibold w-32">☎️ Tel No:</span>{" "}
              +977-0987654321
            </p>
            <p className="text-gray-800 flex items-start">
              <span className="font-semibold w-32">📍 Address:</span>
              <span>Sangeet Chowk, Itahari - 4</span>
            </p>
          </div>

          {/* Google Map */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3565.7836559666025!2d87.29937287521501!3d26.655408476801433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6ea070e7b18b%3A0x2959e2a3e2bf54e0!2sItahari%20International%20College!5e0!3m2!1sen!2snp!4v1744822892777!5m2!1sen!2snp"
              width="100%"
              height="450"
              style={{ border: "0" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
