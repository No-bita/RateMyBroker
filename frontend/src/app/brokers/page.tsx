import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';

// Mock data for brokers
const brokers = [
  { id: 1, name: 'Ravi Sharma', performance: '+18.2%', tips: 120 },
  { id: 2, name: 'Priya Mehta', performance: '+15.7%', tips: 98 },
  { id: 3, name: 'Amit Patel', performance: '+13.4%', tips: 110 },
  { id: 4, name: 'Sunita Rao', performance: '+12.1%', tips: 90 },
  { id: 5, name: 'Vikram Singh', performance: '+10.8%', tips: 85 },
];

export default function BrokersPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 6 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        All Brokers
      </Typography>
      <Grid container spacing={3}>
        {brokers.map((broker) => (
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
  );
} 