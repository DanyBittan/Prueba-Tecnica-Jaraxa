import { useEffect, useState } from "react";
import "./App.css";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { IconLoading } from "./utils/icons";

function App() {
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (search === "") {
      setSearchData([]);
      setIsLoading(false);
      return;
    }
    if (!isLoading) setIsLoading(true);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);
  console.log(searchData);

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ p: 1 }}
      >
        <TextField
          id="outlined-password-input"
          label="Nombre del medicamento"
          type="text"
          autoComplete="off"
          sx={{ width: 1 / 3 }}
          onChange={(e) => setSearch(e.target.value)}
        />
        {isLoading && (
          <IconLoading style={{ margin: "20px 0 0 0" }} className="spinwheel">
            C
          </IconLoading>
        )}
      </Grid>

      <br />

      {searchData?.map((drugData) => (
        <Link
          key={drugData.openfda.product_ndc}
          to={`/product/${drugData.id}`}
          style={{ textDecoration: "none" }} // Aquí se quita el subrayado
        >
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ p: 1 }}
          >
            <Card
              variant="outlined"
              sx={{
                width: 11 / 12,
                "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
              }}
            >
              <Box sx={{ p: 3 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }} // Cambio de dirección en tamaños de pantalla diferentes
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography gutterBottom variant="h6" component="div">
                    {drugData.openfda.brand_name}
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{ mt: { xs: 1, sm: 0 } }} // Añade margen superior en tamaños pequeños
                  >
                    {drugData.openfda.manufacturer_name}
                  </Typography>
                </Stack>
                <Typography color="text.secondary" variant="body2">
                  {drugData.indications_and_usage}
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Link>
      ))}
    </>
  );
}

export default App;
