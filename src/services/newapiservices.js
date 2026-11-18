

import axios from "axios";
import { getRecords, addNewRecord, addProperty } from "../config/apiRoute";
import { buildApiUrl } from "../utils/apiHelper";

// User Profile
export const fetchUserProfileDetails = async (userId) => {
  try {
    const url = buildApiUrl(`/userProfile?user_id=${userId}`);
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return error;
  }
};

// User Landing View Listings Api [1] 
export const fetchAllProperties = async (
  filters = {},
  pagination = { page: 1, limit: 6 }
) => {
  try {
    const { page, limit } = pagination;
    const params = {
      ...filters,
      page,
      limit,
      current_status: 3,
    };

    const url = buildApiUrl("/showPropDetails", "user");
    const response = await axios.get(url, { params });
    return response;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return error;
  }
};

export const fetchUserActions = async (userId) => {
  try {
    const url = buildApiUrl(`/usermyfavourties?user_id=${userId}`, "user");
    const response = await axios.get(url);
   
    return response;
  } catch (error) {
    console.error("Error fetching user actions:", error);
    return error;
  }
};

export const fetchPostPropertiesData = async () => {
  try {
    const response = await axios.get(buildApiUrl("/getPostData", "user"));
    return response;
  } catch (error) {
    console.error("PostProperty Data Fetching Failed:", error);
    return error;
  }
};

export const fetchFiltersData = async () => {
  try {
    // Pass 'user' explicitly so the url becomes /api/user/filterdata
    const response = await axios.get(buildApiUrl("/filterdata", "user"));
    return response;
  } catch (error) {
    console.log("Filter Data Fetching Failed", error);
    return error;
  }
};


export const uploadProperty = async (fieldValues) => {
  const images = fieldValues.images;
  delete fieldValues.images;
  return addProperty(fieldValues, images);
};

// My Listings View Api's [1]
export const fetchUserListings = async (userId, page, limit) => {
  
  try {
    console.log(buildApiUrl);
    
    const url = buildApiUrl(`/usermylistings?user_id=${userId}&page=${page}&limit=${limit}`,"user");
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error("Error fetching Listings:", error);
    return error || "Fetch Failed";
  }
};

export const fetchTransactionsData = async (userId) => {
  try {
    const response = await axios.get(
      buildApiUrl(`/getUserTransactions?tenant_id=${userId}`)
    );
    return response;
  } catch (error) {
    console.log("Transactions Data Fetching Failed", error);
    return error;
  }
};

// RM ------------

export const postRMTask = async (userId, propertyId, statusId) => {
  try {
    const response = await axios.post(
      buildApiUrl("/addRmTask", "rm"),
      {
        user_id: userId,
        property_id: propertyId,
        cur_stat_code: statusId,
      }
    );
    return response;
  } catch (error) {
    console.log("Error At Connect To RM:", error.message);
    return error;
  }
};

export const updateRMTask = async (userId, propertyId, statusId) => {
  console.log("updateRMTask params:", { userId, propertyId, statusId });
  try {
    const response = await axios.put(
      buildApiUrl("/updateRMTask", "rm"),
      {
        user_id: userId,
        property_id: propertyId,
        cur_stat_code: statusId,
      }
    );
    return response;
  } catch (error) {
    console.log("Error At Update RM Task:", error.message);
    return error;
  }
};

export const deleteRMTask = async (trId) => {
  try {
    const response = await axios.delete(buildApiUrl("/deleteRecord", "crud"), {
      data: {
        tableName: "dy_transactions",
        whereCondition: `id = ${trId}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error deleting records:", error.message || error);
    throw new Error(
      error.response?.data?.message || "Failed to delete records"
    );
  }
};

// testimonial related

export const addNewTestimonial = async (testimonialData, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("user_id", testimonialData.user_id);
    formData.append("display_name", testimonialData.display_name);
    formData.append("rating", testimonialData.rating);
    formData.append("description", testimonialData.description);
    formData.append("current_status", testimonialData.current_status);
    formData.append("city_id", testimonialData.city_id);
    formData.append("builder_id", testimonialData.builder_id);
    formData.append("project_category", testimonialData.project_category);
    formData.append("community_id", testimonialData.community_id);

    if (imageFile) {
      formData.append("images", imageFile);
    }

    const response = await axios.post(
      buildApiUrl("/addNewTestimonialRecord", "test"),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding testimonial:", error.message || error);
    throw new Error(
      error.response?.data?.message || "Failed to add testimonial"
    );
  }
};

export const getAllTestimonials = async () => {
  const url = buildApiUrl("getAllTestimonialRecords", "test");

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "No testimonials found.");
    }

    const data = await response.json();
    if (!data.result || data.result.length === 0) {
      return [];
    }

    return data.result.map((item) => ({
      id: item.id,
      user_name: item.user_name || "Anonymous",
      display_name: item.display_name || item.user_name || "Anonymous",
      rating: item.rating,
      description: item.description,
      image_data: item.image_data || null,
      current_status: item.current_status,
      testimonial_date: item.testimonial_date,
      city_id: item.city_id || null,
      city_name: item.city_name || null,
      builder_id: item.builder_id || null,
      builder_name: item.builder_name || null,
      community_id: item.community_id || null,
      community_name: item.community_name || null,
    }));
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
};


export const fetchCommunityAmenities = async (community_id) => {
  try {
    const response = await axios.get(
      buildApiUrl(`/amenities?community_id=${community_id}`, "user")
    );
    return response.data; // backend sends JSON data
  } catch (error) {
    console.error("Failed to fetch amenities:", error);
    return null;
  }
};
