// Importamos Grid de Material-UI
import {
  Button,
  Card,
  Typography,
  Stack,
  Box,
  Grid,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Description = () => {
  const { drugId } = useParams();
  const [drugData, setDrugData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.fda.gov/drug/label.json?search=id:${drugId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setDrugData(data?.results?.[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [drugId]);

  if (!drugData) {
    return <Typography>Loading data...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Link to="/">
        <Button variant="contained" sx={{ mb: 2 }}>
          Back
        </Button>
      </Link>
      <Card
        variant="outlined"
        sx={{
          p: 3,
          mb: 3,
          bgcolor: "#f1fced",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: "#e8f5e9",
            opacity: 0.1,
            zIndex: -1,
          }}
        />
        <Stack spacing={1}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" sx={{ color: "#37474f" }}>
              {drugData.openfda?.brand_name?.[0] ?? "Brand name not available"}
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "green", mt: { xs: 1, sm: 0 } }}
            >
              NDC: {drugData.openfda?.product_ndc?.[0] ?? "NDC not available"}
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: 14, color: "#37474f" }}>
            {drugData.openfda?.generic_name?.join(", ") ??
              "Generic name not available"}
          </Typography>
          <Typography variant="body1" sx={{ color: "#37474f" }}>
            {drugData.purpose?.[0] ?? "Purpose not available"}
          </Typography>

          <Divider sx={{ my: 2, backgroundColor: "#37474f" }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" sx={{ color: "#37474f" }}>
                Indications and Usage
              </Typography>
              <Typography variant="body2" sx={{ color: "#78909c" }}>
                {drugData.indications_and_usage?.[0] ??
                  "Information not available"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" sx={{ color: "#37474f" }}>
                Warnings
              </Typography>
              <Typography variant="body2" sx={{ color: "#78909c" }}>
                {drugData.warnings?.[0] ?? "Information not available"}
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </Card>
      <Card
        variant="outlined"
        sx={{
          p: 3,
          mb: 3,
          bgcolor: "#f1fced",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >
        <Stack spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Active Ingredients</Typography>
              <Typography variant="body2" sx={{ color: "#78909c" }}>
                {drugData.active_ingredient?.[0] ?? "Information not available"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Inactive Ingredients</Typography>
              <Typography variant="body2" sx={{ color: "#78909c" }}>
                {drugData.inactive_ingredient?.[0] ??
                  "Information not available"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Dosage and Administration</Typography>
              <Typography variant="body2" sx={{ color: "#78909c" }}>
                {drugData.dosage_and_administration?.[0] ??
                  "Information not available"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">Other Information</Typography>
              <Typography variant="body2" sx={{ color: "#78909c" }}>
                {drugData.spl_unclassified_section?.[0] ??
                  "Information not available"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Questions</Typography>
              <Typography variant="body2" sx={{ color: "#78909c" }}>
                {drugData.questions?.[0] ?? "Information not available"}
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </Box>
  );
};

export default Description;
