"use client";

import React, { useState } from "react";
import { Container, Button, Typography, Grid2, Box } from "@mui/material";
import {List, ListItemButton, ListItemText} from "@mui/material";


type Case = {
  id: number;
  amount: number;
  revealed: boolean;
  selected: boolean;
};

type BonusCase = {
  id: string;
  bonus: string;
  selected: boolean;
}

type OfferType = {
    divisor: number;
    switchPercentage: number;
}

const Home: React.FC = () => {
  const [cases, setCases] = useState<Case[]>(generateCases());
  const [bonusCases, setBonusCases] = useState<BonusCase[]>(generateBonusCases());
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [bankOffer, setBankOffer] = useState<number | null>(null);
  const [switchOffer, setSwitchOffer] = useState<boolean>(false);

  function generateCases(): Case[] {
    const amounts = [0.01, 1, 2, 5, 10, 20, 50, 100, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 5000, 7500, 10000, 20000, 40000, 70000];
    return shuffleArray(amounts).map((amount, index) => ({
      id: index + 1,
      amount,
      revealed: false,
      selected: false
    }));
  }

  function generateBonusCases(): BonusCase[] {
    const bonuses = ["0", "/2", "x2", "x1", "+1500€"]

    return shuffleArray(bonuses).map((bonus, index) => ({
      id: `23${String.fromCharCode(65 + index)}`,
      bonus,
      selected: false
    }));
  }

  const offerRound: Record<number, OfferType> = {
      5: {divisor: 6, switchPercentage: 0.0},
      10: {divisor: 5, switchPercentage: 0.0},
      14: {divisor: 4, switchPercentage: 0.0},
      17: {divisor: 3, switchPercentage: 0.05},
      19: {divisor: 2, switchPercentage: 0.075},
      20: {divisor: 1, switchPercentage: 0.1}
  }

  function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


  const handleCaseSelect = (id: number) => {
    if (selectedCase === null) {
      setSelectedCase(id);
      const updatedCases = cases.map((c) =>
        c.id === id ? { ...c, selected: true } : c
      );
      setCases(updatedCases);
    } else {
      const updatedCases = cases.map((c) =>
        c.id === id ? { ...c, revealed: true } : c
      );
      setCases(updatedCases);

      const revealedCasesCount = getRevealedCasesCount(updatedCases);
      const random = Math.random();
       console.log(Object.keys(offerRound), "revealcasecount: ", revealedCasesCount);
      if (revealedCasesCount in offerRound) {
        console.log(revealedCasesCount, offerRound[revealedCasesCount].switchPercentage, random);
      }
      if ((revealedCasesCount in offerRound) && (random <= offerRound[revealedCasesCount].switchPercentage)) {
        console.log(revealedCasesCount, offerRound[revealedCasesCount].switchPercentage, random);
        setSwitchOffer(true);
      }
    }

  };

  const handleBonusCaseSelect = (id: string) => {
    const updatedBonusCases = bonusCases.map((c) =>
      c.id === id ? { ...c, selected: true } : {...c, selected: false}
    );
    setBonusCases(updatedBonusCases);
  }

  const getRevealedCasesCount = (currCases: Case[]) => {
    return currCases.filter((c) => c.revealed).length;
  };

  const calculateBankOffer = () => {
    const unrevealedAmounts = cases.filter((c) => !c.revealed).map((c) => c.amount);
    const average =
      unrevealedAmounts.reduce((sum, amount) => sum + amount, 0) / unrevealedAmounts.length / offerRound[getRevealedCasesCount(cases)].divisor*0.92;
    setBankOffer(Math.round(average));
  };

  const resetSelected = () => {
    const updatedCases = cases.map((c) =>
      c.selected ? { ...c, selected: false } : c
    );
    setCases(updatedCases);
    setSelectedCase(null);
    setBankOffer(null);
    setSwitchOffer(false);
  };

  return (
    <Container maxWidth="lg">
        <Box sx={{ display: "grid", gridTemplateColumns: "15% 70% 15%", gap: 2 }}>
            {/* Left Column */}
            <Box sx={{ padding: 2 }}>
                <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                    Blue Amounts
                </Typography>
                <List>
                {cases.filter((c) => c.amount <= 750).sort((a, b) => a.amount - b.amount).map((c) => (
                    <ListItemButton
                        key={c.id}
                        sx={{
                            backgroundColor: c.revealed ? "black" : "darkblue",
                            color: "white",
                            mb: 1,
                            borderRadius: 2,
                            borderColor: "darkblue",
                        }}
                    >
                        <ListItemText primary={c.amount}/>
                    </ListItemButton>
                ))}
                </List>
            </Box>

            {/* Center Column */}
            <Box sx={{ padding: 2 }}>
                <Typography variant="h4" textAlign="center" gutterBottom>
                    Deal or No Deal
                </Typography>
                <Grid2 container spacing={2}>
                    {cases.map((c) => (
                    <Grid2 key={c.id}>
                        <Button
                        variant={c.revealed ? "contained" : "contained"}
                        color={(c.selected) ? "error" : (c.revealed ? "secondary" : "primary")}
                        onClick={() => handleCaseSelect(c.id)}
                        //disabled={c.revealed}
                        sx={{ width: "100px" }}
                        >
                        {c.revealed ? `€${c.amount}` : `Case ${c.id}`}
                        </Button>
                    </Grid2>
                    ))}
                </Grid2>
                <Typography variant="h6" textAlign="center" mt={4}>
                    Selected Case: {selectedCase || "None"}
                </Typography>
                {bankOffer !== null && (
                    <Typography variant="h6" textAlign="center" mt={2}>
                    Banker Offer: €{bankOffer}
                    </Typography>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={switchOffer ? resetSelected : calculateBankOffer}
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={!(getRevealedCasesCount(cases) in offerRound) || (selectedCase === null) }
                >
                    {switchOffer ? "Switch Case Offer" : "Get Banker Offer"}
                </Button>

                <Grid2 container spacing={2} mt={4}>
                    {bonusCases.map((c) => (
                    <Grid2 key={c.id}>
                        <Button
                        variant="contained"
                        color={c.selected ? "error" : "primary"}
                        onClick={() => handleBonusCaseSelect(c.id)}
                        sx={{ width: "120px" }}
                        //disabled={c.revealed}
                        >
                        {c.selected ? `${c.bonus}` : `Case ${c.id}`}
                        </Button>
                    </Grid2>
                    ))}
                </Grid2>
            </Box>

            {/* Right Column */}
            <Box sx={{  padding: 2 }}>
                <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                    Red Amounts
                </Typography>
                <List>
                {cases.filter((c) => c.amount > 750).sort((a, b) => a.amount - b.amount).map((c) => (
                    <ListItemButton
                        key={c.id}
                        sx={{
                            backgroundColor: c.revealed ? "Black" : "firebrick",
                            color: "white",
                            mb: 1,
                            borderRadius: 2,
                            borderColor: "firebrick",
                        }}
                    >
                        <ListItemText primary={c.amount}/>
                    </ListItemButton>
                ))}
                </List>
            </Box>
        </Box>
    </Container>
  );
};

export default Home;