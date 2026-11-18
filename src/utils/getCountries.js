
import axios from "axios";

export async function getCountries() {
  try {
    const response = await axios.get(
      "https://restcountries.com/v3.1/all?fields=name,cca2,flags,idd"
    );

    return response.data.map(country => ({
      name: country.name.common,
      iso: country.cca2,                    
      code: country.idd?.root + (country.idd?.suffixes?.[0] || ""),
      flag: country.flags?.png || ""
    }));
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
}