import { useState, useEffect } from "react";
import { Box, Typography, Divider, Tabs, Tab } from "@mui/material";
import { useCarModel } from "./components/Header";
import { AlignmentTab } from "./components/settings/AlignmentTab";
import { WheelTab } from "./components/settings/WheelsTab";
import { TiresTab } from "./components/settings/TiresTab";
import { CarTab } from "./components/settings/CarTab";
import { AccountTab } from "./components/settings/AccountTab";

type SettingsProps = {
  updateModel: (model: any) => void;
};

const CombinedSettings = ({ updateModel }: SettingsProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const { model, setModel } = useCarModel();
  const [matchWheels, setMatchWheels] = useState(false);
  const [matchTires, setMatchTires] = useState(false);
  const [frontCamber, setFrontCamber] = useState(-0.5);
  const [rearCamber, setRearCamber] = useState(-0.5);
  const [frontCaster, setFrontCaster] = useState(5);
  const [frontToe, setFrontToe] = useState(0);
  const [rearToe, setRearToe] = useState(0);
  const [rideHeightFront, setRideHeightFront] = useState(-2.65);
  const [rideHeightRear, setRideHeightRear] = useState(-2.65);

  const [frontTireWidth, setFrontTireWidth] = useState(185);
  const [frontTireSidewall, setFrontTireSidewall] = useState(60);
  const [frontWheelWidth, setFrontWheelWidth] = useState(6);
  const [frontWheelDiameter, setFrontWheelDiameter] = useState(14);
  const [frontWheelOffset, setFrontWheelOffset] = useState(45);
  const [frontWheelSpacer, setFrontWheelSpacer] = useState(0);
  const [rearTireWidth, setRearTireWidth] = useState(185);
  const [rearTireSidewall, setRearTireSidewall] = useState(60);
  const [rearWheelWidth, setRearWheelWidth] = useState(6);
  const [rearWheelDiameter, setRearWheelDiameter] = useState(14);
  const [rearWheelOffset, setRearWheelOffset] = useState(45);
  const [rearWheelSpacer, setRearWheelSpacer] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    updateModel({
      frontCamber,
      rearCamber,
      frontCaster,
      frontToe,
      rearToe,
      rideHeightFront,
      rideHeightRear,
      frontTireWidth,
      frontTireSidewall,
      frontWheelWidth,
      frontWheelDiameter,
      frontWheelOffset,
      frontWheelSpacer,
      rearTireWidth,
      rearTireSidewall,
      rearWheelWidth,
      rearWheelDiameter,
      rearWheelOffset,
      rearWheelSpacer,
    });
  }, [
    frontCamber,
    rearCamber,
    frontCaster,
    frontToe,
    rearToe,
    rideHeightFront,
    rideHeightRear,
    frontTireWidth,
    frontTireSidewall,
    frontWheelWidth,
    frontWheelDiameter,
    frontWheelOffset,
    frontWheelSpacer,
    rearTireWidth,
    rearTireSidewall,
    rearWheelWidth,
    rearWheelDiameter,
    rearWheelOffset,
    rearWheelSpacer,
    updateModel,
  ]);

  useEffect(() => {
    if (matchWheels) {
      setRearWheelWidth(frontWheelWidth);
      setRearWheelDiameter(frontWheelDiameter);
      setRearWheelOffset(frontWheelOffset);
      setRearWheelSpacer(frontWheelSpacer);
    }
  }, [
    matchWheels,
    frontWheelWidth,
    frontWheelDiameter,
    frontWheelOffset,
    frontWheelSpacer,
  ]);

  useEffect(() => {
    if (matchTires) {
      setRearTireWidth(frontTireWidth);
      setRearTireSidewall(frontTireSidewall);
    }
  }, [matchTires, frontTireWidth, frontTireSidewall]);

  return (
    <Box sx={{ p: 2, height: "100%", overflow: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Settings
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          mb: 2,
          "& .MuiTabs-scrollButtons": {
            "&.Mui-disabled": { opacity: 0.3 },
          },
        }}
      >
        <Tab label="Alignment" />
        <Tab label="Wheels" />
        <Tab label="Tires" />
        <Tab label="Car" />
        <Tab label="Account" />
      </Tabs>

      {activeTab === 0 && (
        <AlignmentTab
          alignment={{
            frontCamber,
            setFrontCamber,
            rearCamber,
            setRearCamber,
            frontCaster,
            setFrontCaster,
            frontToe,
            setFrontToe,
            rearToe,
            setRearToe,
            rideHeightFront,
            setRideHeightFront,
            rideHeightRear,
            setRideHeightRear,
          }}
        />
      )}

      {activeTab === 1 && (
        <WheelTab
          wheels={{
            matchWheels,
            setMatchWheels,
            frontWheelWidth,
            setFrontWheelWidth,
            frontWheelDiameter,
            setFrontWheelDiameter,
            frontWheelOffset,
            setFrontWheelOffset,
            frontWheelSpacer,
            setFrontWheelSpacer,
            rearWheelWidth,
            setRearWheelWidth,
            rearWheelDiameter,
            setRearWheelDiameter,
            rearWheelOffset,
            setRearWheelOffset,
            rearWheelSpacer,
            setRearWheelSpacer,
          }}
        />
      )}

      {activeTab === 2 && (
        <TiresTab
          tires={{
            matchTires,
            setMatchTires,
            frontTireWidth,
            setFrontTireWidth,
            frontTireSidewall,
            setFrontTireSidewall,
            rearTireWidth,
            setRearTireWidth,
            rearTireSidewall,
            setRearTireSidewall,
          }}
        />
      )}

      {activeTab === 3 && (
        <CarTab
          cars={{
            model,
            setModel,
          }}
        />
      )}

      {activeTab === 4 && <AccountTab />}
    </Box>
  );
};

export default CombinedSettings;
