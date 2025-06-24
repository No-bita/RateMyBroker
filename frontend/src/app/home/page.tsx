"use client";
import React from 'react';
import { Box, Typography, Button, Stack, Card, CardContent, Avatar, Grid } from '@mui/material';

// Mock data for top brokers
const topBrokers = [
  { id: 1, name: 'Ravi Sharma', performance: '+18.2%', tips: 120 },
  { id: 2, name: 'Priya Mehta', performance: '+15.7%', tips: 98 },
  { id: 3, name: 'Amit Patel', performance: '+13.4%', tips: 110 },
];

export default function HomePage() {
  return (
    <Box sx={{ p: { xs: 2, md: 6 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Home
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ my: 4 }}>
        <Button variant="contained" color="primary" size="large" href="/brokers">
          Browse Brokers
        </Button>
        <Button variant="outlined" color="primary" size="large" href="/submit-tip">
          Submit a Tip
        </Button>
      </Stack>
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Top Brokers
        </Typography>
        <Grid container spacing={3}>
          {topBrokers.map((broker) => (
            <Grid item xs={12} sm={6} md={4} key={broker.id}>
              <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Avatar sx={{ mr: 2 }}>{broker.name[0]}</Avatar>
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6">{broker.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Performance: {broker.performance}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tips: {broker.tips}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
} 