import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  styled,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  SelectChangeEvent,
  Link,
} from "@mui/material";
import { useCarModel } from "./components/Header";
import { useAuth } from "./provider/AuthProvider";
import { Link as RouterLink } from "react-router-dom";
import SuspensionSettings from "./components/FitmentSettingsTabs/SuspensionSettings";
import WheelSettings from "./components/FitmentSettingsTabs/WheelSettings";
import TireSettings from "./components/FitmentSettingsTabs/TireSettings";
import CarSelectionSettings from "./components/FitmentSettingsTabs/CarSelectionSettings";
import AccountSettings from "./components/FitmentSettingsTabs/AccountSettings";

type SettingsProps = {
  updateModel: (model: any) => void;
};

const CombinedSettings = ({ updateModel }: SettingsProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const { model, setModel } = useCarModel();
  const { user, loading } = useAuth();
  const [matchWheels, setMatchWheels] = useState(false);
  const [matchTires, setMatchTires] = useState(false);
  const [frontCamber, setFrontCamber] = useState(-0.5);
  const [rearCamber, setRearCamber] = useState(-0.5);
  const [frontCaster, setFrontCaster] = useState(5);
  const [frontToe, setFrontToe] = useState(0);
  const [rearToe, setRearToe] = useState(0);
  const [rideHeightFront, setRideHeightFront] = useState(-2.65);
  const [rideHeightRear, setRideHeightRear] = useState(-2.65);
  const STOCK_RIDE_HEIGHT = -2.65;
  const MM_TO_INCHES = 25.4;

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
        <>
          <SuspensionSettings
            title="Front Suspension"
            rideHeight={rideHeightFront}
            setRideHeight={setRideHeightFront}
            camber={frontCamber}
            setCamber={setFrontCamber}
            caster={frontCaster}
            setCaster={setFrontCaster}
            toe={frontToe}
            setToe={setFrontToe}
            stockRideHeight={STOCK_RIDE_HEIGHT}
            mmToInches={MM_TO_INCHES}
          />
          <SuspensionSettings
            title="Rear Suspension"
            rideHeight={rideHeightRear}
            setRideHeight={setRideHeightRear}
            camber={rearCamber}
            setCamber={setRearCamber}
            stockRideHeight={STOCK_RIDE_HEIGHT}
            mmToInches={MM_TO_INCHES}
          />
        </>
      )}

      {activeTab === 1 && (
        <>
          <WheelSettings
            matchWheels={matchWheels}
            setMatchWheels={setMatchWheels}
            frontWheelWidth={frontWheelWidth}
            setFrontWheelWidth={setFrontWheelWidth}
            frontWheelDiameter={frontWheelDiameter}
            setFrontWheelDiameter={setFrontWheelDiameter}
            frontWheelOffset={frontWheelOffset}
            setFrontWheelOffset={setFrontWheelOffset}
            frontWheelSpacer={frontWheelSpacer}
            setFrontWheelSpacer={setFrontWheelSpacer}
            rearWheelWidth={rearWheelWidth}
            setRearWheelWidth={setRearWheelWidth}
            rearWheelDiameter={rearWheelDiameter}
            setRearWheelDiameter={setRearWheelDiameter}
            rearWheelOffset={rearWheelOffset}
            setRearWheelOffset={setRearWheelOffset}
            rearWheelSpacer={rearWheelSpacer}
            setRearWheelSpacer={setRearWheelSpacer}
          />
        </>
      )}

      {activeTab === 2 && (
        <>
          <TireSettings
            matchTires={matchTires}
            setMatchTires={setMatchTires}
            frontTireWidth={frontTireWidth}
            setFrontTireWidth={setFrontTireWidth}
            frontTireSidewall={frontTireSidewall}
            setFrontTireSidewall={setFrontTireSidewall}
            rearTireWidth={rearTireWidth}
            setRearTireWidth={setRearTireWidth}
            rearTireSidewall={rearTireSidewall}
            setRearTireSidewall={setRearTireSidewall}
          />
        </>
      )}

      {activeTab === 3 && (
        <CarSelectionSettings
          model={model}
          setModel={setModel}
          user={user}
          loading={loading}
        />
      )}

      {activeTab === 4 && <AccountSettings user={user} />}
    </Box>
  );
};

export default CombinedSettings;
