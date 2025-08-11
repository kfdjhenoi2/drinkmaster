import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type TaskCategory } from "@shared/schema";

interface CategorySelectionProps {
  selectedCategory: TaskCategory | "";
  onCategorySelect: (category: TaskCategory) => void;
}

export function CategorySelection({ selectedCategory, onCategorySelect }: CategorySelectionProps) {
  const categories = [
    {
      id: "spicy" as TaskCategory,
      emoji: "🌶️",
      name: "Spicy",
      description: "Rohkeita haasteita",
      className: "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white",
    },
    {
      id: "funny" as TaskCategory,
      emoji: "😂",
      name: "Funny",
      description: "Hauskoja tehtäviä",
      className: "bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-gray-800",
    },
    {
      id: "party" as TaskCategory,
      emoji: "🎊",
      name: "Party",
      description: "Bilemeininki",
      className: "bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white",
    },
  ];

  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-white">🎯 Valitse kategoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`p-6 h-auto font-bold text-lg transition-all duration-200 shadow-lg ${
                category.className
              } ${
                selectedCategory === category.id ? "ring-4 ring-white scale-105" : "hover:scale-105"
              }`}
              data-testid={`button-category-${category.id}`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{category.emoji}</div>
                <div className="text-lg font-bold">{category.name}</div>
                <div className="text-sm font-normal opacity-90">{category.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
