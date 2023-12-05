// src/components/TabsUI.js
import React from 'react';
import { TabsContext, TabList, Tab, TabPanels, TabPanel } from "monday-ui-react-core";
import IframeDisplay from "./IframeDisplay";

const TabsUI = ({ tabsData }) => (
  <TabsContext>
    <TabList>
      {tabsData.map((tabData, index) => (
        <Tab key={index}>{tabData.label}</Tab>
      ))}
    </TabList>
    <TabPanels>
      {tabsData.map((tabData, index) => (
        <TabPanel className="" key={index}>
          <IframeDisplay iframeSrc={tabData.iframeSrc} />
        </TabPanel>
      ))}
    </TabPanels>
  </TabsContext>
);

export default TabsUI;
