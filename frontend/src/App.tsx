import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import AddPatient from "./components/AddPatient";
import EditPatient from "./components/EditPatient";
import SearchPatient from "./components/SearchPatient";
import { SelectFile } from "./components/SelectFile";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ width: "100%" }}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function App() {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="vertical tabs"
        sx={{
          borderRight: 1,
          borderColor: "divider",
          minWidth: "200px",
          marginY: "auto",
        }}
      >
        <Tab label="Add Patient" {...a11yProps(0)} />
        <Tab label="Edit Patients" {...a11yProps(1)} />
        <Tab label="Search" {...a11yProps(2)} />
        <Tab label="Select" {...a11yProps(2)} />
      </Tabs>

      <Box sx={{ flexGrow: 1, bgcolor: "grey.50" }}>
        <TabPanel value={value} index={0}>
          <AddPatient />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <EditPatient />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <SearchPatient />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <SelectFile />
        </TabPanel>
      </Box>
    </Box>
  );
}

export default App;
