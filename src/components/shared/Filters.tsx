
import { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Query, Databases, Client } from "appwrite";

interface FiltersProps {
  handleSearch: () => Promise<any>;
}

// Initialize Appwrite client
const client = new Client();
client.setEndpoint(import.meta.env.VITE_APPWRITE_URL).setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

const Filters: React.FC<{ onSearch: (filters: FiltersProps) => Promise<void> }> = ({ onSearch }) => {
  const [priceRange, setPriceRange] = useState([100000, 50000000]);
  const [Bedroom, setBedroom] = useState("1");
  const [bathrooms, setBathrooms] = useState("1");
  const [parking, setParking] = useState("1");
  const [listingType, setListingType] = useState("Sale");
  const [types, setTypes] = useState({
    Condo: false,
    "Condo-TownHouse": false,
    Loft: false,
    Detached: false,
    "Semi-Detached": false,
    TownHouse: false,
  });

  const mapSliderValueToPrice = (value: number): number => {
    if (value <= 25) {
      return Math.round(100000 + (value / 25) * 900000);
    } else if (value <= 50) {
      return Math.round(1000000 + ((value - 25) / 25) * 1000000);
    } else if (value <= 75) {
      return Math.round(2000000 + ((value - 50) / 25) * 8000000);
    } else {
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
      [type]: !prevTypes[type as keyof typeof prevTypes], // Type assertion added
    }));
  };

  const handleListingTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setListingType(event.target.value);
  };

  const handleSearch = async () => {
    try {
      // Log the current filter state
      console.log("Search Filters:", {
        listingType,
        priceRange,
        Bedroom,
        bathrooms,
        parking,
        selectedTypes: Object.keys(types).filter((type) => types[type as keyof typeof types]),
      });
  
      const filters = [
        Query.equal("ForSaleorRent", listingType),
        Query.greaterThanEqual("Price", priceRange[0]),
        Query.lessThanEqual("Price", priceRange[1]),
      ];
  
      // Bedroom handling - checking for matches or more than specified value
      if (Bedroom.includes("+")) {
        const bedroomCount = parseInt(Bedroom.replace("+", ""));
        filters.push(Query.greaterThanEqual("Bedroom", bedroomCount.toString()));
      } else {
        filters.push(Query.equal("Bedroom", Bedroom));
      }
  
      // Bathroom and Parking handling
      if (bathrooms.includes("+")) {
        const bathroomCount = parseInt(bathrooms.replace("+", ""));
        filters.push(Query.greaterThanEqual("Bathroom", bathroomCount));
      } else {
        filters.push(Query.equal("Bathroom", parseInt(bathrooms)));
      }
  
      if (parking.includes("+")) {
        const parkingCount = parseInt(parking.replace("+", ""));
        filters.push(Query.greaterThanEqual("Parking", parkingCount));
      } else {
        filters.push(Query.equal("Parking", parseInt(parking)));
      }
  
      // Adding type filters if any are selected
      const selectedTypes = Object.keys(types).filter((type) => types[type as keyof typeof types]);
      if (selectedTypes.length > 0) {
        filters.push(Query.equal("Type", selectedTypes));
      }
  
      console.log("Query Filters:", filters);
  
      const listings = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_LISTING_COLLECTION_ID,
        [
          ...filters,
          Query.orderDesc("$createdAt"),
          Query.limit(20),
        ]
      );
  
      console.log('Fetched Listings:', listings);
  
      if (!listings || listings.documents.length === 0) throw new Error('No listings found');
      return listings;
    } catch (error) {
      console.log('Error fetching listings:', error);
      throw error;
    }
  };    

  return (
    <div className="filters p-4 bg-dark-2 text-light-1 rounded mb-4">
      <h3 className="h3-bold text-light-1 mb-3">Search</h3>

      {/* Sale/Rent Radio Button */}
      <div className="filter-item mb-4">
        <label className="body-regular text-light-3 mb-2">Listing Type</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="Sale"
              checked={listingType === "Sale"}
              onChange={handleListingTypeChange}
              className="mr-2"
            />
            <span className="text-light-3">Sale</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="Rent"
              checked={listingType === "Rent"}
              onChange={handleListingTypeChange}
              className="mr-2"
            />
            <span className="text-light-3">Rent</span>
          </label>
        </div>
      </div>

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
            value={Bedroom}
            onChange={(e) => setBedroom(e.target.value)}
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

      {/* Search Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => onSearch({ handleSearch })}
          className="ml-2 p-2 bg-primary-500 text-light-1 rounded hover:bg-primary-600 transition"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Filters;