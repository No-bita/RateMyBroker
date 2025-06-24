"use client";
import React from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Grid, Card, CardContent, Stack, Avatar, useMediaQuery
} from '@mui/material';
import Image from 'next/image';
import { useTheme } from '@mui/material/styles';

export default function LandingPage() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'), { ssr: false });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      {/* Header */}
      <AppBar position="static" elevation={0} color="transparent" sx={{ py: 1, bgcolor: 'transparent' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h5" fontWeight={700} color="primary">
            Rate My Broker
          </Typography>
          <Stack direction="row" spacing={3} alignItems="center">
            <Button color="inherit" href="#" sx={{ color: theme.palette.text.primary }}>Home</Button>
            <Button color="inherit" href="#how-it-works" sx={{ color: theme.palette.text.primary }}>How it Works</Button>
            <Button color="inherit" href="#" sx={{ color: theme.palette.text.primary }}>About</Button>
            <Button color="inherit" href="#" sx={{ color: theme.palette.text.primary }}>Blog</Button>
            <Button variant="outlined" sx={{ ml: 2, borderColor: theme.palette.secondary.main, color: theme.palette.text.primary }} href="#">Sign In</Button>
            <Button variant="contained" sx={{ ml: 1, bgcolor: theme.palette.accent.main, color: theme.palette.accent.contrastText, '&:hover': { bgcolor: '#d4e900' } }} href="#">Register</Button>
          </Stack>
        </Toolbar>
      </AppBar>
      {/* Main Hero Section */}
      <Grid container alignItems="center" justifyContent="center" sx={{ px: { xs: 2, md: 8 }, py: { xs: 6, md: 10 } }}>
        {/* Left Side */}
        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: 500, mx: { xs: 'auto', md: 0 }, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h2" fontWeight={700} gutterBottom color="primary">
              Track Broker Tips.<br />Invest Smarter.
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Discover the real performance of Indian stock brokers. See every tip, every outcome, and make informed investment decisions.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }} justifyContent={{ xs: 'center', md: 'flex-start' }}>
              <Button variant="contained" size="large" href="/home" sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, '&:hover': { bgcolor: '#222' } }}>
                Get Started
              </Button>
              <Button variant="contained" size="large" href="#how-it-works" sx={{ bgcolor: theme.palette.accent.main, color: theme.palette.accent.contrastText, '&:hover': { bgcolor: '#d4e900' } }}>
                How It Works
              </Button>
            </Stack>
            <Box sx={{ mt: 4, opacity: 0.7 }}>
              <Typography variant="body2" color="text.secondary">
                Trusted by 1,000+ Indian investors
              </Typography>
            </Box>
          </Box>
        </Grid>
        {/* Right Side */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 6, md: 0 } }}>
          <Box sx={{ position: 'relative', width: isMdUp ? 400 : '100%', maxWidth: 400, minHeight: 350 }}>
            {/* Hero Image Placeholder */}
            <Box sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 3, width: '100%', height: 300, bgcolor: '#e0e7ef', position: 'relative' }}>
              <Image src="/hero-placeholder.png" alt="Hero" fill style={{ objectFit: 'cover' }} />
            </Box>
            {/* Overlay Card: Sample Tip */}
            <Card sx={{ position: 'absolute', top: 16, left: -32, minWidth: 220, boxShadow: 2, display: { xs: 'none', sm: 'block' } }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>R</Avatar>
                <Box>
                  <Typography variant="subtitle2" color="primary">Ravi Sharma</Typography>
                  <Typography variant="body2" color="text.secondary">Buy TCS @ 4000</Typography>
                  <Typography variant="caption" color="success.main">+7% outcome</Typography>
                </Box>
              </CardContent>
            </Card>
            {/* Overlay Card: Platform Stats */}
            <Card sx={{ position: 'absolute', bottom: 16, right: -32, minWidth: 200, boxShadow: 2, display: { xs: 'none', sm: 'block' } }}>
              <CardContent>
                <Typography variant="subtitle2" color="primary">Tips Tracked</Typography>
                <Typography variant="h6" fontWeight={700} color="primary">10,000+</Typography>
                <Typography variant="caption" color="text.secondary">and counting!</Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
      {/* How it Works Section */}
      <Box id="how-it-works" sx={{ maxWidth: 1000, mx: 'auto', py: 10 }}>
        <Typography variant="h4" fontWeight={600} align="center" gutterBottom color="primary">
          How It Works
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ borderColor: theme.palette.secondary.main }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">Submit Tips</Typography>
                <Typography variant="body2" color="text.secondary">
                  Users and brokers submit investment tips with source, date, and recommendation.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ borderColor: theme.palette.secondary.main }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">Admin Review</Typography>
                <Typography variant="body2" color="text.secondary">
                  All tips are reviewed and verified by our admin team before being listed.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined" sx={{ borderColor: theme.palette.secondary.main }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="primary">Track Performance</Typography>
                <Typography variant="body2" color="text.secondary">
                  See every broker's historical performance and make informed choices.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
