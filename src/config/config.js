import "dotenv/config";

const { PORT, BASE_URL, MONGODB_URI, JWT_SECRET } = process.env;

export const db = MONGODB_URI;
export const port = PORT || 5000;
export const jwtSecret =
  JWT_SECRET || "aJShdiasuuJHDikjashdilaSJGHDiuiasugdkasiGDasiluijgdasiugdhA";
export const baseUrl = BASE_URL || `http://localhost:${port}`;
