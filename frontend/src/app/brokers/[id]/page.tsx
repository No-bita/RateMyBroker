import React from 'react';
import { Box, Typography, Card, CardContent, Avatar, Grid } from '@mui/material';
import { notFound } from 'next/navigation';

// Mock data for brokers and tips
const brokers = [
  { id: 1, name: 'Ravi Sharma', performance: '+18.2%', tips: 120 },
  { id: 2, name: 'Priya Mehta', performance: '+15.7%', tips: 98 },
  { id: 3, name: 'Amit Patel', performance: '+13.4%', tips: 110 },
  { id: 4, name: 'Sunita Rao', performance: '+12.1%', tips: 90 },
  { id: 5, name: 'Vikram Singh', performance: '+10.8%', tips: 85 },
];

const tips = [
  { id: 1, brokerId: 1, asset: 'TCS', recommendation: 'Buy', target: '4000', stopLoss: '3700', date: '2024-06-01', outcome: '+7%' },
  { id: 2, brokerId: 1, asset: 'INFY', recommendation: 'Sell', target: '1400', stopLoss: '1500', date: '2024-05-20', outcome: '-2%' },
  { id: 3, brokerId: 2, asset: 'NIFTY', recommendation: 'Buy', target: '23000', stopLoss: '22000', date: '2024-06-02', outcome: '+3%' },
  { id: 4, brokerId: 3, asset: 'RELIANCE', recommendation: 'Hold', target: '2600', stopLoss: '2400', date: '2024-05-15', outcome: '+1%' },
];

export default function BrokerProfile({ params }: { params: { id: string } }) {
  const broker = brokers.find(b => b.id === Number(params.id));
  if (!broker) return notFound();
  const brokerTips = tips.filter(tip => tip.brokerId === broker.id);

  return (
    <Box sx={{ p: { xs: 2, md: 6 }, maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar sx={{ width: 64, height: 64, mr: 3 }}>{broker.name[0]}</Avatar>
        <Box>
          <Typography variant="h3" fontWeight={700}>{broker.name}</Typography>
          <Typography variant="body1" color="text.secondary">Performance: {broker.performance}</Typography>
          <Typography variant="body1" color="text.secondary">Tips: {broker.tips}</Typography>
        </Box>
      </Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>Tips by {broker.name}</Typography>
      <Grid container spacing={3}>
        {brokerTips.length === 0 && (
          <Grid item xs={12}><Typography>No tips found for this broker.</Typography></Grid>
        )}
        {brokerTips.map((tip) => (
          <Grid item xs={12} md={6} key={tip.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{tip.asset} - {tip.recommendation}</Typography>
                <Typography variant="body2" color="text.secondary">Target: {tip.target} | Stop Loss: {tip.stopLoss}</Typography>
                <Typography variant="body2" color="text.secondary">Date: {tip.date}</Typography>
                <Typography variant="body2" color="text.secondary">Outcome: {tip.outcome}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 