import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Sparkles } from "lucide-react";
import { type Task, type TaskCategory } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";

export default function GamePage() {
  const [players, setPlayers] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | "">("");
  const [playerInput, setPlayerInput] = useState("");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [showTaskAnimation, setShowTaskAnimation] = useState(false);

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
      setShowTaskAnimation(true);
      setTimeout(() => {
        setCurrentTask(task);
        setIsButtonPressed(false);
      }, 300);
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
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-3 py-4 max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
            🍻 JUOMAPELI 🎉
          </h1>
          <p className="text-lg text-yellow-200">Hauskaa yhdessä!</p>
        </div>

        <div className="space-y-4">
          {/* Player Setup */}
          <Card className="bg-gradient-to-br from-purple-600/70 to-pink-600/70 border border-pink-300/30 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-center text-yellow-300 font-bold">👥 Pelaajat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 mb-4">
                <Input
                  type="text"
                  placeholder="Syötä pelaajan nimi..."
                  value={playerInput}
                  onChange={(e) => setPlayerInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-white/20 border-2 border-yellow-400/50 text-white placeholder-yellow-200 focus:ring-2 focus:ring-yellow-400 text-lg py-3 backdrop-blur-sm"
                  data-testid="input-player-name"
                />
                <Button
                  onClick={addPlayer}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                  data-testid="button-add-player"
                >
                  ✨ Lisää pelaaja ✨
                </Button>
              </div>

              <div className="space-y-2">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/60 to-purple-500/60 border border-blue-400/50 backdrop-blur-sm"
                    data-testid={`player-item-${index}`}
                  >
                    <span className="font-semibold" data-testid={`text-player-name-${index}`}>
                      {player}
                    </span>
                    <Button
                      onClick={() => removePlayer(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-300 hover:text-red-100 hover:bg-red-500/30"
                      data-testid={`button-remove-player-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {players.length < 2 && (
                <p className="text-sm text-yellow-200 mt-4 text-center font-semibold" data-testid="text-minimum-players">
                  ⚠️ Vähintään 2 pelaajaa tarvitaan
                </p>
              )}
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card className="bg-gradient-to-br from-green-600/70 to-teal-600/70 border border-green-300/30 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-center text-yellow-300 font-bold">🎯 Valitse kategoria</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as TaskCategory)}>
                <SelectTrigger className="w-full bg-white/20 border-2 border-yellow-400/50 text-white text-lg py-3 backdrop-blur-sm" data-testid="select-category">
                  <SelectValue placeholder="Valitse kategoria..." />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-b from-purple-600 to-blue-600 border-2 border-purple-400/50">
                  {categories.map((category) => (
                    <SelectItem 
                      key={category.id} 
                      value={category.id}
                      className="text-white hover:bg-white/20 focus:bg-white/20"
                      data-testid={`option-category-${category.id}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{category.emoji}</span>
                        <div>
                          <span className="font-semibold">{category.name}</span>
                          <span className="text-sm text-yellow-200 ml-2">- {category.description}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Task Display */}
          <Card className="bg-gradient-to-br from-orange-600/70 to-red-600/70 border border-orange-300/30 shadow-lg">
            <CardContent className="p-6 text-center min-h-48 flex items-center justify-center">
              {currentTask ? (
                <div 
                  className="task-appear"
                  data-testid="display-current-task"
                >
                  <p className="text-3xl font-bold text-yellow-300 mb-4" data-testid="text-task-player">
                    {players[currentPlayerIndex]}
                  </p>
                  <p className="text-lg text-white leading-relaxed" data-testid="text-task-content">
                    {currentTask.text}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-5xl mb-4">🎲</div>
                  <p className="text-lg text-yellow-200" data-testid="text-no-task">
                    {canGetTask ? "Paina nappia saadaksesi tehtävän!" : "Lisää pelaajia ja valitse kategoria"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Button */}
          <Button
            onClick={() => {
              setIsButtonPressed(true);
              getRandomTask();
              // Move to next player after getting task
              setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
            }}
            disabled={!canGetTask || isGettingTask}
            className={`w-full py-6 font-bold text-xl transition-all duration-200 rounded-xl shadow-lg ${
              canGetTask
                ? `bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white cursor-pointer transform ${
                    isButtonPressed ? 'scale-95' : 'hover:scale-105'
                  } ${isGettingTask ? 'animate-pulse' : ''}`
                : "bg-gradient-to-r from-gray-500 to-gray-600 text-gray-300 cursor-not-allowed opacity-70"
            }`}
            data-testid="button-get-task"
          >
            <div className="flex items-center justify-center gap-2">
              {isGettingTask && <Sparkles className="w-6 h-6 animate-spin" />}
              {isGettingTask
                ? "Ladataan..."
                : !canGetTask
                ? players.length < 2
                  ? "Lisää pelaajia (min. 2)"
                  : "Valitse kategoria"
                : "🎲 Anna tehtävä"}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
