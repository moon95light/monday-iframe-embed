// src/App.js
import React, { useState, useEffect } from "react"; // Importing useState and useEffect hooks from React
import "./App.css"; // Importing the stylesheet for the App component
import mondaySdk from "monday-sdk-js"; // Importing the monday-sdk-js library to interact with the Monday.com platform
import "monday-ui-react-core/dist/main.css"; // Importing the Monday UI React core library for styling
import InputForm from "./components/InputForm"; // Importing custom InputForm component
import ErrorDisplay from "./components/ErrorDisplay"; // Importing custom ErrorDisplay component
import IframeDisplay from "./components/IframeDisplay"; // Importing custom IframeDisplay component
import TabsUI from "./components/TabsUI"; // Importing custom TabsUI component
import { useDataHooks } from "./hooks/useDataHooks"; // Importing custom hooks from useDataHooks file
import MenuComponent from "./components/MenuComponent";
import src from "monday-sdk-js";

const monday = mondaySdk(); // Initializing the Monday SDK

// Main App component
const App = () => {
  // Defining state variables using the useState hook
  const [context, setContext] = useState(null); // State to hold the context object from Monday SDK
  const [url, setUrl] = useState(""); // State to hold the URL input by the user
  const [iframeSrc, setIframeSrc] = useState(""); // State to hold the source for the Iframe
  const [isButtonClicked, setIsButtonClicked] = useState(false); // State to manage the button click status
  const [error, setError] = useState(null); // State to hold any error messages
  const [isFetched, setIsFetched] = useState(false); // State to manage the fetched status
  const [iframeSources, setIframeSources] = useState({}); // State to hold iframe sources for all link columns
  const [tabsData, setTabsData] = useState([]); // State to store tab labels and iframe sources
  const [html, setHtml] = useState({
    __html: '<div />',
  });
  // Destructuring custom hooks to get necessary functions
  const { handleUnfurl, fetchLinkColumnUrls, fetchIframeSrc } = useDataHooks(
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
  );

  // useEffect hook to execute certain operations on component mount
  useEffect(() => {
    monday.execute("valueCreatedForUser"); // Executing a Monday.com API operation
    monday.listen("context", (res) => {
      // Listening for context changes from Monday SDK
      setContext(res.data); // Updating context state with new data
      console.log("PG_EA:: context", res); // Logging the context data (for debugging purposes)
    });
  }, []); // Empty dependency array to run only once on mount
  useEffect(() => {
    window.iframely && window.iframely.load();
  });
  // Uncomment below useEffect hook if needed to fetch iframe source when context or isFetched state changes
  /*useEffect(() => {
    if (context && !isFetched) {
      fetchIframeSrc();  // Fetching iframe source if context is truthy and isFetched is falsey
    }
  }, [context, fetchIframeSrc, isFetched]);*/

  // useEffect hook to fetch URLs from link columns when context state changes
  useEffect(() => {
    if (context) {
      // Checking if context is truthy
      switch (
        context.instanceType // Switch statement to handle different instance types
      ) {
        case "item_view":
          //fetchLinkColumnUrls(); // Fetching URLs from link columns if instance type is 'item_view'
          break;
        default:
          break; // Default case (do nothing)
      }
    }
  }, [context, fetchLinkColumnUrls]); // Dependencies for useEffect

  // Render method for App component
  return (
    <div className="App">
      <p>Hello</p>
      {isButtonClicked ? (
        <TabsUI tabsData={tabsData} /> // Rendering TabsUI component if isButtonClicked is true
      ) : (
        <>
          <InputForm // Rendering InputForm component
            url={url} // Passing url state as prop
            handleUrlChange={setUrl} // Passing setUrl function as prop to handle URL changes
            handleUnfurl={() => handleUnfurl(url)} // Passing handleUnfurl function as prop to handle unfurl action
          />
          <ErrorDisplay // Rendering ErrorDisplay component with error state as prop
            error={error}
          />
        </>
      )}
      {
        // isButtonClicked && <div dangerouslySetInnerHTML={html} />
        isButtonClicked && <IframeDisplay iframeSrc={iframeSrc} /> // Rendering IframeDisplay component if isButtonClicked is true
      }
      <MenuComponent monday={monday} />
    </div>
  );
};

export default App;
