"use client";

import React, { useState } from "react";
import { Container, Button, Typography, Grid } from "@mui/material";

type Case = {
  id: number;
  amount: number;
  revealed: boolean;
};

const Home: React.FC = () => {
  const [cases, setCases] = useState<Case[]>(generateCases());
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [bankOffer, setBankOffer] = useState<number | null>(null);

  function generateCases(): Case[] {
    const amounts = [1, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000];
    return shuffleArray(amounts).map((amount, index) => ({
      id: index + 1,
      amount,
      revealed: false,
    }));
  }

  function shuffleArray<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
  }

  const handleCaseSelect = (id: number) => {
    if (selectedCase === null) {
      setSelectedCase(id);
    } else {
      const updatedCases = cases.map((c) =>
        c.id === id ? { ...c, revealed: true } : c
      );
      setCases(updatedCases);
    }
  };

  const calculateBankOffer = () => {
    const unrevealedAmounts = cases.filter((c) => !c.revealed).map((c) => c.amount);
    const average =
      unrevealedAmounts.reduce((sum, amount) => sum + amount, 0) / unrevealedAmounts.length;
    setBankOffer(Math.round(average));
  };

  return (
    <Container>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Deal or No Deal
      </Typography>
      <Grid container spacing={2}>
        {cases.map((c) => (
          <Grid item xs={3} key={c.id}>
            <Button
              variant={c.revealed ? "outlined" : "contained"}
              color={c.revealed ? "secondary" : "primary"}
              onClick={() => handleCaseSelect(c.id)}
              disabled={c.revealed}
            >
              {c.revealed ? `$${c.amount}` : `Case ${c.id}`}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h6" textAlign="center" mt={4}>
        Selected Case: {selectedCase || "None"}
      </Typography>
      {bankOffer !== null && (
        <Typography variant="h6" textAlign="center" mt={2}>
          Banker Offer: ${bankOffer}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={calculateBankOffer}
        disabled={bankOffer !== null}
        fullWidth
        sx={{ mt: 2 }}
      >
        Get Banker Offer
      </Button>
    </Container>
  );
};

export default Home;