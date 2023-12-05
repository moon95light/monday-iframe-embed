import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

export const saveIframeSrc = async (key, iframeSrc) => {
  try {
    console.log("Saving iframeSrc:", key, iframeSrc);
    const response = await monday.storage.instance.setItem(key, JSON.stringify(iframeSrc));
    if (response.data && response.data.success) {
      console.log("iframeSrc saved successfully:", response.data);
    } else {
      console.error("Error saving iframeSrc:", response);
    }
  } catch (error) {
    console.error("Exception encountered while saving iframeSrc:", error);
  }
};

export const getIframeSrc = async (key) => {
  try {
    const response = await monday.storage.instance.getItem(key);
    console.log("Retrieved iframeSrc:", key, response);
    if (response.data && response.data.success) {
      return response.data.value ? JSON.parse(response.data.value) : null;
    } else {
      console.error("Error retrieving iframeSrc:", response);
    }
  } catch (error) {
    console.error("Exception encountered while retrieving iframeSrc:", error);
  }
  return null;  // Return null if retrieval was unsuccessful or an exception occurred
};
