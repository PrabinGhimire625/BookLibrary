import React from "react";
import Navbar from "../../globals/Navbar";

const teamMembers = [
  {
    name: "Jeewan Gurung",
    role: "Frontend Developer",
    expertise: "React, Tailwind CSS, UI/UX Design",
    description:
      "Aarav crafts intuitive user interfaces and ensures seamless user experiences across all platforms.",
    image: "https://scontent.fbir1-1.fna.fbcdn.net/v/t39.30808-1/366994599_1486576968773045_8928094768307444563_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_ohc=_G_9gPJbc8EQ7kNvwHojPxd&_nc_oc=AdkTGczntdUNrjM1nJFxOllohQVqY0TqD64lCKiFA6isS2rUCR5JOel98yjEmLY1GlwTMz8nYwCGwDnAhcKX66Bg&_nc_zt=24&_nc_ht=scontent.fbir1-1.fna&_nc_gid=Ryw254dwgJqzlB7OUio1bg&oh=00_AfFx_xtyzuGMRg1Be54ijtVACqfIb463CVwgnvznzObXhQ&oe=6805AFD9", // Replace with actual image URLs
  },
  {
    name: "Ayush Shah",
    role: "Backend Developer",
    expertise: "Node.js, Express, MongoDB",
    description:
      "Maya builds robust backend systems, ensuring our applications are fast and reliable.",
    image: "https://scontent.fbir1-1.fna.fbcdn.net/v/t39.30808-6/467712418_3714842678661603_4388462958120220209_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=ssblpQN7TWUQ7kNvwFAZ72R&_nc_oc=Adm8HYeP_6n4zzlIOLwA4YVU73pOXa0W_oKMbJE4PhGGohCbr04SiB3H4NLn48d9Z_QUvQbbQbXUwq32bKokC7XV&_nc_zt=23&_nc_ht=scontent.fbir1-1.fna&_nc_gid=ncpAXrhij2tCcevQYU84ng&oh=00_AfGrsT4Zoen-Nrug4rwDUKgsTWBE4tCAOUobBBZUN6EMzQ&oe=68059C49",
  },
  {
    name: "Prabin Ghimire",
    role: "Full Stack Developer",
    expertise: "MERN Stack, API Development",
    description:
      "Ravi bridges the gap between frontend and backend, delivering cohesive solutions.",
    image: "https://scontent.fbir1-1.fna.fbcdn.net/v/t39.30808-1/490219264_1734870557128481_8297631663551351246_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=100&ccb=1-7&_nc_sid=1d2534&_nc_ohc=bjyRO7OwOjkQ7kNvwE2bEDN&_nc_oc=AdnF6DTtXa_L8bP0WLqfQ_q9zMGtvXyD3-D604xxLB_OZnCGKZnWwfOimb-qJbFC1PeFwtmflsKooLqD4WuPy0Sm&_nc_zt=24&_nc_ht=scontent.fbir1-1.fna&_nc_gid=2sTz6gh9iHTXIlIS_e5RVQ&oh=00_AfElddFJehhm4DVJGSorM4X0EYtjZgsKCwU_h8sbTC7cEg&oe=6805B4A2",
  },
  {
    name: "Nischay Madara",
    role: "Project Manager",
    expertise: "Agile Methodologies, Team Coordination",
    description:
      "Sita ensures projects are delivered on time, coordinating between clients and the development team.",
    image:
      "https://scontent.fbir1-1.fna.fbcdn.net/v/t39.30808-1/342538148_606435948064499_6559753334652988795_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_ohc=wqcNNHVA7EAQ7kNvwEo-6d5&_nc_oc=Adn-CwViWeMATLypp-G85cq8XDrjn_sRXc2pAiCqY2UpZHSu8NG-MvTa-otMxKlpa2MmJ8uwfzXsQwUB6B6emnsa&_nc_zt=24&_nc_ht=scontent.fbir1-1.fna&_nc_gid=CJilXb9jXA4dzlOa_nEe3g&oh=00_AfFML1yUPyOkqgOxtot1lRzplm31t39V51MyhSCOBVZYWg&oe=68059586",
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
