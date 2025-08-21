import React from "react";
import { Box, Typography } from "@mui/material";

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: 2,
                textAlign: "center",
                bgcolor: "#f5f5f5",
                mt: "auto",
                position: "relative"
            }}
        >
            <Typography variant="body2" color="text.secondary">
                &copy; {new Date().getFullYear()} My Blog App - All rights reserved.
            </Typography>
        </Box>
    );
}
