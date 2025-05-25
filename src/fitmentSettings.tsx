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
} from "@mui/material";
import { useCarModel } from "./components/Header";

type SettingsProps = {
  updateModel: (model: any) => void;
};

const StyledInput = styled("input")(({ theme }) => ({
  width: "100%",
  padding: "8px",
  marginBottom: "8px",
  borderRadius: "4px",
  border: `1px solid ${theme.palette.divider}`,
  fontSize: "0.875rem",
  "&:focus": {
    outline: "none",
    borderColor: theme.palette.primary.main,
  },
}));

const StyledLabel = styled("label")(({ theme }) => ({
  display: "block",
  marginBottom: "4px",
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
}));

const StyledDiv = styled("div")(({ theme }) => ({
  marginBottom: "16px",
  padding: "16px",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "4px",
  border: `1px solid ${theme.palette.divider}`,
}));

const SliderContainer = styled("div")(({}) => ({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "8px",
}));

const SliderValue = styled("span")(({ theme }) => ({
  minWidth: "60px",
  textAlign: "right",
  color: theme.palette.text.secondary,
}));

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
          <StyledDiv>
            <Typography variant="subtitle1" gutterBottom>
              Front Settings
            </Typography>
            <SliderContainer>
              <StyledLabel>Ride Height:</StyledLabel>
              <StyledInput
                type="range"
                min="-3"
                max="-2"
                step="0.01"
                value={rideHeightFront}
                onChange={(e) => setRideHeightFront(parseFloat(e.target.value))}
              />
              <SliderValue>
                {rideHeightFront === STOCK_RIDE_HEIGHT
                  ? 'Stock (0.00")'
                  : `${(
                      -(rideHeightFront - STOCK_RIDE_HEIGHT) * MM_TO_INCHES
                    ).toFixed(2)}\u2033`}
              </SliderValue>
            </SliderContainer>

            <SliderContainer>
              <StyledLabel>Camber:</StyledLabel>
              <StyledInput
                type="range"
                min="-20"
                max="1"
                step="0.1"
                value={frontCamber}
                onChange={(e) => setFrontCamber(parseFloat(e.target.value))}
              />
              <SliderValue>{frontCamber}°</SliderValue>
            </SliderContainer>

            <SliderContainer>
              <StyledLabel>Caster:</StyledLabel>
              <StyledInput
                type="range"
                min="5"
                max="8"
                step="0.1"
                value={frontCaster}
                onChange={(e) => setFrontCaster(parseFloat(e.target.value))}
              />
              <SliderValue>{frontCaster}°</SliderValue>
            </SliderContainer>

            <SliderContainer>
              <StyledLabel>Toe:</StyledLabel>
              <StyledInput
                type="range"
                min="-0.05"
                max="0.05"
                step="0.01"
                value={frontToe}
                onChange={(e) => setFrontToe(parseFloat(e.target.value))}
              />
              <SliderValue>{frontToe}°</SliderValue>
            </SliderContainer>
          </StyledDiv>

          <StyledDiv>
            <Typography variant="subtitle1" gutterBottom>
              Rear Settings
            </Typography>
            <SliderContainer>
              <StyledLabel>Ride Height:</StyledLabel>
              <StyledInput
                type="range"
                min="-3"
                max="-2"
                step="0.01"
                value={rideHeightRear}
                onChange={(e) => setRideHeightRear(parseFloat(e.target.value))}
              />
              <SliderValue>
                {rideHeightRear === STOCK_RIDE_HEIGHT
                  ? 'Stock (0.00")'
                  : `${(
                      -(rideHeightRear - STOCK_RIDE_HEIGHT) * MM_TO_INCHES
                    ).toFixed(2)}\u2033`}
              </SliderValue>
            </SliderContainer>

            <SliderContainer>
              <StyledLabel>Camber:</StyledLabel>
              <StyledInput
                type="range"
                min="-20"
                max="1"
                step="0.1"
                value={rearCamber}
                onChange={(e) => setRearCamber(parseFloat(e.target.value))}
              />
              <SliderValue>{rearCamber}°</SliderValue>
            </SliderContainer>

            <SliderContainer>
              <StyledLabel>Toe:</StyledLabel>
              <StyledInput
                type="range"
                min="-0.05"
                max="0.05"
                step="0.01"
                value={rearToe}
                onChange={(e) => setRearToe(parseFloat(e.target.value))}
              />
              <SliderValue>{rearToe}°</SliderValue>
            </SliderContainer>
          </StyledDiv>
        </>
      )}

      {activeTab === 1 && (
        <>
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={matchWheels}
                  onChange={(e) => setMatchWheels(e.target.checked)}
                />
              }
              label="Match Front and Rear Wheels"
            />
          </Box>

          <StyledDiv>
            <Typography variant="subtitle1" gutterBottom>
              Front Wheels
            </Typography>
            <StyledLabel>Width (in)</StyledLabel>
            <StyledInput
              type="number"
              value={frontWheelWidth}
              onChange={(e) => setFrontWheelWidth(parseFloat(e.target.value))}
            />

            <StyledLabel>Diameter (in)</StyledLabel>
            <StyledInput
              type="number"
              value={frontWheelDiameter}
              onChange={(e) =>
                setFrontWheelDiameter(parseFloat(e.target.value))
              }
            />

            <StyledLabel>Offset (mm)</StyledLabel>
            <StyledInput
              type="number"
              value={frontWheelOffset}
              onChange={(e) => setFrontWheelOffset(parseFloat(e.target.value))}
            />

            <StyledLabel>Spacer (mm)</StyledLabel>
            <StyledInput
              type="number"
              value={frontWheelSpacer}
              onChange={(e) => setFrontWheelSpacer(parseFloat(e.target.value))}
            />
          </StyledDiv>

          <StyledDiv sx={{ opacity: matchWheels ? 0.5 : 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Rear Wheels {matchWheels && "(Matching Front)"}
            </Typography>
            <StyledLabel>Width (in)</StyledLabel>
            <StyledInput
              type="number"
              value={rearWheelWidth}
              onChange={(e) => setRearWheelWidth(parseFloat(e.target.value))}
              disabled={matchWheels}
            />

            <StyledLabel>Diameter (in)</StyledLabel>
            <StyledInput
              type="number"
              value={rearWheelDiameter}
              onChange={(e) => setRearWheelDiameter(parseFloat(e.target.value))}
              disabled={matchWheels}
            />

            <StyledLabel>Offset (mm)</StyledLabel>
            <StyledInput
              type="number"
              value={rearWheelOffset}
              onChange={(e) => setRearWheelOffset(parseFloat(e.target.value))}
              disabled={matchWheels}
            />

            <StyledLabel>Spacer (mm)</StyledLabel>
            <StyledInput
              type="number"
              value={rearWheelSpacer}
              onChange={(e) => setRearWheelSpacer(parseFloat(e.target.value))}
              disabled={matchWheels}
            />
          </StyledDiv>
        </>
      )}

      {activeTab === 2 && (
        <>
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={matchTires}
                  onChange={(e) => setMatchTires(e.target.checked)}
                />
              }
              label="Match Front and Rear Tires"
            />
          </Box>

          <StyledDiv>
            <Typography variant="subtitle1" gutterBottom>
              Front Tires
            </Typography>
            <StyledLabel>Width (mm)</StyledLabel>
            <StyledInput
              type="number"
              value={frontTireWidth}
              onChange={(e) => setFrontTireWidth(parseFloat(e.target.value))}
            />

            <StyledLabel>Sidewall (%)</StyledLabel>
            <StyledInput
              type="number"
              value={frontTireSidewall}
              onChange={(e) => setFrontTireSidewall(parseFloat(e.target.value))}
            />
          </StyledDiv>

          <StyledDiv sx={{ opacity: matchTires ? 0.5 : 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Rear Tires {matchTires && "(Matching Front)"}
            </Typography>
            <StyledLabel>Width (mm)</StyledLabel>
            <StyledInput
              type="number"
              value={rearTireWidth}
              onChange={(e) => setRearTireWidth(parseFloat(e.target.value))}
              disabled={matchTires}
            />

            <StyledLabel>Sidewall (%)</StyledLabel>
            <StyledInput
              type="number"
              value={rearTireSidewall}
              onChange={(e) => setRearTireSidewall(parseFloat(e.target.value))}
              disabled={matchTires}
            />
          </StyledDiv>
        </>
      )}

      {activeTab === 3 && (
        <StyledDiv>
          <Typography variant="subtitle1" gutterBottom>
            Car Selection
          </Typography>
          <Box sx={{ mb: 2 }}>
            <StyledLabel>Miata Generation</StyledLabel>
            <Select
              value={model}
              onChange={(event: SelectChangeEvent) => {
                setModel(event.target.value);
              }}
              fullWidth
              sx={{ mt: 0.5 }}
            >
              <MenuItem value="na">NA Miata (1989-1997)</MenuItem>
              <MenuItem value="nb">NB Miata (1998-2005)</MenuItem>
              <MenuItem value="nc" disabled>
                NC Miata (2006-2015) - Coming Soon
              </MenuItem>
              <MenuItem value="nd" disabled>
                ND Miata (2016-Present) - Coming Soon
              </MenuItem>
            </Select>
          </Box>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Select your Miata generation to view and customize its fitment
            settings. Each generation has unique wheel wells and suspension
            geometry.
          </Typography>
        </StyledDiv>
      )}

      {activeTab === 4 && (
        <StyledDiv>
          <Typography variant="subtitle1" gutterBottom>
            Account Settings
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Account settings and preferences will be implemented in a future
            update.
          </Typography>
        </StyledDiv>
      )}
    </Box>
  );
};

export default CombinedSettings;
