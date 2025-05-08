import React from "react";
import Prabin from '../../../assets/Prabin.jpg'; 
import Jeewan from '../../../assets/Jeewan.jpg'; 
import Nischay from '../../../assets/Nischay.jpg'; 
import Ayush from '../../../assets/Ayush.jpg'; 
import Piyush from '../../../assets/Piyush.jpg'; 

const teamMembers = [
  {
    name: "Prabin Ghimire",
    role: "Full Stack Developer",
    expertise: ".NET, MERN Stack Development",
    description:
      "Prabin bridges the gap between frontend and backend, delivering cohesive and scalable solutions.",
    image: Prabin
  },
  {
    name: "Nischay Madara",
    role: "Backend Developer",
    expertise: "Backend developer",
    description:
      "Nischay ensures smooth project flow by managing backend logic and team collaboration.",
    image: Nischay
  },
  {
    name: "Jeewan Gurung",
    role: "Frontend Developer",
    expertise: "React, Tailwind CSS",
    description:
      "Jeewan crafts intuitive user interfaces and ensures seamless user experiences across all devices.",
    image: Jeewan
  },
  {
    name: "Ayush Shah",
    role: "Frontend Developer",
    expertise: "Frontend, UI Implementation",
    description:
      "Ayush builds responsive user interfaces and ensures smooth interaction for all users.",
    image: Ayush
  },
  
  {
    name: "Piyush Nepal",
    role: "UI/UX Designer",
    expertise: "UI Design, User Experience",
    description:
      "Piyush focuses on user-centered design, creating visually appealing and user-friendly interfaces.",
    image: Piyush
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen py-12 px-12">
      <h1 className="text-4xl font-bold text-center text-indigo-800 mb-12">
        Meet Our Team
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white border border-indigo-200 rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
            />
            <h2 className="text-xl font-semibold text-indigo-900">
              {member.name}
            </h2>
            <p className="text-indigo-700 mb-2">{member.role}</p>
            <p className="text-sm text-gray-600 mb-2">{member.description}</p>
            <p className="text-sm text-indigo-600 font-medium">
              {member.expertise}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
