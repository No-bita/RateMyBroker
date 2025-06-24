import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, Grid } from '@mui/material';

// Mock data for pending tips
const initialTips = [
  {
    id: 1,
    broker: 'Ravi Sharma',
    asset: 'TCS',
    recommendation: 'Buy',
    target: '4000',
    stopLoss: '3700',
    rationale: 'Strong earnings expected',
    source: 'Telegram',
    date: '2024-06-01',
  },
  {
    id: 2,
    broker: 'Priya Mehta',
    asset: 'NIFTY',
    recommendation: 'Sell',
    target: '22000',
    stopLoss: '22500',
    rationale: '',
    source: 'WhatsApp',
    date: '2024-06-02',
  },
];

export default function AdminPage() {
  const [tips, setTips] = useState(initialTips);

  const handleAction = (id: number) => {
    setTips((prev) => prev.filter((tip) => tip.id !== id));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 6 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Admin Panel
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Review and approve or reject submitted tips.
      </Typography>
      <Grid container spacing={3}>
        {tips.length === 0 && (
          <Grid item xs={12}>
            <Typography>No pending tips.</Typography>
          </Grid>
        )}
        {tips.map((tip) => (
          <Grid item xs={12} md={6} key={tip.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{tip.broker} - {tip.asset}</Typography>
                <Typography variant="body2" color="text.secondary">Recommendation: {tip.recommendation}</Typography>
                <Typography variant="body2" color="text.secondary">Target: {tip.target} | Stop Loss: {tip.stopLoss}</Typography>
                <Typography variant="body2" color="text.secondary">Source: {tip.source}</Typography>
                <Typography variant="body2" color="text.secondary">Date: {tip.date}</Typography>
                {tip.rationale && <Typography variant="body2" color="text.secondary">Rationale: {tip.rationale}</Typography>}
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button variant="contained" color="success" onClick={() => handleAction(tip.id)}>Approve</Button>
                  <Button variant="outlined" color="error" onClick={() => handleAction(tip.id)}>Reject</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 