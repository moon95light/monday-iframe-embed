// Importing necessary hooks and utilities from React and local files
import { useCallback } from "react";
import { fetchBoardData, fetchIframelyData } from "../helpers/api";
import { saveIframeSrc, getIframeSrc } from "../helpers/storage";
import { generateStorageKey } from "../helpers/utils";

// Defining a custom hook called useDataHooks
export const useDataHooks = (
  setIframeSources,
  setTabsData,
  setError,
  setIsButtonClicked,
  iframeSrc,
  setIframeSrc,
  setIsFetched,
  context,
  tabsData,
  setHtml
) => {
  // Defining a memoized callback function to handle URL unfurling
  const handleUnfurl = useCallback(
    async (urlToUnfurl, linkColumnId, linkColumnTitle) => {
      // Checking if the URL is empty
      if (!urlToUnfurl.trim()) {
        setError("URL cannot be empty");
        return;
      }

      // Defining a regular expression pattern to validate the URL
      const urlPattern =
        /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i;
      // Checking if the URL matches the pattern
      if (!urlPattern.test(urlToUnfurl)) {
        setError("Invalid URL");
        return;
      }
      fetchIframelyData(urlToUnfurl).then(function (result) {
        setHtml({ __html: result });
        console.log(result);
      });

      // Setting the button clicked state to true
      setIsButtonClicked(true);
      // Resetting any previous error messages
      setError(null);

      try {
        // Generating a storage key based on the context and link column ID
        const storageKey = generateStorageKey(context, linkColumnId);
        // Fetching iframe data from storage using the storage key
        const iframeDataFromStorage = await getIframeSrc(storageKey);
        console.warn(
          "Calling getIframeSrc from handleUnfurl",
          urlToUnfurl,
          linkColumnId,
          linkColumnTitle
        );

        // Checking if iframe data is already in storage
        if (iframeDataFromStorage) {
          // Updating the iframe sources state with the new data
          setIframeSources((prevIframeSources) => ({
            ...prevIframeSources,
            [linkColumnId]: iframeDataFromStorage,
          }));
          // Updating the tabs data state with the new tab data
          setTabsData((prevTabsData) => [
            ...prevTabsData,
            { label: linkColumnTitle, iframeSrc: iframeDataFromStorage },
          ]);
        } else {
          // Fetching iframe data from Iframely API
          const iframeData = await fetchIframelyData(urlToUnfurl);
          // Updating the iframe sources state with the new data
          setIframeSources((prevIframeSources) => ({
            ...prevIframeSources,
            [linkColumnId]: iframeData,
          }));
          // Saving the iframe data to storage
          saveIframeSrc(storageKey, iframeData);
          // Updating the tabs data state with the new tab data
          setTabsData((prevTabsData) => [
            ...prevTabsData,
            { label: linkColumnTitle, iframeSrc: iframeData },
          ]);
        }
      } catch (error) {
        // Setting the error state with the error message if an error occurs
        setError(error.message);
        // Setting the button clicked state to false if an error occurs
        setIsButtonClicked(false);
      }
    },
    // Specifying dependencies for the useCallback hook
    [setIsButtonClicked, setError, context, setIframeSources, setTabsData]
  );

  // The fetchLinkColumnUrls function is a memoized function that fetches URLs from link columns.
  const fetchLinkColumnUrls = useCallback(async () => {
    try {
      // Destructure boardId and itemId from the context object.
      const { boardId, itemId } = context;

      // Fetch board data using a helper function.
      const boardData = await fetchBoardData(boardId, itemId);

      // Filter out columns of type 'link' from the board data.
      const linkColumns = boardData.columns.filter(
        (column) => column.type === "link"
      );

      // Reset tabsData state to an empty array before processing link columns.
      setTabsData([]);

      // Map over link columns to process each one and return an array of promises.
      const linkDataPromises = linkColumns.map(async (linkColumn) => {
        // Get the ID of the current link column.
        const linkColumnId = linkColumn.id;

        // Get the first item of the board.
        const item = boardData.items[0];

        // Find the column value object that matches the link column ID.
        const linkColumnValue = item.column_values.find(
          (column_value) => column_value.id === linkColumnId
        );

        // Check if linkColumnValue and its text property exist.
        if (linkColumnValue && linkColumnValue.text) {
          // Extract URL from the text property of linkColumnValue.
          const textSegments = linkColumnValue.text.split(" - ");
          const url = textSegments[textSegments.length - 1];

          // Look for existing tab data for the current link column.
          const existingTabData = tabsData.find(
            (tabData) => tabData.label === linkColumn.title
          );

          // If no existing tab data is found, fetch iframe source.
          if (!existingTabData) {
            // Fetch iframe source from storage or Iframely API.
            await handleUnfurl(url, linkColumnId, linkColumn.title);
          } else {
            // If existing tab data is found, update tabsData state without fetching.
            setTabsData((prevTabsData) => [...prevTabsData, existingTabData]);
          }
        } else {
          // Set error state if no URL is found in the link column.
          setError("No URL found in link column");
        }
      });

      // Wait for all promises in linkDataPromises array to resolve.
      await Promise.all(linkDataPromises);
    } catch (error) {
      // Set error state and log error to console if any part of the process fails.
      setError("Failed to fetch data");
      console.error(error);
    }
  }, [context, handleUnfurl, tabsData, setTabsData, setError]); // Dependencies for useCallback

  // Define a memoized callback function to fetch the iframe source from storage.
  const fetchIframeSrc = useCallback(async () => {
    // If iframeSrc is already set, exit early from this function.
    if (iframeSrc) return;

    // Generate a storage key based on the context.
    const storageKey = generateStorageKey(context);

    // Await the result of fetching the iframe source from storage.
    const iframeSrcFromStorage = await getIframeSrc(storageKey);
    console.warn("Calling getIframeSrc from fetchIframeSrc"); // Logging the call to getIframeSrc.

    // If iframeSrcFromStorage is truthy (i.e., not null, undefined, etc.)
    if (iframeSrcFromStorage) {
      // Set isButtonClicked to true, setIframeSrc to the fetched value,
      // and setIsFetched to true, indicating that the iframe source has been successfully fetched.
      setIsButtonClicked(true);
      setIframeSrc(iframeSrcFromStorage);
      setIsFetched(true);
    }
  }, [iframeSrc, context, setIsButtonClicked, setIframeSrc, setIsFetched]); // List of dependencies for useCallback.

  // Return an object containing the handleUnfurl, fetchLinkColumnUrls, and fetchIframeSrc functions,
  // so they can be used in the component that calls useDataHooks.
  return { handleUnfurl, fetchLinkColumnUrls, fetchIframeSrc };
};
