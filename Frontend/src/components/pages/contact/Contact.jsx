import React from "react";

const ContactUs = () => {
  return (
    <>
      <div className="min-h-screen py-16 px-6 pt-24 bg-gradient-to-br from-white via-gray-30 to-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Contact Information */}
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-200 transition duration-300 hover:scale-[1.02]">
            <h2 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-3 border-gray-300">
              📬 Contact Us
            </h2>
            <ul className="space-y-4 text-[16px]">
              <li className="flex">
                <span className="w-32 font-semibold text-gray-700">📘 Company:</span>
                <span className="text-gray-600">Book Library Name</span>
              </li>
              <li className="flex">
                <span className="w-32 font-semibold text-gray-700">✉️ Email:</span>
                <a
                  href="mailto:contact@bookstore.com"
                  className="text-emerald-600 hover:underline"
                >
                  contact@bookLibrary.com
                </a>
              </li>
              <li className="flex">
                <span className="w-32 font-semibold text-gray-700">📞 Contact No:</span>
                <span className="text-gray-600">+977-1234567890</span>
              </li>
              <li className="flex">
                <span className="w-32 font-semibold text-gray-700">☎️ Tel No:</span>
                <span className="text-gray-600">+977-0987654321</span>
              </li>
              <li className="flex items-start">
                <span className="w-32 font-semibold text-gray-700">📍 Address:</span>
                <span className="text-gray-600">Itahari - 4</span>
              </li>
            </ul>
          </div>

          {/* Embedded Google Map */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 hover:scale-[1.01] transition duration-300">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3565.7836559666025!2d87.29937287521501!3d26.655408476801433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6ea070e7b18b%3A0x2959e2a3e2bf54e0!2sItahari%20International%20College!5e0!3m2!1sen!2snp!4v1744822892777!5m2!1sen!2snp"
              width="100%"
              height="450"
              style={{ border: "0" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Itahari Map"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
