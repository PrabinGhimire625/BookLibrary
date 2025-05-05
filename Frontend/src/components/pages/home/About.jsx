import React from "react";
import Navbar from "../../globals/Navbar";
import Prabin from '../../../assets/Prabin.jpg'; 
import Jeewan from '../../../assets/Jeewan.jpg'; 
import Nischay from '../../../assets/Nischay.jpg'; 
import Ayush from '../../../assets/Ayush.jpg'; 

const teamMembers = [
  {
    name: "Jeewan Gurung",
    role: "Frontend Developer",
    expertise: "React, Tailwind CSS, UI/UX Design",
    description:
      "Aarav crafts intuitive user interfaces and ensures seamless user experiences across all platforms.",
      image:Jeewan
  },
  {
    name: "Ayush Shah",
    role: "Backend Developer",
    expertise: "Node.js",
    description:
      "Maya builds robust backend systems, ensuring our applications are fast and reliable.",
  image:Ayush
  },
  {
    name: "Prabin Ghimire",
    role: "Full Stack Developer",
    expertise: ".NET, MERN Stack,  Development",
    description:
      "Ravi bridges the gap between frontend and backend, delivering cohesive solutions.",
    image: Prabin
  },
  {
    name: "Nischay Madara",
    role: "Project Manager",
    expertise: "Agile Methodologies, Team Coordination",
    description:
      "Sita ensures projects are delivered on time, coordinating between clients and the development team.",
  image:Nischay
  },
  
];

const AboutUs = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-indigo-50 py-12 px-12 pt-20">
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
    </>
  );
};

export default AboutUs;
