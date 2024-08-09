import { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const Filters = () => {
  const [priceRange, setPriceRange] = useState([100000, 50000000]);
  const [bedrooms, setBedrooms] = useState("1");
  const [bathrooms, setBathrooms] = useState("1");
  const [parking, setParking] = useState("1");
  const [types, setTypes] = useState({
    Condo: false,
    "Condo-TownHouse": false,
    Loft: false,
    Detached: false,
    "Semi-Detached": false,
    TownHouse: false,
  });

  // Map the slider value (0 to 100) to the desired price range
  const mapSliderValueToPrice = (value: number): number => {
    if (value <= 25) {
      // Map 0-25% to 100,000 to 1,000,000
      return Math.round(100000 + (value / 25) * 900000);
    } else if (value <= 50) {
      // Map 25-50% to 1,000,000 to 2,000,000
      return Math.round(1000000 + ((value - 25) / 25) * 1000000);
    } else if (value <= 75) {
      // Map 50-75% to 2,000,000 to 10,000,000
      return Math.round(2000000 + ((value - 50) / 25) * 8000000);
    } else {
      // Map 75-100% to 10,000,000 to 50,000,000
      return Math.round(10000000 + ((value - 75) / 25) * 40000000);
    }
  };

  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPriceRange(value.map(mapSliderValueToPrice));
    } else {
      setPriceRange([mapSliderValueToPrice(value), priceRange[1]]);
    }
  };

  const getSliderMarks = () => ({
    0: "100k",
    25: "1M",
    50: "2M",
    75: "10M",
    100: "50M"
  });

  const handleTypeChange = (type: string) => {
    setTypes((prevTypes) => ({
      ...prevTypes,
      [type]: !prevTypes[type as keyof typeof types],
    }));
  };

  return (
    <div className="filters p-4 bg-dark-2 text-light-1 rounded mb-4">
      <h3 className="h3-bold text-light-1 mb-3">Search</h3>

      {/* Type Filter */}
      <div className="filter-item mb-4">
        <label className="body-regular text-light-3 mb-2">Type</label>
        <div className="flex flex-wrap gap-4">
          {Object.keys(types).map((type) => (
            <label key={type} className="body-regular text-light-3">
              <input
                type="checkbox"
                checked={types[type as keyof typeof types]}
                onChange={() => handleTypeChange(type)}
              />
              <span className="ml-2">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="filter-item w-1/3">
          <label className="body-regular text-light-3">Bedroom</label>
          <select
            className="filter-input bg-light-1 text-dark-2 w-full"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
          >
            <option value="Studio">Studio</option>
            <option value="1">1</option>
            <option value="1+1">1+1</option>
            <option value="2">2</option>
            <option value="2+1">2+1</option>
            <option value="3+">3+</option>
          </select>
        </div>
        <div className="filter-item w-1/3">
          <label className="body-regular text-light-3">Bathroom</label>
          <select
            className="filter-input bg-light-1 text-dark-2 w-full"
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
          >
            <option value="1">1</option>
            <option value="1+">1+</option>
            <option value="2+">2+</option>
            <option value="3+">3+</option>
          </select>
        </div>
        <div className="filter-item w-1/3">
          <label className="body-regular text-light-3">Parking</label>
          <select
            className="filter-input bg-light-1 text-dark-2 w-full"
            value={parking}
            onChange={(e) => setParking(e.target.value)}
          >
            <option value="1">1</option>
            <option value="1+">1+</option>
            <option value="2+">2+</option>
            <option value="3+">3+</option>
          </select>
        </div>
      </div>

      <div className="filter-item mb-4">
        <label className="body-regular text-light-3 mb-2">Price Range</label>
        <Slider
          marks={getSliderMarks()}
          range
          min={0}
          max={100}
          defaultValue={[0, 100]}
          onChange={handlePriceChange}
          trackStyle={[{ backgroundColor: "#ccc" }]}
          handleStyle={[
            { borderColor: "orange", backgroundColor: "blue" },
            { borderColor: "orange", backgroundColor: "blue" }
          ]}
          railStyle={{ backgroundColor: "#ccc" }}
          step={0.1} // finer control over the steps
        />
        <div className="flex justify-between text-light-3 mt-4">
          <span>{`CAD ${priceRange[0].toLocaleString()}`}</span>
          <span>{`CAD ${priceRange[1].toLocaleString()}`}</span>
        </div>
      </div>
    </div>
  );
};

export default Filters;