import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface PlayerSetupProps {
  players: string[];
  onPlayersChange: (players: string[]) => void;
}

export function PlayerSetup({ players, onPlayersChange }: PlayerSetupProps) {
  const [playerInput, setPlayerInput] = useState("");

  const addPlayer = () => {
    const name = playerInput.trim();
    if (name && !players.includes(name)) {
      onPlayersChange([...players, name]);
      setPlayerInput("");
    }
  };

  const removePlayer = (index: number) => {
    const newPlayers = players.filter((_, i) => i !== index);
    onPlayersChange(newPlayers);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addPlayer();
    }
  };

  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-white">
          👥 Pelaajat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input
            type="text"
            placeholder="Syötä pelaajan nimi..."
            value={playerInput}
            onChange={(e) => setPlayerInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500"
            data-testid="input-player-name"
          />
          <Button
            onClick={addPlayer}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold whitespace-nowrap"
            data-testid="button-add-player"
          >
            Lisää pelaaja
          </Button>
        </div>

        <div className="space-y-2">
          {players.map((player, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-600 px-4 py-2 rounded-lg"
              data-testid={`player-item-${index}`}
            >
              <span
                className="font-semibold text-white"
                data-testid={`text-player-name-${index}`}
              >
                {player}
              </span>
              <Button
                onClick={() => removePlayer(index)}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-gray-500"
                data-testid={`button-remove-player-${index}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <p
          className="text-sm text-gray-400 mt-4 text-center"
          data-testid="text-minimum-players"
        >
          Vähintään 2 pelaajaa tarvitaan
        </p>
      </CardContent>
    </Card>
  );
}
