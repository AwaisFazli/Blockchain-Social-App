const Footer = () => {
  return (
    <div className="bg-[#15202b] flex flex-col justify-center items-center p-20">
      <div className="text-secondaryBlue text-[2.5rem] font-bold m-6">
        <p>A Project by Tech Titans</p>
      </div>
      <div className="flex justify-center items-center">
        <div className="flex flex-col">
          <p className=" text-[1.5rem] p-4">F20BA014 Wasi Abdullah</p>
          <p className="text-[1.5rem] p-4">F20BA025 Awais Mutahir</p>
        </div>

        <div className="flex flex-col">
          <p className="text-[1.5rem] p-4">F20BA016 Maima Ismail</p>
          <p className="text-[1.5rem] p-4">F20BA040 Arfha Ateeq</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
