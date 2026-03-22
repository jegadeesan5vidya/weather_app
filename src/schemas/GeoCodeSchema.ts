import { z } from "zod";

export const GeoCodeSchema = z.array(
  z.object({
    name: z.string(),
    local_names: z.record(z.string()).optional(),
    lat: z.number(),
    lon: z.number(),
    country: z.string(),
    state: z.string().optional()
  })
);