import { useState, useEffect } from "react";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Statistics = (props) => {
  const [dustHoldersCount, setDustHoldersCount] = useState(0);
  const [dustPrice] = useState(props.dustPrice);

  useEffect(() => {
    fetch(
      "https://public-api.solscan.io/token/holders?tokenAddress=DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ&offset=0&limit=10"
    )
      .then((res) => res.json())
      .then((data) => setDustHoldersCount(data.total ?? "0"))
      .catch((error) => setDustHoldersCount("0"));
  }, []);

  return (
    <div className="flex flex-col md:flex-row py-5 px-4 sm:px-8 lg:px-12 xl:px-36 justify-around items-center gap-4">
      <div className="flex flex-col p-3 sm:p-6 text-center justify-center w-full bg-[#242424] rounded-xl gap-2 shadowAndTransition">
        <div className="text-xl text-white fontFamily selectionColor">
          DUST Market Cap
        </div>
        <div className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#ff7c01] via-[#ff5301] to-[#a819eb] fontFamily">
          ${numberWithCommas(33300000 * dustPrice)}
        </div>
      </div>
      <div className="flex flex-col p-3 sm:p-6 text-center justify-center w-full bg-[#242424] rounded-xl gap-2 shadowAndTransition">
        <div className="text-xl text-white fontFamily selectionColor">
          DUST Holders
        </div>
        <div className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#ff7c01] via-[#ff5301] to-[#a819eb] fontFamily">
          {numberWithCommas(dustHoldersCount)}
        </div>
      </div>
      <div className="flex flex-col p-3 sm:p-6 text-center justify-center w-full bg-[#242424] rounded-xl gap-2 shadowAndTransition">
        <div className="text-xl text-white fontFamily selectionColor">
          DUST/USD
        </div>
        <div className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#ff7c01] via-[#ff5301] to-[#a819eb] fontFamily">
          ${dustPrice}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
