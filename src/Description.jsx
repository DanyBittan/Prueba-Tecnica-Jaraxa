import {
  Button,
  Card,
  Typography,
  Box,
  Grid,
  Divider,
  Container,
  Chip,
  Fade,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  LocalPharmacy as PharmacyIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Medication as MedicationIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./App.css";

const Description = () => {
  const { drugId } = useParams();
  const [drugData, setDrugData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem("theme-mode");
    return saved || "dark";
  });

  const toggleTheme = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("theme-mode", newMode);
    document.documentElement.setAttribute("data-theme", newMode);
  };

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [drugId]);

  useEffect(() => {
    const saved = localStorage.getItem("theme-mode");
    if (saved) {
      setMode(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }

    const handleStorageChange = () => {
      const newMode = localStorage.getItem("theme-mode") || "dark";
      setMode(newMode);
      document.documentElement.setAttribute("data-theme", newMode);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (isLoading) {
    return (
      <Box className={`app-container ${mode}`}>
        <Container maxWidth="md">
          <Box className="loading-container">
            <Box className="pulse-spinner">
              <Box className="pulse-ring" />
              <Box className="pulse-ring delay-1" />
              <Box className="pulse-ring delay-2" />
              <Box className="pulse-core">
                <PharmacyIcon />
              </Box>
            </Box>
            <Typography className="loading-text">Cargando información...</Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (!drugData) {
    return (
      <Box className={`app-container ${mode}`}>
        <Container maxWidth="md">
          <Box className="no-results">
            <InfoIcon className="no-results-icon" />
            <Typography variant="h6">Información no disponible</Typography>
            <Typography variant="body2">
              No se pudo cargar la información del medicamento
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box className={`app-container ${mode}`}>
      <Box className="theme-toggle-corner">
        <Tooltip title="Cambiar tema">
          <IconButton
            onClick={toggleTheme}
            className="theme-button"
            aria-label="toggle theme"
          >
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              className="back-button"
              style={{ marginBottom: "1.5rem" }}
            >
              Volver a la búsqueda
            </Button>
          </Link>

          <Fade in={!isLoading}>
            <Box className="description-content">
              <Card className="detail-card main-card">
                <Box className="card-header">
                  <Box className="drug-info">
                    <Typography variant="h4" className="drug-name">
                      {drugData.openfda?.brand_name?.[0] || "Nombre no disponible"}
                    </Typography>
                    <Chip
                      icon={<PharmacyIcon />}
                      label={
                        drugData.openfda?.manufacturer_name?.[0] ||
                        "Fabricante desconocido"
                      }
                      className="manufacturer-chip"
                      size="small"
                    />
                  </Box>
                  <Chip
                    label={`NDC: ${drugData.openfda?.product_ndc?.[0] || "N/A"}`}
                    className="ndc-chip"
                    size="small"
                  />
                </Box>

                <Box className="card-body-compact">
                  <Box className="scrollable-text">
                    <Typography className="generic-name">
                      <strong>Nombre genérico:</strong>{" "}
                      {drugData.openfda?.generic_name?.join(", ") ||
                        "No disponible"}
                    </Typography>
                  </Box>
                  <Box className="scrollable-text">
                    <Typography className="purpose-text">
                      <strong>Propósito:</strong>{" "}
                      {drugData.purpose?.[0] || "No disponible"}
                    </Typography>
                  </Box>
                </Box>

                <Divider className="section-divider" />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box className="info-section">
                      <Box className="section-header">
                        <InfoIcon />
                        <Typography variant="h6">Indicaciones y Uso</Typography>
                      </Box>
                      <Box className="scrollable-text">
                        <Typography className="section-content">
                          {drugData.indications_and_usage?.[0] ||
                            "Información no disponible"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box className="info-section">
                      <Box className="section-header warning">
                        <WarningIcon />
                        <Typography variant="h6">Advertencias</Typography>
                      </Box>
                      <Box className="scrollable-text">
                        <Typography className="section-content">
                          {drugData.warnings?.[0] || "Información no disponible"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Card>

              <Card className="detail-card secondary-card">
                <Typography variant="h5" className="section-title">
                  Información Detallada
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box className="detail-item">
                      <Typography className="detail-label">
                        <MedicationIcon fontSize="small" /> Ingredientes Activos
                      </Typography>
                      <Box className="scrollable-text">
                        <Typography className="detail-value">
                          {drugData.active_ingredient?.[0] ||
                            "Información no disponible"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className="detail-item">
                      <Typography className="detail-label">
                        <PharmacyIcon fontSize="small" /> Ingredientes Inactivos
                      </Typography>
                      <Box className="scrollable-text">
                        <Typography className="detail-value">
                          {drugData.inactive_ingredient?.[0] ||
                            "Información no disponible"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className="detail-item">
                      <Typography className="detail-label">
                        <InfoIcon fontSize="small" /> Dosis y Administración
                      </Typography>
                      <Box className="scrollable-text">
                        <Typography className="detail-value">
                          {drugData.dosage_and_administration?.[0] ||
                            "Información no disponible"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box className="detail-item">
                      <Typography className="detail-label">
                        <InfoIcon fontSize="small" /> Información Adicional
                      </Typography>
                      <Box className="scrollable-text">
                        <Typography className="detail-value">
                          {drugData.spl_unclassified_section?.[0] ||
                            "Información no disponible"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box className="detail-item full-width">
                      <Typography className="detail-label">
                        <InfoIcon fontSize="small" /> Preguntas
                      </Typography>
                      <Box className="scrollable-text">
                        <Typography className="detail-value">
                          {drugData.questions?.[0] || "Información no disponible"}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Box>
          </Fade>
        </Box>
      </Container>

      <Box className="footer">
        <Typography variant="body2">
          Datos proporcionados por la API pública de la FDA
        </Typography>
      </Box>
    </Box>
  );
};

export default Description;