"use client";

import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, MenuItem, Stack, Alert, InputLabel
} from '@mui/material';

const recommendations = [
  { value: 'buy', label: 'Buy' },
  { value: 'sell', label: 'Sell' },
  { value: 'hold', label: 'Hold' },
];

export default function SubmitTipPage() {
  const [form, setForm] = useState({
    broker: '',
    asset: '',
    recommendation: '',
    target: '',
    stopLoss: '',
    rationale: '',
    source: '',
    date: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({
      broker: '', asset: '', recommendation: '', target: '', stopLoss: '', rationale: '', source: '', date: '',
    });
    setFile(null);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 6 }, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Submit a Tip
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Your tip will be reviewed by an admin before being listed.
      </Typography>
      {submitted && <Alert severity="success" sx={{ mb: 2 }}>Tip submitted for review!</Alert>}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Broker Name" name="broker" value={form.broker} onChange={handleChange} required fullWidth />
          <TextField label="Asset (e.g. TCS, NIFTY)" name="asset" value={form.asset} onChange={handleChange} required fullWidth />
          <TextField select label="Recommendation" name="recommendation" value={form.recommendation} onChange={handleChange} required fullWidth>
            {recommendations.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
          <TextField label="Target Price" name="target" value={form.target} onChange={handleChange} required fullWidth type="number" />
          <TextField label="Stop Loss" name="stopLoss" value={form.stopLoss} onChange={handleChange} required fullWidth type="number" />
          <TextField label="Rationale (optional)" name="rationale" value={form.rationale} onChange={handleChange} multiline rows={2} fullWidth />
          <TextField label="Source (link or description)" name="source" value={form.source} onChange={handleChange} fullWidth />
          <Box>
            <InputLabel htmlFor="supporting-file">Upload Supporting Document (image or PDF)</InputLabel>
            <input
              id="supporting-file"
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              style={{ marginTop: 8 }}
            />
            {file && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">Selected: {file.name}</Typography>
                {file.type.startsWith('image/') && (
                  <Box component="img" src={URL.createObjectURL(file)} alt="preview" sx={{ maxWidth: 120, mt: 1, borderRadius: 1 }} />
                )}
              </Box>
            )}
          </Box>
          <TextField label="Date" name="date" value={form.date} onChange={handleChange} required fullWidth type="date" InputLabelProps={{ shrink: true }} />
          <Button type="submit" variant="contained" color="primary" size="large">
            Submit Tip
          </Button>
        </Stack>
      </Box>
    </Box>
  );
} 