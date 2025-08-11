import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Game, type Task, type TaskCategory } from "@shared/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface GameScreenProps {
  game: Game;
  onBackToSetup: () => void;
}

export function GameScreen({ game, onBackToSetup }: GameScreenProps) {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const queryClient = useQueryClient();

  const { mutate: updateGame } = useMutation({
    mutationFn: async (updates: Partial<Game>) => {
      const response = await apiRequest("PATCH", `/api/games/${game.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games", game.id] });
    },
  });

  const { mutate: getRandomTask, isPending: isGettingTask } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/tasks/${game.category}/random`);
      if (!response.ok) throw new Error("Failed to get task");
      return response.json();
    },
    onSuccess: (task: Task) => {
      setCurrentTask(task);
    },
  });

  const nextPlayer = () => {
    const nextIndex = (game.currentPlayerIndex + 1) % game.players.length;
    updateGame({ currentPlayerIndex: nextIndex });
    setCurrentTask(null);
  };

  const getCategoryConfig = (category: TaskCategory) => {
    const configs = {
      spicy: { emoji: "🌶️", text: "Spicy", className: "bg-gradient-to-r from-red-500 to-red-600" },
      funny: { emoji: "😂", text: "Funny", className: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800" },
      party: { emoji: "🎊", text: "Party", className: "bg-gradient-to-r from-purple-500 to-purple-600" },
    };
    return configs[category];
  };

  const categoryConfig = getCategoryConfig(game.category);
  const currentPlayer = game.players[game.currentPlayerIndex];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">🎉 Juomapeli 🎉</h1>
        <div
          className={`inline-block px-4 py-2 rounded-full font-semibold ${categoryConfig.className}`}
          data-testid="display-current-category"
        >
          {categoryConfig.emoji} {categoryConfig.text}
        </div>
      </div>

      {/* Current Player */}
      <Card className="bg-gray-700 border-gray-600 mb-6">
        <CardContent className="pt-6 text-center">
          <h2 className="text-xl mb-2 text-white">Vuorossa:</h2>
          <div className="text-3xl font-bold text-yellow-400" data-testid="text-current-player">
            {currentPlayer}
          </div>
        </CardContent>
      </Card>

      {/* Task Display */}
      <Card className="bg-gray-700 border-gray-600 mb-6">
        <CardContent className="p-8 text-center min-h-32 flex items-center justify-center">
          {currentTask ? (
            <div data-testid="display-current-task">
              <p className="text-2xl font-bold text-yellow-400 mb-4" data-testid="text-task-player">
                {currentPlayer}
              </p>
              <p className="text-xl text-white" data-testid="text-task-content">
                {currentTask.text}
              </p>
            </div>
          ) : (
            <p className="text-lg text-gray-400" data-testid="text-no-task">
              Paina nappia saadaksesi tehtävän!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Game Controls */}
      <div className="space-y-4">
        <Button
          onClick={() => getRandomTask()}
          disabled={isGettingTask}
          className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold text-xl"
          data-testid="button-get-task"
        >
          {isGettingTask ? "Ladataan..." : "Anna tehtävä"}
        </Button>

        <Button
          onClick={nextPlayer}
          variant="outline"
          className="w-full py-3 bg-gray-600 hover:bg-gray-500 text-white border-gray-500 font-semibold"
          data-testid="button-next-player"
        >
          Seuraava pelaaja
        </Button>
      </div>

      {/* Players List */}
      <Card className="mt-6 bg-gray-700 border-gray-600">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3 text-center text-white">Pelaajat:</h3>
          <div className="flex flex-wrap gap-2 justify-center" data-testid="list-game-players">
            {game.players.map((player, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm ${
                  index === game.currentPlayerIndex
                    ? "bg-yellow-500 text-gray-800"
                    : "bg-gray-600 text-white"
                }`}
                data-testid={`player-badge-${index}`}
              >
                {player}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Back to Setup */}
      <Button
        onClick={onBackToSetup}
        variant="outline"
        className="w-full mt-4 py-3 bg-gray-600 hover:bg-gray-500 text-white border-gray-500 font-semibold"
        data-testid="button-back-to-setup"
      >
        Takaisin asetuksiin
      </Button>
    </div>
  );
}
