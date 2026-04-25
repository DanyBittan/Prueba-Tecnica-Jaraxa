import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Card,
  Container,
  Fade,
  Chip,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Search as SearchIcon,
  LocalPharmacy as PharmacyIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import "./App.css";

function App() {
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem("theme-mode");
    return saved || (prefersDarkMode ? "dark" : "light");
  });

  useEffect(() => {
    localStorage.setItem("theme-mode", mode);
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    if (search === "") {
      setSearchData([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(async () => {
      const data = await fetch(
        `https://api.fda.gov/drug/label.json${search.length > 0
          ? `?search=openfda.brand_name:${search}*&limit=6`
          : ""
        }`
      )
        .then((result) => result.json())
        .catch((err) => {
          alert(err);
        })
        .finally(() => setIsLoading(false));
      setSearchData(data.results);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

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

      <Box className="hero-section">
        <Box className="hero-background" />

        <Container maxWidth="md">
          <Box className="hero-content">
            <Box className="logo-section">
              <Box className="logo-icon">
                <PharmacyIcon fontSize="large" />
              </Box>
              <Typography variant="h3" className="app-title">
                MediSearch
              </Typography>
            </Box>

            <Typography variant="h6" className="tagline">
              Tu buscador confiable de medicamentos aprobados por la FDA
            </Typography>

            <Box className="search-container">
              <SearchIcon className="search-icon" />
              <TextField
                id="medicine-search"
                placeholder="Busca por nombre de medicamento..."
                type="text"
                autoComplete="off"
                className="search-input"
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ disableUnderline: true }}
                variant="standard"
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Box className="results-section">
          {isLoading && (
            <Fade in={isLoading}>
              <Box className="loading-container">
                <Box className="pulse-spinner">
                  <Box className="pulse-ring" />
                  <Box className="pulse-ring delay-1" />
                  <Box className="pulse-ring delay-2" />
                  <Box className="pulse-core">
                    <PharmacyIcon />
                  </Box>
                </Box>
                <Typography className="loading-text">Buscando...</Typography>
              </Box>
            </Fade>
          )}

          <Fade in={searchData?.length > 0 && !isLoading}>
            <Box className="results-container">
              {searchData?.map((drugData, index) => {
                const fullText = drugData.indications_and_usage?.[0] || "";
                const truncatedText = fullText.substring(0, 200) + (fullText.length > 200 ? "..." : "");

                return (
                  <Fade in={!isLoading} key={drugData.openfda?.product_ndc?.[0] || index}>
                    <Card className="drug-card">
                      <Box className="card-header">
                        <Box className="drug-info">
                          <Typography variant="h5" className="drug-name">
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
                      </Box>

                      <Box className="card-body">
                        <Box className="drug-purpose-wrapper">
                          <Typography className="drug-purpose">
                            {truncatedText}
                          </Typography>
                        </Box>
                      </Box>

                      <Box className="card-footer">
                        <Link
                          to={`/product/${drugData.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <Button
                            size="small"
                            className="detail-button"
                            endIcon={<ArrowForwardIcon />}
                          >
                            Ver detalles
                          </Button>
                        </Link>
                      </Box>
                    </Card>
                  </Fade>
                );
              })}
            </Box>
          </Fade>

          {!isLoading && search.length > 0 && searchData?.length === 0 && (
            <Box className="no-results">
              <PharmacyIcon className="no-results-icon" />
              <Typography variant="h6">
                No se encontraron resultados
              </Typography>
              <Typography variant="body2">
                Intenta con otro nombre de medicamento
              </Typography>
            </Box>
          )}
        </Box>
      </Container>

      <Box className="footer">
        <Typography variant="body2">
          Datos proporcionados por la API pública de la FDA
        </Typography>
      </Box>
    </Box>
  );
}

export default App;