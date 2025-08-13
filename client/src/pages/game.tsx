import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Sparkles } from "lucide-react";
import { type Task, type TaskCategory } from "@shared/schema";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GamePage() {
  const [players, setPlayers] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | "">(
    ""
  );
  const [playerInput, setPlayerInput] = useState("");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  // UUSI: korttipakka ilman duplikaatteja
  const [deck, setDeck] = useState<Task[]>([]);
  const [deckIndex, setDeckIndex] = useState(0);
  const [deckLoading, setDeckLoading] = useState(false);

  const categories = [
    {
      id: "spicy" as TaskCategory,
      emoji: "🌶️",
      name: "Spicy",
      description: "Rohkeita haasteita",
    },
    {
      id: "funny" as TaskCategory,
      emoji: "😂",
      name: "Funny",
      description: "Hauskoja tehtäviä",
    },
    {
      id: "party" as TaskCategory,
      emoji: "🎊",
      name: "Party",
      description: "Bilemeininki",
    },
    {
      id: "extreme" as TaskCategory,
      emoji: "🔥",
      name: "Extreme",
      description: "Hardcore haasteet",
    },
  ];

  // Kun kategoria vaihtuu → hae kaikki kysymykset, sekoita pakka
  useEffect(() => {
    let cancelled = false;

    async function loadDeck() {
      if (!selectedCategory) {
        setDeck([]);
        setDeckIndex(0);
        setCurrentTask(null);
        return;
      }
      setDeckLoading(true);
      try {
        const r = await fetch(`/api/tasks/${selectedCategory}`);
        if (!r.ok) throw new Error("Failed to load tasks");
        const all: Task[] = await r.json();

        // Poista mahdolliset duplikaatit id:n perusteella varmuuden vuoksi
        const uniq = Array.from(new Map(all.map((t) => [t.id, t])).values());
        const shuffled = shuffle(uniq);

        if (!cancelled) {
          setDeck(shuffled);
          setDeckIndex(0);
          setCurrentTask(null);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setDeck([]);
          setDeckIndex(0);
          setCurrentTask(null);
        }
      } finally {
        if (!cancelled) setDeckLoading(false);
      }
    }

    loadDeck();
    return () => {
      cancelled = true;
    };
  }, [selectedCategory]);

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
    if (e.key === "Enter") addPlayer();
  };

  const canGetTask =
    players.length >= 2 && !!selectedCategory && deck.length > 0;
  const currentPlayer = players[currentPlayerIndex];

  // Päänappi: jaa seuraava kortti pakasta (ei toistoa)
  const handleGiveTask = () => {
    if (!canGetTask) return;

    // pakka loppu?
    if (deckIndex >= deck.length) {
      setCurrentTask({
        id: "end",
        text: "Pakka loppui! Vaihda kategoria tai aloita alusta 🎉",
        category: selectedCategory as TaskCategory,
      });
      return;
    }

    const next = deck[deckIndex];
    setCurrentTask(next);
    setDeckIndex((i) => i + 1);

    // Siirrä vuoro seuraavalle (voit korvata omalla satunnaislogiikallasi)
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Floating party elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="floating text-6xl absolute top-10 left-10 opacity-20">
          🍺
        </div>
        <div
          className="floating text-4xl absolute top-20 right-10 opacity-30"
          style={{ animationDelay: "2s" }}
        >
          🎊
        </div>
        <div
          className="floating text-5xl absolute top-40 left-5 opacity-25"
          style={{ animationDelay: "4s" }}
        >
          🥂
        </div>
        <div
          className="floating text-3xl absolute bottom-40 right-5 opacity-20"
          style={{ animationDelay: "1s" }}
        >
          🎉
        </div>
        <div
          className="floating text-4xl absolute bottom-20 left-8 opacity-30"
          style={{ animationDelay: "3s" }}
        >
          🍾
        </div>
      </div>

      <div className="container mx-auto px-3 py-4 max-w-lg relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 animate-pulse">
            🍻 SIPPY 🎉
          </h1>
          <p className="text-lg text-yellow-200 font-semibold">
            FUN TOGETHER! 🥳
          </p>
        </div>

        <div className="space-y-4">
          {/* Player Setup */}
          <Card className="bg-gradient-to-br from-purple-600/70 to-pink-600/70 border border-pink-300/30 shadow-lg card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-center text-yellow-300 font-bold">
                👥 Players
              </CardTitle>
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
                  ✨ Add player ✨
                </Button>
              </div>

              <div className="space-y-2">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/60 to-purple-500/60 border border-blue-400/50 backdrop-blur-sm"
                    data-testid={`player-item-${index}`}
                  >
                    <span
                      className="font-semibold"
                      data-testid={`text-player-name-${index}`}
                    >
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
                <p
                  className="text-sm text-yellow-200 mt-4 text-center font-semibold"
                  data-testid="text-minimum-players"
                >
                  ⚠️ Min 2 players
                </p>
              )}
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card className="bg-gradient-to-br from-green-600/70 to-teal-600/70 border border-green-300/30 shadow-lg card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-center text-yellow-300 font-bold">
                🎯 Choose Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedCategory}
                onValueChange={(value) =>
                  setSelectedCategory(value as TaskCategory)
                }
              >
                <SelectTrigger
                  className="w-full bg-white/20 border-2 border-yellow-400/50 text-white text-lg py-3 backdrop-blur-sm"
                  data-testid="select-category"
                >
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
                          <span className="text-sm text-yellow-200 ml-2">
                            - {category.description}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Task Display */}
          <Card className="bg-gradient-to-br from-orange-600/70 to-red-600/70 border border-orange-300/30 shadow-lg card-hover">
            <CardContent className="p-6 text-center min-h-48 flex items-center justify-center">
              {currentTask ? (
                <div className="task-appear" data-testid="display-current-task">
                  <p
                    className="text-3xl font-bold text-yellow-300 mb-4"
                    data-testid="text-task-player"
                  >
                    {players[currentPlayerIndex]}
                  </p>
                  <p
                    className="text-lg text-white leading-relaxed"
                    data-testid="text-task-content"
                  >
                    {currentTask.text}
                  </p>
                </div>
              ) : deckLoading ? (
                <div className="flex items-center gap-2 text-yellow-200">
                  <Sparkles className="w-6 h-6 animate-spin" />
                  <span>Ladataan kategoriaa…</span>
                </div>
              ) : deck.length === 0 && selectedCategory ? (
                <p className="text-xl text-yellow-200 font-semibold">
                  Tässä kategoriassa ei ole tehtäviä. Lisää Drizzlessä/Neonissa.
                  🙃
                </p>
              ) : (
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-bounce">🎲</div>
                  <p
                    className="text-xl text-yellow-200 font-semibold"
                    data-testid="text-no-task"
                  >
                    {players.length >= 2
                      ? "🎯 Valitse kategoria"
                      : "🎮 Add players & Choose category"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Button */}
          <Button
            onClick={handleGiveTask}
            disabled={!canGetTask || deckLoading}
            className={`w-full py-6 font-bold text-xl transition-all duration-300 rounded-xl shadow-lg ${
              canGetTask
                ? "bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white cursor-pointer transform hover:scale-110 border-2 border-yellow-300/30"
                : "bg-gradient-to-r from-gray-500 to-gray-600 text-gray-300 cursor-not-allowed opacity-70"
            }`}
            data-testid="button-get-task"
          >
            <div className="flex items-center justify-center gap-3">
              {deckLoading && (
                <Sparkles className="w-7 h-7 animate-spin text-yellow-300" />
              )}
              <span className="drop-shadow-lg">
                {deckLoading ? "🎊 Ladataan..." : "🎉 ANNA TEHTÄVÄ! 🎉"}
              </span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
