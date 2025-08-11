import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { type Task, type TaskCategory } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";

export default function GamePage() {
  const [players, setPlayers] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | "">("");
  const [playerInput, setPlayerInput] = useState("");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const categories = [
    { id: "spicy" as TaskCategory, emoji: "🌶️", name: "Spicy", description: "Rohkeita haasteita" },
    { id: "funny" as TaskCategory, emoji: "😂", name: "Funny", description: "Hauskoja tehtäviä" },
    { id: "party" as TaskCategory, emoji: "🎊", name: "Party", description: "Bilemeininki" },
  ];

  const { mutate: getRandomTask, isPending: isGettingTask } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/tasks/${selectedCategory}/random`);
      if (!response.ok) throw new Error("Failed to get task");
      return response.json();
    },
    onSuccess: (task: Task) => {
      setCurrentTask(task);
    },
  });

  const addPlayer = () => {
    const name = playerInput.trim();
    if (name && !players.includes(name)) {
      setPlayers([...players, name]);
      setPlayerInput("");
    }
  };

  const removePlayer = (index: number) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
    if (currentPlayerIndex >= newPlayers.length) {
      setCurrentPlayerIndex(0);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addPlayer();
    }
  };

  const canGetTask = players.length >= 2 && selectedCategory;
  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">🎉 Juomapeli 🎉</h1>
          <p className="text-xl text-gray-300">Paina nappia ja tee tehtävä!</p>
        </div>

        <div className="space-y-6">
          {/* Player Setup */}
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-white">👥 Pelaajat</CardTitle>
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
                    className={`flex justify-between items-center px-4 py-2 rounded-lg ${
                      index === currentPlayerIndex && currentTask
                        ? "bg-yellow-500 text-gray-800"
                        : "bg-gray-600"
                    }`}
                    data-testid={`player-item-${index}`}
                  >
                    <span className="font-semibold" data-testid={`text-player-name-${index}`}>
                      {player}
                      {index === currentPlayerIndex && players.length >= 2 && selectedCategory && (
                        <span className="ml-2 text-sm">(Vuorossa)</span>
                      )}
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

              {players.length < 2 && (
                <p className="text-sm text-gray-400 mt-4 text-center" data-testid="text-minimum-players">
                  Vähintään 2 pelaajaa tarvitaan
                </p>
              )}
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-white">🎯 Valitse kategoria</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as TaskCategory)}>
                <SelectTrigger className="w-full bg-gray-600 border-gray-500 text-white text-lg py-3" data-testid="select-category">
                  <SelectValue placeholder="Valitse kategoria..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-600 border-gray-500">
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id}
                      className="text-white hover:bg-gray-500 focus:bg-gray-500"
                      data-testid={`option-category-${category.id}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{category.emoji}</span>
                        <div>
                          <span className="font-semibold">{category.name}</span>
                          <span className="text-sm text-gray-300 ml-2">- {category.description}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Task Display */}
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-8 text-center min-h-32 flex items-center justify-center">
              {currentTask ? (
                <div data-testid="display-current-task">
                  <p className="text-2xl font-bold text-yellow-400 mb-4" data-testid="text-task-player">
                    {players[currentPlayerIndex]}
                  </p>
                  <p className="text-xl text-white" data-testid="text-task-content">
                    {currentTask.text}
                  </p>
                </div>
              ) : (
                <p className="text-lg text-gray-400" data-testid="text-no-task">
                  {canGetTask ? "Paina nappia saadaksesi tehtävän!" : "Lisää pelaajia ja valitse kategoria"}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Main Button */}
          <Button
            onClick={() => {
              getRandomTask();
              // Move to next player after getting task
              setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
            }}
            disabled={!canGetTask || isGettingTask}
            className={`w-full py-4 font-bold text-xl transition-all duration-200 ${
              canGetTask
                ? "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
            data-testid="button-get-task"
          >
            {isGettingTask
              ? "Ladataan..."
              : !canGetTask
              ? players.length < 2
                ? "Lisää pelaajia (min. 2)"
                : "Valitse kategoria"
              : "Anna tehtävä"}
          </Button>
        </div>
      </div>
    </div>
  );
}
