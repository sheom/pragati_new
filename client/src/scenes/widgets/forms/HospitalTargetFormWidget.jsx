import { Typography, Box, Stack, Divider, useTheme } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useState, createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import submitForm from "./submitForm";
import WidgetWrapper from "components/WidgetWrapper";
//
import HospitalStep from "./quarterForms/HospitalStep";
import { string } from "yup";

const monthsArray = [
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
];

export const FormContext = createContext();

const HospitalTargetFormWidget = ({
  propertyName,
  propertyCode,
  propertyId,
}) => {
  const isCurrentUser = true;
  const theme = createTheme();
  const navigate = useNavigate();
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const subsidiary = useSelector((state) => state.user.subsidiary);

  const [value, setValue] = useState("0");
  //
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [formLocked, setFormLocked] = useState(false);
  //
  const fye = new Date().getFullYear()+1
  //
  const getBudget = async () => {
    //"http://localhost:4000/",
    const response = await fetch(
      `http://localhost:4000/budget?propertyCode=${propertyCode}&budgetYear=${fye }`,
      {
        // const response = await fetch(`http://localhost:4000/budget?propertyCode=${propertyCode}&budgetYear=${new Date().getFullYear() + 1}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    //alert("data: "+JSON.stringify(data))
    if (data) {
      setFormData(data.payload);
      setFormLocked(data.locked)
      setActiveStepIndex(4);
      makeForm();
    }
  };

  useEffect(() => {
    getBudget();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  //
  //
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    setActiveStepIndex( newValue );
    //setActiveStepIndex( toString(newValue));
  };

  const makeForm = () => {
    return (
      <>
        <Box display="flex" minHeight="230px">
        {/* <h1>Target form for Hospital {activeStepIndex} </h1> */}

          <FormContext.Provider
            value={{
              activeStepIndex,
              setActiveStepIndex,
              formData,
              setFormData,
              formLocked, 
              setFormLocked,
            }}
          >
            <div>
            {/* {propertyCode} */}
              <HospitalStep
                propertyName={propertyName}
                propertyCode={propertyCode}
                propertyId={propertyId}
              />
            </div>
          </FormContext.Provider>
        </Box>
        
      </>
    );
  };

  return (
    <>
      <>
        <WidgetWrapper>
          {/* {propertyCode} */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center" //minHeight="100vh"
          >
            <Typography
              fontSize={25}
              fontWeight={700}
              //color="#11142D"
              color="#FF0000"
              align="center"
            >
              {propertyName} <br />
              Enter budget data for Financial year {fye-1}-{fye}
            </Typography>
          </Box>

          <TabContext value={activeStepIndex}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                centered={true}
                onChange={handleTabChange}
                fontSize={"20px"}
              >
                <Tab label="Quarter One" value={0} />
                <Tab label="Quarter Two" value={1} />
                <Tab label="Quarter Three" value={2} />
                <Tab label="Quarter Four" value={3} />
                <Tab label="Summary" value={4} />
              </TabList>
            </Box>

            <TabPanel value={0}>{makeForm()}</TabPanel>
            <TabPanel value={1}>{makeForm()}</TabPanel>
            <TabPanel value={2}>{makeForm()}</TabPanel>
            <TabPanel value={3}>{makeForm()}</TabPanel>
            <TabPanel value={4}>{makeForm()}</TabPanel>
          </TabContext>
        </WidgetWrapper>
      </>
    </>
  );
};

export default HospitalTargetFormWidget;
