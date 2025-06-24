"use client";

import * as React from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#fafbfc',
      paper: '#fff',
    },
    primary: {
      main: '#111', // black
      contrastText: '#fff',
    },
    secondary: {
      main: '#6b7280', // muted gray
      contrastText: '#fff',
    },
    accent: {
      main: '#e9fb46', // neon yellow-green
      contrastText: '#111',
    },
    text: {
      primary: '#111',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h2: { fontWeight: 700 },
    h5: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 16,
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
} 