import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayerSetup } from "@/components/PlayerSetup";
import { CategorySelection } from "@/components/CategorySelection";
import { GameScreen } from "@/components/GameScreen";
import { type Game, type TaskCategory } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function GamePage() {
  const [players, setPlayers] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | "">("");
  const [currentGame, setCurrentGame] = useState<Game | null>(null);

  const { mutate: createGame, isPending } = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/games", {
        players,
        category: selectedCategory,
      });
      return response.json();
    },
    onSuccess: (game: Game) => {
      setCurrentGame(game);
    },
  });

  const startGame = () => {
    if (players.length >= 2 && selectedCategory) {
      createGame();
    }
  };

  const backToSetup = () => {
    setCurrentGame(null);
  };

  const canStart = players.length >= 2 && selectedCategory;

  if (currentGame) {
    return <GameScreen game={currentGame} onBackToSetup={backToSetup} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">🎉 Juomapeli 🎉</h1>
          <p className="text-xl text-gray-300">Lisää pelaajat ja valitse kategoria</p>
        </div>

        <div className="space-y-6">
          <PlayerSetup players={players} onPlayersChange={setPlayers} />

          <CategorySelection
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          <Button
            onClick={startGame}
            disabled={!canStart || isPending}
            className={`w-full py-4 font-bold text-xl transition-all duration-200 ${
              canStart
                ? "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
            data-testid="button-start-game"
          >
            {isPending
              ? "Aloitetaan..."
              : !canStart
              ? players.length < 2
                ? "Lisää pelaajia (min. 2)"
                : "Valitse kategoria"
              : "Aloita peli"}
          </Button>
        </div>
      </div>
    </div>
  );
}
