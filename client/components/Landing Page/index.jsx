import Footer from "./Footer";
import { NavBar } from "./Navbar";
import Image from "next/image";
import blueCone from "../../assets/blue-cone.png";
import blueLine from "../../assets/blue-line.png";
import lightBeam from "../../assets/light-beam.png";
import { FaCrown } from "react-icons/fa";
import { RiChatPrivateLine } from "react-icons/ri";
import { MdPerson } from "react-icons/md";

const LandingPage = () => {
  return (
    <div className="flex flex-col bg-lightGray overflow-x-hidden">
      <NavBar />
      <div className="flex flex-col">
        <div className="flex flex-col">
          <div className="flex justify-between items-center py-[7rem] xl:px-[10rem] px-[5rem]">
            <div className="w-[40rem]">
              <p className=" text-[3rem] font-bold p-8">
                Embrace the Future of Trustworthy Social Networking
              </p>
            </div>
            <Image src={blueCone}></Image>
          </div>
          <div className="flex justify-center py-[5rem] bg-lightGray">
            <Image src={blueLine} width={2000} height={50}></Image>
          </div>
        </div>
        <div className="bg-lightGray relative">
          <Image src={lightBeam} width={2000} height={1000}></Image>
          <div className="absolute top-[2rem] lg:top-[10rem] xl:top-[15rem] right-[10rem]">
            <div className="flex m-4">
              <div className="bg-primaryBlue flex items-center justify-center w-20 h-20 rounded-full shadow-embossed">
                <RiChatPrivateLine className="text-[2.5rem]" />
              </div>
              <div className="flex bg-primaryGray h-[5rem] w-[22rem] font-bold rounded-lg text-white mx-3 justify-center items-center shadow-embossed">
                <p>80% of users value online privacy.</p>
              </div>
            </div>
            <div className="flex m-4">
              <div className="bg-primaryBlue flex items-center justify-center w-20 h-20 rounded-full shadow-embossed">
                <MdPerson className="text-[2.5rem]" />
              </div>
              <div className="flex bg-primaryGray h-[5rem] w-[22rem] rounded-lg font-bold text-white mx-3 justify-center items-center shadow-embossed">
                <p>65% of users fear data breaches.</p>
              </div>
            </div>
            <div className="flex m-4">
              <div className="bg-primaryBlue flex items-center justify-center w-20 h-20 rounded-full shadow-embossed">
                <FaCrown className="text-[2.5rem]" />
              </div>
              <div className="flex bg-primaryGray h-[5rem] w-[22rem] rounded-lg font-bold text-white mx-3 justify-center items-center shadow-embossed">
                <p>75% of Millennials want data ownership.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
