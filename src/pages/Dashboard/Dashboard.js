import React from "react";
import {
  Flex,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Center,
} from "@chakra-ui/react";
import All from "./Blogs/All";
import Active from "./Blogs/Active";
import Archived from "./Blogs/Archived";
import Drafts from "./Blogs/Drafts";

const Dashboard = () => (
  <Flex
    direction="column"
    py={12}
  >
    <Heading textAlign="center" pb={12}>My Blogs</Heading>
    <Tabs colorScheme="gray" isLazy>
      <Center>
        <TabList>
          <Tab py={2}>All</Tab>
          <Tab py={2}>Active</Tab>
          <Tab py={2}>Drafts</Tab>
          <Tab py={2}>Archived</Tab>
        </TabList>
      </Center>

      <TabPanels mt={6}>
        <TabPanel>
          <All />
        </TabPanel>

        <TabPanel>
          <Active />
        </TabPanel>

        <TabPanel>
          <Drafts />
        </TabPanel>

        <TabPanel>
          <Archived />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Flex>
);

export default Dashboard;
